// src/services/authService.ts
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const apiNoAuth = axios.create({
  baseURL: `${apiBaseUrl}/api`, // puedes usar variables de entorno import.meta.env.VITE_API_URL ||
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getLocalPorIdService(id: number) {
  try {
    const response = await apiNoAuth.get(`/locales/${id}`);
    return response.data; // El backend debería devolver info del nuevo registro o un mensaje
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al obtener el local por ID: " + id
    );
  }
}
