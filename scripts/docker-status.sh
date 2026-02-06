#!/bin/bash

# Script pour afficher le statut des conteneurs Docker

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

echo "📊 Statut des conteneurs Docker:"
echo ""
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
