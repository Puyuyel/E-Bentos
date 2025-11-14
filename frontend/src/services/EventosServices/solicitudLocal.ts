import api from "../apiBase";

export async function verificarEstadoSolicitudLocal(localId: number, eventoId: number): Promise<string> {
  try {
    console.log("🔍 Verificando estado de solicitud para local:", localId, "y evento:", eventoId);
    
    const response = await api.get(`/solicitudes/local/${localId}/evento/${eventoId}`);
    const estado = response.data.estado;
    
    console.log("📋 Estado de solicitud:", estado);
    return estado; // "APROBADO" | "EN_REVISION" | "RECHAZADO"
    
  } catch (error: any) {
    console.error("❌ Error al verificar estado de solicitud:", error);
    
    // Si no existe solicitud (404) o hay error, considerar como "PENDIENTE"
    if (error.response?.status === 404) {
      console.log("📋 No se encontró solicitud, estado: PENDIENTE");
      return "PENDIENTE";
    }
    
    // En caso de otros errores, asumir que no se puede cambiar por precaución
    console.log("📋 Error en consulta, estado: EN_REVISION (por precaución)");
    return "EN_REVISION";
  }
}