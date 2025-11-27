import { useEffect, useMemo, useState } from "react";
import {
  CheckmarkOutline,
  Gift,
  Renew,
  Star,
  WarningAlt,
} from "@carbon/icons-react";
import HeaderEbentos from "../../components/Cliente/HeaderEbentos";
import Footer from "../../components/Cliente/Footer";
import styles from "../../styles/Cliente/MisPuntos.module.css";
import { getUser } from "../../services/authService";
import {
  canjearDescuento,
  obtenerMisPuntos,
} from "../../services/clienteService";
import type {
  DescuentoActivo,
  MisPuntosResponse,
  OpcionCanje,
} from "../../types/puntos.types";

export default function MisPuntos() {
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [puntosInfo, setPuntosInfo] = useState<MisPuntosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selected, setSelected] = useState<OpcionCanje | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const cargarDatos = async () => {
    try {
      setError(null);
      setLoading(true);
      const user = await getUser();
      setClienteId(user.usuarioId);
      const data = await obtenerMisPuntos(user.usuarioId);
      setPuntosInfo(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "No pudimos cargar tus puntos.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const puntosDisponibles = useMemo(
    () => puntosInfo?.puntosActuales ?? 0,
    [puntosInfo]
  );

  const handleCanjear = async () => {
    if (!clienteId || !selected) return;
    try {
      setSubmitting(true);
      setError(null);
      await canjearDescuento(clienteId, selected.descuentoId);
      const data = await obtenerMisPuntos(clienteId);
      setPuntosInfo(data);
      setSuccess(
        `Canjeaste ${selected.nombre}. Revisa tu código en la sección de descuentos.`
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "No pudimos completar el canje.";
      setError(message);
    } finally {
      setSubmitting(false);
      setSelected(null);
    }
  };

  const closeFeedback = () => {
    setSuccess(null);
    setError(null);
  };

  const renderDescuentosActivos = () => {
    if (!puntosInfo?.descuentosActivos?.length) {
      return (
        <div className={styles.emptyBox}>
          <p>Aún no tienes descuentos canjeados.</p>
          <small>Usa tus puntos para desbloquear tus primeros beneficios.</small>
        </div>
      );
    }

    return (
      <div className={styles.activosGrid}>
        {puntosInfo.descuentosActivos.map((descuento: DescuentoActivo) => (
          <article key={descuento.descuentoUnicoId} className={styles.card}>
            <header className={styles.cardHeader}>
              <div>
                <p className={styles.kicker}>Descuento activo</p>
                <h3 className={styles.cardTitle}>{descuento.nombre}</h3>
              </div>
              <span className={styles.badgeSoft}>-{descuento.valorPorcentaje}%</span>
            </header>
            <div className={styles.codeBox}>
              <span className={styles.codeLabel}>Código</span>
              <strong className={styles.codeValue}>{descuento.codigoDescuento}</strong>
            </div>
            <p className={styles.cardMeta}>
              Canjeado por {descuento.costoPuntos} puntos
            </p>
          </article>
        ))}
      </div>
    );
  };

  const renderOpcionesCanje = () => {
    if (!puntosInfo?.opcionesCanje?.length) return null;
    return (
      <div className={styles.opcionesGrid}>
        {puntosInfo.opcionesCanje.map((opcion: OpcionCanje) => {
          const alcanzable = opcion.costoPuntos <= puntosDisponibles;
          return (
            <button
              key={opcion.descuentoId}
              className={`${styles.canjeCard} ${
                alcanzable ? styles.canjeDisponible : styles.canjeBloqueado
              } ${selected?.descuentoId === opcion.descuentoId ? styles.canjeSeleccionado : ""}`}
              onClick={() => (alcanzable ? setSelected(opcion) : undefined)}
              disabled={!alcanzable}
            >
              <div className={styles.canjeHeader}>
                <div>
                  <p className={styles.kicker}>Canjear</p>
                  <h3 className={styles.cardTitle}>{opcion.nombre}</h3>
                </div>
                <span className={styles.badgeSoft}>-{opcion.valorPorcentaje}%</span>
              </div>
              <div className={styles.canjePuntos}>
                <Star size={20} />
                <div>
                  <p>{opcion.costoPuntos} pts</p>
                  <small>
                    {alcanzable
                      ? "Disponible para canje"
                      : "Necesitas más puntos"}
                  </small>
                </div>
              </div>
              {selected?.descuentoId === opcion.descuentoId && (
                <div className={styles.selectedNote}>
                  <CheckmarkOutline size={16} /> Seleccionado para canje
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.pageRoot}>
      <HeaderEbentos />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Mis puntos</p>
          <h1 className={styles.title}>Gestiona tus recompensas</h1>
          <p className={styles.subtitle}>
            Visualiza tus puntos acumulados, canjea descuentos exclusivos y obtén
            los códigos para usarlos en tus próximas compras.
          </p>
        </div>
        <div className={styles.heroBadge}>
          <Gift size={28} />
          <div>
            <p>Puntos disponibles</p>
            <strong>{puntosDisponibles} pts</strong>
          </div>
        </div>
      </section>

      <main className={styles.content}>
        {loading ? (
          <div className={styles.emptyBox}>Cargando tus puntos...</div>
        ) : error ? (
          <div className={`${styles.emptyBox} ${styles.errorBox}`}>
            <WarningAlt size={20} /> {error}
          </div>
        ) : (
          <>
            {success && (
              <div className={`${styles.feedback} ${styles.success}`}>
                <CheckmarkOutline size={16} />
                <span>{success}</span>
                <button onClick={closeFeedback} aria-label="Cerrar aviso">
                  ✕
                </button>
              </div>
            )}
            <div className={styles.topGrid}>
              <article className={styles.card}>
                <header className={styles.cardHeader}>
                  <div>
                    <p className={styles.kicker}>Estado</p>
                    <h2 className={styles.cardTitle}>Tus puntos actuales</h2>
                  </div>
                  <span className={styles.badgeSoft}>
                    <Star size={16} /> {puntosDisponibles} pts
                  </span>
                </header>
                <p className={styles.cardMeta}>
                  Suma puntos en cada compra y canjéalos por descuentos
                  inmediatos. Mientras más ahorres, mejores beneficios recibes.
                </p>
                <div className={styles.highlightBox}>
                  <Renew size={18} />
                  <div>
                    <p className={styles.highlightTitle}>Opciones de canje</p>
                    <p className={styles.highlightText}>
                      75 pts = 5% de descuento · 125 pts = 10% de descuento · 150
                      pts = 15% de descuento
                    </p>
                  </div>
                </div>
              </article>

              <article className={styles.card}>
                <header className={styles.cardHeader}>
                  <div>
                    <p className={styles.kicker}>Tus descuentos</p>
                    <h2 className={styles.cardTitle}>Códigos canjeados</h2>
                  </div>
                </header>
                {renderDescuentosActivos()}
              </article>
            </div>

            <section className={styles.canjeSection}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.kicker}>Canjear puntos</p>
                  <h2 className={styles.cardTitle}>Elige un descuento</h2>
                  <p className={styles.subtitle}>
                    Selecciona la opción que prefieras. Confirmaremos tu
                    elección antes de aplicar el canje.
                  </p>
                </div>
                <button
                  className={styles.primaryBtn}
                  disabled={!selected || submitting}
                  onClick={handleCanjear}
                >
                  {submitting ? "Procesando..." : "Confirmar canje"}
                </button>
              </div>
              {renderOpcionesCanje()}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}