#!/bin/bash

# ===========================================
# Script de gestion Docker - Production
# ===========================================

set -e

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérification du fichier .env.prod
check_env() {
    if [ ! -f .env.prod ]; then
        log_error "Le fichier .env.prod n'existe pas!"
        log_info "Copiez .env.prod.example en .env.prod et configurez vos variables"
        exit 1
    fi
}

# Affichage de l'aide
show_help() {
    echo "
╔═══════════════════════════════════════════════════════════╗
║          FizzUp - Gestion Docker Production              ║
╚═══════════════════════════════════════════════════════════╝

Usage: ./docker-prod.sh [COMMAND]

Commands:
  start       Démarre tous les services en production
  stop        Arrête tous les services
  restart     Redémarre tous les services
  build       Build les images Docker
  logs        Affiche les logs de tous les services
  logs-api    Affiche les logs de l'API
  logs-web    Affiche les logs du frontend
  logs-db     Affiche les logs de PostgreSQL
  logs-redis  Affiche les logs de Redis
  status      Affiche le statut des services
  clean       Supprime les conteneurs et volumes (ATTENTION!)
  debug       Démarre avec le profil debug (Adminer inclus)
  help        Affiche cette aide

Exemples:
  ./docker-prod.sh start
  ./docker-prod.sh logs-api
  ./docker-prod.sh build
  ./docker-prod.sh debug
"
}

# Commandes
case "$1" in
    start)
        check_env
        log_info "Démarrage des services en production..."
        docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
        log_success "Services démarrés!"
        docker compose -f docker-compose.prod.yml --env-file .env.prod ps
        ;;
    
    stop)
        log_info "Arrêt des services..."
        docker compose -f docker-compose.prod.yml --env-file .env.prod down
        log_success "Services arrêtés!"
        ;;
    
    restart)
        check_env
        log_info "Redémarrage des services..."
        docker compose -f docker-compose.prod.yml --env-file .env.prod restart
        log_success "Services redémarrés!"
        docker compose -f docker-compose.prod.yml --env-file .env.prod ps
        ;;
    
    build)
        check_env
        log_info "Build des images Docker..."
        docker compose -f docker-compose.prod.yml --env-file .env.prod build --no-cache
        log_success "Build terminé!"
        ;;
    
    logs)
        docker compose -f docker-compose.prod.yml --env-file .env.prod logs -f
        ;;
    
    logs-api)
        log_info "Affichage des logs de l'API..."
        docker compose -f docker-compose.prod.yml --env-file .env.prod logs -f api
        ;;
    
    logs-web)
        log_info "Affichage des logs du frontend..."
        docker compose -f docker-compose.prod.yml --env-file .env.prod logs -f web-app
        ;;
    
    logs-db)
        log_info "Affichage des logs de PostgreSQL..."
        docker compose -f docker-compose.prod.yml --env-file .env.prod logs -f postgres
        ;;
    
    logs-redis)
        log_info "Affichage des logs de Redis..."
        docker compose -f docker-compose.prod.yml --env-file .env.prod logs -f redis
        ;;
    
    status)
        log_info "Statut des services:"
        docker compose -f docker-compose.prod.yml --env-file .env.prod ps
        ;;
    
    clean)
        log_warning "Cette action va supprimer tous les conteneurs et volumes!"
        read -p "Êtes-vous sûr? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "Nettoyage en cours..."
            docker compose -f docker-compose.prod.yml --env-file .env.prod down -v --rmi all
            log_success "Nettoyage terminé!"
        else
            log_info "Annulé."
        fi
        ;;
    
    debug)
        check_env
        log_info "Démarrage avec le profil debug (Adminer inclus)..."
        docker compose -f docker-compose.prod.yml --env-file .env.prod --profile debug up -d
        log_success "Services démarrés avec debug!"
        docker compose -f docker-compose.prod.yml --env-file .env.prod --profile debug ps
        ;;
    
    help|--help|-h|"")
        show_help
        ;;
    
    *)
        log_error "Commande inconnue: $1"
        show_help
        exit 1
        ;;
esac
