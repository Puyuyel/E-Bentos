import api from "../apiBase";

export default async function eliminarLocal(idLocal: number) {
  try {
    console.log("ID del local a eliminar:", idLocal);
    const response = await api.delete(`/locales/${idLocal}`);
    return response;
  } catch (error: any) {
    console.error("Error al eliminar el local:", error);
    throw new Error(error.response?.data?.message || error.message);
  }
}
