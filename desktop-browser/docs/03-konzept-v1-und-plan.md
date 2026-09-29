# Konzept v1 & Umsetzungsplan – „Deskview“

## Positionierung

> **Sieh jede Website wie auf einem echten Monitor – und bediene sie wie mit einer Maus.**

- **Primär:** Menschen, die Websites prüfen (Entwicklung, QA/Support, Marketing).
- **Sekundär:** Power-User mit Desktop-only-Oberflächen (Shop-Backend, Router, Buchhaltung).

Drei Versprechen (aus dem Zielgruppentest abgeleitet):

1. **Echt** – Die Seite wird wirklich in der gewählten Größe gelayoutet (CSS-Breakpoints,
   `innerWidth`), nicht nur gezoomt. Die aktuelle Größe ist immer sichtbar.
2. **Bedienbar** – Trackpad-Modus mit Cursor: Hover-Menüs, Rechtsklick, Scrollen.
3. **Belegbar** – Screenshot in echter Auflösung mit Info-Leiste (URL, Größe, Kennung, Zeit), direkt teilen.

## Funktionsumfang v1 (dieser Build)

| # | Funktion | Adressiert |
| --- | --- | --- |
| 1 | Virtueller Monitor: WebView in echter CSS-Größe, skaliert auf das Display | Kern |
| 2 | **Geräte-Presets** („MacBook Air 13″ – 1470 × 956“), gruppiert; eigene Größe unter „Erweitert“ | Marco, Thomas |
| 3 | **Schnellwahl** mit einem Tipp auf den Größen-Chip; Chip zeigt live `1920 × 1080 · 21 %` | Lena, Aylin |
| 4 | Darstellung verständlich benannt: „**Ganzer Bildschirm**“ (Breite fix, Höhe passt sich an) vs. „**Originalformat**“ (exakt, mit Rändern) | alle |
| 5 | **Trackpad-Modus** (Maus): 1 Finger bewegt Cursor, Tippen = Klick, lange drücken = Rechtsklick, 2 Finger = Scrollen; Hover löst `:hover`-Styles und Maus-Events aus | alle |
| 6 | **Screenshot** in echter Auflösung + Info-Leiste, Teilen über das iOS-Teilen-Menü (Markup, Jira, Slack, Fotos) | Marco, Aylin, Lena |
| 7 | **Profil pro Website** („Für example.com merken“) | Thomas, Jonas |
| 8 | **Lesezeichen**; Cookies/Logins bleiben erhalten | Thomas, Lena |
| 9 | **Testseite als Startseite**: zeigt Viewport, Breakpoints, Hover-/Touch-Erkennung – der „Aha“-Moment in den ersten 30 Sekunden | Jonas, Lena |
| 10 | Kennung „Als … ausgeben“ mit **ehrlichem Hinweis**: iOS rendert immer mit WebKit | Aylin, Lena, Jonas |
| 11 | „Desktop-Modus“ (statt „vortäuschen“) mit Details-Liste, was geändert wird | Thomas, Lena |
| 12 | Vollbild; Querformat-Hinweis | Thomas, Aylin |

**Roadmap v2:** Vergleich mehrerer Größen nebeneinander, Markieren im Screenshot,
Ganzseiten-Screenshot, Tabs, devicePixelRatio, JS-Konsole, Share-Extension „In Deskview öffnen“.

## Technische Entscheidungen

- **Expo (React Native) + `react-native-webview`**: läuft ohne Mac direkt in der
  kostenlosen **Expo Go**-App auf dem iPhone (per Snack-Link). Unter iOS ist
  `react-native-webview` ein `WKWebView` – dasselbe Rendering wie der native Prototyp.
  Später per EAS Build als echte App (TestFlight/App Store) auslieferbar.
- **Skalierung:** WebView erhält `width = cssWidth`, `height = cssHeight` und
  `transform: scale(s)` mit `transformOrigin: 'top left'` in einem Container mit
  `overflow: hidden`.
- **Desktop-Layout:** `contentMode="desktop"`, Desktop-User-Agent, injiziertes Skript
  ersetzt `<meta name=viewport>` durch `width=device-width` (Desktop-Browser ignorieren ihn).
- **Desktop-Modus:** `screen.*`, `outerWidth/Height`, `navigator.platform/vendor/maxTouchPoints`,
  `ontouchstart`-Erkennung, `matchMedia` für `hover`/`pointer`.
- **Trackpad:** Gesten-Overlay über der WebView (PanResponder), Cursor als RN-View,
  Befehle per `injectJavaScript` an `window.__dv` (Maus-Engine im Seitenkontext).
  `:hover` wird emuliert, indem lesbare CSS-Regeln mit `:hover` dupliziert werden
  (`[data-dv-hover]`) und die Hover-Kette markiert wird. Grenze: Stylesheets anderer
  Domains ohne CORS sind nicht lesbar → Versuch per `fetch`, sonst nur JS-Hover-Events.
- **Screenshot:** `react-native-view-shot` auf den *unskalierten* Container
  (WebView + Info-Leiste) → PNG in CSS-Pixel-Größe; Teilen via `expo-sharing`.
- **Persistenz:** AsyncStorage (Einstellungen, Lesezeichen, Profile).
- **Auslieferung zum Testen:** Build-Skript bündelt die App mit esbuild zu einer
  einzelnen `snack/App.js`; ein Snack-Link lädt sie von GitHub. Zusätzlich
  GitHub-Actions-Workflow für CI und optional EAS Update (braucht `EXPO_TOKEN`).

## Arbeitspakete (Subagents)

| Paket | Inhalt | Dateien |
| --- | --- | --- |
| **A – Kern & Skripte** | Auflösungen/Geometrie, URL-Logik, Kennungen, injizierte Skripte (Viewport, Desktop-Modus, Maus-Engine, Info-Reporter), Testseite, Jest-Tests (jsdom) | `src/core/**`, `__tests__/**`, `jest.config.js` |
| **B – App-Oberfläche** | Zustand/Persistenz, Browser-Screen, Adressleiste, Toolbar, Schnellwahl, Einstellungen, Lesezeichen, Onboarding | `App.tsx`, `src/state/**`, `src/screens/**`, `src/ui/**` |
| **C – Viewport & Trackpad** | Skalierte WebView, Navigation, Trackpad-Overlay mit Cursor, Screenshot + Info-Leiste | `src/viewport/**` |
| **D – Auslieferung** | esbuild-Snack-Bundle, Snack-Link, CI-Workflow, EAS-Workflow, README/Testanleitung | `scripts/**`, `snack/**`, `.github/**`, `README.md`, `package.json`-Skripte |

Schnittstellen sind in `src/types.ts` und den Stub-Dateien in `src/core/` festgelegt.

## Definition of Done

- `npx tsc --noEmit` fehlerfrei, `npx jest` grün
- Metro-Bundle für iOS baut (`expo export`), Snack-Bundle erzeugt
- Review-Subagent: Code-Review + Heuristik-Review gegen die Personas
- Testanleitung für das iPhone ohne Rechner
