// src/types/solicitud.types.ts

export type EstadoSolicitud = 'APROBADO' | 'EN_REVISION' | 'RECHAZADO';

export interface Solicitud {
  solicitudId?: number;
  eventoId: number;
  localId: number;
  estado: EstadoSolicitud;
  justificacion: string | null;
  // Campos adicionales que pueden venir del backend
  evento?: {
    eventoId: number;
    nombre: string;
    fechaHorarioInicio: string;
    descripcion?: string;
  };
  local?: {
    localId: number;
    nombre: string;
  };
  fechaSolicitud?: string;
  solicitadoPor?: string;
}

export interface SolicitudPaginacion {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SolicitudPaginadaResponse {
  data: Solicitud[];
  pagination: SolicitudPaginacion;
}
