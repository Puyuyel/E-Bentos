// services/localService.ts
import api from "./apiBase";

export async function getLocales() {
  try {
    const response = await api.get("/locales");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener locales");
  }
}
