// src/types/solicitud.types.ts

export type EstadoSolicitud = 'APROBADO' | 'EN_REVISION' | 'RECHAZADO';

export interface Solicitud {
  localId: number;
  eventoId: number;
  nombreEvento: string;
  nombreLocal: string;
  fechaInicio: string;
  nombreGestor: string;
  descripcionEvento: string;
  estado: EstadoSolicitud;
  justificacion?: string | null;
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
