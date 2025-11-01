import api from "../services/apiBase";

export async function logoutService() {
  try {
    const response = await api.post("/auth/logout");
    console.log("Respuesta desde el api de auth/auth/logout: ", response.data);
    return response.status;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al cerrar sesión");
  }
}
