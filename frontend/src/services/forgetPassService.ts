import api from "../services/apiBase";

export async function forgetPassService(email: string) {
  try {
    const response = await api.post("/auth/forgot-password", null, {
      params: { email },
    });
    console.log(
      "Respuesta desde el api de auth/forgot-password: ",
      response.data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al recuperar el correo"
    );
  }
}
