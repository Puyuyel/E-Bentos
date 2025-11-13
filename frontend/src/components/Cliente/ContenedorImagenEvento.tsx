import "../../styles/Cliente/ContenerImagenEvento.css";

interface ContenedorImagenEventoProps {
  imagen: string;
  className?: string;
}

export function ContenedorImagenEvento({
  imagen,
  className,
}: ContenedorImagenEventoProps) {
  return (
    <div
      className={className ? `img-banner ${className}` : "img-banner"}
      style={{
        backgroundImage: `url(${imagen})`,
      }}
    />
  );
}
