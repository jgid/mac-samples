# Konzept v0 – „Deskview“ (Arbeitstitel)

*Stand: Entwurf vor dem Zielgruppen-Test*

## Problem

Auf dem iPhone bekommen Nutzer fast immer die **Mobilversion** einer Website.
Safaris „Desktop-Website anfordern“ ändert nur die Browser-Kennung; das Layout
bleibt bei ca. 980 px Breite. Man kann **keine echte Bildschirmgröße** wählen
(z. B. 1920 × 1080) und sieht daher nicht, was ein Nutzer am großen Monitor sieht.
Viele Web-Oberflächen (Admin-Backends, Dashboards, Router-Menüs, Shop-Backends,
Tabellen-Tools) sind mobil unvollständig oder unbenutzbar.

## Idee

Ein Browser für iPhone, der Webseiten auf einem **virtuellen Monitor** in frei
wählbarer Auflösung darstellt. Die Webansicht wird intern wirklich z. B.
1920 px breit angelegt und nur optisch verkleinert – Webseiten „glauben“, sie
laufen auf einem Desktop.

## Hypothesen zu Zielgruppen

1. **Web-Entwickler:innen / Designer:innen** – Breakpoints und Layouts unterwegs prüfen.
2. **Power-User** – brauchen Desktop-only-Funktionen (WordPress-Backend, Online-Banking-Details, Google Sheets, Router, Behördenportale).
3. **Support / QA** – Kundenprobleme bei bestimmten Auflösungen nachstellen, Screenshots für Tickets.
4. **Marketing / E-Commerce** – Landingpages und Shops auf großen Bildschirmen kontrollieren.

## Geplanter Funktionsumfang (MVP)

- Adressleiste mit Suche, Zurück/Vor, Neu laden
- Auflösungs-Presets (1280 × 800 … 4K) + eigene Auflösung
- Skalierung: „Display füllen“ oder „Exaktes Format“
- Pinch-Zoom in die verkleinerte Seite, Vollbild, Querformat
- Browser-Kennung wählbar (Safari/Chrome/Edge/Firefox, macOS/Windows)
- Desktop-Umgebung vortäuschen (Bildschirmgröße, keine Touch-Erkennung, Maus-Hover)
- Einstellungen werden gespeichert

## Offene Fragen für den Test

- Welche Zielgruppe hat den größten Schmerz?
- Was fehlt für den Alltag (z. B. Hover-Menüs mit dem Finger, Rechtsklick, Screenshots, Lesezeichen, Tabs)?
- Wie wichtig sind Presets vs. eigene Auflösung?
- Was würde die Nutzung sofort abbrechen lassen?
