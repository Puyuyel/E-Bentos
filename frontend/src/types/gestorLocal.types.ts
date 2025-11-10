export interface GestorLocal {
  usuarioId: number;
  telefono: string;
  email: string;
  dni: string;
  nombres: string;
  apellidos: string;
  usuarioCreador: {
    usuarioId: number;
  };
  puntoVenta: {
    puntoVentaId: number;
    nombre: string;
    direccion: string;
  };
}