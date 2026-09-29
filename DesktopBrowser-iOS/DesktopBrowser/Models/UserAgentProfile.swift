import Foundation

/// The desktop browser the app pretends to be.
enum UserAgentProfile: String, CaseIterable, Identifiable {
    case safariMac
    case chromeMac
    case chromeWindows
    case edgeWindows
    case firefoxWindows

    var id: String { rawValue }

    var title: String {
        switch self {
        case .safariMac: "Safari (macOS)"
        case .chromeMac: "Chrome (macOS)"
        case .chromeWindows: "Chrome (Windows)"
        case .edgeWindows: "Edge (Windows)"
        case .firefoxWindows: "Firefox (Windows)"
        }
    }

    var userAgent: String {
        switch self {
        case .safariMac:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15"
        case .chromeMac:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
        case .chromeWindows:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
        case .edgeWindows:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0"
        case .firefoxWindows:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0"
        }
    }

    /// Value reported by `navigator.platform`.
    var platform: String {
        switch self {
        case .safariMac, .chromeMac: "MacIntel"
        case .chromeWindows, .edgeWindows, .firefoxWindows: "Win32"
        }
    }

    /// Value reported by `navigator.vendor`.
    var vendor: String {
        switch self {
        case .safariMac: "Apple Computer, Inc."
        case .chromeMac, .chromeWindows, .edgeWindows: "Google Inc."
        case .firefoxWindows: ""
        }
    }
}

enum SearchEngine: String, CaseIterable, Identifiable {
    case duckDuckGo
    case google
    case bing
    case ecosia

    var id: String { rawValue }

    var title: String {
        switch self {
        case .duckDuckGo: "DuckDuckGo"
        case .google: "Google"
        case .bing: "Bing"
        case .ecosia: "Ecosia"
        }
    }

    func searchURL(for query: String) -> URL? {
        let base = switch self {
        case .duckDuckGo: "https://duckduckgo.com/"
        case .google: "https://www.google.com/search"
        case .bing: "https://www.bing.com/search"
        case .ecosia: "https://www.ecosia.org/search"
        }
        var components = URLComponents(string: base)
        components?.queryItems = [URLQueryItem(name: "q", value: query)]
        return components?.url
    }
}
