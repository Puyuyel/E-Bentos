// src/services/authService.ts
import axios from "axios";
import api from "../services/apiBase";
import type { LoginCredentials } from "../types/auth.types";
const apiBaseUrl = import.meta.env.VITE_API_URL;

export const apiLog = axios.create({
  baseURL: `${apiBaseUrl}/api`, // puedes usar variables de entorno import.meta.env.VITE_API_URL ||
  withCredentials: true, // importante, porque el backend usa cookies de sesión
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export async function login(credentials: LoginCredentials) {
  const params = new URLSearchParams();
  params.append("email", credentials.email);
  params.append("contrasenha", credentials.contrasenha);

  try {
    const response = await apiLog.post("/auth/login", params, {
      withCredentials: true,
    });
    const roleUser = await api.get("/users/me");
    const cleanRole = roleUser.data.nombreRol.replace("ROLE_", "");
    return { response: response.data, role: cleanRole }; // El backend debería devolver info del usuario o un mensaje
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al iniciar sesión");
  }
}

/*
import axios from "axios";

export async function registerUser(email: string, contrasenha: string) {
  const params = new URLSearchParams();
  params.append("email", email);
  params.append("contrasenha", contrasenha);

  try {
    const response = await axios.post("/api/auth/register", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al registrar:", error.response?.data || error.message);
    throw error;
  }
}


*/
