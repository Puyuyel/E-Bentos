import api from "../apiBase";

import type { FormDataLocalUpdate } from "../../types/locales.types";

export default async function editarLocal(dataUpdate: FormDataLocalUpdate) {
  try {
    const jsonRequired = {
      nombre: dataUpdate.nombre,
      direccion: dataUpdate.direccion,
      foto: dataUpdate.foto,
      aforo: dataUpdate.aforo,
      tipoLocal: dataUpdate.tipoLocal,
      distrito: {
        distritoId: dataUpdate.distrito.distritoId,
      },
    };
    console.log("Datos para EDITAR del local:", jsonRequired);
    console.log("ID del local a editar:", dataUpdate.localId.toString());
    const response = await api.put(
      `/locales/${dataUpdate.localId.toString()}`,
      jsonRequired
    );
    return response;
  } catch (error: any) {
    console.error("Error al EDITAR el local:", error);
    throw new Error(error.response?.data?.message || error.message);
  }
}
