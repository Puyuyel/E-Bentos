import api from "../apiBase";

import type { FormDataLocal } from "../../../types/locales.types.ts";

export default async function agregarLocal(data: FormDataLocal) {
  const jsonData = {
    nombre: data.nombre,
    direccion: data.direccion,
    foto: data.foto,
    aforo: data.aforo,
    tipoLocal: data.tipoLocal,
    gestor: {
      usuarioId: data.gestorId,
    },
    distrito: {
      distritoId: data.distritoId,
    },
  };
  try {
    console.log("Datos para agregar local:", jsonData);
    const response = await api.post("/locales", jsonData);
    return response;
  } catch (error: any) {
    console.error("Error al agregar el local:", error);
    throw new Error(error.response?.data?.message || error.message);
  }
}
