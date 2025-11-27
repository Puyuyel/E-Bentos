import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckmarkOutline,
  Email,
  Phone,
  Renew,
  User,
  Wallet,
  WarningAlt,
} from "@carbon/icons-react";
import HeaderEbentos from "../../components/Cliente/HeaderEbentos";
import Footer from "../../components/Cliente/Footer";
import styles from "../../styles/Cliente/MiPerfil.module.css";
import { getUser } from "../../services/authService";
import { actualizarCliente, obtenerCliente } from "../../services/clienteService";
import type { ClienteDTO, ClienteUpdatePayload, Genero } from "../../types/cliente.types";

const PAYMENT_STORAGE_KEY = "perfil-metodos-pago";

const generoLabels: Record<Genero, string> = {
  MASCULINO: "Masculino",
  FEMENINO: "Femenino",
  NINGUNO_DE_LOS_ANTERIORES: "Prefiero no decirlo",
};

export default function MiPerfil() {
  const [cliente, setCliente] = useState<ClienteDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [nuevoMetodo, setNuevoMetodo] = useState<string>("");
  const [paymentMethods, setPaymentMethods] = useState<string[]>(() => {
    const stored = localStorage.getItem(PAYMENT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : ["Tarjeta de crédito", "Yape"];  
  });

  const [formState, setFormState] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    email: "",
    telefono: "",
    genero: "" as Genero | "",
    contrasenha: "",
  });

  useEffect(() => {
    localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setLoading(true);
        const user = await getUser();
        const data = await obtenerCliente(user.usuarioId);
        setCliente(data);
        setFormState({
          nombres: data.nombres || "",
          apellidos: data.apellidos || "",
          dni: data.dni || "",
          email: data.email || "",
          telefono: data.telefono || "",
          genero: data.genero ?? "",
          contrasenha: "",
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "No pudimos cargar tu perfil";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, []);

  const puntosDisponibles = useMemo(() => {
    if (!cliente) return 0;
    return (cliente.puntosAcumulados || 0) - (cliente.puntosGastados || 0);
  }, [cliente]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPayment = () => {
    const value = nuevoMetodo.trim();
    if (!value) return;
    setPaymentMethods((prev) => Array.from(new Set([...prev, value])));
    setNuevoMetodo("");
  };

  const handleRemovePayment = (method: string) => {
    setPaymentMethods((prev) => prev.filter((item) => item !== method));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!cliente) return;
    try {
      setSaving(true);
      setFeedback(null);
      const payload: ClienteUpdatePayload = {
        email: formState.email,
        telefono: formState.telefono,
        genero: formState.genero,
        activo: 1,
        contrasenha: formState.contrasenha ? formState.contrasenha : '',
      };
      const actualizado = await actualizarCliente(cliente.usuarioId, payload);
      setCliente(actualizado);
      setFormState((prev) => ({ ...prev, contrasenha: "" }));
      setFeedback("Datos actualizados correctamente");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "No pudimos guardar los cambios";
      setFeedback(message);
    } finally {
      setSaving(false);
    }
  };

  const fechaNacimiento = cliente?.fechaNacimiento
    ? new Intl.DateTimeFormat("es-PE", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(new Date(cliente.fechaNacimiento))
    : "";

  return (
    <div className={styles.pageRoot}>
      <HeaderEbentos />
      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Tu perfil</p>
          <h1 className={styles.title}>Información personal y preferencias</h1>
          <p className={styles.subtitle}>
            Mantén tus datos al día para agilizar tus compras y recibir alertas de tus eventos favoritos.
          </p>
        </div>
        <div className={styles.heroBadge}>
          <User size={28} />
          <div>
            <p>{cliente?.nombres ? `Hola, ${cliente.nombres}` : "Perfil"}</p>
            <strong>{cliente?.email || "Cargando"}</strong>
          </div>
        </div>
      </section>

      <main className={styles.content}>
        {loading ? (
          <div className={styles.empty}>Cargando tu información...</div>
        ) : error ? (
          <div className={`${styles.empty} ${styles.errorBox}`}>
            <WarningAlt size={20} /> {error}
          </div>
        ) : (
          <>
            <div className={styles.topGrid}>
              <article className={styles.card}>
                <header className={styles.cardHeader}>
                  <div>
                    <p className={styles.kicker}>Identidad</p>
                    <h2 className={styles.cardTitle}>Datos personales</h2>
                  </div>
                  <span className={styles.badgeSoft}>
                    <Calendar size={16} /> {fechaNacimiento || "Sin fecha"}
                  </span>
                </header>

                <div className={styles.fieldGrid}>
                  <label className={styles.field}>
                    <span>Nombres</span>
                    <input
                      type="text"
                      name="nombres"
                      value={formState.nombres}
                      onChange={handleInputChange}
                      disabled
                    />
                    <small>Para modificar tus nombres, contáctanos por soporte.</small>
                  </label>

                  <label className={styles.field}>
                    <span>Apellidos</span>
                    <input
                      type="text"
                      name="apellidos"
                      value={formState.apellidos}
                      onChange={handleInputChange}
                      disabled
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Documento de identidad</span>
                    <input
                      type="text"
                      name="dni"
                      value={formState.dni}
                      onChange={handleInputChange}
                      disabled
                    />
                    <small>Tu documento está validado y no puede editarse desde aquí.</small>
                  </label>

                  <label className={styles.field}>
                    <span>Género</span>
                    <select
                      name="genero"
                      value={formState.genero}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecciona una opción</option>
                      {Object.entries(generoLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </article>

              <article className={styles.card}>
                <header className={styles.cardHeader}>
                  <div>
                    <p className={styles.kicker}>Contacto</p>
                    <h2 className={styles.cardTitle}>Datos para notificaciones</h2>
                  </div>
                  <span className={styles.badgeSoft}>
                    <Renew size={16} /> {cliente?.puntosAcumulados ?? 0} pts
                  </span>
                </header>

                <div className={styles.fieldGrid}>
                  <label className={styles.field}>
                    <span>Correo electrónico</span>
                    <div className={styles.inputIcon}>
                      <Email size={16} />
                      <input
                        type="email"
                        name="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </label>

                  <label className={styles.field}>
                    <span>Teléfono</span>
                    <div className={styles.inputIcon}>
                      <Phone size={16} />
                      <input
                        type="tel"
                        name="telefono"
                        value={formState.telefono}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <small>Usaremos este número para enviarte alertas de eventos y códigos QR.</small>
                  </label>
                </div>

                <div className={styles.highlightBox}>
                  <div>
                    <p className={styles.highlightTitle}>Puntos disponibles</p>
                    <strong className={styles.points}>{puntosDisponibles} pts</strong>
                  </div>
                  <p className={styles.highlightText}>
                    Canjea tus puntos en la sección "Mis puntos" y obtén descuentos en próximos eventos.
                  </p>
                </div>
              </article>
            </div>

            <div className={styles.bottomGrid}>
              <article className={styles.card}>
                <header className={styles.cardHeader}>
                  <div>
                    <p className={styles.kicker}>Métodos de pago</p>
                    <h2 className={styles.cardTitle}>Preferencias guardadas</h2>
                  </div>
                  <Wallet size={22} />
                </header>

                <div className={styles.paymentList}>
                  {paymentMethods.map((method) => (
                    <span key={method} className={styles.paymentChip}>
                      {method}
                      <button
                        type="button"
                        className={styles.removeChip}
                        onClick={() => handleRemovePayment(method)}
                        aria-label={`Eliminar ${method}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {paymentMethods.length === 0 && (
                    <p className={styles.muted}>Aún no tienes métodos guardados.</p>
                  )}
                </div>

                <div className={styles.paymentForm}>
                  <input
                    type="text"
                    placeholder="Ej. Visa, Mastercard, Yape, Plin"
                    value={nuevoMetodo}
                    onChange={(e) => setNuevoMetodo(e.target.value)}
                  />
                  <button type="button" onClick={handleAddPayment}>
                    Agregar
                  </button>
                </div>
                <small className={styles.muted}>
                  Guardamos tus preferencias en tu dispositivo para agilizar la compra. Pronto podrás sincronizarlas con tu cuenta.
                </small>
              </article>

              <form className={styles.card} onSubmit={handleSubmit}>
                <header className={styles.cardHeader}>
                  <div>
                    <p className={styles.kicker}>Seguridad</p>
                    <h2 className={styles.cardTitle}>Guardar cambios</h2>
                  </div>
                  {feedback && (
                    <span className={styles.badgeSoft}>
                      <CheckmarkOutline size={16} />
                      {feedback}
                    </span>
                  )}
                </header>

                <p className={styles.muted}>
                  Actualiza tus datos de contacto y preferencias. Los cambios se aplican a futuras compras.
                </p>
                
                <label className={styles.field}>
                  <span>Nueva contraseña</span>
                  <input
                    type="password"
                    name="contrasenha"
                    value={formState.contrasenha}
                    onChange={handleInputChange}
                    placeholder="Ingresa una nueva contraseña"
                  />
                  <small>Déjalo en blanco si no deseas cambiar tu contraseña.</small>
                </label>

                <div className={styles.actions}>
                  <button type="submit" className={styles.primaryButton} disabled={saving}>
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => formState.telefono && setFeedback("Datos sin cambios")}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}