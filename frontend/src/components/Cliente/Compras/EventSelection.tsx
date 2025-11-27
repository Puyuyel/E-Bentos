import React from "react";
import { Button, NumberInput, Tile, Grid, Column } from "@carbon/react";
import { ShoppingCart, Calendar, Location } from "@carbon/icons-react";

interface Ticket {
  id: string;
  name: string;
  price: number;
  available: number;
  description: string;
}

interface EventSelectionProps {
  onNext: (tickets: { [key: string]: number }) => void;
}

export function EventSelection({ onNext }: EventSelectionProps) {
  const [selectedTickets, setSelectedTickets] = React.useState<{
    [key: string]: number;
  }>({});

  const ticketTypes: Ticket[] = [
    {
      id: "general",
      name: "Entrada General",
      price: 25.0,
      available: 100,
      description: "Acceso general al evento",
    },
    {
      id: "vip",
      name: "Entrada VIP",
      price: 75.0,
      available: 30,
      description: "Acceso VIP con asientos preferenciales y bebidas incluidas",
    },
    {
      id: "premium",
      name: "Entrada Premium",
      price: 150.0,
      available: 15,
      description:
        "Experiencia completa con meet & greet y merchandising exclusivo",
    },
  ];

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
    return sum + (selectedTickets[ticket.id] || 0) * ticket.price;
  }, 0);

  const handleContinue = () => {
    if (totalTickets > 0) {
      onNext(selectedTickets);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "0.5rem" }}
        >
          Concierto de Rock 2025
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
            <span>15 de Diciembre, 2025</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Location size={20} />
            <span>Estadio Nacional</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        {ticketTypes.map((ticket) => (
          <Tile
            key={ticket.id}
            style={{ marginBottom: "1rem", backgroundColor: "white" }}
          >
            <Grid>
              <Column lg={10} md={6} sm={4}>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                  }}
                >
                  {ticket.name}
                </h3>
                <p style={{ color: "#525252", marginBottom: "0.5rem" }}>
                  {ticket.description}
                </p>
                <p style={{ fontSize: "0.875rem", color: "#737373" }}>
                  Disponibles: {ticket.available}
                </p>
              </Column>
              <Column
                lg={6}
                md={2}
                sm={4}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "1rem",
                }}
              >
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      marginBottom: "1rem",
                    }}
                  >
                    ${ticket.price.toFixed(2)}
                  </p>
                  <NumberInput
                    id={`ticket-${ticket.id}`}
                    min={0}
                    max={ticket.available}
                    value={selectedTickets[ticket.id] || 0}
                    onChange={(e: any, state: any) =>
                      handleQuantityChange(ticket.id, state.value)
                    }
                    label=""
                    hideLabel
                    size="md"
                  />
                </div>
              </Column>
            </Grid>
          </Tile>
        ))}
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
              ${totalAmount.toFixed(2)}
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
