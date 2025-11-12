import "../../styles/Cliente/ContenerImagenEvento.css";

interface ContenedorImagenEventoProps {
  imagen: string;
}

export function ContenedorImagenEvento({
  imagen,
}: ContenedorImagenEventoProps) {
  return (
    <div
      className="img-banner"
      style={{
        backgroundImage: `url(${imagen})`,
      }}
    />
  );
}
