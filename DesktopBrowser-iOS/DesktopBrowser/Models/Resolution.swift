import Foundation

/// A virtual desktop screen size in CSS pixels.
struct Resolution: Hashable, Codable {
    var width: Int
    var height: Int

    static let widthRange = 320...7680
    static let heightRange = 240...4320

    var label: String { "\(width) × \(height)" }

    /// Returns a copy with both dimensions clamped to the supported range.
    var clamped: Resolution {
        Resolution(
            width: min(max(width, Self.widthRange.lowerBound), Self.widthRange.upperBound),
            height: min(max(height, Self.heightRange.lowerBound), Self.heightRange.upperBound)
        )
    }
}

struct ResolutionPreset: Identifiable, Hashable {
    let name: String
    let resolution: Resolution

    var id: Resolution { resolution }

    static let all: [ResolutionPreset] = [
        ResolutionPreset(name: "Kleiner Laptop", resolution: Resolution(width: 1280, height: 800)),
        ResolutionPreset(name: "Laptop HD", resolution: Resolution(width: 1366, height: 768)),
        ResolutionPreset(name: "MacBook Air 13″", resolution: Resolution(width: 1470, height: 956)),
        ResolutionPreset(name: "Laptop 15″", resolution: Resolution(width: 1536, height: 864)),
        ResolutionPreset(name: "MacBook Pro 16″", resolution: Resolution(width: 1728, height: 1117)),
        ResolutionPreset(name: "Full HD", resolution: Resolution(width: 1920, height: 1080)),
        ResolutionPreset(name: "iMac 24″", resolution: Resolution(width: 2240, height: 1260)),
        ResolutionPreset(name: "WQHD", resolution: Resolution(width: 2560, height: 1440)),
        ResolutionPreset(name: "Ultrawide", resolution: Resolution(width: 3440, height: 1440)),
        ResolutionPreset(name: "4K UHD", resolution: Resolution(width: 3840, height: 2160)),
    ]

    static func named(for resolution: Resolution) -> String? {
        all.first { $0.resolution == resolution }?.name
    }
}

/// How the virtual screen is mapped onto the iPhone display.
enum ScaleMode: String, CaseIterable, Identifiable {
    /// The width is fixed to the chosen resolution; the height grows or shrinks
    /// so the virtual screen fills the whole display (no black bars).
    case fillDisplay
    /// Width and height match the chosen resolution exactly; the screen is
    /// letterboxed when the aspect ratio differs from the display.
    case exact

    var id: String { rawValue }

    var title: String {
        switch self {
        case .fillDisplay: "Display füllen"
        case .exact: "Exaktes Format"
        }
    }
}
