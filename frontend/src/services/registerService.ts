// src/services/authService.ts
import api from "./apiBase";
import type { RegisterData } from "../types/register.types";

export async function register(data: RegisterData) {
  try {
    const response = await api.post("/auth/register", data);
    return response.data; // El backend debería devolver info del nuevo registro o un mensaje
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al registrar nuevo usuario");
  }
}
