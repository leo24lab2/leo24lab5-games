#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────
# GitHub Secrets Setup — leo24lab5 Games
# ──────────────────────────────────────────────────
# Führt aus: Dieses Skript setzt GitHub Actions Secrets
# für das Repository leo24lab2/leo24lab5-games.
#
# Voraussetzung: gh CLI installiert und authentifiziert
#   gh auth login
#
# Alternativ: Secrets manuell setzen unter
#   https://github.com/leo24lab2/leo24lab5-games/settings/secrets/actions
# ──────────────────────────────────────────────────

REPO="leo24lab2/leo24lab5-games"

echo "=== GitHub Secrets Setup für $REPO ==="
echo ""

# Prüfe gh auth
if ! gh auth status &>/dev/null; then
  echo "❌ gh CLI nicht authentifiziert. Bitte ausführen:"
  echo "   gh auth login"
  echo ""
  echo "Alternativ: Secrets manuell setzen unter:"
  echo "   https://github.com/$REPO/settings/secrets/actions"
  exit 1
fi

echo "✅ gh CLI authentifiziert"
echo ""

# --- Secrets definieren ---
declare -A SECRETS
SECRETS["CF_API_TOKEN"]=""
SECRETS["CF_ACCOUNT_ID"]=""
SECRETS["ANALYTICS_ENDPOINT"]="/api/event"

echo "Folgende Secrets werden benötigt:"
echo ""
printf "  %-20s %s\n" "Secret" "Beschreibung"
printf "  %-20s %s\n" "------" "------------"
printf "  %-20s %s\n" "CF_API_TOKEN" "Cloudflare API Token (Pages:Read + Pages:Write)"
printf "  %-20s %s\n" "CF_ACCOUNT_ID" "Cloudflare Account ID"
printf "  %-20s %s\n" "ANALYTICS_ENDPOINT" "Analytics-URL (optional, default: /api/event)"
echo ""

# --- CF_API_TOKEN ---
read -rsp "🔑 CF_API_TOKEN eingeben (Eingabe unsichtbar): " CF_API_TOKEN
echo ""
if [ -n "$CF_API_TOKEN" ]; then
  SECRETS["CF_API_TOKEN"]="$CF_API_TOKEN"
fi

# --- CF_ACCOUNT_ID ---
read -rp "🔑 CF_ACCOUNT_ID eingeben: " CF_ACCOUNT_ID
if [ -n "$CF_ACCOUNT_ID" ]; then
  SECRETS["CF_ACCOUNT_ID"]="$CF_ACCOUNT_ID"
fi

# --- ANALYTICS_ENDPOINT ---
read -rp "📊 ANALYTICS_ENDPOINT (Enter = /api/event): " ANALYTICS_ENDPOINT
if [ -n "$ANALYTICS_ENDPOINT" ]; then
  SECRETS["ANALYTICS_ENDPOINT"]="$ANALYTICS_ENDPOINT"
fi

echo ""
echo "=== Setze Secrets via gh CLI ==="
echo ""

for KEY in "${!SECRETS[@]}"; do
  VALUE="${SECRETS[$KEY]}"
  if [ -z "$VALUE" ]; then
    echo "⚠️  Überspringe $KEY (leer)"
    continue
  fi
  echo "→ Setze $KEY ..."
  echo "$VALUE" | gh secret set "$KEY" --repo "$REPO"
done

echo ""
echo "=== Übersicht ==="
for KEY in "${!SECRETS[@]}"; do
  STATUS="🔴 nicht gesetzt"
  if [ -n "${SECRETS[$KEY]}" ]; then
    STATUS="🟢 gesetzt"
  fi
  printf "  %-20s %s\n" "$KEY" "$STATUS"
done

echo ""
echo "=== Nächste Schritte ==="
echo "1. GitHub Pages aktivieren (optional):"
echo "   https://github.com/$REPO/settings/pages"
echo "   → Source: GitHub Actions"
echo ""
echo "2. Pushen auf main triggert automatisches Deployment:"
echo "   git push origin main"
echo ""
echo "3. Deployment-Status prüfen:"
echo "   https://github.com/$REPO/actions"
echo ""
echo "✅ Setup abgeschlossen!"
