import "../../styles/Cliente/ContenedorZonasPrecios.css";

import zonaProvisional from "../../assets/zonas-img-test.png";

const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

import {
  StructuredListBody,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
} from "@carbon/react";

interface ContenedorZonasPreciosProps {
  zonas: [
    {
      zonaId: number;
      capacidadTotal: number;
      tipoZona: string;
      letraZona: string;
      precioUnitario: number;
    }
  ];
  local: {
    localId: number;
    nombre: string;
    direccion: string;
    foto: string;
    aforo: number;
    tipoLocal: string; // 'BAR'
    activo: number;
    gestor: {
      usuarioId: number;
    };
    distrito: {
      distritoId: number;
      nombre: string;
    };
  };
}

export default function ContenedorZonasPrecios({
  zonas,
  local,
}: ContenedorZonasPreciosProps) {
  const imagenZona = `${imageBaseUrl}/${local.tipoLocal}`;
  return (
    <div
      style={{
        alignContent: "center",
        backgroundColor: "rgba(130, 150, 252, 0.25)",
        justifyItems: "center",
      }}
    >
      <h2
        style={{
          marginTop: "2rem",
          marginBottom: "2rem",
        }}
      >
        ZONAS Y PRECIOS
      </h2>
      <div style={{ display: "flex" }}>
        <div
          className="img-zonas"
          style={{
            backgroundImage: `url(${zonaProvisional})`,
          }}
        ></div>

        <div>
          <StructuredListWrapper>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>ZONAS</StructuredListCell>
                <StructuredListCell head>Tarifa regular</StructuredListCell>
                <StructuredListCell head>Descuentos</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {Array.isArray(zonas) &&
                zonas.length > 0 &&
                zonas.map((zona) => (
                  <StructuredListRow key={zona.zonaId}>
                    {/* Nombre de la zona */}
                    <StructuredListCell noWrap>
                      {zona.tipoZona} {zona.letraZona}
                    </StructuredListCell>

                    {/* Precio regular */}
                    <StructuredListCell>
                      S/ {zona.precioUnitario.toFixed(2)}
                    </StructuredListCell>

                    {/* Descuentos (si aún no hay, se deja texto fijo o vacío) */}
                    <StructuredListCell>— Sin descuentos —</StructuredListCell>
                  </StructuredListRow>
                ))}
            </StructuredListBody>
          </StructuredListWrapper>
        </div>
      </div>
    </div>
  );
}
