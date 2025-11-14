import api from "../apiBase";
//import type { Event } from "../types/event.types";

// Añadimos 'idCategoria' como un parámetro opcional de tipo number
export async function obtenerDetalleEvento(idEvento?: number) {
  try {
    console.log("Obteniendo detalle para eventoId:", idEvento);
    const response = await api.get(`/eventosCliente/verDetalle/${idEvento}`);
    return response.data;
  } catch (error: any) {
    // (Sugerencia: Cambié el mensaje de error para que coincida con la ruta)
    throw new Error(
      error.response?.data?.message ||
        `Error al OBTENER DETALLE del EVENTO con id ${idEvento}`
    );
  }
}
