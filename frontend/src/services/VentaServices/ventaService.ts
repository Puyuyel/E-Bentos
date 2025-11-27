import api from "../apiBase";
import type { VentaDTO } from "../../types/venta.types";

export async function listarVentasActivas(): Promise<VentaDTO[]> {
  try {
    const response = await api.get("/ventas/activas");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al listar las ventas activas"
    );
  }
}

export async function listarVentasPasadas(): Promise<VentaDTO[]> {
  try {
    const response = await api.get("/ventas/pasadas");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al listar las ventas pasadas"
    );
  }
}