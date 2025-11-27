import React from "react";
import { Button, Tile } from "@carbon/react";
import { CheckmarkFilled, Download, Email } from "@carbon/icons-react";

interface ConfirmationProps {
  onStartOver: () => void;
}

export function Confirmation({ onStartOver }: ConfirmationProps) {
  const orderNumber = `EB-${Date.now().toString().slice(-8)}`;

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "0 1rem",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            backgroundColor: "#d1f4e0",
            borderRadius: "50%",
            marginBottom: "1rem",
          }}
        >
          <CheckmarkFilled size={48} style={{ color: "#198038" }} />
        </div>
        <h1
          style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "0.5rem" }}
        >
          ¡Compra confirmada!
        </h1>
        <p style={{ color: "#525252" }}>
          Tu pedido ha sido procesado exitosamente
        </p>
      </div>

      <Tile
        style={{
          backgroundColor: "white",
          marginBottom: "1.5rem",
          textAlign: "left",
        }}
      >
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Detalles del pedido
        </h3>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <span style={{ color: "#525252" }}>Número de pedido</span>
            <span style={{ fontWeight: 600 }}>{orderNumber}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <span style={{ color: "#525252" }}>Fecha</span>
            <span>{new Date().toLocaleDateString("es-ES")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#525252" }}>Estado</span>
            <span style={{ fontWeight: 600, color: "#198038" }}>
              Confirmado
            </span>
          </div>
        </div>
      </Tile>

      <div
        style={{
          backgroundColor: "#d0e2ff",
          border: "1px solid #0043ce",
          borderRadius: "8px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
            textAlign: "left",
          }}
        >
          <Email size={24} style={{ color: "#0043ce", marginTop: "2px" }} />
          <div>
            <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
              Hemos enviado tus tickets por correo electrónico
            </p>
            <p style={{ fontSize: "0.875rem", color: "#525252" }}>
              Revisa tu bandeja de entrada. Si no lo encuentras, verifica la
              carpeta de spam.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <Button
          kind="secondary"
          size="lg"
          renderIcon={Download}
          style={{ flex: 1 }}
        >
          Descargar tickets
        </Button>
        <Button
          kind="primary"
          size="lg"
          onClick={onStartOver}
          style={{ flex: 1 }}
        >
          Nueva compra
        </Button>
      </div>

      <div
        style={{
          padding: "1rem",
          backgroundColor: "#f4f4f4",
          borderRadius: "8px",
        }}
      >
        <p style={{ fontSize: "0.875rem", color: "#525252" }}>
          Si tienes alguna pregunta, contáctanos a soporte@e-bentos.com
        </p>
      </div>
    </div>
  );
}
