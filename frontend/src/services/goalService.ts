import api from "./apiBase";
import type { MetaProductora } from "../types/metaProductora.types"; // ajusta según tu estructura
import type { EventoDisponible } from "../types/eventosDisponibles.types";
import type { MetaRequest } from "../types/MetaRequest,types";

export async function listarMetasProductora(): Promise<MetaProductora[]> {
  try {
    const response = await api.get("/metas/productora");
    return response.data as MetaProductora[];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al listar metas de la productora");
  }
}

export async function listarEventosDisponibles(): Promise<EventoDisponible[]> {
  try {
    const response = await api.get("/metas/eventos-disponibles");
    return response.data as EventoDisponible[];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al listar eventos disponibles");
  }
}

/**
 * Crear una nueva meta
 * POST /metas
 */
export async function crearMeta(data: MetaRequest): Promise<MetaProductora> {
  try {
    const response = await api.post("/metas", data);
    return response.data as MetaProductora;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al crear la meta");
  }
}

/**
 * Editar una meta existente
 * PUT /metas/{metaId}
 */
export async function editarMeta(metaId: number, data: MetaRequest): Promise<MetaProductora> {
  try {
    const response = await api.put(`/metas/${metaId}`, data);
    return response.data as MetaProductora;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al editar la meta");
  }
}

/**
 * Eliminar una meta
 * DELETE /metas/{metaId}
 */
export async function eliminarMeta(metaId: number): Promise<void> {
  try {
    await api.delete(`/metas/${metaId}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al eliminar la meta");
  }
}


