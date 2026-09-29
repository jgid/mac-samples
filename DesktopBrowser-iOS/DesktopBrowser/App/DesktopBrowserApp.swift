import SwiftUI

@main
struct DesktopBrowserApp: App {
    @StateObject private var settings = BrowserSettings()
    @StateObject private var browser = BrowserController()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(settings)
                .environmentObject(browser)
        }
    }
}
