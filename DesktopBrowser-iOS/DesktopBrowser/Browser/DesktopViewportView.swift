import SwiftUI
import UIKit
import WebKit

/// The size of the emulated screen and how much it is scaled down to fit the display.
struct ViewportGeometry: Equatable {
    var screenSize: Resolution
    var scale: CGFloat

    var percentLabel: String { "\(Int((scale * 100).rounded())) %" }
}

/// Hosts the web view at the full virtual resolution (e.g. 1920 × 1080 points) and
/// scales it down with a transform so it fits on the iPhone display.
///
/// Because the web view really *is* that large, WebKit lays pages out exactly like a
/// desktop browser window of that size: `window.innerWidth`, CSS media queries and
/// responsive breakpoints all see the big screen. Pinch-to-zoom still works through
/// the web view's own scroll view, just like zooming on a Mac trackpad.
final class DesktopViewportView: UIView {
    let webView: WKWebView
    var onGeometryChange: ((ViewportGeometry) -> Void)?

    private var resolution = Resolution(width: 1920, height: 1080)
    private var scaleMode = ScaleMode.fillDisplay
    private var lastGeometry: ViewportGeometry?

    init(webView: WKWebView) {
        self.webView = webView
        super.init(frame: .zero)
        backgroundColor = .black
        clipsToBounds = true
        addSubview(webView)
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    func configure(resolution: Resolution, scaleMode: ScaleMode) {
        guard resolution != self.resolution || scaleMode != self.scaleMode else { return }
        self.resolution = resolution
        self.scaleMode = scaleMode
        setNeedsLayout()
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        guard bounds.width > 0, bounds.height > 0 else { return }

        let width = CGFloat(resolution.width)
        var height = CGFloat(resolution.height)
        let scale: CGFloat

        switch scaleMode {
        case .fillDisplay:
            scale = bounds.width / width
            height = (bounds.height / scale).rounded()
        case .exact:
            scale = min(bounds.width / width, bounds.height / height)
        }

        // Set bounds/center rather than frame: frame is undefined once a transform is applied.
        let size = CGSize(width: width, height: height)
        if webView.bounds.size != size {
            webView.bounds = CGRect(origin: .zero, size: size)
        }
        webView.center = CGPoint(x: bounds.midX, y: bounds.midY)
        webView.transform = CGAffineTransform(scaleX: scale, y: scale)

        let geometry = ViewportGeometry(screenSize: Resolution(width: Int(width), height: Int(height)), scale: scale)
        if geometry != lastGeometry {
            lastGeometry = geometry
            // Defer so SwiftUI state is not mutated during its own layout pass.
            DispatchQueue.main.async { [weak self] in
                self?.onGeometryChange?(geometry)
            }
        }
    }
}

struct DesktopViewport: UIViewRepresentable {
    let webView: WKWebView
    let resolution: Resolution
    let scaleMode: ScaleMode
    var onGeometryChange: (ViewportGeometry) -> Void

    func makeUIView(context: Context) -> DesktopViewportView {
        DesktopViewportView(webView: webView)
    }

    func updateUIView(_ view: DesktopViewportView, context: Context) {
        view.onGeometryChange = onGeometryChange
        view.configure(resolution: resolution, scaleMode: scaleMode)
    }
}
