# Desktop Browser für iPhone

Eine SwiftUI-App für iOS 17+, die auf dem iPhone einen Desktop-Browser emuliert.
Die Auflösung des „virtuellen Bildschirms“ ist frei wählbar (z. B. 1920 × 1080,
2560 × 1440 oder 4K), damit Webseiten so aussehen wie auf einem großen Monitor.

## Funktionen

- **Echte Desktop-Auflösung**: Die Webansicht wird intern in der gewählten Größe
  angelegt und dann verkleinert angezeigt. Webseiten sehen also wirklich einen
  1920 px breiten Bildschirm: CSS-Breakpoints, `window.innerWidth` und
  responsive Layouts verhalten sich wie am Desktop.
- **Auflösungs-Presets** von 1280 × 800 bis 4K sowie eine **eigene Auflösung**.
- **Zwei Skalierungsmodi**
  - *Display füllen*: Die Breite bleibt fix, die Höhe passt sich dem iPhone an
    (keine schwarzen Ränder, gut im Hochformat).
  - *Exaktes Format*: Genau die gewählte Auflösung, bei Bedarf mit Rändern
    (ideal im Querformat).
- **Desktop-User-Agent**: Safari (macOS), Chrome (macOS/Windows), Edge oder Firefox.
- **Desktop-Umgebung vortäuschen** (abschaltbar): `screen.width/height`,
  `navigator.platform`, `maxTouchPoints = 0`, keine `ontouchstart`-Erkennung und
  `matchMedia('(hover: hover)')` / `(pointer: fine)` wie bei einer Maus.
- **Viewport-Meta wird neutralisiert**: Desktop-Browser ignorieren
  `<meta name="viewport">`, deshalb wird er auf die virtuelle Breite gesetzt.
- Pinch-to-Zoom in die verkleinerte Seite, Vollbildmodus, Querformat,
  Wisch-Gesten für Zurück/Vorwärts, Suchmaschinen-Auswahl, Startseite,
  Website-Daten löschen.

## Projekt öffnen und starten

Voraussetzung: Mac mit **Xcode 16** oder neuer.

1. `DesktopBrowser-iOS/DesktopBrowser.xcodeproj` in Xcode öffnen.
2. Unter *Signing & Capabilities* dein Team auswählen und ggf. die
   Bundle-ID (`com.example.DesktopBrowser`) anpassen.
3. Ein iPhone oder einen Simulator wählen und mit ⌘R starten.

Das Projekt nutzt einen synchronisierten Ordner: Neue Dateien in
`DesktopBrowser/` werden automatisch ins Target aufgenommen.

## Aufbau

| Datei | Aufgabe |
| --- | --- |
| `App/DesktopBrowserApp.swift` | Einstiegspunkt, erzeugt Einstellungen und Browser |
| `Browser/DesktopViewportView.swift` | Legt die `WKWebView` in voller virtueller Größe an und skaliert sie per Transform auf das Display |
| `Browser/BrowserController.swift` | Besitzt die `WKWebView`, User-Agent, Navigation, Fehlerbehandlung |
| `Browser/DesktopScripts.swift` | Per `WKUserScript` injiziertes JavaScript (Viewport, Bildschirmgröße, Plattform, Touch/Hover) |
| `Models/` | Auflösungen/Presets, Browser-Profile, gespeicherte Einstellungen |
| `Views/` | Adressleiste, Toolbar mit Auflösungsmenü, Einstellungen |

### Das Prinzip

```
iPhone-Display (z. B. 393 pt breit)
┌──────────────┐
│ ┌──────────┐ │   WKWebView.bounds  = 1920 × 1080 (virtueller Monitor)
│ │ Webseite │ │   WKWebView.transform = scale(393 / 1920 ≈ 0.2)
│ └──────────┘ │
└──────────────┘
```

Weil die Webansicht tatsächlich so groß ist, rechnet WebKit das Layout wie ein
Desktop-Fenster dieser Größe. Die Verkleinerung ist nur Darstellung.

## Grenzen

- Auf iOS muss jeder Browser die WebKit-Engine verwenden. Die App *meldet*
  sich als Chrome/Firefox, rendert aber mit WebKit. Seiten, die engine-spezifische
  Features erwarten, können sich daher anders verhalten – „Safari (macOS)“ ist
  meist die zuverlässigste Wahl.
- CSS-Media-Queries `hover`/`pointer` in Stylesheets lassen sich nicht umbiegen,
  nur deren Abfrage per JavaScript (`matchMedia`).
- Sehr hohe Auflösungen (4K und mehr) brauchen viel Arbeitsspeicher, da WebKit
  die Seite in voller Größe rendert.
- Text ist bei großen Auflösungen naturgemäß klein – mit zwei Fingern zoomen
  oder das Gerät ins Querformat drehen.
