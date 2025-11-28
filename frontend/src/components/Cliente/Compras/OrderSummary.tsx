import React from "react";
import { Button, Tile } from "@carbon/react";
import { ArrowLeft, Checkmark, Map } from "@carbon/icons-react";
import { useZonasEventoStore } from "../../../store/useZonasEventoStore";
import { obtenerFecha } from "../../util/obtenerFecha";
import type { BuyerData } from "../../../types/cliente.types";
import {
  useEntradasClienteStore,
  type TicketSelection,
} from "../../../store/useEntradasClienteStore";
import { useAuthStore } from "../../../store/useAuthStore";

import { LocationIcon, CalendarIcon } from "../../icons";

interface OrderSummaryProps {
  tickets: TicketSelection;
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
  const { user } = useAuthStore();
  const { titulo, lugar, fecha, eventoId, zonas, ubicacion } =
    useZonasEventoStore();
  const { getSelections, cliente, metodoPago } = useEntradasClienteStore();
  buyerData = cliente;

  // console.log("metodoPago: ", metodoPago);
  // Para que TS no se queje .-.
  if (eventoId) {
    const ticketsPre = getSelections(eventoId);
    if (ticketsPre) {
      // console.log("dentro de ticketsPre");
      tickets = ticketsPre;
      // console.log("tickts: ", tickets);
    }
  }

  const ticketTypes = zonas;

  const selectedTickets = ticketTypes.filter(
    (ticket) => tickets[ticket.tipoZona] > 0
  );
  // console.log("selectedTickets: ", selectedTickets);
  const subtotal = selectedTickets.reduce(
    (sum, ticket) => sum + tickets[ticket.tipoZona] * ticket.precioUnitario,
    0
  );
  const serviceFee = subtotal * 0.01;
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
            {titulo}
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              color: "#525252",
            }}
          >
            <p>
              <CalendarIcon />
              {" " + obtenerFecha(fecha)}
            </p>
            <p>
              <LocationIcon /> {ubicacion}
            </p>
            <p style={{ gap: "0.3rem", display: "flex" }}>
              <Map size={23} /> <span>{lugar}</span>
            </p>
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
                key={ticket.tipoZona}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid #e5e5e5",
                }}
              >
                <div>
                  <p style={{ fontWeight: 500 }}>Entrada {ticket.tipoZona}</p>
                  <p style={{ fontSize: "0.875rem", color: "#525252" }}>
                    Cantidad: {tickets[ticket.tipoZona]}
                  </p>
                </div>
                <p style={{ fontWeight: 600 }}>
                  S/.
                  {(selectedTickets.length * ticket.precioUnitario).toFixed(2)}
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
            {user?.rol == "TAQUILLERO" && metodoPago == "CLIENTE" && (
              <>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ color: "#737373" }}>Email:</span>
                  <span>{buyerData.correoCli}</span>
                </div>
              </>
            )}

            {user?.rol == "CLIENTE" && metodoPago == "TARJETA" && (
              <>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ color: "#737373" }}>Nombre:</span>
                  <span>{buyerData.nombreTitularTarjeta}</span>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ color: "#737373" }}>Numero de tarjeta:</span>
                  <span>{buyerData.numTarjeta}</span>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ color: "#737373" }}>CVV:</span>
                  <span>{buyerData.cvvTarjeta}</span>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ color: "#737373" }}>
                    Fecha de vencimiento:
                  </span>
                  <span>{buyerData.fechaVencimiento}</span>
                </div>
              </>
            )}

            {metodoPago == "YAPE" && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#737373" }}>Compra:</span>
                <span>Su pago por YAPE fue SATISFACTORIO.</span>
              </div>
            )}
            {user?.rol == "TAQUILLERO" && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#737373" }}>Correo Cliente:</span>
                <span>{buyerData.correoCli}</span>
              </div>
            )}
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
              <span>S/.{subtotal.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#525252",
              }}
            >
              <span>Cargo por servicio (1%)</span>
              <span>S/.{serviceFee.toFixed(2)}</span>
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
                S/.{total.toFixed(2)}
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
