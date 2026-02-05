#!/bin/bash

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

echo "🔍 Vérification de l'état des conteneurs..."
RUNNING=$(docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps -q 2>/dev/null | wc -l | tr -d ' ')

if [ "$RUNNING" -gt 0 ]; then
  echo ""
  echo "⚠️  Les conteneurs sont déjà en cours d'exécution!"
  echo ""
  echo "📊 Statut actuel:"
  docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
  echo ""
  echo "💡 Utilisez './scripts/docker-restart.sh' pour redémarrer"
  echo "💡 Utilisez './scripts/docker-stop.sh' pour arrêter"
  exit 0
fi

echo "🚀 Démarrage des conteneurs Docker..."
echo "📄 Utilisation du fichier d'environnement: $ENV_FILE"
echo "📄 Utilisation du fichier docker-compose: $COMPOSE_FILE"
docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build

echo ""
echo "✅ Conteneurs démarrés avec succès!"