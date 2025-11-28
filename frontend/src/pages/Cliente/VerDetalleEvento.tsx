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
import { getLocalPorIdService } from "../../services/LocalesServices/getLocalPorId";
import type { Local } from "../../types/locales.types";
import { ConvertToCloud } from "@carbon/icons-react";
import { useAuthStore } from "../../store/useAuthStore";
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
  } = useZonasEventoStore();
  const { setEventSearchedByID, eventSearched } = useEventos();
  const { eventoId } = useParams();
  const navigate = useNavigate();
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
    const llenarZonas = () => {
      if (datosEvento) {
        console.log(datosEvento);
        setZonas(datosEvento?.zonas);
        setLugar(datosEvento.nombreLocal);
        if (eventoId) setEventSearchedByID(Number(eventoId));
        setTitulo(eventSearched);
        setFecha(datosEvento.fecha);
        setEventoID(Number(eventoId));
        setUbicacion(datosEvento.direccionLocal);
        setImagenZonas(datosEvento.imagenZonas);
      }
    };
    llenarZonas();
  }, [datosEvento]);

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
