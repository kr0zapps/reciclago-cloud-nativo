#!/bin/bash
# ==============================================================================
# Script de Despliegue en Servidor AWS EC2 (Bash)
# RecicLaGo Cloud Native — Municipalidad de Puerto Varas
# ==============================================================================

set -e

echo "=========================================================="
echo "  🚀 INICIANDO DESPLIEGUE EN AWS EC2 - RECICLAGO BACKEND  "
echo "=========================================================="

WORKDIR="$HOME/reciclago"
mkdir -p "$WORKDIR"
cd "$WORKDIR"

# 1. Crear .env si no existe
if [ ! -f .env ]; then
  echo "📄 Generando archivo .env por defecto..."
  cat <<EOF > .env
COMPOSE_PROFILES=apps
POSTGRES_DB=reciclago_db
POSTGRES_USER=reciclago
POSTGRES_PASSWORD=reciclagopass
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
IMAGE_TAG=latest
EOF
fi

# 2. Iniciar contenedores con Docker Compose
echo "🐳 Levantando contenedores (Infraestructura + Microservicios)..."
docker compose pull ms-bff ms-catalog ms-pickups ms-routes || true
docker compose up -d

echo "📊 Verificando estado de los servicios:"
docker compose ps

echo "=========================================================="
echo "  ✅ SISTEMA RECICLAGO BACKEND OPERATIVO EN PUERTO 8080   "
echo "=========================================================="
