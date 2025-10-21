# 🧩 E-Bentos – Entorno de Desarrollo Local con Docker

Este proyecto define un entorno de desarrollo completo para **E-Bentos**, una aplicación compuesta por:

* **Frontend:** React + Vite
* **Backend:** Spring Boot + Maven (Java 17)
* **Base de datos:** MySQL 8
* **Orquestación:** Docker Compose

El objetivo es permitir que cualquier desarrollador pueda **levantar todo el entorno localmente con un solo comando**, sin necesidad de instalar dependencias manuales.

---

## 🧰 Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac)
* [Git](https://git-scm.com/downloads)
* (Opcional) Java 17 y Node.js 20 si deseas ejecutar los servicios fuera de Docker.

---

## 📁 Estructura del proyecto

```
E-Bentos/
│
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│
├── mysql-data/               # Se crea automáticamente (persistencia de datos)
│
├── docker-compose.yml
├── .env                      # Variables de entorno globales
└── README.md
```

---

## ⚙️ Configuración de entorno

El archivo `.env` contiene las variables de configuración utilizadas por los servicios.
Crea uno en la raíz del proyecto (o copia `.env.example` si existe):

```bash
cp .env.example .env
```

### Contenido recomendado para `.env`

```env
# --- MySQL ---
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=ebentos
MYSQL_USER=ebentos
MYSQL_PASSWORD=losdibujitos

# --- Spring Boot ---
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/ebentos
SPRING_DATASOURCE_USERNAME=ebentos
SPRING_DATASOURCE_PASSWORD=losdibujitos

# --- Frontend (Vite) ---
REACT_APP_API_URL=http://backend:8080
```

---

## 🐳 Servicios Docker

El entorno se compone de tres contenedores principales definidos en `docker-compose.yml`:

### **1️⃣ MySQL (Base de datos)**

* Imagen: `mysql:8`
* Puerto: `3306`
* Datos persistentes en `./mysql-data`
* Credenciales y nombre de base de datos definidos en `.env`

📌 **Notas:**

* Los datos no se borran al reiniciar los contenedores.
* Si deseas reiniciar la base desde cero:

  ```bash
  docker compose down -v
  ```

---

### **2️⃣ Backend (Spring Boot)**

* Directorio: `/backend`
* Puerto expuesto: `8080`
* Se conecta automáticamente al contenedor de MySQL
* Usa las variables de entorno `SPRING_DATASOURCE_*`

📌 **Comportamiento:**

* Se compila usando Maven (`mvn clean package -DskipTests`)
* Levanta la aplicación con `java -jar app.jar`
* Logs disponibles en tiempo real con:

  ```bash
  docker compose logs -f backend
  ```

---

### **3️⃣ Frontend (React + Vite)**

* Directorio: `/frontend`
* Puerto expuesto: `5173`
* Conecta al backend vía proxy (`/api` → `backend:8080`)
* Permite **hot reload** gracias a los volúmenes montados.

📌 **Comportamiento:**

* Usa `npm run dev` como comando por defecto.
* Cualquier cambio en el código fuente se refleja automáticamente.
* Logs disponibles con:

  ```bash
  docker compose logs -f frontend
  ```

---

## 🚀 Levantar el entorno completo

Ejecuta desde la raíz del proyecto:

```bash
docker compose --env-file .env up --build
```

Esto descargará las imágenes, construirá los contenedores y ejecutará los servicios en orden:

| Servicio | Puerto local | URL de acceso                                  |
| -------- | ------------ | ---------------------------------------------- |
| MySQL    | `3306`       | —                                              |
| Backend  | `8080`       | [http://localhost:8080](http://localhost:8080) |
| Frontend | `5173`       | [http://localhost:5173](http://localhost:5173) |

---

## 🧩 Probar la conexión

1. Abre tu navegador en
   👉 **[http://localhost:5173](http://localhost:5173)**

2. El frontend se conectará automáticamente al backend usando el proxy configurado.

3. Para probar el backend directamente:
   👉 **[http://localhost:8080/api/hello](http://localhost:8080/api/hello)**

   (Ajusta según tus endpoints reales).

---

## 🛠️ Desarrollo local (sin Docker)

Si prefieres desarrollar de forma tradicional:

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Asegúrate de tener MySQL corriendo localmente y que el archivo `application.properties` apunte a `localhost:3306`.

---

## 🧹 Comandos útiles

| Comando                      | Descripción                        |
| ---------------------------- | ---------------------------------- |
| `docker compose up`          | Levanta los servicios              |
| `docker compose down`        | Detiene los contenedores           |
| `docker compose down -v`     | Detiene y borra datos (resetea DB) |
| `docker compose logs -f`     | Muestra logs en vivo               |
| `docker exec -it mysql bash` | Entra al contenedor MySQL          |
| `docker image ls`            | Lista las imágenes locales         |

---

## 💾 Persistencia de datos

* Los datos de MySQL se almacenan en `./mysql-data` (en tu carpeta local).
* Puedes eliminarla si necesitas un entorno limpio:

  ```bash
  rm -rf mysql-data
  ```

---

## 🧑‍💻 Flujo de trabajo para desarrolladores

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/tuusuario/e-bentos.git
   cd e-bentos
   ```

2. Crear archivo `.env` (o usar el incluido)

3. Levantar el entorno:

   ```bash
   docker compose up --build
   ```

4. Modificar código en `frontend/` o `backend/`
   → Los cambios se reflejarán automáticamente (gracias a los volúmenes).

5. Cuando termines:

   ```bash
   docker compose down
   ```

---

## ☁️ Próximos pasos

Una vez que todo funcione localmente, este mismo entorno puede desplegarse fácilmente en:

* **AWS ECS o EC2**
* **Render**
* **DigitalOcean**
* **Azure Container Apps**

Solo necesitarás subir las imágenes a un registro (por ejemplo, Amazon ECR o Docker Hub).

---

## 🧾 Licencia

Este proyecto se distribuye bajo licencia privada interna para el equipo de desarrollo de **E-Bentos**.

---
