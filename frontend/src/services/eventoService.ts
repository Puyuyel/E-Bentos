import api from "./apiBase";

export async function listarEventos() {
  try {
    const response = await api.get("/eventos");
    return response.data; // El backend debería devolver info del nuevo registro o un mensaje
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al listar eventos");
  }
}