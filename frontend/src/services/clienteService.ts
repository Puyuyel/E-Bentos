import api from "./apiBase";
import type { ClienteDTO, ClienteUpdatePayload } from "../types/cliente.types";

export async function obtenerCliente(id: number): Promise<ClienteDTO> {
  try {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      apiError.response?.data?.message ||
        "No se pudo obtener la información del cliente"
    );
  }
}

export async function actualizarCliente(
  id: number,
  payload: ClienteUpdatePayload
): Promise<ClienteDTO> {
  try {
    console.log(payload);
    const response = await api.put(`/clientes/${id}`, payload);
    return response.data;
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      apiError.response?.data?.message ||
        "No se pudo actualizar la información del cliente"
    );
  }
}