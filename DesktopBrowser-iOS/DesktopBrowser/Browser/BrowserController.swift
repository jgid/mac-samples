import SwiftUI
import UIKit
import WebKit

/// Owns the single `WKWebView` and publishes its navigation state to SwiftUI.
@MainActor
final class BrowserController: NSObject, ObservableObject {
    @Published private(set) var title = ""
    @Published private(set) var currentURL: URL?
    @Published private(set) var canGoBack = false
    @Published private(set) var canGoForward = false
    @Published private(set) var isLoading = false
    @Published private(set) var progress: Double = 0
    @Published var errorMessage: String?

    let webView: WKWebView

    private var observations: [NSKeyValueObservation] = []
    private var failedURL: URL?
    private var profile = UserAgentProfile.safariMac
    private var spoofsEnvironment = true
    private var screenSize = Resolution(width: 1920, height: 1080)

    override init() {
        let configuration = WKWebViewConfiguration()
        configuration.defaultWebpagePreferences.preferredContentMode = .desktop
        configuration.allowsInlineMediaPlayback = true
        configuration.ignoresViewportScaleLimits = true
        configuration.websiteDataStore = .default()

        webView = WKWebView(frame: CGRect(x: 0, y: 0, width: 1920, height: 1080), configuration: configuration)
        super.init()

        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.allowsBackForwardNavigationGestures = true
        webView.allowsLinkPreview = false
        webView.isInspectable = true
        // The web view is transformed, so safe-area insets would be applied at the wrong scale.
        webView.scrollView.contentInsetAdjustmentBehavior = .never

        observe(\.title) { $0.title = $1 ?? "" }
        observe(\.url) { $0.currentURL = $1 }
        observe(\.canGoBack) { $0.canGoBack = $1 }
        observe(\.canGoForward) { $0.canGoForward = $1 }
        observe(\.isLoading) { $0.isLoading = $1 }
        observe(\.estimatedProgress) { $0.progress = $1 }
    }

    // MARK: - Configuration

    /// Applies user agent and spoofing settings. Reloads the page if they changed.
    func apply(_ settings: BrowserSettings) {
        let changed = settings.userAgent != profile || settings.spoofsDesktopEnvironment != spoofsEnvironment
        profile = settings.userAgent
        spoofsEnvironment = settings.spoofsDesktopEnvironment
        webView.customUserAgent = profile.userAgent
        installUserScripts()
        if changed, webView.url != nil {
            webView.reload()
        }
    }

    /// Called whenever the virtual screen size changes (resolution, rotation, scale mode).
    func viewportDidChange(to size: Resolution) {
        guard size != screenSize else { return }
        screenSize = size
        installUserScripts()
        // Update the spoofed `screen` values of the current page without reloading.
        webView.evaluateJavaScript(DesktopScripts.updateCall(screenSize: size), completionHandler: nil)
    }

    private func installUserScripts() {
        let controller = webView.configuration.userContentController
        controller.removeAllUserScripts()
        DesktopScripts
            .userScripts(screenSize: screenSize, profile: profile, spoofsEnvironment: spoofsEnvironment)
            .forEach { controller.addUserScript($0) }
    }

    // MARK: - Navigation

    func load(_ url: URL) {
        errorMessage = nil
        failedURL = nil
        webView.load(URLRequest(url: url))
    }

    /// Retries the navigation that failed, or reloads the current page.
    func retry() {
        errorMessage = nil
        if let url = failedURL {
            load(url)
        } else {
            webView.reload()
        }
    }

    func goBack() { webView.goBack() }
    func goForward() { webView.goForward() }

    func reloadOrStop() {
        if webView.isLoading {
            webView.stopLoading()
        } else if webView.url != nil {
            webView.reload()
        }
    }

    /// Resets pinch-zoom to 100 % (the page fills the virtual screen width).
    func resetZoom() {
        webView.scrollView.setZoomScale(webView.scrollView.minimumZoomScale, animated: true)
    }

    func clearWebsiteData() async {
        let store = WKWebsiteDataStore.default()
        await store.removeData(ofTypes: WKWebsiteDataStore.allWebsiteDataTypes(), modifiedSince: .distantPast)
    }

    private func observe<Value>(_ keyPath: KeyPath<WKWebView, Value>, update: @escaping @MainActor (BrowserController, Value) -> Void) {
        let observation = webView.observe(keyPath, options: [.initial, .new]) { [weak self] webView, _ in
            let value = webView[keyPath: keyPath]
            MainActor.assumeIsolated {
                guard let self else { return }
                update(self, value)
            }
        }
        observations.append(observation)
    }
}

// MARK: - WKNavigationDelegate

extension BrowserController: WKNavigationDelegate {
    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        preferences: WKWebpagePreferences,
        decisionHandler: @escaping (WKNavigationActionPolicy, WKWebpagePreferences) -> Void
    ) {
        // Hand links like mailto:, tel: or App Store links to the system.
        if let url = navigationAction.request.url, let scheme = url.scheme?.lowercased(),
           !["http", "https", "about", "data", "blob", "file"].contains(scheme) {
            UIApplication.shared.open(url)
            decisionHandler(.cancel, preferences)
            return
        }
        preferences.preferredContentMode = .desktop
        decisionHandler(.allow, preferences)
    }

    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        errorMessage = nil
        failedURL = nil
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        show(error)
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        show(error)
    }

    private func show(_ error: Error) {
        let nsError = error as NSError
        // Cancelled loads and policy interruptions (e.g. downloads) are not real errors.
        if nsError.domain == NSURLErrorDomain, nsError.code == NSURLErrorCancelled { return }
        if nsError.domain == "WebKitErrorDomain", nsError.code == 102 { return }
        failedURL = nsError.userInfo[NSURLErrorFailingURLErrorKey] as? URL
        errorMessage = error.localizedDescription
    }
}

// MARK: - WKUIDelegate

extension BrowserController: WKUIDelegate {
    /// Opens `target="_blank"` links and `window.open` in the same web view.
    func webView(
        _ webView: WKWebView,
        createWebViewWith configuration: WKWebViewConfiguration,
        for navigationAction: WKNavigationAction,
        windowFeatures: WKWindowFeatures
    ) -> WKWebView? {
        if navigationAction.targetFrame == nil {
            webView.load(navigationAction.request)
        }
        return nil
    }
}
