import "../../styles/Cliente/ContenerImagenEvento.css";

const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

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
        backgroundImage: `url(${imageBaseUrl}/${imagen})`,
      }}
    />
  );
}
