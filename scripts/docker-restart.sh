#!/bin/bash

# Script pour redémarrer les conteneurs Docker

set -e

ENV_FILE="${1:-.env.development}"

echo "🔄 Redémarrage des conteneurs Docker..."

./scripts/docker-stop.sh "$ENV_FILE"
./scripts/docker-start.sh "$ENV_FILE"
