import api from "../apiBase";

export async function verificarEstadoSolicitudLocal(eventoId: number): Promise<string> {
  try {
    const response = await api.get(`/solicitudes/evento/${eventoId}`); // Ajusta el endpoint
    return response.data.estado; // "APROBADO" | "EN_REVISION" | "RECHAZADO"
  } catch (error) {
    // Si no existe solicitud, considerar como "PENDIENTE" o permitir cambio
    return "PENDIENTE";
  }
}