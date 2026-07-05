# Deployment-Checkliste — game1 (Snake)

## Voraussetzung

GitHub Secrets müssen gesetzt sein (siehe LEOAAAA-7):

| Secret | Beschreibung |
|--------|-------------|
| `CF_API_TOKEN` | Cloudflare API Token mit Pages:Edit |
| `CF_ACCOUNT_ID` | Cloudflare Account ID |
| `ANALYTICS_ENDPOINT` | Analytics-URL (optional) |

## Test-Plan

### 1. Workflow manuell triggern

Im GitHub-Repo:
1. **Actions** → `Deploy (Cloudflare Pages)` → **Run workflow** → Branch: `main`
2. Oder alternativ: `Deploy (GitHub Pages)` → **Run workflow** → Branch: `main`

### 2. Build prüfen

Nach dem Trigger:
- [ ] Build läuft grün durch
- [ ] Keine Build-Fehler in den Logs
- [ ] Artefakt `dist/` wird erzeugt

### 3. Deployment-URL prüfen

| Plattform | URL |
|-----------|-----|
| Cloudflare Pages | `https://leo24lab5-snake.pages.dev` |
| GitHub Pages | `https://leo24lab2.github.io/leo24lab5-games/` |

### 4. Health-Checks

- [ ] HTTP 200 auf der URL
- [ ] HTML lädt (Spiel-Titel sichtbar)
- [ ] JS lädt (Canvas erscheint)
- [ ] Keine 404 für Assets
- [ ] Spieloberfläche interaktiv

### 5. Lokaler Smoke-Test (bereits bestätigt ✅)

```bash
cd packages/game1
npm run build
python3 -m http.server 8080 -d dist
# → http://localhost:8080 → HTTP 200, Spiel lädt
```
