import api from "../apiBase";

import type { FormDataLocalUpdate } from "../../../types/locales.types.ts";

export default async function editarLocal(dataUpdate: FormDataLocalUpdate) {
  try {
    console.log("Datos para EDITAR del local:", dataUpdate);
    const response = await api.put("/locales", dataUpdate);
    return response;
  } catch (error: any) {
    console.error("Error al EDITAR el local:", error);
    throw new Error(error.response?.data?.message || error.message);
  }
}
