#!/bin/bash
echo "🔄 Reiniciando entorno E-Bentos..."

docker compose down -v
docker compose --env-file .env up --build -d

if [ $? -eq 0 ]; then
  echo "✅ Entorno reiniciado correctamente."
else
  echo "⚠️  Error al reiniciar el entorno."
fi
