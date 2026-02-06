#!/bin/bash

# Script pour afficher les logs des conteneurs Docker

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH=${1:-$(git rev-parse --abbrev-ref HEAD)}
SERVICE="${2:-}"

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

if [ -z "$SERVICE" ]; then
  echo "📋 Affichage des logs de tous les services..."
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f
else
  echo "📋 Affichage des logs du service: $SERVICE"
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f "$SERVICE"
fi
