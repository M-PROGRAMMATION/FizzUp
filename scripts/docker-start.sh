#!/bin/bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH=${1:-$(git rev-parse --abbrev-ref HEAD)}

case "$BRANCH" in
  main|master)
    ENV_FILE="$ROOT_DIR/.env.production"
    ;;
  staging)
    ENV_FILE="$ROOT_DIR/.env.staging"
    ;;
  *)
    ENV_FILE="$ROOT_DIR/.env.development"
    ;;
esac

echo "� Vérification de l'état des conteneurs..."
RUNNING=$(docker-compose -f "$ROOT_DIR/docker-compose.local.yaml" --env-file "$ENV_FILE" ps -q 2>/dev/null | wc -l | tr -d ' ')

if [ "$RUNNING" -gt 0 ]; then
  echo ""
  echo "⚠️  Les conteneurs sont déjà en cours d'exécution!"
  echo ""
  echo "📊 Statut actuel:"
  docker-compose -f "$ROOT_DIR/docker-compose.local.yaml" --env-file "$ENV_FILE" ps
  echo ""
  echo "💡 Utilisez './scripts/docker-restart.sh' pour redémarrer"
  echo "💡 Utilisez './scripts/docker-stop.sh' pour arrêter"
  exit 0
fi

echo "�🚀 Démarrage des conteneurs Docker..."
echo "📄 Utilisation du fichier: $ENV_FILE"
docker-compose -f "$ROOT_DIR/docker-compose.local.yaml" --env-file "$ENV_FILE" up -d

echo ""
echo "✅ Conteneurs démarrés avec succès!"