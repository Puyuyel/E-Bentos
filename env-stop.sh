#!/bin/bash
echo "🧹 Deteniendo entorno E-Bentos..."

docker compose down

if [ $? -eq 0 ]; then
  echo "🛑 Contenedores detenidos correctamente."
else
  echo "⚠️  Error al detener los contenedores."
fi
