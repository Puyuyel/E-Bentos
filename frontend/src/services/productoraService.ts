import api from "./apiBase";
import type { Productora } from "../types/productora.types";

export async function listarProductoras() {
  try {
    const response = await api.get("/productoras");
    return response.data; // El backend debería devolver info del nuevo registro o un mensaje
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al listar productoras");
  }
}

export async function listarProductorasPaginado(page: number, limit: number, buscador: string) {
  try {
    const response = await api.get("/productoras/paginadoPorBuscador",{
      params: {
        page,
        limit,
        buscador
      }
    });
    //console.log(buscador);
    //console.log(response.data);
    return response.data; // El backend debería devolver info del nuevo registro o un mensaje
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al listar productoras");
  }
}

export async function actualizarProductora(id: number, payload: Partial<Productora>) {
  try {
    const response = await api.put(`/productoras/${id}`, payload);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al actualizar productora");
  }
}

export async function registrarProductora(payload: Partial<Productora>) {
  try {
    const response = await api.post("/productoras", payload);
    console.log(response.data);
    return response.data; // El backend debería devolver info del nuevo registro o un mensaje
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al registrar productora"
    );
  }
}

export async function eliminarProductora(id: number) {
  try {
    const response = await api.delete(`/productoras/${id}`);
    console.log(response.data);
    return response.data; // El backend debería devolver info del nuevo registro o un mensaje
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar productora"
    );
  }
}


