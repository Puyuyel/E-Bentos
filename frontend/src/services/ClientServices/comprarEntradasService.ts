import type { TicketSelection } from "../../store/useEntradasClienteStore";
import api from "../apiBase";
//import type { Event } from "../types/event.types";

// Añadimos 'idCategoria' como un parámetro opcional de tipo number
export async function comprarEntradasService(
  entradas: TicketSelection,
  clientId: number
) {
  try {
    console.log("Obteniendo reserva de entradas para clienteID:", clientId);
    // Convert the `entradas` map { [zonaId]: cantidad } into the API payload
    const zonasPayload = Object.entries(entradas)
      .map(([k, v]) => ({ zonaId: Number(k), cantidad: Number(v) }))
      .filter(
        (z) =>
          !Number.isNaN(z.zonaId) && Number.isFinite(z.zonaId) && z.cantidad > 0
      );

    const jsonReservas = {
      clienteId: clientId,
      zonas: zonasPayload,
    };

    console.log("jsonReservas: ", jsonReservas);
    const response = await api.post(`/ventas/reservar`, jsonReservas);
    return response;
  } catch (error: any) {
    // (Sugerencia: Cambié el mensaje de error para que coincida con la ruta)
    throw new Error(
      error.response?.data?.message ||
        `Error al comprar ENTRADAS del CLIENTE con id ${clientId}`
    );
  }
}
