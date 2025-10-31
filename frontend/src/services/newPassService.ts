import api from "../services/apiBase";

export async function newPassService(
  email: string,
  codigo: string,
  nuevaContrasenha: string
) {
  try {
    const body = {
      email,
      codigo,
      nuevaContrasenha,
    };
    const response = await api.post("/auth/reset-password", body);
    console.log(
      "Respuesta desde el api de auth/reset-password: ",
      response.data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al enviar la nueva contrasenha"
    );
  }
}
