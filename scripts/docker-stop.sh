#!/bin/bash

# Script pour arrêter les conteneurs Docker

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH=${1:-$(git rev-parse --abbrev-ref HEAD)}

case "$BRANCH" in
  main|master)
    ENV_FILE="$ROOT_DIR/.env.production"
    COMPOSE_FILE="$ROOT_DIR/docker-compose.local.yaml"
    ;;
  staging)
    ENV_FILE="$ROOT_DIR/.env.staging"
    COMPOSE_FILE="$ROOT_DIR/docker-compose.staging.yaml"
    ;;
  *)
    ENV_FILE="$ROOT_DIR/.env.development"
    COMPOSE_FILE="$ROOT_DIR/docker-compose.local.yaml"
    ;;
esac

echo "🛑 Arrêt des conteneurs Docker..."
echo "📄 Utilisation du fichier d'environnement: $ENV_FILE"
echo "📄 Utilisation du fichier docker-compose: $COMPOSE_FILE"

docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down

echo ""
echo "✅ Conteneurs arrêtés avec succès!"
