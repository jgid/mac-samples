import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var settings: BrowserSettings
    @EnvironmentObject private var browser: BrowserController
    @Environment(\.dismiss) private var dismiss

    @State private var customWidth = 0
    @State private var customHeight = 0
    @State private var showsClearConfirmation = false
    @State private var clearedData = false

    var body: some View {
        NavigationStack {
            Form {
                screenSection
                customResolutionSection
                browserSection
                dataSection
                aboutSection
            }
            .navigationTitle("Einstellungen")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Fertig") { dismiss() }
                }
            }
            .onAppear {
                customWidth = settings.resolution.width
                customHeight = settings.resolution.height
            }
            .onChange(of: settings.resolution) { _, resolution in
                customWidth = resolution.width
                customHeight = resolution.height
            }
        }
    }

    private var screenSection: some View {
        Section {
            Picker("Auflösung", selection: $settings.resolution) {
                if ResolutionPreset.named(for: settings.resolution) == nil {
                    Text("Eigene · \(settings.resolution.label)").tag(settings.resolution)
                }
                ForEach(ResolutionPreset.all) { preset in
                    VStack(alignment: .leading) {
                        Text(preset.name)
                        Text(preset.resolution.label)
                            .font(.caption.monospacedDigit())
                            .foregroundStyle(.secondary)
                    }
                    .tag(preset.resolution)
                }
            }
            .pickerStyle(.navigationLink)

            Picker("Skalierung", selection: $settings.scaleMode) {
                ForEach(ScaleMode.allCases) { mode in
                    Text(mode.title).tag(mode)
                }
            }
            .pickerStyle(.segmented)
        } header: {
            Text("Virtueller Bildschirm")
        } footer: {
            Text("„Display füllen“ behält die Breite bei und passt die Höhe an dein iPhone an. „Exaktes Format“ zeigt genau die gewählte Auflösung mit Rändern. Im Querformat wirkt der große Bildschirm am natürlichsten; mit zwei Fingern kannst du hineinzoomen.")
        }
    }

    private var customResolutionSection: some View {
        Section {
            LabeledContent("Breite") {
                TextField("Breite", value: $customWidth, format: .number.grouping(.never))
                    .keyboardType(.numberPad)
                    .multilineTextAlignment(.trailing)
            }
            LabeledContent("Höhe") {
                TextField("Höhe", value: $customHeight, format: .number.grouping(.never))
                    .keyboardType(.numberPad)
                    .multilineTextAlignment(.trailing)
            }
            Button("Eigene Auflösung übernehmen") {
                settings.resolution = Resolution(width: customWidth, height: customHeight).clamped
            }
            .disabled(Resolution(width: customWidth, height: customHeight).clamped == settings.resolution)
        } header: {
            Text("Eigene Auflösung")
        } footer: {
            Text(rangeHint)
        }
    }

    private var rangeHint: String {
        let width = Resolution.widthRange, height = Resolution.heightRange
        return "Erlaubt sind \(width.lowerBound)–\(width.upperBound) × \(height.lowerBound)–\(height.upperBound) Pixel. "
            + "Sehr große Auflösungen (ab 4K) benötigen viel Arbeitsspeicher."
    }

    private var browserSection: some View {
        Section {
            Picker("Browser-Kennung", selection: $settings.userAgent) {
                ForEach(UserAgentProfile.allCases) { profile in
                    Text(profile.title).tag(profile)
                }
            }
            Toggle("Desktop-Umgebung vortäuschen", isOn: $settings.spoofsDesktopEnvironment)
            Picker("Suchmaschine", selection: $settings.searchEngine) {
                ForEach(SearchEngine.allCases) { engine in
                    Text(engine.title).tag(engine)
                }
            }
            LabeledContent("Startseite") {
                TextField("https://…", text: $settings.homePage)
                    .keyboardType(.URL)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .multilineTextAlignment(.trailing)
            }
        } header: {
            Text("Browser")
        } footer: {
            Text("„Desktop-Umgebung vortäuschen“ meldet Seiten die gewählte Bildschirmgröße (screen.width/height), eine Desktop-Plattform, keine Touch-Unterstützung und eine Maus als Zeigegerät.")
        }
    }

    private var dataSection: some View {
        Section {
            Button("Website-Daten löschen", role: .destructive) {
                showsClearConfirmation = true
            }
            .confirmationDialog("Cookies, Cache und gespeicherte Daten aller Websites löschen?", isPresented: $showsClearConfirmation, titleVisibility: .visible) {
                Button("Löschen", role: .destructive) {
                    Task {
                        await browser.clearWebsiteData()
                        clearedData = true
                    }
                }
            }
        } footer: {
            if clearedData {
                Text("Website-Daten wurden gelöscht.")
            }
        }
    }

    private var aboutSection: some View {
        Section("So funktioniert es") {
            Text("Die Webansicht wird intern in der gewählten Auflösung (z. B. 1920 × 1080) angelegt und anschließend verkleinert dargestellt. Webseiten sehen dadurch wirklich einen großen Bildschirm – inklusive CSS-Breakpoints und window.innerWidth.")
                .font(.footnote)
                .foregroundStyle(.secondary)
        }
    }
}
