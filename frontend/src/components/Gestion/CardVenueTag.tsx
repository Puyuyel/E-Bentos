interface CardVenueTagProps {
  mensaje: string;
  color?: string;
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
        backgroundColor: color,
        border: "2px solid #fafafaff",
        borderRadius: "8px",
      }}
    >
      <span>{mensaje}</span>
    </div>
  );
}
