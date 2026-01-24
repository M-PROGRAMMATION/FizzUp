#!/bin/bash

# Script pour démarrer les conteneurs Docker en mode développement

set -e

ENV_FILE="${1:-.env.development}"

echo "� Vérification de l'état des conteneurs..."

# Vérifier si les conteneurs sont déjà en cours d'exécution
RUNNING=$(docker compose -f docker-compose.local.yaml --env-file "$ENV_FILE" ps -q 2>/dev/null | wc -l | tr -d ' ')

if [ "$RUNNING" -gt 0 ]; then
  echo ""
  echo "⚠️  Les conteneurs sont déjà en cours d'exécution!"
  echo ""
  echo "📊 Statut actuel:"
  docker compose -f docker-compose.local.yaml --env-file "$ENV_FILE" ps
  echo ""
  echo "💡 Utilisez './scripts/docker-restart.sh' pour redémarrer"
  echo "💡 Utilisez './scripts/docker-stop.sh' pour arrêter"
  exit 0
fi

echo "�🚀 Démarrage des conteneurs Docker..."
echo "📄 Utilisation du fichier: $ENV_FILE"

docker compose -f docker-compose.local.yaml --env-file "$ENV_FILE" up -d

echo ""
echo "✅ Conteneurs démarrés avec succès!"
echo ""
echo "📊 Services disponibles:"
echo "  - PostgreSQL: localhost:35435"
echo "  - Adminer: http://localhost:38082"
echo "  - Redis: localhost:6379"
echo "  - Redis Commander: http://localhost:8081"
echo ""
echo "💡 Utilisez './scripts/docker-logs.sh' pour voir les logs"
