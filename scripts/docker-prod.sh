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

# Variables
COMPOSE_FILE="docker-compose.prod.yaml"
ENV_FILE=".env.prod"

# Vérification du fichier .env.prod
check_env() {
    if [ ! -f "$ENV_FILE" ]; then
        log_error "Le fichier $ENV_FILE n'existe pas!"
        log_info "Copiez .env.prod.example en $ENV_FILE et configurez vos variables"
        exit 1
    fi
}

# Wrapper pour docker compose
docker_compose() {
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" "$@"
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
  logs-db     Affiche les logs de PostgreSQL
  logs-redis  Affiche les logs de Redis
  status      Affiche le statut des services
  clean       Supprime les conteneurs et volumes (ATTENTION!)
  debug       Démarre avec le profil debug (Adminer inclus)
  help        Affiche cette aide

Exemples:
  ./docker-prod.sh start
  ./docker-prod.sh logs-db
  ./docker-prod.sh build
  ./docker-prod.sh debug
"
}

# Commandes
case "$1" in
    start)
        check_env
        log_info "Démarrage des services en production..."
        docker_compose up -d
        log_success "Services démarrés!"
        docker_compose ps
        ;;
    
    stop)
        log_info "Arrêt des services..."
        docker_compose down
        log_success "Services arrêtés!"
        ;;
    
    restart)
        check_env
        log_info "Redémarrage des services..."
        docker_compose restart
        log_success "Services redémarrés!"
        docker_compose ps
        ;;
    
    build)
        check_env
        log_info "Build des images Docker..."
        docker_compose build --no-cache
        log_success "Build terminé!"
        ;;
    
    logs)
        docker_compose logs -f
        ;;
    
    # logs-api)
    #     log_info "Affichage des logs de l'API..."
    #     docker_compose logs -f api
    #     ;;
    
    # logs-web)
    #     log_info "Affichage des logs du frontend..."
    #     docker_compose logs -f web-app
    #     ;;
    
    logs-db)
        log_info "Affichage des logs de PostgreSQL..."
        docker_compose logs -f fizzup_postgres
        ;;
    
    logs-redis)
        log_info "Affichage des logs de Redis..."
        docker_compose logs -f fizzup_redis
        ;;
    
    status)
        log_info "Statut des services:"
        docker_compose ps
        ;;
    
    clean)
        log_warning "Cette action va supprimer tous les conteneurs et volumes!"
        read -p "Êtes-vous sûr? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "Nettoyage en cours..."
            docker_compose down -v --rmi all
            log_success "Nettoyage terminé!"
        else
            log_info "Annulé."
        fi
        ;;
    
    debug)
        check_env
        log_info "Démarrage avec le profil debug (Adminer inclus)..."
        docker_compose --profile debug up -d
        log_success "Services démarrés avec debug!"
        docker_compose --profile debug ps
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
