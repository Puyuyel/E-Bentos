export interface MetaProductora {
  metaId: number;
  eventoId: number;
  metaIngresos: number;
  tasaConversion: number;
  ticketsObjetivo: number;
  activo: number;
  nombreEvento: string;
  fechaHorarioInicio: string; // formato ISO "2025-11-09T06:41:40.503Z"
  entradasVendidas: number;
  montoTotalRecaudado: number;
  visitas: number;
}
