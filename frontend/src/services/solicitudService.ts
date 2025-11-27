// src/services/solicitudService.ts
import api from "./apiBase";
import type { Solicitud, SolicitudPaginadaResponse, EstadoSolicitud } from "../types/solicitud.types";

export interface SolicitudPaginadoParams {
  page?: number;
  limit?: number;
}

export async function listarSolicitudesPaginado(
  gestorUsuarioId: number,
  params: SolicitudPaginadoParams = {}
): Promise<SolicitudPaginadaResponse | Solicitud[]> {
  try {
    const { page = 0, limit = 10 } = params;
    const response = await api.get(`/solicitudes/paginado/${gestorUsuarioId}`, {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al listar solicitudes"
    );
  }
}

export interface CambiarEstadoSolicitudPayload {
  localId: number;
  eventoId: number;
  justificacion?: string;
  estado: EstadoSolicitud;
}

export async function cambiarEstadoSolicitud(
  localId: number,
  eventoId: number,
  nuevoEstado: EstadoSolicitud,
  justificacion?: string
): Promise<void> {
  try {
    const payload: CambiarEstadoSolicitudPayload = {
      localId,
      eventoId,
      estado: nuevoEstado,
    };
    
    if (justificacion) {
      payload.justificacion = justificacion;
    }

    await api.put(`/solicitudes/local/${localId}/evento/${eventoId}`, payload);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al cambiar estado de solicitud"
    );
  }
}

export async function aprobarSolicitud(
  localId: number,
  eventoId: number,
  justificacion?: string
): Promise<void> {
  return cambiarEstadoSolicitud(localId, eventoId, "APROBADO", justificacion);
}

export async function rechazarSolicitud(
  localId: number,
  eventoId: number,
  justificacion?: string
): Promise<void> {
  return cambiarEstadoSolicitud(localId, eventoId, "RECHAZADO", justificacion);
}
