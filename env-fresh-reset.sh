#!/bin/bash
# ==========================================================
# 🚀 Script de reinicialización del entorno e-Bentos
# Limpia volúmenes, borra la base local y reconstruye todo
# ==========================================================

set -e

echo "🧹 Deteniendo contenedores..."
docker compose down -v

echo "🗑️  Eliminando datos persistentes de MySQL..."
rm -rf ./mysql-data

echo "🧱 Reconstruyendo el entorno desde cero..."
docker compose --env-file .env up --build

echo "✅ Entorno reinicializado correctamente."
echo "   - Base de datos limpia e inicializada desde ./mysql-init"
echo "   - Backend y Frontend reconstruidos."
