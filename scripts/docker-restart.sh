#!/bin/bash

# Script pour redémarrer les conteneurs Docker

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH=${1:-$(git rev-parse --abbrev-ref HEAD)}

echo "🔄 Redémarrage des conteneurs Docker..."

"$ROOT_DIR/scripts/docker-stop.sh" "$BRANCH"
"$ROOT_DIR/scripts/docker-start.sh" "$BRANCH"
