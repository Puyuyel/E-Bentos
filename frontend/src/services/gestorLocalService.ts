import api from "./apiBase";
import type { GestorLocal } from "../types/gestorLocal.types";
import { getUser } from "./authService";

export async function listarGestoresLocales() {
  try {
    const response = await api.get("/gestores");
    const gestoresSinPuntoVenta = response.data.filter(
      (gestor: any) => gestor.puntoVenta == null
    );
    console.log(gestoresSinPuntoVenta);
    return gestoresSinPuntoVenta; 
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al listar gestores");
  }
}

export async function listarTaquilleros() {
  try {
    const response = await api.get("/gestores");
    const taquillerosConPuntoVenta = response.data.filter(
      (gestor: any) => gestor.puntoVenta !== null
    );
    console.log(taquillerosConPuntoVenta);
    return taquillerosConPuntoVenta;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al listar taquilleros");
  }
}

export async function listarOrganizadores(
  page: number = 0,
  limit: number = 100,
  nombreRol: string = 'ORGANIZADOR_EVENTOS',
  buscador: string = ''
) {
  console.log("listando ");
  try {
    const response = await api.get("/gestores/paginadoPorBuscadorYRol", {
      params: {
        page, limit, nombreRol,buscador,
      },
    });
    const user = await getUser();
    const organizadoresFiltrados = response.data.data.filter(
      (gestor: any) => gestor.usuarioCreador.usuarioId === user.usuarioId
    );
    console.log(organizadoresFiltrados);
    return organizadoresFiltrados;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al listar organizadores");
  }
}

export async function listarDuenhos(
  page: number = 0,
  limit: number = 100,
  nombreRol: string = 'DUENHO_LOCAL',
  buscador: string = ''
) {
  console.log("listando ");
  try {
    const response = await api.get("/gestores/paginadoPorBuscadorYRol", {
      params: {
        page, limit, nombreRol,buscador,
      },
    });
    const user = await getUser();
    const organizadoresFiltrados = response.data.data.filter(
      (gestor: any) => gestor.usuarioCreador.usuarioId === user.usuarioId
    );
    console.log(organizadoresFiltrados);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al listar duenhos");
  }
}

export async function actualizarGestorLocal(id: number, payload: Partial<GestorLocal>) {
  try {
    const response = await api.put(`/gestores/${id}`, payload);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al actualizar gestores");
  }
}

export async function actualizarTaquillero(id: number, payload: Partial<GestorLocal>) {
  try {
    const response = await api.put(`/gestores/${id}`, payload);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al actualizar taquilleros");
  }
}

export async function actualizarOrganizador(id: number, payload: Partial<GestorLocal>) {
  try {
    const response = await api.put(`/gestores/${id}`, payload);
    console.log(response.data);
    return response.data;
  } catch (error: any) { 
    throw new Error(error.response?.data?.message || "Error al actualizar organizador");
  }
}

export async function actualizarDuenho(id: number, payload: Partial<GestorLocal>) {
  try {
    const response = await api.put(`/gestores/${id}`, payload);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al actualizar dueños");
  }
}

export async function registrarGestorLocal(payload: Partial<GestorLocal>) {
  try {
    const response = await api.post("/gestores", payload);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const mensaje = error.response.data;
      alert(mensaje);
    }
    throw new Error(error.response?.data || "Error al agregar gestor");
  }
}

export async function registrarTaquillero(payload: Partial<GestorLocal>) {
  try {
    const response = await api.post("/gestores", payload);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const mensaje = error.response.data;
      alert(mensaje);
    }
    throw new Error(error.response?.data || "Error al agregar taquillero");
  }
}

export async function registrarOrganizador(payload: Partial<GestorLocal>) {
  try {
    const response = await api.post("/gestores", payload);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const mensaje = error.response.data;
      alert(mensaje);
    }
    throw new Error(error.response?.data || "Error al agregar organizador");
  }
}

export async function registrarDuenho(payload: Partial<GestorLocal>) {
  try {
    const response = await api.post("/gestores", payload);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const mensaje = error.response.data;
      alert(mensaje);
    }
    throw new Error(error.response?.data || "Error al agregar duenho");
  }
}

export async function eliminarGestorLocal(id: number) {
  try {
    const response = await api.delete(`/gestores/${id}`);
    console.log(response.data);
    return response.data; // El backend debería devolver info del nuevo registro o un mensaje
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar gestor"
    );
  }
}

export async function eliminarTaquillero(id: number) {
  try {
    const response = await api.delete(`/gestores/${id}`);
    console.log(response.data);
    return response.data; // El backend debería devolver info del nuevo registro o un mensaje
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar taquillero"
    );
  }
}

export async function eliminarOrganizador(id: number) {
  try {
    const response = await api.delete(`/gestores/${id}`);
    console.log(response.data);
    return response.data; // El backend debería devolver info del nuevo registro o un mensaje
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar organizador"
    );
  }
}

export async function eliminarDuenho(id: number) {
  try {
    const response = await api.delete(`/gestores/${id}`);
    console.log(response.data);
    return response.data; // El backend debería devolver info del nuevo registro o un mensaje
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar duenho"
    );
  }
}