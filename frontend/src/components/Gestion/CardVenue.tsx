import { Grid, Column, Stack, Tag, ClickableTile } from "@carbon/react";
import { Location, Calendar } from "@carbon/react/icons";
import CardVenueTag from "./CardVenueTag";
import type { Local } from "../../types/locales.types";
import { useState, useEffect } from "react";

// CONSTANTES
const MENSAJES_TIPO = {
  HABILITADO: "Habilitado",
  EN_REVISION: "En revisión",
  ELIMINADO: "De baja",
} as const;

const COLORES_TIPO = {
  HABILITADO: "#4CAF50", // verde
  EN_REVISION: "#FFC107", // amarillo
  ELIMINADO: "#F44336", // rojo
} as const;

interface CardVenueProps {
  local: Local;
}

export default function CardVenue({ local }: CardVenueProps) {
  const [mensaje, setMensaje] = useState<string>("");
  const [color, setColor] = useState<string>("gray");

  useEffect(() => {
    switch (local.activo) {
      case 1:
        setMensaje(MENSAJES_TIPO.HABILITADO);
        setColor(COLORES_TIPO.HABILITADO);
        break;
      case 2:
        setMensaje(MENSAJES_TIPO.EN_REVISION);
        setColor(COLORES_TIPO.EN_REVISION);
        break;
      case 0:
        setMensaje(MENSAJES_TIPO.ELIMINADO);
        setColor(COLORES_TIPO.ELIMINADO);
        break;
      default:
        setMensaje("Desconocido");
        setColor("gray");
        break;
    }
  }, [local]); // <- se ejecuta cada vez que 'local' cambie

  const nombreLocal = local.nombre;
  const ubicacion = local.direccion;
  return (
    <div>
      <ClickableTile className="back_card">
        <Grid>
          <Column sm={4} md={4} lg={4} xlg={4} max={4}>
            <Stack gap={3}>
              <h4>{nombreLocal}</h4>
              <div
                style={{ display: "flex", alignItems: "left", gap: "0.5rem" }}
              >
                <Location size={25}></Location>
                <p>{ubicacion}</p>
              </div>
              <div
                style={{ display: "flex", alignItems: "left", gap: "0.5rem" }}
              ></div>
            </Stack>
          </Column>
          <Column sm={4} md={4} lg={4} xlg={4} max={4}>
            <div
              style={{
                position: "relative",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_lgROAzNtkzHWNBsAzCCxwLUEIqUN98CZ0g&s" // local.foto
                alt="Imagen del local"
                style={{ width: "100%", objectFit: "cover" }}
              ></img>
              <CardVenueTag mensaje={mensaje} color={color}></CardVenueTag>
            </div>
          </Column>
        </Grid>
      </ClickableTile>
    </div>
  );
}
