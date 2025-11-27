export interface DescuentoActivo {
  descuentoUnicoId: number;
  nombre: string;
  valorPorcentaje: number;
  costoPuntos: number;
  codigoDescuento: string;
}

export interface OpcionCanje {
  descuentoId: number;
  nombre: string;
  valorPorcentaje: number;
  costoPuntos: number;
}

export interface MisPuntosResponse {
  puntosActuales: number;
  descuentosActivos: DescuentoActivo[];
  opcionesCanje: OpcionCanje[];
}