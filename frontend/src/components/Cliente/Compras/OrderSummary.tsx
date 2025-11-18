import React from "react";
import { Button, Tile } from "@carbon/react";
import { ArrowLeft, Checkmark } from "@carbon/icons-react";
import type { BuyerData } from "./BuyerInformation";

interface OrderSummaryProps {
  tickets: { [key: string]: number };
  buyerData: BuyerData;
  onBack: () => void;
  onConfirm: () => void;
}

export function OrderSummary({
  tickets,
  buyerData,
  onBack,
  onConfirm,
}: OrderSummaryProps) {
  const ticketTypes = [
    { id: "general", name: "Entrada General", price: 25.0 },
    { id: "vip", name: "Entrada VIP", price: 75.0 },
    { id: "premium", name: "Entrada Premium", price: 150.0 },
  ];

  const selectedTickets = ticketTypes.filter(
    (ticket) => tickets[ticket.id] > 0
  );
  const subtotal = selectedTickets.reduce(
    (sum, ticket) => sum + tickets[ticket.id] * ticket.price,
    0
  );
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "0.5rem" }}
        >
          Resumen de tu pedido
        </h1>
        <p style={{ color: "#525252" }}>
          Revisa tu información antes de confirmar
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Event Info */}
        <Tile style={{ backgroundColor: "white" }}>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Concierto de Rock 2025
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              color: "#525252",
            }}
          >
            <p>📅 15 de Diciembre, 2025 - 20:00</p>
            <p>📍 Estadio Nacional</p>
          </div>
        </Tile>

        {/* Tickets */}
        <Tile style={{ backgroundColor: "white" }}>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Entradas seleccionadas
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {selectedTickets.map((ticket) => (
              <div
                key={ticket.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid #e5e5e5",
                }}
              >
                <div>
                  <p style={{ fontWeight: 500 }}>{ticket.name}</p>
                  <p style={{ fontSize: "0.875rem", color: "#525252" }}>
                    Cantidad: {tickets[ticket.id]}
                  </p>
                </div>
                <p style={{ fontWeight: 600 }}>
                  ${(tickets[ticket.id] * ticket.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </Tile>

        {/* Buyer Information */}
        <Tile style={{ backgroundColor: "white" }}>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Información del comprador
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              color: "#525252",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <span style={{ color: "#737373" }}>Nombre:</span>
              <span>{buyerData.fullName}</span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <span style={{ color: "#737373" }}>Email:</span>
              <span>{buyerData.email}</span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <span style={{ color: "#737373" }}>Teléfono:</span>
              <span>{buyerData.phone}</span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <span style={{ color: "#737373" }}>ID:</span>
              <span>{buyerData.idNumber}</span>
            </div>
          </div>
        </Tile>

        {/* Price Summary */}
        <Tile style={{ backgroundColor: "white" }}>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Resumen de pago
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#525252",
              }}
            >
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#525252",
              }}
            >
              <span>Cargo por servicio (10%)</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "2px solid #d1d1d1",
                paddingTop: "0.75rem",
              }}
            >
              <span style={{ fontWeight: 600 }}>Total</span>
              <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </Tile>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <Button
          kind="secondary"
          size="lg"
          onClick={onBack}
          renderIcon={ArrowLeft}
          style={{ flex: 1 }}
        >
          Volver
        </Button>
        <Button
          kind="primary"
          size="lg"
          onClick={onConfirm}
          renderIcon={Checkmark}
          style={{ flex: 1 }}
        >
          Confirmar compra
        </Button>
      </div>
    </div>
  );
}
