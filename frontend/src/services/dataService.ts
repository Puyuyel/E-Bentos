import { apiLog } from "./authService";

export async function useGetProductora(id: number) {
  // Ya no necesitamos 'URLSearchParams' porque el ID va en la ruta

  try {
    const response = await apiLog.get(`/productoras/${id}`, {
      withCredentials: true,
    });

    return { response: response.data};
  } catch (error: any) {
    // Ajusté el mensaje de error para que sea más específico
    throw new Error(error.response?.data?.message || "Error al obtener la productora");
  }
}

export async function useGetGestor(id: number) {
  // Ya no necesitamos 'URLSearchParams' porque el ID va en la ruta

  try {
    const response = await apiLog.get(`/gestores/${id}`, {
      withCredentials: true,
    });

    return { response: response.data};
  } catch (error: any) {
    // Ajusté el mensaje de error para que sea más específico
    throw new Error(error.response?.data?.message || "Error al obtener la productora");
  }
}
