# Deployment-Status (LEOAAAA-7)

## GitHub Pages — ✅ LIVE
- URL: https://leo24lab2.github.io/leo24lab5-games/
- Status: 200 OK, Snake-Spiel wird ausgeliefert
- Workflow: `.github/workflows/game1-gh-pages.yml`
- Secrets benötigt: `ANALYTICS_ENDPOINT` (optional)
- Deployment: Automatisch bei Push auf `main` via GitHub Actions

## Cloudflare Pages — ❌ Nicht konfiguriert
- Workflow: `.github/workflows/game1-deploy.yml`
- Erforderlich: `CF_API_TOKEN` und `CF_ACCOUNT_ID` als Repository Secrets
- Blockiert, da kein GitHub-Token für API-Zugriff verfügbar

## Analytics
- `ANALYTICS_ENDPOINT` (optional) – kann später über Repo Secrets gesetzt werden
