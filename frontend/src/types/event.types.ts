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