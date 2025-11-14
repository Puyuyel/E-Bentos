import api from "../apiBase";

/**
 * Servicio para eliminar un evento por su ID
 * @param eventoId - ID del evento a eliminar
 * @returns Promise con la respuesta del servidor
 */
export default async function eliminarEvento(eventoId: number): Promise<any> {
  try {
    // Validar que el eventoId sea válido
    if (!eventoId || eventoId === 0) {
      throw new Error("ID de evento no válido.");
    }

    console.log("🗑️ Eliminando evento:", eventoId);
    
    // Realizar la petición DELETE
    const response = await api.delete(`/eventos/${eventoId}`);
    
    console.log("✅ Evento eliminado exitosamente:", response.data);
    return response.data;
    
  } catch (error: any) {
    console.error("❌ Error al eliminar el evento:", error);
    
    // Manejar diferentes tipos de errores
    if (error.response?.status === 404) {
      throw new Error("El evento no fue encontrado.");
    } else if (error.response?.status === 403) {
      throw new Error("No tiene permisos para eliminar este evento.");
    } else if (error.response?.status === 409) {
      throw new Error("No se puede eliminar el evento porque tiene registros asociados.");
    }
    
    throw new Error(error.response?.data?.message || error.message || "Error al eliminar el evento");
  }
}

// También puedes exportar una función con confirmación si lo prefieres
export async function eliminarEventoConConfirmacion(eventoId: number, nombreEvento?: string): Promise<boolean> {
  const mensaje = nombreEvento 
    ? `¿Está seguro que desea eliminar el evento "${nombreEvento}"?`
    : "¿Está seguro que desea eliminar este evento?";
  
  if (window.confirm(mensaje)) {
    try {
      await eliminarEvento(eventoId);
      return true;
    } catch (error) {
      console.error("Error en eliminación confirmada:", error);
      return false;
    }
  }
  return false;
}