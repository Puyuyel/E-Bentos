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

export interface EventoDetalle {
  posterHorizontal: string;
  posterVertical: string;
  tipoLocal: string;
  nombreLocal: string;
  direccionLocal: string;
  departamento: string;
  fecha: string;
  zonas: [
    {
      cantidadEntradasDisponible: number;
      precioUnitario: number;
      tipoZona: string;
      letraZona: string;
    }
  ];
}
