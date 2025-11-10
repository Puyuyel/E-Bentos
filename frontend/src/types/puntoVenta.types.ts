export interface Departamento {
  departamentoId: number;
  nombre: string;
}

export interface Provincia {
  provinciaId: number;
  nombre: string;
  departamento: Departamento;
}

export interface Distrito {
  distritoId: number;
  nombre: string;
  provincia: Provincia;
}

export interface PuntoVenta {
  puntoventaId: number;
  nombre: string;
  direccion: string;
  distrito: Distrito;
  activo: boolean;
}