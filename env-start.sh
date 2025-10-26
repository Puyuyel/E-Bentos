#!/bin/bash
echo "🚀 Iniciando entorno E-Bentos con Docker Compose..."

if [ ! -f ".env" ]; then
  echo "❌ No se encontró el archivo .env en la raíz del proyecto."
  exit 1
fi

docker compose --env-file .env up --build -d

if [ $? -eq 0 ]; then
  echo "✅ Entorno iniciado correctamente. Los contenedores están en ejecución."
else
  echo "⚠️  Ocurrió un error al iniciar los contenedores."
fi
