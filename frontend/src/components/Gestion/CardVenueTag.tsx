interface CardVenueTagProps {
  mensaje: string;
  color: {
    fondo: string;
    fuente: string;
  };
}
export default function CardVenueTag({ mensaje, color }: CardVenueTagProps) {
  return (
    <div
      className="CardVenueTag"
      style={{
        position: "absolute",
        top: "5px",
        right: "5px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100px",
        height: "35px",
        backgroundColor: color.fondo,
        border: "2px solid #fafafaff",
        borderRadius: "8px",
      }}
    >
      <span style={{ color: color.fuente }}>
        <strong>{mensaje}</strong>
      </span>
    </div>
  );
}
