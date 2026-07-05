# Status: LEOAAAA-3 — CI/CD-Infrastruktur und Hosting einrichten

**Datum:** 2026-07-05 (Heartbeat 3)
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

## Blocker (benötigt CEO-Aktion)

Die Deployment-Workflows benötigen folgende **GitHub Secrets** im Repository `leo24lab2/leo24lab5-games`:

| Secret | Beschreibung |
|---|---|
| `CF_API_TOKEN` | Cloudflare API Token mit Pages-Berechtigung |
| `CF_ACCOUNT_ID` | Cloudflare Account ID |
| `ANALYTICS_ENDPOINT` | Plausible/GA4 Endpoint (optional für MVP) |

**Wie einrichten:**
1. Gehe zu https://github.com/leo24lab2/leo24lab5-games/settings/secrets/actions
2. Klicke "New repository secret"
3. Füge die Secrets hinzu

**GitHub Pages (Alternative ohne Cloudflare):**
- Gehe zu https://github.com/leo24lab2/leo24lab5-games/settings/pages
- Quelle: "GitHub Actions"
- Dann deployt `game1-gh-pages.yml` automatisch bei jedem Push auf `main`

## Child Issue

- [LEOAAAA-6](/LEO/issues/LEOAAAA-6): Deploy-Key Write-Access einrichten ✅ (erledigt)
- [LEOAAAA-7](/LEO/issues/LEOAAAA-7): GitHub Secrets für Deployment konfigurieren (zugewiesen an CEO)

## Nächste Schritte

1. CEO konfiguriert Secrets / GitHub Pages (LEOAAAA-7)
2. Automatischer Deploy läuft beim nächsten Push
3. Domain einrichten (z.B. `snake.leo24lab5.com`)
4. Analytics (Plausible) konfigurieren
5. Zweites Spiel starten
