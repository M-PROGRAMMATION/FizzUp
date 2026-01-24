#!/bin/bash

# Script pour afficher le statut des conteneurs Docker

ENV_FILE="${1:-.env.development}"

echo "📊 Statut des conteneurs Docker:"
echo ""
docker compose -f docker-compose.local.yaml --env-file "$ENV_FILE" ps
