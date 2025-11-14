import HeaderEbentos from "../../components/Cliente/HeaderEbentos";
import { Button } from "@carbon/react";
import { ContenedorImagenEvento } from "../../components/Cliente/ContenedorImagenEvento";
import Footer from "../../components/Cliente/Footer";
import ContenedorZonasPrecios from "../../components/Cliente/ContenedorZonasPrecios";
import ContenedorInformacionEvento from "../../components/Cliente/ContenedorInformacionEvento";
import ContenedorTerminosCondiciones from "../../components/Cliente/ContenedorTerminosCondiciones";
import styles from "../../styles/Cliente/VerDetalleEvento.module.css";
import "../../styles/Cliente/verDetalleEvento.body.css";
import { useEffect, useState } from "react";
import { Modal, InlineLoading } from "@carbon/react";
import { obtenerDetalleEvento } from "../../services/ClientServices/detalleEventoService";
import { useParams } from "react-router-dom";
import type { EventoDetalle } from "../../types/event.types";
import { obtenerFecha } from "../../components/util/obtenerFecha";
import { getLocalPorIdService } from "../../services/LocalesServices/getLocalPorId";
import type { Local } from "../../types/locales.types";
import { ConvertToCloud } from "@carbon/icons-react";

export default function VerDetalleEvento() {
  const [datosEvento, setDatosEvento] = useState<EventoDetalle>();
  const { eventoId } = useParams();
  useEffect(() => {
    const llamarAPIConIdEvento = async () => {
      try {
        console.log("Llamando API para eventoId:", eventoId);
        const response = await obtenerDetalleEvento(Number(eventoId)); // ya me da el .data
        console.log("Respuesta de detalleEventoService:", response);
        setDatosEvento(response);
        if (response) {
          setLoading(false);
        }
      } catch (error: any) {
        alert(
          `ERROR al recuperar el Detalle del evento o del Local: ${eventoId} - ${String(
            error
          )}`
        );
      }
    };
    llamarAPIConIdEvento();
  }, [eventoId]);

  useEffect(() => {
    // Add class to body while this page is mounted to scope the body change
    document.body.classList.add("verdetalle-page");
    return () => {
      document.body.classList.remove("verdetalle-page");
    };
  }, []);

  const [loading, setLoading] = useState<boolean>(true);

  if (loading) {
    return (
      <Modal open={true} modalHeading="Cargando" passiveModal>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <InlineLoading description="Cargando datos..." status="active" />
        </div>
      </Modal>
    );
  }

  if (!datosEvento) return <div>Sin datos disponibles.</div>;

  return (
    <div className={styles.pageRoot}>
      <HeaderEbentos />
      <ContenedorImagenEvento
        imagen={datosEvento.posterHorizontal}
        className={styles.hero}
      />
      <main className={styles.container}>
        <ContenedorZonasPrecios
          zonas={datosEvento.zonas}
          localTipo={datosEvento.tipoLocal}
        />
        <div
          style={{
            backgroundColor: "rgba(130, 150, 252, 0.25)",
          }}
          className={styles.ctaWrap}
        >
          <Button>Comprar Entradas</Button>
        </div>
        <ContenedorInformacionEvento
          ubicacion={datosEvento.direccionLocal}
          imgArtista={datosEvento.posterVertical}
          fechaHora={obtenerFecha(datosEvento.fecha)}
          descripcion={datosEvento.descripcion}
        />
        <ContenedorTerminosCondiciones
          nombreLocal={datosEvento.nombreLocal}
          fechaISO={datosEvento.fecha}
        />
        <Footer />
      </main>
    </div>
  );
}
