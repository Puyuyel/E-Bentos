// src/services/api.ts
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${apiBaseUrl}/api`, // puedes usar variables de entorno import.meta.env.VITE_API_URL ||
  withCredentials: true, // importante, porque el backend usa cookies de sesión
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de respuesta para manejar errores 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar storage y redirigir al login
      const { logout } = useAuthStore.getState();
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
