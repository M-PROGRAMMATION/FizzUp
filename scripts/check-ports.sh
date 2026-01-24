#!/bin/bash

# Script pour vérifier si les ports nécessaires sont disponibles

echo "🔍 Vérification des ports utilisés..."
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
      echo "🐳 Port $PORT ($NAME) est utilisé par Docker"
      DOCKER_USED=true
    else
      echo "❌ Port $PORT ($NAME) est utilisé par: $PROCESS (PID: $PID)"
    fi
  else
    echo "✅ Port $PORT ($NAME) est disponible"
  fi
done

if [ "$DOCKER_USED" = true ]; then
  echo ""
  echo "💡 Les ports sont utilisés par Docker. Vérifiez avec './scripts/docker-status.sh'"
fi
