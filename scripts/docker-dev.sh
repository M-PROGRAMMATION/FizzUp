#!/bin/bash

# ===========================================
# Script de gestion Docker - Développement
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
ENV_FILE="${2:-.env.development}"
COMPOSE_FILE="docker-compose.local.yaml"

# Affichage de l'aide
show_help() {
    echo "
╔═══════════════════════════════════════════════════════════╗
║        FizzUp - Gestion Docker Développement             ║
╚═══════════════════════════════════════════════════════════╝

Usage: ./docker-dev.sh [COMMAND] [ENV_FILE]

Commands:
  start       Démarre tous les services en développement
  stop        Arrête tous les services
  restart     Redémarre tous les services
  status      Affiche le statut des services
  logs        Affiche les logs de tous les services
  logs-db     Affiche les logs de PostgreSQL
  logs-redis  Affiche les logs de Redis
  clean       Supprime les conteneurs et volumes (ATTENTION!)
  check       Vérifie les ports disponibles
  help        Affiche cette aide

Arguments:
  ENV_FILE    Fichier d'environnement (défaut: .env.development)

Exemples:
  ./docker-dev.sh start
  ./docker-dev.sh logs-db
  ./docker-dev.sh start .env.test

Services disponibles:
  - PostgreSQL:       localhost:35435
  - Adminer:          http://localhost:38082
  - Redis:            localhost:6379
  - Redis Commander:  http://localhost:8081
"
}

# Vérifier si les conteneurs sont déjà en cours d'exécution
check_running() {
    RUNNING=$(docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps -q 2>/dev/null | wc -l | tr -d ' ')
    return $RUNNING
}

# Commandes
case "$1" in
    start)
        log_info "Vérification de l'état des conteneurs..."
        
        if check_running && [ $? -gt 0 ]; then
            echo ""
            log_warning "Les conteneurs sont déjà en cours d'exécution!"
            echo ""
            log_info "Statut actuel:"
            docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
            echo ""
            log_info "Utilisez './scripts/docker-dev.sh restart' pour redémarrer"
            log_info "Utilisez './scripts/docker-dev.sh stop' pour arrêter"
            exit 0
        fi
        
        log_info "Démarrage des conteneurs Docker..."
        log_info "Utilisation du fichier: $ENV_FILE"
        
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
        
        echo ""
        log_success "Conteneurs démarrés avec succès!"
        echo ""
        log_info "Services disponibles:"
        echo "  - PostgreSQL:       localhost:35435"
        echo "  - Adminer:          http://localhost:38082"
        echo "  - Redis:            localhost:6379"
        echo "  - Redis Commander:  http://localhost:8081"
        echo ""
        log_info "Utilisez './scripts/docker-dev.sh logs' pour voir les logs"
        ;;
    
    stop)
        log_info "Arrêt des conteneurs Docker..."
        log_info "Utilisation du fichier: $ENV_FILE"
        
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
        
        echo ""
        log_success "Conteneurs arrêtés avec succès!"
        ;;
    
    restart)
        log_info "Redémarrage des conteneurs Docker..."
        echo ""
        
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
        echo ""
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
        
        echo ""
        log_success "Conteneurs redémarrés avec succès!"
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
        ;;
    
    status)
        log_info "Statut des conteneurs Docker:"
        echo ""
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
        ;;
    
    logs)
        log_info "Affichage des logs de tous les services..."
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f
        ;;
    
    logs-db)
        log_info "Affichage des logs de PostgreSQL..."
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f postgres
        ;;
    
    logs-redis)
        log_info "Affichage des logs de Redis..."
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f redis
        ;;
    
    clean)
        log_info "Nettoyage complet des conteneurs et volumes Docker..."
        log_warning "ATTENTION: Cette action supprimera toutes les données!"
        echo ""
        read -p "Êtes-vous sûr de vouloir continuer? (y/N) " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "Nettoyage en cours..."
            docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down -v --remove-orphans
            echo ""
            log_success "Nettoyage terminé!"
        else
            log_warning "Opération annulée."
            exit 1
        fi
        ;;
    
    check)
        log_info "Vérification des ports utilisés..."
        echo ""
        
        PORTS=(35435 38082 6379 8081)
        PORT_NAMES=("PostgreSQL" "Adminer" "Redis" "Redis Commander")
        DOCKER_USED=false
        
        for i in "${!PORTS[@]}"; do
            PORT="${PORTS[$i]}"
            NAME="${PORT_NAMES[$i]}"
            
            if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
                PID=$(lsof -Pi :$PORT -sTCP:LISTEN -t)
                PROCESS=$(ps -p $PID -o comm= 2>/dev/null || echo "Processus inconnu")
                
                if [[ "$PROCESS" == *"docker"* ]] || [[ "$PROCESS" == *"com.docker.backend"* ]]; then
                    log_info "Port $PORT ($NAME) est utilisé par Docker"
                    DOCKER_USED=true
                else
                    log_error "Port $PORT ($NAME) est utilisé par: $PROCESS (PID: $PID)"
                fi
            else
                log_success "Port $PORT ($NAME) est disponible"
            fi
        done
        
        if [ "$DOCKER_USED" = true ]; then
            echo ""
            log_info "Les ports sont utilisés par Docker. Vérifiez avec './scripts/docker-dev.sh status'"
        fi
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
