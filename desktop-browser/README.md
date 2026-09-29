# Deskview

**Sieh jede Website wie auf einem echten Monitor – und bediene sie wie mit einer Maus.**

Deskview ist eine iPhone-App (Expo / React Native), die Websites in echter Desktop-Größe
layoutet (z. B. 1920 × 1080 CSS-Pixel), auf das Display skaliert, per Trackpad-Modus mit
Cursor bedienbar macht (Hover, Rechtsklick, Scrollen) und Screenshots in echter Auflösung
mit Info-Leiste erzeugt. Konzept, Zielgruppentest und Plan: [`docs/`](docs/)
(insbesondere [`docs/03-konzept-v1-und-plan.md`](docs/03-konzept-v1-und-plan.md)).

## Auf dem iPhone testen – ohne Rechner

Du brauchst nur das iPhone. Die komplette App liegt als einzelne Datei
[`snack/App.js`](snack/App.js) in diesem Repository und wird über Expo Snack in die
kostenlose App **Expo Go** geladen.

1. **Expo Go installieren** – im App Store nach „Expo Go“ suchen und installieren
   (kostenlos, kein Konto nötig).
2. **Snack-Link auf dem iPhone in Safari öffnen:**

   **→ [Deskview in Expo Snack öffnen](https://snack.expo.dev/?platform=ios&supportedPlatforms=ios&name=Deskview&description=Websites+wie+auf+einem+echten+Monitor+ansehen+und+mit+Maus-Cursor+bedienen&sdkVersion=57.0.0&dependencies=%40expo%2Fvector-icons%40%5E15.1.1%2C%40react-native-async-storage%2Fasync-storage%40%5E2.2.0%2Cexpo-clipboard%40%7E57.0.2%2Cexpo-haptics%40%7E57.0.3%2Cexpo-media-library%40%7E57.0.5%2Cexpo-screen-orientation%40%7E57.0.2%2Cexpo-sharing%40%7E57.0.22%2Cexpo-status-bar%40%7E57.0.1%2Creact-native-safe-area-context%40%7E5.7.0%2Creact-native-view-shot%40%5E5.1.0%2Creact-native-webview%40%5E13.16.1&sourceUrl=https%3A%2F%2Fraw.githubusercontent.com%2Fjgid%2Fmac-samples%2Fclaude%2Fdesktop-browser-app%2Fdesktop-browser%2Fsnack%2FApp.js)**

   <details><summary>Link als Text (zum Kopieren)</summary>

   ```
   https://snack.expo.dev/?platform=ios&supportedPlatforms=ios&name=Deskview&description=Websites+wie+auf+einem+echten+Monitor+ansehen+und+mit+Maus-Cursor+bedienen&sdkVersion=57.0.0&dependencies=%40expo%2Fvector-icons%40%5E15.1.1%2C%40react-native-async-storage%2Fasync-storage%40%5E2.2.0%2Cexpo-clipboard%40%7E57.0.2%2Cexpo-haptics%40%7E57.0.3%2Cexpo-media-library%40%7E57.0.5%2Cexpo-screen-orientation%40%7E57.0.2%2Cexpo-sharing%40%7E57.0.22%2Cexpo-status-bar%40%7E57.0.1%2Creact-native-safe-area-context%40%7E5.7.0%2Creact-native-view-shot%40%5E5.1.0%2Creact-native-webview%40%5E13.16.1&sourceUrl=https%3A%2F%2Fraw.githubusercontent.com%2Fjgid%2Fmac-samples%2Fclaude%2Fdesktop-browser-app%2Fdesktop-browser%2Fsnack%2FApp.js
   ```
   </details>

3. **In Expo Go starten** – Snack lädt den Code von GitHub. Tippe auf der Snack-Seite auf
   **„Open in Expo Go“** bzw. wähle bei der Vorschau **„My Device“**. Auf dem iPhone öffnet
   sich dann Expo Go direkt (ansonsten den angezeigten QR-Code mit der Kamera-App scannen,
   z. B. von einem zweiten Gerät aus).
4. Die App startet mit der Testseite. Für Desktop-Größen am besten ins **Querformat** drehen.

**Falls es hakt:**

- Fragt die Snack-Seite nach einer Plattform, **iOS** wählen.
- Meldet Expo Go einen **SDK-Konflikt** („incompatible SDK version“): Expo Go im App Store
  aktualisieren; oder auf der Snack-Seite im **SDK-Auswahlmenü** (unten in der Leiste) die
  SDK-Version wählen, die Expo Go unterstützt (Deskview ist für **SDK 57** gebaut).
- Fehlt ein Paket („Unable to resolve module …“): auf der Snack-Seite erscheint meist ein
  Hinweis „Add dependency“ – antippen, danach neu laden.
- Snack zeigt immer den Stand des Branches `claude/desktop-browser-app`. Nach neuen Commits
  den Link einfach erneut öffnen.

### Alternative (optional): EAS Update

Stabiler als Snack, aber einmalig etwas Einrichtung (geht auch komplett im Browser/auf GitHub,
bis auf Schritt 2):

1. Kostenloses Konto auf [expo.dev](https://expo.dev) anlegen und dort unter
   *Account settings → Access tokens* einen Token erzeugen.
2. Einmalig ein EAS-Projekt verknüpfen: `cd desktop-browser/app && npx eas-cli init` und
   `npx eas-cli update:configure` (schreibt `extra.eas.projectId` / `updates.url` in
   `app.json`), dann `app.json` committen. *Dafür wird einmal ein Rechner oder eine
   Cloud-Umgebung gebraucht.*
3. Im GitHub-Repository unter *Settings → Secrets and variables → Actions* das Secret
   **`EXPO_TOKEN`** anlegen.
4. Unter *Actions* den Workflow **„Deskview EAS Update (optional)“** starten
   (*Run workflow*). Er läuft außerdem bei jedem Push auf `desktop-browser/app/**`.
5. Auf expo.dev beim Projekt unter *Updates* das Update (Branch `preview`) öffnen und
   per QR-Code/Link in Expo Go starten (Expo-Go-Konto = expo.dev-Konto).

Ohne `EXPO_TOKEN` wird der Workflow einfach übersprungen.

## Entwicklung

Voraussetzungen: Node.js 22, npm.

```bash
cd desktop-browser/app
npm ci                 # Abhängigkeiten installieren
npm start              # Metro/Expo Dev-Server (QR-Code für Expo Go)
npm run typecheck      # tsc --noEmit
npm test               # Jest (Kernlogik + injizierte Skripte mit jsdom)
npm run build:snack    # snack/App.js, dependencies.json, snack-link.txt neu erzeugen
npm run check:snack    # CI: schlägt fehl, wenn snack/ nicht zum Quellcode passt
npm run export:ios     # Metro-Bundle für iOS nach dist/ (offline: EXPO_OFFLINE=1)
```

**Wichtig:** Nach Änderungen an `app/` immer `npm run build:snack` ausführen und
`snack/` mit committen – sonst lädt der Snack-Link den alten Stand (und die CI schlägt fehl).

CI: [`.github/workflows/deskview-ci.yml`](../.github/workflows/deskview-ci.yml) prüft
Typecheck, Tests, Aktualität des Snack-Bundles und das iOS-Metro-Bundle.

## Projektstruktur

```
desktop-browser/
├── README.md              diese Datei
├── docs/                  Konzept v0, Zielgruppentest, Konzept v1 & Plan
├── snack/                 GENERIERT – nicht von Hand bearbeiten
│   ├── App.js             gesamte App als ein ESM-Bundle (für Expo Snack)
│   ├── dependencies.json  externe Pakete mit Versionen
│   └── snack-link.txt     fertiger Snack-Link
└── app/                   Expo-Projekt (SDK 57, React Native, TypeScript)
    ├── App.tsx            Einstieg (Default-Export App)
    ├── index.ts           registerRootComponent
    ├── app.json           Expo-Konfiguration
    ├── scripts/
    │   └── build-snack.mjs  esbuild-Bundler für snack/
    ├── src/
    │   ├── types.ts       gemeinsame Typen/Schnittstellen
    │   ├── core/          Auflösungen, URL-Logik, Kennungen, injizierte Skripte, Testseite
    │   ├── state/         Zustand & Persistenz (AsyncStorage)
    │   ├── screens/       Browser-Screen, Einstellungen, Lesezeichen
    │   ├── ui/            UI-Bausteine (Adressleiste, Toolbar, Schnellwahl …)
    │   └── viewport/      skalierte WebView, Trackpad-Overlay, Screenshot
    └── __tests__/         Jest-Tests
```

## Bekannte Grenzen

- **Nur WebKit:** Auf iOS rendert jede WebView mit WebKit (WKWebView). „Als Chrome/Edge
  ausgeben“ ändert nur die Kennung (User-Agent), nicht die Rendering-Engine.
- **`:hover`-Emulation:** Echte `:hover`-Styles werden nachgebildet, indem lesbare
  CSS-Regeln dupliziert werden. Stylesheets fremder Domains ohne CORS-Freigabe sind nicht
  lesbar – dort greifen nur JavaScript-Hover-Events (`mouseover`/`mouseenter`), nicht
  reine CSS-Hover-Effekte.
- **Google-Login** (und einige andere OAuth-Anbieter) blockieren eingebettete WebViews
  („Diese App ist möglicherweise nicht sicher“). Logins aus Safari werden nicht übernommen;
  wo möglich E-Mail/Passwort statt „Mit Google anmelden“ verwenden.
- **Speicher:** Sehr große Größen (4K, 3840 × 2160) brauchen viel Speicher; bei schweren
  Seiten kann iOS den WebView-Prozess beenden (Seite lädt neu). Screenshots in 4K ebenso.
- **Snack/Expo Go ≠ echte App:** In Expo Go laufen nur die dort enthaltenen nativen Module;
  Name, Icon, Berechtigungstexte und Performance entsprechen nicht einer echten
  App-Store-/TestFlight-Version (dafür EAS Build). Snack lädt den Code bei jedem Start aus
  dem Netz; Fotos-Mediathek-Zugriff und Teilen laufen unter „Expo Go“.
