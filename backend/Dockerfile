# Imagen base con Maven y Java
FROM maven:3.9.9-eclipse-temurin-17

# Directorio de trabajo
WORKDIR /app

# Copiar el pom.xml y descargar dependencias (para cachear)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar el código fuente
COPY src ./src

# Exponer puerto de Spring Boot
EXPOSE 8080

# Ejecutar Spring Boot en modo desarrollo
CMD ["mvn", "spring-boot:run"]
