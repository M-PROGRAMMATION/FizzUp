#!/bin/bash

# Script pour afficher les logs des conteneurs Docker

ENV_FILE="${1:-.env.development}"
SERVICE="${2:-}"

if [ -z "$SERVICE" ]; then
  echo "📋 Affichage des logs de tous les services..."
  docker compose -f docker-compose.local.yaml --env-file "$ENV_FILE" logs -f
else
  echo "📋 Affichage des logs du service: $SERVICE"
  docker compose -f docker-compose.local.yaml --env-file "$ENV_FILE" logs -f "$SERVICE"
fi
