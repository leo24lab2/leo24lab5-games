# Deployment Guide — leo24lab5 Games

## Status

| Komponente | Status |
|---|---|
| Snake-Spiel (MVP) | ✅ Build erfolgreich getestet |
| GitHub Actions Workflows | ✅ Vorhanden in `packages/game1/.github/workflows/` — **kein manuelles Kopieren nötig** |
| Cloudflare Pages Konfiguration | ✅ `wrangler.toml` + `_headers` + `_redirects` vorhanden |
| Analytics (Plausible Proxy) | ✅ Cloudflare Functions in `functions/analytics.js` |
| GitHub Pages Alternative | ✅ Workflow vorhanden (`deploy-github-pages.yml`) |

> **Hinweis:** `packages/game1/` ist ein eigenständiges Git-Repository. Die Workflows in `.github/workflows/` werden von GitHub Actions automatisch erkannt, sobald das Repo auf GitHub gepusht wird.

---

## Voraussetzungen

1. **GitHub-Repository** mit dem Code (z. B. `leo24lab5/leo24lab5-games`)
2. **Cloudflare-Konto** (kostenlos) für Pages: https://dash.cloudflare.com/
3. **Plausible-Konto** (oder self-hosted) für Analytics: https://plausible.io/

---

## 1. GitHub Actions Workflows

Die Workflows liegen fertig konfiguriert in `packages/game1/.github/workflows/`:

| Datei | Trigger | Aufgabe |
|---|---|---|
| `game1-ci.yml` | push/PR auf `main`, `develop` | Build + Upload als Artefakt |
| `game1-deploy.yml` | push auf `main` | Build + Deploy zu Cloudflare Pages (via `wrangler-action`) |
| `game1-gh-pages.yml` | push auf `main` | Build + Deploy zu GitHub Pages (via `actions/deploy-pages`) |

Da `packages/game1/` ein eigenes Git-Repository ist, müssen die Workflows **nicht** kopiert werden — sie liegen bereits am richtigen Ort.

---

## 2. Cloudflare Pages Setup

### Schritt 1: Projekt erstellen

1. Im Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages**
2. **Connect to Git** → Repository auswählen (oder **Direct Upload** → später)
3. Build-Konfiguration:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `packages/game1`

### Schritt 2: Domain (optional)

- Standard: `leo24lab5-snake.pages.dev`
- Custom Domain: Im Pages-Dashboard → Projekt → **Custom domains** → `snake.leo24lab5.de`

### Schritt 3: GitHub Secrets setzen

| Secret | Wert |
|---|---|
| `CF_API_TOKEN` | Cloudflare API Token (Permissions: Cloudflare Pages → Edit) |
| `CF_ACCOUNT_ID` | Cloudflare Account ID (im Dashboard →右侧) |
| `ANALYTICS_ENDPOINT` | Analytics-Proxy-URL (z. B. `/api/event`) |

### Schritt 4: Wrangler (optional, für lokales Testen)

```bash
npm install -g wrangler
wrangler login
wrangler pages deploy dist --project-name=leo24lab5-snake
```

---

## 3. Analytics (Plausible)

### Self-Hosted Variante (empfohlen)

1. Plausible auf einem Server oder via Railway/Render hosten
2. In `packages/game1/functions/analytics.js` die `PLAUSIBLE_URL` anpassen

### Cloudflare Pages Function als Proxy

Die Datei `packages/game1/functions/analytics.js` routet POST-Anfragen an `/api/event` zu Plausible weiter — so bleibt der API-Key verborgen.

### Umgebungsvariablen

| Variable | Dev | Staging | Production |
|---|---|---|---|
| `VITE_ANALYTICS_ENDPOINT` | (leer) | `/api/event` | `/api/event` |
| `VITE_RELEASE_CHANNEL` | `dev` | `staging` | `production` |

---

## 4. Lokales Build & Preview

```bash
cd packages/game1

# Development Server
npm run dev

# Production Build
npm run build

# Build preview
npm run preview
```

---

## 5. Alternative: GitHub Pages (kostenlos, einfacher)

Falls Cloudflare Pages nicht gewünscht ist:

1. Workflow `packages/game1/deploy/deploy-github-pages.yml` nach `.github/workflows/` kopieren
2. Im GitHub-Repo: **Settings** → **Pages** → Source: **GitHub Actions**
3. Fertig — bei jedem Push auf `main` wird automatisch deployed

**Domain**: `leo24lab5.github.io/leo24lab5-games/` (oder Custom Domain)

---

## 6. Schnellstart (minimal)

Für den schnellsten Weg live:

1. Repo auf GitHub erstellen (z. B. `leo24lab5/leo24lab5-games`)
2. Token mit `repo`-Scope generieren (https://github.com/settings/tokens)
3. Lokal: `git init && git add . && git commit -m "init" && git push`
4. GitHub Pages aktivieren (Settings → Pages → GitHub Actions)
5. Workflow `deploy-github-pages.yml` nach `.github/workflows/game1-deploy.yml` kopieren
6. Pushen → in < 5 Minuten live unter `github.io`
