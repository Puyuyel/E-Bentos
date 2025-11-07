import api from "./apiBase";
import type { PuntoVenta } from "../types/puntoVenta.types";

export async function listarPuntosVenta() {
  try {
    const response = await api.get("/puntoventas");
    return response.data; // El backend debería devolver info del nuevo registro o un mensaje
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al listar puntos de venta");
  }
}

export async function actualizarPuntoVenta(id: number, payload: Partial<PuntoVenta>) {
  try {
    const response = await api.put(`/puntoventas/${id}`, payload);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al actualizar puntos de venta");
  }
}

export async function registrarPuntoVenta(payload: Partial<PuntoVenta>) {
  try {
    const response = await api.post("/puntoventas", payload);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al agregar punto de venta");
  }
}

export async function eliminarPuntoVenta(id: number) {
  try {
    const response = await api.delete(`/puntoventas/${id}`);
    console.log(response.data);
    return response.data; // El backend debería devolver info del nuevo registro o un mensaje
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar punto de venta"
    );
  }
}