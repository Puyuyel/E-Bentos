import { Location, EventSchedule } from "@carbon/react/icons";

import imagenArtista from "../../assets/artist-img-test.png";

export default function ContenedorInformacionEvento() {
  const ubicacion = "Lugar del evento, Ciudad, País";
  const fechaHoravento = "Fecha y hora del evento";
  const descripcionArtista = `
  La superestrella global y ganadora del GRAMMY® Doja Cat subió su primera canción a Soundcloud en 2013, a los 16 años. Criada en Los Ángeles, desarrolló sus habilidades musicales estudiando piano y danza, mientras se inspiraba en artistas como Busta Rhymes, Erykah Badu, Nicki Minaj y Drake. En 2014 firmó con Kemosabe/RCA Records y lanzó su EP Purrr!, seguido de su álbum debut Amala en 2018. Ese mismo año, su tema viral “MOOO!” la catapultó al reconocimiento global.

Su segundo álbum, Hot Pink (2019), nominado al GRAMMY y certificado platino, cosechó más de 7 mil millones de streams en todo el mundo e incluyó el fenómeno viral “Streets” y el éxito #1 nominado al GRAMMY “Say So”, certificado 6x platino por la RIAA. En 2021 lanzó su aclamado álbum Planet Her, que debutó en el No. 1 del Billboard Top R&B Albums y No. 2 en el Billboard 200, generando éxitos globales como “Kiss Me More” ft. SZA, “Woman”, “You Right” y “Need to Know”.

Con más de 36 mil millones de streams globales, Doja Cat ha ofrecido actuaciones memorables en los principales premios y festivales de música del mundo. Ha ganado 5 AMAs, 5 Billboard Music Awards, 5 MTV VMAs, 3 BMI Awards, 2 MTV EMAs, 1 GRAMMY y 1 NAACP Image Award, además de acumular 19 nominaciones al GRAMMY. En 2023, fue nombrada una de las 100 personas más influyentes de TIME, protagonizando la portada de abril y actuando en la gala TIME100 en Nueva York.

Su cuarto álbum, Scarlet (2023), certificado platino por la RIAA, incluyó los hits “Agora Hills” y “Paint The Town Red”. Este último se convirtió en el primer tema de rap en alcanzar el No. 1 del Billboard Hot 100 en 2023, manteniéndose tres semanas en la cima. Luego de su primera gira como headliner en Norteamérica, The Scarlet Tour, Doja Cat encabezó Coachella 2024 con una actuación inolvidable.

En septiembre de 2025 lanzó su quinto álbum Vie, un proyecto ambicioso que rinde homenaje a los sonidos de los ’70, ’80 y ’90, fusionados con su inconfundible estilo moderno. Con Vie y la gira Tour Ma Vie World Tour, Doja Cat sigue redefiniendo el estrellato global, consolidándose como una de las voces más influyentes e innovadoras de su generación.`;
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
            Ubicación <br /> {ubicacion}
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
            backgroundImage: `url(${imagenArtista})`,
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
