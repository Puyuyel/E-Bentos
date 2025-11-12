// src/services/authService.ts
import api from "../apiBase";

export async function getLocalesService() {
  try {
    const response = await api.get("/locales");
    return response; // El backend debería devolver info del nuevo registro o un mensaje
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al registrar nuevo usuario"
    );
  }
}
