# game1 (Snake)

Ein klassisches Snake-Spiel mit Onboarding, Progressionssystem und Analytics.

## Spielfeatures

- **Onboarding**: 3 Schritte (Bewegen → Fressen → Run abschließen), zielt auf < 60s first-time-flow
- **Progression**: Meilensteine schalten Boni frei (Bonus-Punkte, schnelleres Tempo, extra Startlänge)
- **Steuerung**: Pfeiltasten oder WASD
- **Highscore**: Lokal gespeichert (localStorage)

## Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Development Server (http://localhost:3000)
npm run dev

# Production Build
npm run build

# Staging Build
npm run build:staging

# Build Preview
npm run preview
```

## Deployment

### Status: ✅ Live

| Plattform | URL | Status |
|---|---|---|
| **GitHub Pages** | [https://leo24lab2.github.io/leo24lab5-games/](https://leo24lab2.github.io/leo24lab5-games/) | ✅ Aktiv (Primary) |
| **Cloudflare Pages** | — | ⏳ Blockiert (Secrets-Konfiguration) |

### CI/CD-Pipeline

- **CI**: GitHub Actions — Build + TypeScript Check bei jedem Push auf `main`/`develop` + PR
- **CD**: Auto-Deploy zu GitHub Pages bei Push auf `main`
- **Workflow-Dateien**: `.github/workflows/game1-ci.yml`, `.github/workflows/game1-gh-pages.yml`

### Manuelles Deployment

```bash
npm run build      # Build erzeugen
npm run preview    # Lokal testen
git push origin main  # Automatischer Deploy
```

## Analytics Events

| Event | Auslöser |
|---|---|
| `session_start` | Spiel wird geladen (mit `isReturnVisit` Flag) |
| `tutorial_complete` | Erstes Futter gefressen |
| `first_win` | Spielfeld komplett gefüllt |
| `first_lose` | Erster Game Over |
| `return_visit` | Rückkehr nach 24h+ |

Ohne konfigurierten Endpunkt werden Events in `localStorage.snake_telemetry_log` gesammelt.

## Umgebungsvariablen

| Variable | Dev | Staging | Production |
|---|---|---|---|
| `VITE_ANALYTICS_ENDPOINT` | — | `/api/event` | `/api/event` |
| `VITE_RELEASE_CHANNEL` | `dev` | `staging` | `production` |
