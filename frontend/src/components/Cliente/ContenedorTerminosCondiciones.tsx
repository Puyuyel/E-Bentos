import { FluidTextArea } from "@carbon/react";

export default function ContenedorTerminosCondiciones() {
  const terminosCondiciones = `Día del concierto: 13 de Febrero - 8:00pm
Recinto: ARENA 1 - Costa Verde de San Miguel s/n, altura de bajada Bertolotto.
Público recomendado: a partir de los 14 años.
Ingresan y pagan a partir de los 4 años, acompañados de un adulto responsable de su seguridad, cada uno con su ticket en el mismo sector.
Venta de entradas online solo por e-Bentos.
Preventa Artista cuenta con el mismo precio de la tarifa regular
Compra máxima por persona: 6 tickets.
La ticketera no se hace responsable por entradas adquiridas fuera del sistema eBentos.`;

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
          paddingBottom: "3rem",
        }}
      >
        TÉRMINOS Y CONDICIONES
      </h2>
      <div
        style={{
          width: "37.5rem",
          marginBottom: "5rem",
        }}
      >
        <FluidTextArea
          className="test-class"
          invalidText="Error message that is really long can wrap to more lines but should not be excessively long."
          labelText="Términos y condiciones"
          style={{ height: "15rem" }}
          maxCount={500}
          editable={false}
          value={terminosCondiciones}
          warnText="This is a warning message."
        />
      </div>
    </div>
  );
}
