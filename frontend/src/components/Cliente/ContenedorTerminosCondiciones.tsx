import { FluidTextArea } from "@carbon/react";

export default function ContenedorTerminosCondiciones() {
  return (
    <div>
      <h2>Términos y condiciones</h2>
      <div
        style={{
          width: "37.5rem",
        }}
      >
        <FluidTextArea
          className="test-class"
          invalidText="Error message that is really long can wrap to more lines but should not be excessively long."
          labelText="Text Area label"
          maxCount={500}
          placeholder="Placeholder text"
          warnText="This is a warning message."
        />
      </div>
    </div>
  );
}
