import Foundation

/// User preferences, persisted in `UserDefaults`.
@MainActor
final class BrowserSettings: ObservableObject {
    @Published var resolution: Resolution {
        didSet { defaults.set([resolution.width, resolution.height], forKey: Keys.resolution) }
    }
    @Published var scaleMode: ScaleMode {
        didSet { defaults.set(scaleMode.rawValue, forKey: Keys.scaleMode) }
    }
    @Published var userAgent: UserAgentProfile {
        didSet { defaults.set(userAgent.rawValue, forKey: Keys.userAgent) }
    }
    /// Overrides `screen.*`, `navigator.platform`, touch detection and
    /// `matchMedia` hover/pointer queries so pages believe they run on a desktop.
    @Published var spoofsDesktopEnvironment: Bool {
        didSet { defaults.set(spoofsDesktopEnvironment, forKey: Keys.spoofsDesktopEnvironment) }
    }
    @Published var searchEngine: SearchEngine {
        didSet { defaults.set(searchEngine.rawValue, forKey: Keys.searchEngine) }
    }
    @Published var homePage: String {
        didSet { defaults.set(homePage, forKey: Keys.homePage) }
    }

    private let defaults: UserDefaults

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults

        if let values = defaults.array(forKey: Keys.resolution) as? [Int], values.count == 2 {
            resolution = Resolution(width: values[0], height: values[1]).clamped
        } else {
            resolution = Resolution(width: 1920, height: 1080)
        }
        scaleMode = defaults.string(forKey: Keys.scaleMode).flatMap(ScaleMode.init(rawValue:)) ?? .fillDisplay
        userAgent = defaults.string(forKey: Keys.userAgent).flatMap(UserAgentProfile.init(rawValue:)) ?? .safariMac
        spoofsDesktopEnvironment = defaults.object(forKey: Keys.spoofsDesktopEnvironment) as? Bool ?? true
        searchEngine = defaults.string(forKey: Keys.searchEngine).flatMap(SearchEngine.init(rawValue:)) ?? .duckDuckGo
        homePage = defaults.string(forKey: Keys.homePage) ?? "https://www.apple.com/de/"
    }

    /// Turns address bar input into a URL, falling back to a web search.
    func url(fromUserInput input: String) -> URL? {
        let text = input.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return nil }

        if let url = URL(string: text), let scheme = url.scheme?.lowercased(),
           ["http", "https", "about", "data"].contains(scheme) {
            return url
        }
        let looksLikeHost = !text.contains(" ") && (text.contains(".") || text.hasPrefix("localhost"))
        if looksLikeHost, let url = URL(string: "https://" + text), url.host != nil {
            return url
        }
        return searchEngine.searchURL(for: text)
    }

    private enum Keys {
        static let resolution = "resolution"
        static let scaleMode = "scaleMode"
        static let userAgent = "userAgent"
        static let spoofsDesktopEnvironment = "spoofsDesktopEnvironment"
        static let searchEngine = "searchEngine"
        static let homePage = "homePage"
    }
}
