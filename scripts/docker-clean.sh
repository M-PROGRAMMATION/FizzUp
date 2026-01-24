#!/bin/bash

# Script pour nettoyer complètement les conteneurs Docker et les volumes

set -e

ENV_FILE="${1:-.env.development}"

echo "🧹 Nettoyage complet des conteneurs et volumes Docker..."
echo "⚠️  ATTENTION: Cette action supprimera toutes les données!"
echo ""
read -p "Êtes-vous sûr de vouloir continuer? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  docker compose -f docker-compose.local.yaml --env-file "$ENV_FILE" down -v --remove-orphans
  echo ""
  echo "✅ Nettoyage terminé!"
else
  echo "❌ Opération annulée"
  exit 1
fi
