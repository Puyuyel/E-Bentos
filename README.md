# E-Bentos — Guía completa para configurar el entorno y flujo de trabajo (Fork → PR)

Este documento describe **paso a paso** cómo levantar el entorno de desarrollo de **E-Bentos**, trabajar colaborativamente mediante **forks** y **pull requests**, y manejar los contenedores con Docker Compose.

---

## 🧰 Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- **Docker Desktop** (Windows, macOS o Linux)
- **Git**
- **MySQL** (solo si usarás tu base de datos local en lugar del contenedor)
- **IDE recomendado:** VS Code, IntelliJ IDEA, o equivalente

---

## 🔀 1. Flujo de trabajo con GitHub (Fork → PR)

1. Ingresa al repositorio principal:  
   👉 `https://github.com/ORG/e-bentos`

2. Haz clic en **Fork** (arriba a la derecha) para crear tu copia personal:  
   Esto generará: `https://github.com/TU_USUARIO/e-bentos`

3. Clona tu fork localmente:
   ```bash
   git clone https://github.com/TU_USUARIO/e-bentos.git
   cd e-bentos
   ```

4. Crea una nueva rama de desarrollo:
   ```bash
   git checkout -b feature/nombre-descriptivo
   ```

5. Realiza tus cambios, agrega y commitea:
   ```bash
   git add .
   git commit -m "feat(frontend): agregar componente X"
   ```

6. Sube tu rama al fork:
   ```bash
   git push origin feature/nombre-descriptivo
   ```

7. Desde GitHub, crea un **Pull Request (PR)** desde tu rama hacia la rama `develop` del repositorio original.

> 💡 **Sugerencia:** para mantener tu fork actualizado con el repo principal:
> ```bash
> git remote add upstream https://github.com/ORG/e-bentos.git
> git fetch upstream
> git merge upstream/develop
> ```

---

## 🗄️ 2. Configurar la base de datos local

Crea la base de datos y el usuario:

```sql
CREATE DATABASE ebentos;
CREATE USER 'ebentos'@'%' IDENTIFIED BY 'losdibujitos';
GRANT ALL PRIVILEGES ON ebentos.* TO 'ebentos'@'%';
FLUSH PRIVILEGES;
```

Verifica la conexión:
- **Host:** localhost
- **Puerto:** 3306 (o el que uses)
- **Usuario:** ebentos
- **Contraseña:** losdibujitos
- **Base de datos:** ebentos

---

## ⚙️ 3. Crear el archivo `.env`

En la raíz del repositorio, crea un archivo `.env` con el siguiente contenido (no se sube al repositorio, está en `.gitignore`):

```env
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=ebentos
MYSQL_USER=ebentos
MYSQL_PASSWORD=losdibujitos
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/ebentos
SPRING_DATASOURCE_USERNAME=ebentos
SPRING_DATASOURCE_PASSWORD=losdibujitos
REACT_APP_API_URL=http://backend:8080
```

### 🔎 Notas importantes
- `SPRING_DATASOURCE_URL` usa **mysql** como host, ya que Docker Compose conecta los contenedores por nombre de servicio.
- `REACT_APP_API_URL` apunta a `backend:8080` dentro de Docker. Si corres el frontend localmente, cámbialo a `http://localhost:8080`.

---

## 🐳 4. Levantar el entorno con Docker Compose

Desde la raíz del repositorio:

```bash
docker compose --env-file .env up --build
```

### 🔧 Servicios esperados
- **mysql** → base de datos
- **backend** → aplicación Spring Boot
- **frontend** → aplicación React (Vite)

### 🧹 Parar y limpiar
```bash
docker compose down           # Detiene los contenedores
```
```bash
docker compose down -v        # Detiene y elimina volúmenes (resetea la BD)
```

---

## 📁 5. Estructura del proyecto

```
e-bentos/
├── backend/          # Spring Boot (Java)
│   ├── src/
│   └── Dockerfile
├── frontend/         # React + Vite
│   ├── src/
│   └── Dockerfile
├── docker-compose.yml
├── .env              # Variables de entorno (local)
└── .gitignore
```

---

## 🧪 6. Comandos útiles

| Acción | Comando |
|--------|----------|
| Ver logs del backend | `docker compose logs -f backend` |
| Ver logs del frontend | `docker compose logs -f frontend` |
| Ver logs de MySQL | `docker compose logs -f mysql` |
| Reconstruir solo el backend | `docker compose build backend` |
| Reiniciar un servicio | `docker compose restart backend` |

---

## 🧭 7. Buenas prácticas de desarrollo

- Crear ramas con prefijo `feature/`, `fix/` o `chore/` según corresponda.
- No hacer commits directos a `develop` ni `main`.
- Antes de subir cambios, verifica que los contenedores corran correctamente con:
  ```bash
  docker compose up --build
  ```
- Mantén actualizado el `.gitignore`.

---

## 💬 8. Soporte y resolución de problemas

1. Verifica que Docker Desktop esté ejecutándose.
2. Consulta los logs con `docker compose logs -f`.
3. Si todo falla, limpia y reconstruye:
   ```bash
   docker compose down -v && docker compose up --build
   ```

---

✅ **Con esto tendrás tu entorno de E-Bentos completamente funcional.**

Cada desarrollador podrá levantar su entorno con un solo comando y contribuir mediante Pull Requests sin conflictos locales.

