export interface Local {
  localId: number;
  nombre: string;
  direccion: string;
  foto: string;
  aforo: number;
  tipoLocal: string;
  activo: number;
  gestor: {
    usuarioId: number;
  };
  distrito: {
    distritoId: number;
    nombre: string;
  };
}
