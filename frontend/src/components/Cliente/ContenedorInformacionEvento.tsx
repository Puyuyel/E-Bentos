import { Location, EventSchedule } from "@carbon/react/icons";

import imagenArtista from "../../assets/artist-img-test.png";

export default function ContenedorInformacionEvento() {
  const ubicacion = "Lugar del evento, Ciudad, País";
  const fechaHoravento = "Fecha y hora del evento";
  const descripcionArtista =
    "Descripción del artista o banda que se presentará en el evento. Información relevante sobre su trayectoria, estilo musical y logros destacados.";
  return (
    <div>
      <h2>Información del Evento</h2>

      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            display: "flex",
            marginRight: "2rem",
          }}
        >
          <Location size={55}></Location>
          <p>
            Ubicación <br /> {ubicacion}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            marginRight: "2rem",
          }}
        >
          <EventSchedule size={55} />
          <p>
            Fecha del evento <br /> {fechaHoravento}
          </p>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <div
          className="img-banner"
          style={{
            backgroundImage: `url(${imagenArtista})`,
          }}
        />

        <p>{descripcionArtista}</p>
      </div>
    </div>
  );
}
