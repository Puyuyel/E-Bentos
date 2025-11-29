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
import { useNavigate } from "react-router-dom";

import { useZonasEventoStore } from "../../store/useZonasEventoStore";
import { useEventos } from "../../store/useEventos";

export default function VerDetalleEvento() {
  const [datosEvento, setDatosEvento] = useState<EventoDetalle>();
  const {
    setZonas,
    setTitulo,
    setLugar,
    setFecha,
    setEventoID,
    setUbicacion,
    setImagenZonas,
    clearZonasEventosStore,
  } = useZonasEventoStore();
  const { setEventSearchedByID, eventSearched } = useEventos();
  const { eventoId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (eventoId) {
      setEventSearchedByID(Number(eventoId));
    }
  }, [eventoId, setEventSearchedByID]);

  useEffect(() => {
    if (eventSearched) {
      setTitulo(eventSearched);
    }
  }, [eventSearched, setTitulo]);

  useEffect(() => {
    const cargarDatosEvento = async () => {
      clearZonasEventosStore();
      if (!eventoId) return;

      setLoading(true);

      try {
        const response = await obtenerDetalleEvento(Number(eventoId));
        if (!response) return;

        setDatosEvento(response);
        setZonas(response.zonas);
        setLugar(response.nombreLocal);
        setFecha(response.fecha);
        setUbicacion(response.direccionLocal);
        setImagenZonas(response.imagenZonas);
        setEventoID(Number(eventoId));
      } catch (error: any) {
        alert(
          `ERROR al recuperar Detalle del evento ${eventoId}: ${String(error)}`
        );
      } finally {
        setLoading(false);
      }
    };

    cargarDatosEvento();
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
          imagenZonas={datosEvento.imagenZonas}
        />
        <div
          style={{
            backgroundColor: "rgba(130, 150, 252, 0.25)",
          }}
          className={styles.ctaWrap}
        >
          <Button
            onClick={() =>
              navigate(`/cliente/comprar-entradas-evento/${eventoId}`)
            }
          >
            Comprar Entradas
          </Button>
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
