import api from "./apiBase";

export async function listarEventos() {
  try {
    const response = await api.get("/eventos");
    return response.data; // El backend debería devolver info del nuevo registro o un mensaje
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al listar eventos");
  }
}

export async function listarEventosFiltrados(organizadorId?: number) {
  try {
    const url = organizadorId 
      ? `/eventos/organizador/${organizadorId}`
      : "/eventos";
    
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al listar eventos"
    );
  }
}