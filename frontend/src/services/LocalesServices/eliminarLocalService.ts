import api from "../apiBase";

import type { FormDataLocalUpdate } from "../../../types/locales.types.ts";

export default async function eliminarLocal(idLocal: number) {
  const params = new URLSearchParams();
  params.append("id", idLocal.toString());
  try {
    console.log("ID del local a eliminar:", idLocal);
    const response = await api.delete("/locales", { params });
    return response;
  } catch (error: any) {
    console.error("Error al EDITAR el local:", error);
    throw new Error(error.response?.data?.message || error.message);
  }
}
