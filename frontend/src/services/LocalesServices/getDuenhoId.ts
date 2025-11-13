import api from "../apiBase";

export default async function getDuenhoId(dniDuenho: number) {
  try {
    console.log("DNI del duenho:", dniDuenho);
    const response = await api.get(`/gestores/nombre-por-dni/${dniDuenho}`);
    return response;
  } catch (error: any) {
    console.error("Error al obtener el ID del duenho:", error);
    throw new Error(error.response?.data?.message || error.message);
  }
}
