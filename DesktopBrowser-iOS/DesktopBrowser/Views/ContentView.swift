import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var settings: BrowserSettings
    @EnvironmentObject private var browser: BrowserController

    @State private var addressText = ""
    @FocusState private var addressFocused: Bool
    @State private var showsSettings = false
    @State private var isFullscreen = false
    @State private var geometry: ViewportGeometry?
    @State private var showsGeometryBadge = false

    var body: some View {
        VStack(spacing: 0) {
            if !isFullscreen {
                AddressBar(text: $addressText, isFocused: $addressFocused, onSubmit: submitAddress)
            }

            viewport

            if !isFullscreen {
                BrowserToolbar(
                    geometry: geometry,
                    showsSettings: $showsSettings,
                    isFullscreen: $isFullscreen
                )
            }
        }
        .background(Color(.systemBackground))
        // Outside the viewport so the button stays clear of the notch / Dynamic Island.
        .overlay(alignment: .topTrailing) {
            if isFullscreen {
                Button {
                    withAnimation { isFullscreen = false }
                } label: {
                    Image(systemName: "arrow.down.right.and.arrow.up.left")
                        .font(.body.weight(.semibold))
                        .padding(10)
                        .background(.ultraThinMaterial, in: Circle())
                }
                .padding(12)
                .accessibilityLabel("Vollbild beenden")
            }
        }
        .statusBarHidden(isFullscreen)
        .persistentSystemOverlays(isFullscreen ? .hidden : .automatic)
        .sheet(isPresented: $showsSettings) {
            SettingsView()
                .environmentObject(settings)
                .environmentObject(browser)
        }
        .task {
            browser.apply(settings)
            if browser.currentURL == nil, let url = settings.url(fromUserInput: settings.homePage) {
                browser.load(url)
            }
        }
        .onChange(of: settings.userAgent) { browser.apply(settings) }
        .onChange(of: settings.spoofsDesktopEnvironment) { browser.apply(settings) }
        .onChange(of: browser.currentURL) { _, url in
            if !addressFocused {
                addressText = url?.absoluteString ?? ""
            }
        }
        .onChange(of: addressFocused) { _, focused in
            if !focused {
                addressText = browser.currentURL?.absoluteString ?? ""
            }
        }
    }

    private var viewport: some View {
        DesktopViewport(
            webView: browser.webView,
            resolution: settings.resolution,
            scaleMode: settings.scaleMode
        ) { newGeometry in
            geometry = newGeometry
            browser.viewportDidChange(to: newGeometry.screenSize)
        }
        .ignoresSafeArea(.keyboard)
        .ignoresSafeArea(edges: isFullscreen ? .all : [])
        .overlay(alignment: .top) {
            if showsGeometryBadge, let geometry {
                Text("\(geometry.screenSize.label) · \(geometry.percentLabel)")
                    .font(.footnote.monospacedDigit().weight(.semibold))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(.ultraThinMaterial, in: Capsule())
                    .padding(.top, 12)
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .overlay(alignment: .top) {
            if browser.isLoading && !isFullscreen {
                ProgressView(value: browser.progress)
                    .progressViewStyle(.linear)
                    .tint(.accentColor)
            }
        }
        .overlay {
            if let message = browser.errorMessage {
                ErrorOverlay(message: message) {
                    browser.retry()
                }
            }
        }
        .task(id: geometry) {
            guard geometry != nil else { return }
            withAnimation { showsGeometryBadge = true }
            try? await Task.sleep(for: .seconds(1.5))
            guard !Task.isCancelled else { return }
            withAnimation { showsGeometryBadge = false }
        }
    }

    private func submitAddress() {
        guard let url = settings.url(fromUserInput: addressText) else { return }
        addressFocused = false
        browser.load(url)
    }
}

// MARK: - Address bar

private struct AddressBar: View {
    @EnvironmentObject private var browser: BrowserController
    @Binding var text: String
    var isFocused: FocusState<Bool>.Binding
    var onSubmit: () -> Void

    var body: some View {
        HStack(spacing: 8) {
            HStack(spacing: 6) {
                Image(systemName: browser.currentURL?.scheme == "https" ? "lock.fill" : "globe")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                TextField("Suchen oder Adresse eingeben", text: $text)
                    .focused(isFocused)
                    .keyboardType(.webSearch)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .submitLabel(.go)
                    .onSubmit(onSubmit)
                if isFocused.wrappedValue && !text.isEmpty {
                    Button {
                        text = ""
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundStyle(.secondary)
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("Eingabe löschen")
                }
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 8)
            .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 10))

            Button {
                browser.reloadOrStop()
            } label: {
                Image(systemName: browser.isLoading ? "xmark" : "arrow.clockwise")
                    .frame(width: 28, height: 28)
            }
            .accessibilityLabel(browser.isLoading ? "Laden stoppen" : "Neu laden")
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
    }
}

// MARK: - Toolbar

private struct BrowserToolbar: View {
    @EnvironmentObject private var settings: BrowserSettings
    @EnvironmentObject private var browser: BrowserController
    let geometry: ViewportGeometry?
    @Binding var showsSettings: Bool
    @Binding var isFullscreen: Bool

    var body: some View {
        HStack {
            Button {
                browser.goBack()
            } label: {
                Image(systemName: "chevron.backward")
            }
            .disabled(!browser.canGoBack)
            .accessibilityLabel("Zurück")

            Spacer()

            Button {
                browser.goForward()
            } label: {
                Image(systemName: "chevron.forward")
            }
            .disabled(!browser.canGoForward)
            .accessibilityLabel("Vorwärts")

            Spacer()

            resolutionMenu

            Spacer()

            Button {
                withAnimation { isFullscreen = true }
            } label: {
                Image(systemName: "arrow.up.left.and.arrow.down.right")
            }
            .accessibilityLabel("Vollbild")

            Spacer()

            Button {
                showsSettings = true
            } label: {
                Image(systemName: "gearshape")
            }
            .accessibilityLabel("Einstellungen")
        }
        .font(.title3)
        .padding(.horizontal, 24)
        .padding(.vertical, 10)
        .background(.bar)
    }

    private var resolutionMenu: some View {
        Menu {
            Picker("Auflösung", selection: $settings.resolution) {
                ForEach(ResolutionPreset.all) { preset in
                    Text("\(preset.name) · \(preset.resolution.label)")
                        .tag(preset.resolution)
                }
            }

            Picker("Skalierung", selection: $settings.scaleMode) {
                ForEach(ScaleMode.allCases) { mode in
                    Text(mode.title).tag(mode)
                }
            }

            Button {
                browser.resetZoom()
            } label: {
                Label("Zoom zurücksetzen", systemImage: "arrow.up.left.and.down.right.magnifyingglass")
            }

            Button {
                showsSettings = true
            } label: {
                Label("Eigene Auflösung …", systemImage: "slider.horizontal.3")
            }
        } label: {
            VStack(spacing: 1) {
                Image(systemName: "display")
                Text(geometry?.screenSize.label ?? settings.resolution.label)
                    .font(.caption2.monospacedDigit())
            }
        }
        .accessibilityLabel("Auflösung")
    }
}

// MARK: - Error overlay

private struct ErrorOverlay: View {
    let message: String
    let retry: () -> Void

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: "exclamationmark.triangle")
                .font(.largeTitle)
                .foregroundStyle(.secondary)
            Text("Seite konnte nicht geladen werden")
                .font(.headline)
            Text(message)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
            Button("Erneut versuchen", action: retry)
                .buttonStyle(.borderedProminent)
        }
        .padding(24)
        .frame(maxWidth: 360)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 16))
        .padding()
    }
}
