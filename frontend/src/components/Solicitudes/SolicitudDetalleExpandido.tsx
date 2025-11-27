// src/components/Solicitudes/SolicitudDetalleExpandido.tsx
import React from "react";
import type { Solicitud } from "../../types/solicitud.types";

interface SolicitudDetalleExpandidoProps {
  solicitud: Solicitud;
}

const SolicitudDetalleExpandido: React.FC<SolicitudDetalleExpandidoProps> = ({
  solicitud,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#e0e8f8",
        padding: "1.5rem",
        borderRadius: "4px",
        margin: "0.5rem 0",
      }}
    >
      {solicitud.solicitadoPor && (
        <div style={{ marginBottom: "1rem" }}>
          <strong>Solicitado por: {solicitud.solicitadoPor}</strong>
        </div>
      )}
      <div
        style={{
          whiteSpace: "pre-wrap",
          lineHeight: "1.6",
          color: "#333",
          fontSize: "0.875rem",
        }}
      >
        {solicitud.justificacion || solicitud.evento?.descripcion || "Sin descripción disponible"}
      </div>
      <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#666" }}>
        <strong>Evento ID:</strong> {solicitud.eventoId} | <strong>Local ID:</strong> {solicitud.localId}
      </div>
    </div>
  );
};

export default SolicitudDetalleExpandido;
