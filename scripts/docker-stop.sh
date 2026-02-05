#!/bin/bash

# Script pour arrêter les conteneurs Docker

set -e

ENV_FILE="${1:-.env.development}"

echo "🛑 Arrêt des conteneurs Docker..."
echo "📄 Utilisation du fichier: $ENV_FILE"

docker-compose -f docker-compose.local.yaml --env-file "$ENV_FILE" down

echo ""
echo "✅ Conteneurs arrêtés avec succès!"
