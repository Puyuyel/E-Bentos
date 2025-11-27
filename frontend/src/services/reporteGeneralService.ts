import api from "./apiBase";

export async function getReporteGeneral() {
  try {
    const response = await api.get("/reportes/general");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al obtener la data de reportes"
    );
  }
}
