// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // puedes usar variables de entorno import.meta.env.VITE_API_URL ||
  withCredentials: true, // importante, porque el backend usa cookies de sesión
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;