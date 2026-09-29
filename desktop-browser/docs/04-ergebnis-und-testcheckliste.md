# Ergebnis v1 & Test-Checkliste

## Was passiert ist

1. **Konzept v0** geschrieben ([01](01-konzept-v0.md)).
2. **Synthetischer Zielgruppentest** mit 5 Personas → Ø **5,0/10** ([02](02-zielgruppentest.md)).
3. **Konzept v1 + Plan** mit klarer Zielgruppe und 3 Versprechen: echt · bedienbar · belegbar ([03](03-konzept-v1-und-plan.md)).
4. **Umsetzung durch 4 parallele Subagents** (Kern & Skripte, Oberfläche, Viewport & Trackpad, Auslieferung).
5. **Code-Review-Subagent**: 5 echte Fehler gefunden und behoben (u. a. Neuladen der Testseite
   führte zu Fehlerseite, Endlos-Neuladen bei Speicher-Absturz, Zwei-Finger-Geste löste Klick aus,
   „Einführung erneut zeigen“ öffnete nie).
6. **Persona-Retest am gebauten Stand** → Ø **~6,7/10** (Marco 7, Thomas 6,5, Lena 6,5).
   Quick Wins daraus umgesetzt: Presets „MacBook Air 13″ (bis 2020) 1440 × 900“ und
   „iMac 27″ / WQHD“, Schnellwahl schließt nach Auswahl, Chip zeigt im Modus „Ganzer Bildschirm“
   nur die Breite, Hinweis „Klicken (dort, wo der Zeiger ist)“, präziserer & größerer Cursor,
   Texte der Testseite an die App angeglichen, Höhe im Modus „Ganzer Bildschirm“ auf das
   Doppelte der gewählten Höhe begrenzt (Speicher).

Automatische Prüfungen: TypeScript fehlerfrei, **56 Jest-Tests grün** (inkl. der
injizierten Skripte in jsdom), iOS-Metro-Bundle (`expo export`) baut, Snack-Bundle aktuell.

**Nicht geprüft:** Die App lief noch auf keinem echten iPhone – das ist dein erster Test.

## Checkliste für deinen ersten Test (ca. 10 Minuten)

| # | Schritt | Erwartung |
| --- | --- | --- |
| 1 | App startet | Willkommens-Sheet, danach Testseite mit großer Anzeige `1920 × …` |
| 2 | Testseite ansehen | Breakpoints bis `2xl` aktiv, 3 Spalten, Checks „Maus/Hover ✓“, „Touch ✗“ |
| 3 | Größen-Chip oben antippen → „Laptop HD (Windows)“ | Sheet schließt, Chip `1366 px breit`, Testseite zeigt 1366 |
| 4 | Darstellung „Originalformat“ | schwarzer Rand, exakt 1366 × 768 |
| 5 | iPhone quer drehen | Seite füllt die Breite, Text besser lesbar |
| 6 | „Maus“ unten antippen | Gesten-Karte, danach Cursor in der Mitte |
| 7 | Cursor über das Hover-Menü der Testseite bewegen | Menü klappt auf |
| 8 | Tippen / lange drücken auf den Zähler-Buttons | Klick- bzw. Rechtsklick-Zähler steigen |
| 9 | 2 Finger ziehen | Seite scrollt |
| 10 | Adresse `wikipedia.org` eingeben | Desktop-Version von Wikipedia |
| 11 | Kamera-Button | Teilen-Menü mit PNG in echter Größe + Info-Leiste unten |
| 12 | Größen-Chip → „Für wikipedia.org merken“ an, andere Größe wählen, zurück zur Testseite und wieder zu Wikipedia | Profil wird angewendet, Hinweis erscheint |
| 13 | App schließen & neu öffnen | Einstellungen und Lesezeichen sind noch da |

Bitte notieren, was abweicht (am besten mit Screenshot) – dann kann ich gezielt nachbessern.

## Bekannte Risiken (erst auf dem Gerät prüfbar)

- **Screenshot** einer skalierten WebView kann auf manchen iOS-Versionen leer/unscharf sein.
- **Speicher** bei 4K und größer: WebKit kann den Seitenprozess beenden (App zeigt dann eine Fehlerkarte statt Endlosschleife).
- **Trackpad nach Pinch-Zoom** im Touch-Modus: Klickposition kann abweichen → vorher Zoom zurücksetzen.
- **`:hover` bei fremden Stylesheets** ohne CORS nicht emulierbar; JS-basierte Menüs funktionieren trotzdem.
- **Google-Login** blockiert eingebettete WebViews generell.
- **Expo Go/Snack** ist eine Testumgebung; die echte App (TestFlight) braucht später einen Apple-Developer-Account und EAS Build.

## Nächste Schritte (Vorschlag)

1. Gerätetest mit der Checkliste oben.
2. Ergebnisse mit 3–5 echten Personen der Primärzielgruppe verifizieren.
3. Roadmap v2 priorisieren: Pinch-Zoom im Maus-Modus, zuletzt genutzte Größen am Chip,
   „Info kopieren“ vor dem Teilen, Vergleich mehrerer Größen, Markieren im Screenshot.
4. Für TestFlight: Apple-Developer-Account + `EXPO_TOKEN` → EAS Build per GitHub Actions.
