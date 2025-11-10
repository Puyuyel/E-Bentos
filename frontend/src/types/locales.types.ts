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

export interface FormDataLocal {
  nombre: string;
  direccion: string;
  foto: string;
  fotoFile?: File; // subir el archivo REAL
  aforo: number;
  tipoLocal: string;
  gestorId: number; // ID del duenho local
  distritoId: number;
}

export interface FormDataLocalUpdate {
  nombre: string;
  direccion: string;
  foto: string;
  fotoFile: File;
  aforo: number;
  tipoLocal: string;
  distrito: {
    distritoId: number;
    nombre: string;
    provincia: {
      provinciaId: number;
      nombre: string;
      departamento: {
        departamentoId: number;
        nombre: string;
      };
    };
  };
}
