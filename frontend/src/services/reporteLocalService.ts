import api from "./apiBase";

export async function getReporteLocales() {
  try {
    const response = await api.get("/reportes/locales");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al obtener reporte de locales"
    );
  }
}
