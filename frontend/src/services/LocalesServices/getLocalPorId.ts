// src/services/authService.ts
import api from "../apiBase";

export async function getLocalPorIdService(id: number) {
  try {
    const response = await api.get(`/locales/${id}`);
    return response.data; // El backend debería devolver info del nuevo registro o un mensaje
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al obtener el local por ID: " + id
    );
  }
}
