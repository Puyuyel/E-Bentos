import React from "react";
import { Button, NumberInput, Tile, Modal } from "@carbon/react";
import { ShoppingCart, Calendar, Location, Map } from "@carbon/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useEntradasClienteStore } from "../../../store/useEntradasClienteStore";

interface EventSelectionProps {
  onNext: (tickets: { [key: string]: number }) => void;
}

import zonaProvisional from "../../../assets/zonas-img-test.png";
import { useZonasEventoStore } from "../../../store/useZonasEventoStore";
import { obtenerFecha } from "../../util/obtenerFecha";
import type { Zona } from "../../../types/event.types";
import { LocationIcon } from "../../icons";

export function EventSelection({ onNext }: EventSelectionProps) {
  const [loginModalOpen, setLoginModalOpen] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { zonas, titulo, lugar, fecha, ubicacion } = useZonasEventoStore();
  const { eventoId } = useParams();
  const { saveSelections, getSelections } = useEntradasClienteStore();

  const [selectedTickets, setSelectedTickets] = React.useState<{
    [key: string]: number;
  }>({});

  const ticketTypes: Zona[] = zonas;

  const handleQuantityChange = (ticketId: string, value: string | number) => {
    const numValue = typeof value === "string" ? parseInt(value) || 0 : value;
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: numValue,
    }));
  };

  const totalTickets = Object.values(selectedTickets).reduce(
    (sum, qty) => sum + qty,
    0
  );
  const totalAmount = ticketTypes.reduce((sum, ticket) => {
    return (
      sum + (selectedTickets[ticket.tipoZona] || 0) * ticket.precioUnitario
    );
  }, 0);

  const handleContinue = () => {
    if (!isLoggedIn) {
      // guarda selecciones para que el usuario las recupere después de iniciar sesión
      if (eventoId) {
        const idNum = parseInt(eventoId as string, 10);
        if (!Number.isNaN(idNum)) saveSelections(idNum, selectedTickets);
      }
      setLoginModalOpen(true);
      return;
    }
    const idNum = parseInt(eventoId as string, 10);
    if (!Number.isNaN(idNum)) saveSelections(idNum, selectedTickets);
    const saved = getSelections(Number(eventoId));
    if (saved) {
      setSelectedTickets(saved);
    }
    if (totalTickets > 0) {
      onNext(selectedTickets);
    }
  };

  // al montar, si hay selecciones guardadas para este evento, cargarlas
  React.useEffect(() => {
    if (!eventoId) return;
    const idNum = parseInt(eventoId as string, 10);
    if (Number.isNaN(idNum)) return;
    const saved = getSelections(idNum);
    if (saved) {
      setSelectedTickets(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventoId]);

  const gestionMax = (ticketDispo: number) => {
    if (ticketDispo > 5) {
      return 5;
    }
    return ticketDispo;
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
      <Modal
        open={loginModalOpen}
        modalHeading="Necesitas iniciar sesión"
        primaryButtonText="Iniciar sesión"
        secondaryButtonText="Cerrar"
        onRequestClose={() => setLoginModalOpen(false)}
        onRequestSubmit={() =>
          navigate(
            `/login?redirect=${encodeURIComponent(
              `/cliente/comprar-entradas-evento/${eventoId}`
            )}`
          )
        }
      >
        <div style={{ padding: "0.5rem 0" }}>
          <p>Debe iniciar sesión para comprar entradas.</p>
          <p>
            Si ya elegiste entradas, se guardarán en tu sesión y{" "}
            <strong>no tendrás que elegirlas otra vez.</strong>
          </p>
        </div>
      </Modal>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "0.5rem" }}
        >
          {titulo}
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            color: "#525252",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Calendar size={20} />
            <span>{obtenerFecha(fecha)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Location size={20} />
            <span>{lugar}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Map size={20} />
            <span>{ubicacion}</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Columna izquierda: imagen de zonas */}
          <div
            style={{
              flex: "0 0 360px",
              maxWidth: "360px",
              width: "100%",
            }}
          >
            <div
              className="img-zonas"
              style={{
                backgroundImage: `url(${zonaProvisional})`,
                backgroundPosition: "center",
                width: "100%",
                paddingTop: "66%",
                borderRadius: 8,
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}
            />
          </div>

          {/* Columna derecha: lista compacta de tipos de ticket */}
          <div style={{ flex: "1 1 400px", minWidth: 0 }}>
            {ticketTypes.map((ticket) => (
              <Tile
                key={ticket.tipoZona}
                style={{
                  marginBottom: "1rem",
                  backgroundColor: "white",
                  padding: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <h3
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {"Entrada " + ticket.tipoZona}
                    </h3>
                    <p
                      style={{
                        color: "#525252",
                        margin: "0.25rem 0",
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {"Zona " + ticket.letraZona}
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#000000aa",
                        margin: 0,
                      }}
                    >
                      Disponibles: {ticket.cantidadEntradasDisponible}
                    </p>
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                      minWidth: 140,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "0.5rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      S/.{ticket.precioUnitario.toFixed(2)}
                    </p>
                    <NumberInput
                      id={`ticket-${ticket.tipoZona}`}
                      min={0}
                      max={gestionMax(ticket.cantidadEntradasDisponible)}
                      value={selectedTickets[ticket.tipoZona] || 0}
                      onChange={(e: any, state: any) =>
                        handleQuantityChange(ticket.tipoZona, state.value)
                      }
                      label=""
                      hideLabel
                      size="md"
                    />
                  </div>
                </div>
              </Tile>
            ))}
          </div>
        </div>
      </div>

      <Tile style={{ backgroundColor: "white", padding: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#525252",
                marginBottom: "0.25rem",
              }}
            >
              Total de tickets
            </p>
            <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>
              {totalTickets}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#525252",
                marginBottom: "0.25rem",
              }}
            >
              Total a pagar
            </p>
            <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>
              S/.{totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <Button
          kind="primary"
          size="lg"
          style={{ width: "100%" }}
          onClick={handleContinue}
          disabled={totalTickets === 0}
          renderIcon={ShoppingCart}
        >
          Continuar con la compra
        </Button>
      </Tile>
    </div>
  );
}
