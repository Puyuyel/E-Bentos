import { Grid, Column, Stack, Tag, ClickableTile } from "@carbon/react";
import { Location, Calendar } from "@carbon/react/icons";
import CardVenueTag from "./CardVenueTag";
import type { Local } from "../../types/locales.types";
import { useState } from "react";

// CONSTANTES
const MENSAJES_TIPO = {
  HABILITADO: "Habilitado",
  EN_REVISION: "En revisión",
  ELIMINADO: "De baja",
};

export default function CardVenue(children: Local) {
  const [mensaje, setMensaje] = useState();
  const nombreLocal = children.nombre;
  const fechaEvento = "Fecha evento de la fiesta de marzo";
  const ubicacion = "data.direccion";
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
              >
                <Calendar size={25}></Calendar>
                <p>{fechaEvento}</p>
              </div>
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
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_lgROAzNtkzHWNBsAzCCxwLUEIqUN98CZ0g&s"
                alt="descripción"
                style={{ width: "100%", objectFit: "cover" }}
              ></img>
              <CardVenueTag mensaje={mensaje}></CardVenueTag>
            </div>
          </Column>
        </Grid>
      </ClickableTile>
    </div>
  );
}
