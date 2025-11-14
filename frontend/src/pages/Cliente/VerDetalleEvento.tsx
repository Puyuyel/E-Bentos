import HeaderEbentos from "../../components/Cliente/HeaderEbentos";
import { Button } from "@carbon/react";
import { ContenedorImagenEvento } from "../../components/Cliente/ContenedorImagenEvento";
import Footer from "../../components/Cliente/Footer";
import ContenedorZonasPrecios from "../../components/Cliente/ContenedorZonasPrecios";
import ContenedorInformacionEvento from "../../components/Cliente/ContenedorInformacionEvento";
import ContenedorTerminosCondiciones from "../../components/Cliente/ContenedorTerminosCondiciones";
import imagenEvento from "../../assets/evento-img-horizontal-test.png";
import imagenZonaEvento from "../../assets/zonas-img-test.png";
import styles from "../../styles/Cliente/VerDetalleEvento.module.css";
import "../../styles/Cliente/verDetalleEvento.body.css";
import { useEffect } from "react";

export default function VerDetalleEvento() {
  useEffect(() => {
    // Add class to body while this page is mounted to scope the body change
    document.body.classList.add("verdetalle-page");
    return () => {
      document.body.classList.remove("verdetalle-page");
    };
  }, []);

  return (
    <div className={styles.pageRoot}>
      <HeaderEbentos />
      <ContenedorImagenEvento imagen={imagenEvento} className={styles.hero} />
      <main className={styles.container}>
        <ContenedorZonasPrecios imagen={imagenZonaEvento} />
        <div
          style={{
            backgroundColor: "rgba(130, 150, 252, 0.25)",
          }}
          className={styles.ctaWrap}
        >
          <Button>Comprar Entradas</Button>
        </div>
        <ContenedorInformacionEvento />
        <ContenedorTerminosCondiciones />
        <Footer />
      </main>
    </div>
  );
}
