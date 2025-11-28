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
      cantidadEntradasDisponible: number;
      precioUnitario: number;
      tipoZona: string;
      letraZona: string;
    }
  ];
  imagenZonas: string;
}

export default function ContenedorZonasPrecios({
  zonas,
  imagenZonas,
}: ContenedorZonasPreciosProps) {
  // const imagenZona = `${imageBaseUrl}/${localTipo}`;
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
            backgroundImage: `url(${imageBaseUrl})`,
          }}
        ></div>

        <div>
          <StructuredListWrapper>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>ZONAS</StructuredListCell>
                <StructuredListCell head>Tarifa regular</StructuredListCell>
                <StructuredListCell head>Disponibilidad</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {Array.isArray(zonas) &&
                zonas.length > 0 &&
                zonas.map((zona, index) => (
                  <StructuredListRow key={index}>
                    {/* Nombre de la zona */}
                    <StructuredListCell noWrap>
                      {zona.tipoZona} {zona.letraZona}
                    </StructuredListCell>

                    {/* Precio regular */}
                    <StructuredListCell>
                      S/ {zona.precioUnitario.toFixed(2)}
                    </StructuredListCell>

                    {/* Descuentos o stock */}
                    <StructuredListCell>
                      {zona.cantidadEntradasDisponible} entradas
                    </StructuredListCell>
                  </StructuredListRow>
                ))}
            </StructuredListBody>
          </StructuredListWrapper>
        </div>
      </div>
    </div>
  );
}
