import { Location, EventSchedule } from "@carbon/react/icons";

const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

interface ContenedorInformacionEventoProps {
  ubicacion: string;
  imgArtista: string;
  fechaHora: string;
  descripcion: string;
}

export default function ContenedorInformacionEvento({
  ubicacion,
  imgArtista,
  fechaHora,
  descripcion,
}: ContenedorInformacionEventoProps) {
  const imagenArtista = imgArtista;
  const ubicacionLocal = ubicacion;
  const fechaHoravento = fechaHora;
  const descripcionArtista = descripcion;
  return (
    <div
      style={{
        alignContent: "center",
        backgroundColor: "rgba(130, 150, 252, 0.25)",
        justifyItems: "center",
      }}
    >
      <h2 style={{ paddingTop: "5rem", paddingBottom: "3rem" }}>
        INFORMACIÓN DEL EVENTO
      </h2>

      <div
        style={{
          display: "flex",
          gap: "15rem",
          justifyContent: "center",
          paddingBottom: "3rem",
        }}
      >
        <div
          style={{
            display: "flex",
            marginRight: "2rem",
            gap: "1rem",
          }}
        >
          <Location size={55}></Location>
          <p>
            Ubicación <br /> {ubicacionLocal}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            marginRight: "2rem",
            gap: "1rem",
          }}
        >
          <EventSchedule size={55} />
          <p>
            Fecha del evento <br /> {fechaHoravento}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12rem",
          paddingBottom: "5rem",
          justifyContent: "center",
        }}
      >
        <div
          className="img-banner"
          style={{
            backgroundImage: `url(${imageBaseUrl}/${imagenArtista})`,
          }}
        />
        <div
          style={{
            width: "110%",
            paddingRight: "5rem",
          }}
        >
          <p
            style={{
              textAlign: "justify",
            }}
          >
            {descripcionArtista}
          </p>
        </div>
      </div>
    </div>
  );
}
