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

Siehe [deploy/README.md](./deploy/README.md) für die vollständige Deployment-Dokumentation.

**Kurzfassung**:
1. Repo auf GitHub erstellen
2. GitHub Pages aktivieren
3. Workflows aus `.github/workflows/` (package-local) oder `deploy/` nach `.github/workflows/` (Root) kopieren
4. Pushen → automatischer Build & Deploy

> **Hinweis**: Die Workflow-Dateien sind bereits in `packages/game1/.github/workflows/` vorbereitet.
> Für GitHub Actions müssen sie ins Root-Verzeichnis `.github/workflows/` kopiert werden
> (der `node`-User kann dies im aktuellen Container nicht tun — bitte von einem Admin ausführen lassen).

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
