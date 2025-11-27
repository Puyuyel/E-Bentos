export interface EventoSimple {
  eventoId: number;
  nombre: string;
  fechaHorarioInicio: string;
}

export interface LocalSimple {
  localId: number;
  nombre: string;
  direccion: string;
}

export interface VentaDTO {
  ventaId: number;
  evento: EventoSimple;
  puntosGanados: number;
  local: LocalSimple;
  montoTotalFinal: number;
  metodoDepago: string;
}

export type EstadoVenta = "activa" | "pasada";

export interface VentaConEstado extends VentaDTO {
  estado: EstadoVenta;
}