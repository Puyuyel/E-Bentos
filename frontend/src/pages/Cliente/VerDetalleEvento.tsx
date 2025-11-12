import HeaderEbentos from "../../components/Cliente/HeaderEbentos";
import { Button } from "@carbon/react";
import { ContenedorImagenEvento } from "../../components/Cliente/ContenedorImagenEvento";
import ContenedorZonasPrecios from "../../components/Cliente/ContenedorZonasPrecios";
import ContenedorInformacionEvento from "../../components/Cliente/ContenedorInformacionEvento";
import ContenedorTerminosCondiciones from "../../components/Cliente/ContenedorTerminosCondiciones";
import imagenEvento from "../../assets/evento-img-horizontal-test.png";
import imagenZonaEvento from "../../assets/zonas-img-test.png";

export default function VerDetalleEvento() {
  return (
    <div>
      <HeaderEbentos></HeaderEbentos>
      <ContenedorImagenEvento imagen={imagenEvento}></ContenedorImagenEvento>
      <ContenedorZonasPrecios
        imagen={imagenZonaEvento}
      ></ContenedorZonasPrecios>
      <Button>Comprar Entradas</Button>
      <ContenedorInformacionEvento></ContenedorInformacionEvento>
      <ContenedorTerminosCondiciones></ContenedorTerminosCondiciones>
    </div>
  );
}
