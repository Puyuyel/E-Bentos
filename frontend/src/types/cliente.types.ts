export type Genero = "MASCULINO" | "FEMENINO" | "NINGUNO_DE_LOS_ANTERIORES";

export interface ClienteDTO {
  usuarioId: number;
  telefono: string;
  email: string;
  nombres: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  genero: Genero | null;
  puntosAcumulados: number;
  puntosGastados: number;
}

export interface ClienteUpdatePayload {
  telefono?: string;
  email?: string;
  contrasenha?: string;
  activo?: number;
  genero?: Genero | "";
}