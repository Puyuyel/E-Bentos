import "../../styles/Cliente/ContenedorZonasPrecios.css";

import {
  StructuredListBody,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
} from "@carbon/react";

interface ContenedorZonasPreciosProps {
  imagen?: string;
}

export default function ContenedorZonasPrecios({
  imagen,
}: ContenedorZonasPreciosProps) {
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
            backgroundImage: `url(${imagen})`,
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
              <StructuredListRow>
                <StructuredListCell noWrap>Row 1</StructuredListCell>
                <StructuredListCell>Row 1</StructuredListCell>
                <StructuredListCell>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  dui magna, finibus id tortor sed, aliquet bibendum augue.
                  Aenean posuere sem vel euismod dignissim. Nulla ut cursus
                  dolor. Pellentesque vulputate nisl a porttitor interdum.
                </StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell noWrap>Row 2</StructuredListCell>
                <StructuredListCell>Row 2</StructuredListCell>
                <StructuredListCell>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  dui magna, finibus id tortor sed, aliquet bibendum augue.
                  Aenean posuere sem vel euismod dignissim. Nulla ut cursus
                  dolor. Pellentesque vulputate nisl a porttitor interdum.
                </StructuredListCell>
              </StructuredListRow>
            </StructuredListBody>
          </StructuredListWrapper>
        </div>
      </div>
    </div>
  );
}
