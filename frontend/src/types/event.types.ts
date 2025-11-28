export type Evento = {
  eventoId: number;
  nombreLocal: string;
  nombreCategoria: string;
  departamentoLocal: string;
  nombreEvento: string;
  fecha: string; // O puedes usar Date si planeas convertirlo
  zonaDeMenorPrecio: number;
  costoTotal: number;
  visitas: number;
  posterHorizontal: string;
  posterVertical: string;
  porcentajeVendido: number;
  popularidad: number;
};

// types/event.types.ts
export interface Local {
  localId: number;
  nombre: string;
  aforo: number;
}

export interface EventoBackend {
  eventoId: number;
  local: Local;
  nombre: string;
  fechaHorarioInicio: string;
  duracionEstimada: number;
  estado: string;
}

export interface Zona {
  zonaId: number;
  cantidadEntradasDisponible: number;
  precioUnitario: number;
  tipoZona: string;
  letraZona: string;
}

export interface EventoDetalle {
  imagenZonas: string;
  posterHorizontal: string;
  posterVertical: string;
  tipoLocal: string;
  nombreLocal: string;
  direccionLocal: string;
  departamento: string;
  fecha: string;
  descripcion: string;
  zonas: [Zona];
}

export interface ConfirmacionVenta {
  eventoId: number;
  gestorId?: number;
  clienteId: number;
  montoTotalOriginal: number;
  descuentoTotal: number;
  montoTotalFinal: number;
  registradoPorTaquillero: number;
  metodoPago: string;
  entradas: [
    {
      entradaId: number;
      ventaId: number;
      zonaId: number;
      precioOriginal: number;
      descuento: number;
      precioFinal: number;
      correo: string;
      qr: string;
    }
  ];
}
