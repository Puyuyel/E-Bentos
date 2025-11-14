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

export interface EventoDetalle {
  eventoId: number;
  local: {
    localId: number;
    nombre: string;
    aforo: number;
  };
  categoriaEvento: {
    categoriaEventoId: number;
    nombre: string;
  };
  nombre: string;
  descripcion: string;
  posterHorizontal: string;
  posterVertical: string;
  fechaHorarioInicio: string;
  duracionEstimada: number;
  costoTotal: number;
  estado: string;
  zonas: [
    {
      zonaId: number;
      capacidadTotal: number;
      tipoZona: string;
      letraZona: string;
      precioUnitario: number;
    }
  ];
}
