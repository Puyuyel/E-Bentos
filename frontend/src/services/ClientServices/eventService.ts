import api from "../apiBase";
//import type { Event } from "../types/event.types";

// Añadimos 'idCategoria' como un parámetro opcional de tipo number
export async function listarEventos(idCategoria?: number) {
  try {
    // 1. Definimos el objeto de parámetros.
    // Si 'idCategoria' llega como 'undefined' (porque no se pasó),
    // axios lo omitirá de la URL.
    // Si 'idCategoria' tiene un valor (ej: 1), axios generará:
    // /eventosCliente?categoriaId=1
    const params = {
      categoriaId: idCategoria
    };

    // 2. Pasamos el objeto 'params' en la configuración de la petición.
    const response = await api.get("/eventosCliente", { params });
    
    return response.data;
  } catch (error: any) {
    // (Sugerencia: Cambié el mensaje de error para que coincida con la ruta)
    throw new Error(error.response?.data?.message || "Error al listar los eventos");
  }
}
