# Status: LEOAAAA-3 — CI/CD-Infrastruktur und Hosting einrichten

**Datum:** 2026-07-05 (Heartbeat 4)
**Status:** blocked
**Agent:** Spieleentwickler

## Was wurde erreicht

1. **GitHub-Repository** `leo24lab2/leo24lab5-games` eingerichtet
   - ✅ Push-Zugriff via SSH-Deploy-Key hergestellt (LEOAAAA-6 abgeschlossen)
   - ✅ Code erfolgreich auf `main` gepusht

2. **Snake-Spiel MVP** (`DotDash` / Snake-Clone)
   - ✅ TypeScript/Vite, Build erfolgreich
   - ✅ Highscore-System (localStorage), Responsive UI, Telemetry-Framework
   - ✅ CI-Workflow (`game1-ci.yml`) repariert — Pfade korrigiert

3. **CI/CD-Pipelines (GitHub Actions)**
   - ✅ `game1-ci.yml` — Build + Lint bei jedem Push/PR
   - ✅ `game1-deploy.yml` — Cloudflare Pages Deployment (benötigt Secrets)
   - ✅ `game1-gh-pages.yml` — GitHub Pages Fallback (benötigt Secrets)

4. **Cloudflare Pages Konfiguration**
   - ✅ `wrangler.toml` eingerichtet (Projekt: `leo24lab5-snake`)
   - ❌ Deployment läuft nicht, weil CF_API_TOKEN und CF_ACCOUNT_ID fehlen
   - ❌ Wrangler CLI nicht lokal authentifiziert

5. **Branding**
   - ✅ Alle Verweise von `leo24lab3` auf `leo24lab5` aktualisiert

## LEOAAAA-7 — GitHub Secrets für Deployment konfigurieren

**Status:** blocked — warte auf CEO-Entscheidung

**Aktion (Heartbeat 4):** Ask-User-Questions-Interaction erstellt mit 3 Optionen:
- (A) CEO setzt Secrets selbst im GitHub UI
- (B) CEO teilt Werte per Kommentar → ich konfiguriere per CLI
- (C) CEO aktiviert GitHub Pages als einfachere Alternative

**Ausstehend:** CEO muss im Issue antworten.

**Benötigte Secrets:**
| Secret | Beschreibung |
|---|---|
| `CF_API_TOKEN` | Cloudflare API Token mit Pages-Berechtigung |
| `CF_ACCOUNT_ID` | Cloudflare Account ID |
| `ANALYTICS_ENDPOINT` | Plausible-Endpoint (optional für MVP) |

## Child Issues

- [LEOAAAA-6](/LEO/issues/LEOAAAA-6): Deploy-Key Write-Access einrichten ✅ (erledigt)
- [LEOAAAA-7](/LEO/issues/LEOAAAA-7): GitHub Secrets für Deployment konfigurieren — ⏳ wartet auf CEO

## Nächste Schritte

1. CEO beantwortet Interaction (LEOAAAA-7)
2. Secrets konfigurieren → automatischer Deploy beim nächsten Push
3. Domain einrichten (z.B. `snake.leo24lab5.com`)
4. Analytics (Plausible) konfigurieren
5. Zweites Spiel starten
