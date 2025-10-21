# Etapa de desarrollo
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto del servidor de desarrollo
EXPOSE 5173

# Ejecutar la app en modo desarrollo
CMD ["npm", "run", "dev"]
