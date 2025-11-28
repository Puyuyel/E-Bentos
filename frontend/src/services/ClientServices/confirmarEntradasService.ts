import type { ConfirmacionVenta } from "../../types/event.types";
import api from "../apiBase";
//import type { Event } from "../types/event.types";

// Añadimos 'idCategoria' como un parámetro opcional de tipo number
export async function confirmarEntradasService(
  reservaId: number,
  correo: string,
  confirmacion: ConfirmacionVenta
) {
  try {
    console.log("Obteniendo confirmación para reserva número: ", reservaId);
    // Validaciones básicas
    if (!reservaId || Number.isNaN(Number(reservaId)) || reservaId <= 0) {
      throw new Error("reservaId inválido");
    }
    if (!correo || typeof correo !== "string" || correo.trim() === "") {
      throw new Error("correo inválido");
    }

    // Endpoint solicitado: /ventas/confirmar/{reservaId}?correo=<correo>
    const url = `/ventas/confirmar/${encodeURIComponent(
      String(reservaId)
    )}?correo=${encodeURIComponent(correo)}`;

    console.log("POST ", url, "body:", confirmacion);
    const response = await api.post(url, confirmacion);
    return response.data;
  } catch (error: any) {
    // (Sugerencia: Cambié el mensaje de error para que coincida con la ruta)
    throw new Error(
      error.response?.data?.message ||
        `Error al confirmar la reserva con id ${reservaId}`
    );
  }
}
