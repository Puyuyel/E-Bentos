import React, { useState } from "react";
import { Button, Tile, Modal, InlineLoading } from "@carbon/react";
import { ArrowLeft, Checkmark, Map, WarningAlt } from "@carbon/icons-react";
import { useZonasEventoStore } from "../../../store/useZonasEventoStore";
import { obtenerFecha } from "../../util/obtenerFecha";
import type { BuyerData } from "../../../types/cliente.types";
import {
  useEntradasClienteStore,
  type TicketSelection,
} from "../../../store/useEntradasClienteStore";
import { useAuthStore } from "../../../store/useAuthStore";

import { LocationIcon, CalendarIcon } from "../../icons";
import { confirmarEntradasService } from "../../../services/ClientServices/confirmarEntradasService";
import type { ConfirmacionVenta } from "../../../types/event.types";

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
  // state for potential future use; not required for building payload
  const [, setConfirmacion] = useState<ConfirmacionVenta | undefined>(
    undefined
  );
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [confirmResult, setConfirmResult] = useState<
    null | "success" | "error"
  >(null);

  const { user } = useAuthStore();
  const {
    titulo,
    lugar,
    fecha,
    eventoId,
    zonas,
    ubicacion,
    clearZonasEventosStore,
  } = useZonasEventoStore();
  const {
    getSelections,
    cliente,
    metodoPago,
    reservaId,
    setVentaId,
    clearAll,
  } = useEntradasClienteStore();
  buyerData = cliente;

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

  // Build a normalized selectedTickets array with only the fields we need
  // { zonaId, precioUnitario, tipoZona, cantidad }
  const selectedTickets = (Array.isArray(ticketTypes) ? ticketTypes : [])
    .filter((ticket) => (tickets?.[ticket.zonaId] || 0) > 0)
    .map((ticket) => ({
      zonaId: ticket.zonaId,
      precioUnitario: ticket.precioUnitario,
      tipoZona: ticket.tipoZona,
      cantidad: tickets?.[ticket.zonaId] || 0,
    }));

  console.log("selectedTickets: ", selectedTickets);

  const subtotal = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.cantidad * ticket.precioUnitario,
    0
  );
  const serviceFee = subtotal * 0.01;
  const total = subtotal + serviceFee;

  const handleConfirmacion = async () => {
    // Build the ConfirmacionVenta payload using available data.
    const confirmacionPayload: ConfirmacionVenta = {
      eventoId: eventoId || 0,
      clienteId: user?.rol === "CLIENTE" ? Number(user?.id) : 0,
      montoTotalOriginal: subtotal || 0,
      descuentoTotal: 0,
      montoTotalFinal: total || 0,
      registradoPorTaquillero: user?.rol === "TAQUILLERO" ? 1 : 0,
      metodoPago: metodoPago || "",
      entradas: (selectedTickets || []).flatMap((ticket) =>
        Array.from({ length: ticket.cantidad }).map(() => ({
          zonaId: ticket.zonaId,
          precioOriginal: ticket.precioUnitario,
          descuento: 0,
          precioFinal: ticket.precioUnitario,
        }))
      ) as any,
    };

    console.log("ConfirmaciónPayload: ", confirmacionPayload);
    // store in state if needed later
    setConfirmacion(confirmacionPayload);

    // start confirming
    setIsConfirming(true);
    setConfirmResult(null);
    try {
      const data = await confirmarEntradasService(
        reservaId,
        user?.loginCreds?.email || "",
        confirmacionPayload
      );
      console.log("confirmar response data:", data);

      // Extract ventaId from multiple possible response shapes
      let ventaIdParsed = 0;
      if (data == null) {
        ventaIdParsed = 0;
      } else if (typeof data === "number") {
        ventaIdParsed = data;
      } else if (
        Array.isArray(data) &&
        data.length > 0 &&
        typeof data[0] === "number"
      ) {
        ventaIdParsed = data[0];
      } else if (typeof data === "object" && (data as any).ventaId != null) {
        ventaIdParsed = Number((data as any).ventaId);
      } else if (typeof data === "string") {
        const maybe = Number(data);
        ventaIdParsed = Number.isFinite(maybe) ? maybe : 0;
      }

      console.log("ventaIdParsed", ventaIdParsed);
      if (
        ventaIdParsed &&
        Number.isFinite(ventaIdParsed) &&
        ventaIdParsed > 0
      ) {
        setVentaId(ventaIdParsed);
        setConfirmResult("success");
      } else {
        setConfirmResult("error");
      }
      console.log("Respuesta de la confirmación: ", data);

      // Borrar todas las selecciones anteriores y los datos guardados en los stores.
      clearAll();
      clearZonasEventosStore();
    } catch (error) {
      console.log("error al confirmar la reserva con id: ", {
        reservaId,
        error,
      });
      setConfirmResult("error");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1rem" }}>
      {/* Confirming modal */}
      <Modal
        open={isConfirming}
        passiveModal
        modalHeading="Confirmando la venta..."
        onRequestClose={() => {}}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <InlineLoading description="Confirmando la venta..." />
        </div>
      </Modal>

      {/* Success modal */}
      <Modal
        open={confirmResult === "success"}
        modalHeading="Venta confirmada"
        primaryButtonText="Aceptar"
        onRequestSubmit={() => {
          setConfirmResult(null);
          onConfirm();
        }}
        onRequestClose={() => setConfirmResult(null)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Checkmark size={24} />
          <span>La venta fue confirmada correctamente</span>
        </div>
      </Modal>

      {/* Error modal */}
      <Modal
        open={confirmResult === "error"}
        modalHeading="Error al confirmar"
        primaryButtonText="Cerrar"
        onRequestSubmit={() => setConfirmResult(null)}
        onRequestClose={() => setConfirmResult(null)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <WarningAlt size={24} />
          <span>
            La venta no pudo ser confirmada. Le reembolsaremos el dinero en caso
            de fallo.
          </span>
        </div>
      </Modal>
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
                key={ticket.zonaId}
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
                    Cantidad: {tickets[ticket.zonaId]}
                  </p>
                </div>
                <p style={{ fontWeight: 600 }}>
                  S/.
                  {(ticket.cantidad * ticket.precioUnitario).toFixed(2)}
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

            {user?.rol == "CLIENTE" && metodoPago == "TARJETA_DE_CREDITO" && (
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
          onClick={handleConfirmacion}
          renderIcon={Checkmark}
          style={{ flex: 1 }}
        >
          Confirmar compra
        </Button>
      </div>
    </div>
  );
}
