import type { Zona } from "../../types/event.types";
import api from "../apiBase";
//import type { Event } from "../types/event.types";

// Añadimos 'idCategoria' como un parámetro opcional de tipo number
export async function obtenerDetalleEvento(zonas: Zona[], clientId: number) {
  try {
    console.log("Obteniendo detalle para clienteID:", clientId);
    const jsonReservas = {
      clienteId: clientId,
      zonas: zonas,
    };
    const response = await api.post(`/ventas/reservar`, jsonReservas);
    return response.data;
  } catch (error: any) {
    // (Sugerencia: Cambié el mensaje de error para que coincida con la ruta)
    throw new Error(
      error.response?.data?.message ||
        `Error al OBTENER DETALLE del EVENTO con id ${idEvento}`
    );
  }
}
