import api from "./apiBase";
import type { Departamento } from "../types/puntoVenta.types";
import type { Provincia } from "../types/puntoVenta.types";
import type { Distrito } from "../types/puntoVenta.types";

export async function listarDepartamentos() {
  try {
    const response = await api.get("/departamentos");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al listar departamentos");
  }
}

export async function listarDistritos() {
  try {
    const response = await api.get("/distritos");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al listar distritos");
  }
}

export async function listarProvincias() {
  try {
    const response = await api.get("/provincias");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al listar provincias");
  }
}