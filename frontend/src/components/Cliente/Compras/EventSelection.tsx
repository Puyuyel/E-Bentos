import React from "react";
import { Button, NumberInput, Tile, Modal } from "@carbon/react";
import { ShoppingCart, Calendar, Location, Map } from "@carbon/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useEntradasClienteStore } from "../../../store/useEntradasClienteStore";

interface EventSelectionProps {
  onNext: (tickets: { [key: string]: number }) => void;
}

const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
import { useZonasEventoStore } from "../../../store/useZonasEventoStore";
import { obtenerFecha } from "../../util/obtenerFecha";
import type { Zona } from "../../../types/event.types";
import { TrashIcon } from "../../icons";

export function EventSelection({ onNext }: EventSelectionProps) {
  const [loginModalOpen, setLoginModalOpen] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { zonas, titulo, lugar, fecha, ubicacion, imagenZonas } =
    useZonasEventoStore();
  const { eventoId } = useParams();
  const { saveSelections, getSelections, clearSelections, setMetodoPago } =
    useEntradasClienteStore();

  const [selectedTickets, setSelectedTickets] = React.useState<{
    [key: number]: number;
  }>({});

  const ticketTypes: Zona[] = zonas;

  const handleQuantityChange = (ticketId: number, value: string | number) => {
    const numValue = typeof value === "string" ? parseInt(value) || 0 : value;
    setSelectedTickets((prev) => {
      const copy = { ...prev } as { [key: number]: number };
      if (!numValue || numValue <= 0) {
        // remove key if value is zero or falsy
        delete copy[ticketId];
      } else {
        copy[ticketId] = numValue;
      }
      return copy;
    });
  };

  const totalTickets = Object.values(selectedTickets).reduce(
    (sum, qty) => sum + qty,
    0
  );
  const totalAmount = ticketTypes.reduce((sum, ticket) => {
    return sum + (selectedTickets[ticket.zonaId] || 0) * ticket.precioUnitario;
  }, 0);

  const handleContinue = () => {
    if (!isLoggedIn) {
      // guarda selecciones para que el usuario las recupere después de iniciar sesión
      if (eventoId) {
        const idNum = parseInt(eventoId as string, 10);
        if (!Number.isNaN(idNum)) {
          const cleaned = Object.fromEntries(
            Object.entries(selectedTickets).filter(([, v]) => Number(v) > 0)
          );
          saveSelections(idNum, cleaned as any);
        }
      }
      setLoginModalOpen(true);
      return;
    }

    const idNum = parseInt(eventoId as string, 10);
    if (!Number.isNaN(idNum)) {
      const cleaned = Object.fromEntries(
        Object.entries(selectedTickets).filter(([, v]) => Number(v) > 0)
      );
      saveSelections(idNum, cleaned as any);
    }

    const saved = getSelections(Number(eventoId));
    if (saved) {
      // ensure loaded saved selections don't include zeros and keys are numeric
      const cleanedSaved: { [key: number]: number } = {};
      Object.entries(saved).forEach(([k, v]) => {
        const num = Number(v);
        const keyNum = Number(k);
        if (!Number.isNaN(keyNum) && Number.isFinite(keyNum) && num > 0) {
          cleanedSaved[keyNum] = num;
        }
      });
      setSelectedTickets(cleanedSaved);
    }
    const cleanedForSubmit = Object.fromEntries(
      Object.entries(selectedTickets).filter(([, v]) => Number(v) > 0)
    );
    if (Object.keys(cleanedForSubmit).length > 0) {
      onNext(cleanedForSubmit as any);
    }
    setMetodoPago("TARJETA_DE_CREDITO"); // siempre se empieza con tarjeta de crédito
  };

  // al montar, si hay selecciones guardadas para este evento, cargarlas
  React.useEffect(() => {
    if (!eventoId) return;
    const idNum = parseInt(eventoId as string, 10);
    if (Number.isNaN(idNum)) return;
    const saved = getSelections(idNum);

    if (saved) {
      // clean loaded selections (remove zeros) and ensure numeric keys
      const cleanedSaved: { [key: number]: number } = {};
      Object.entries(saved).forEach(([k, v]) => {
        const num = Number(v);
        const keyNum = Number(k);
        if (!Number.isNaN(keyNum) && Number.isFinite(keyNum) && num > 0) {
          cleanedSaved[keyNum] = num;
        }
      });
      setSelectedTickets(cleanedSaved);
    } else {
      setSelectedTickets({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventoId]);

  const gestionMax = (ticketDispo: number) => {
    if (ticketDispo > 5) {
      return 5;
    }
    return ticketDispo;
  };

  const eliminarSelecciones = () => {
    const idNum = Number(eventoId);
    if (!Number.isNaN(idNum)) {
      // remove persisted selections for this event
      clearSelections(idNum);
      // also clear local selections so inputs, totals and amount reset
      setSelectedTickets({});
      // if you also want to persist an explicit empty object, you can uncomment:
      // saveSelections(idNum, {});
    }
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
                backgroundImage: `url(${imageBaseUrl}/${imagenZonas})`,
                backgroundPosition: "center",
                width: "100%",
                backgroundSize: "13rem",
                borderRadius: 8,
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}
            />
          </div>

          {/* Columna derecha: lista compacta de tipos de ticket */}
          <div style={{ flex: "1 1 400px", minWidth: 0 }}>
            {ticketTypes.map((ticket) => (
              <Tile
                key={ticket.zonaId}
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
                      id={`ticket-${ticket.zonaId}`}
                      min={0}
                      max={gestionMax(ticket.cantidadEntradasDisponible)}
                      value={selectedTickets[ticket.zonaId] || 0}
                      onChange={(e: any, state: any) =>
                        handleQuantityChange(ticket.zonaId, state.value)
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

        <div
          style={{
            display: "flex",
            gap: "0.8rem",
          }}
        >
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
          <Button
            kind="tertiary"
            size="lg"
            style={{ width: "100%" }}
            onClick={eliminarSelecciones}
            disabled={totalTickets === 0}
            renderIcon={TrashIcon}
          >
            Borrar selecciones
          </Button>
        </div>
      </Tile>
    </div>
  );
}
