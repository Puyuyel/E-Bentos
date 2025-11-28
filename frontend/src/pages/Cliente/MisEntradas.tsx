import { useEffect, useMemo, useState } from "react";
import HeaderEbentos from "../../components/Cliente/HeaderEbentos";
import Footer from "../../components/Cliente/Footer";
import { Search, Filter, Ticket, Calendar, Map, CurrencyDollar, Star } from "@carbon/icons-react";
import styles from"../../styles/Cliente/MisEntradas.module.css";//styles/Cliente/MisEntradas.module.css";
import { listarVentasActivas, listarVentasPasadas } from "../../services/VentaServices/ventaService";
import type { EstadoVenta, VentaConEstado } from "../../types/venta.types";

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("es-PE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const currencyFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

const statusCopy: Record<EstadoVenta, string> = {
  activa: "Próximo",
  pasada: "Finalizado",
};

export default function MisEntradas() {
  const [ventas, setVentas] = useState<VentaConEstado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [buscador, setBuscador] = useState<string>("");
  const [estadoFiltro, setEstadoFiltro] = useState<"todas" | EstadoVenta>("todas");
  const [metodoFiltro, setMetodoFiltro] = useState<string>("todos");
  const [localFiltro, setLocalFiltro] = useState<string>("todos");

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        setLoading(true);
        const [activas, pasadas] = await Promise.all([
          listarVentasActivas(),
          listarVentasPasadas(),
        ]);

        const ventasFormateadas: VentaConEstado[] = [
          ...activas.map((venta) => ({ ...venta, estado: "activa" as const })),
          ...pasadas.map((venta) => ({ ...venta, estado: "pasada" as const })),
        ].sort(
          (a, b) =>
            new Date(b.evento.fechaHorarioInicio).getTime() -
            new Date(a.evento.fechaHorarioInicio).getTime()
        );

        setVentas(ventasFormateadas);
      } catch (err: any) {
        setError(err.message || "No se pudieron cargar tus entradas.");
      } finally {
        setLoading(false);
      }
    };

    cargarVentas();
  }, []);

  const metodosDisponibles = useMemo(
    () =>
      Array.from(new Set(ventas.map((venta) => venta.metodoDepago))).filter(
        Boolean
      ),
    [ventas]
  );

  const localesDisponibles = useMemo(
    () =>
      Array.from(new Set(ventas.map((venta) => venta.local?.nombre))).filter(
        Boolean
      ),
    [ventas]
  );

  const ventasFiltradas = useMemo(() => {
    const query = buscador.trim().toLowerCase();
    return ventas.filter((venta) => {
      const coincideBusqueda =
        !query ||
        venta.evento.nombre.toLowerCase().includes(query) ||
        venta.local?.nombre.toLowerCase().includes(query) ||
        venta.local?.direccion.toLowerCase().includes(query);

      const coincideEstado =
        estadoFiltro === "todas" || venta.estado === estadoFiltro;
      const coincideMetodo =
        metodoFiltro === "todos" || venta.metodoDepago === metodoFiltro;
      const coincideLocal =
        localFiltro === "todos" || venta.local?.nombre === localFiltro;

      return coincideBusqueda && coincideEstado && coincideMetodo && coincideLocal;
    });
  }, [buscador, estadoFiltro, localFiltro, metodoFiltro, ventas]);

  return (
    <div className={styles.pageRoot}>
      <HeaderEbentos />
      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Entradas adquiridas</p>
          <h1 className={styles.title}>Tus accesos a eventos</h1>
          <p className={styles.subtitle}>
            Revisa rápidamente tus próximas entradas, busca por evento o local y
            filtra por método de pago.
          </p>
        </div>
        <div className={styles.heroBadge}>
          <Ticket size={32} />
          <div>
            <p>Historial completo</p>
            <strong>{ventas.length} compras</strong>
          </div>
        </div>
      </section>

      <main className={styles.content}>
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar por evento, local o dirección"
              value={buscador}
              onChange={(e) => setBuscador(e.target.value)}
            />
          </div>
          <div className={styles.filterActions}>
            <div className={styles.filterLabel}>
              <Filter size={16} />
              <span>Filtros</span>
            </div>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value as EstadoVenta | "todas")}
            >
              <option value="todas">Todas</option>
              <option value="activa">Próximas</option>
              <option value="pasada">Finalizadas</option>
            </select>
            <select
              value={metodoFiltro}
              onChange={(e) => setMetodoFiltro(e.target.value)}
            >
              <option value="todos">Método de pago</option>
              {metodosDisponibles.map((metodo) => (
                <option key={metodo} value={metodo}>
                  {metodo}
                </option>
              ))}
            </select>
            <select
              value={localFiltro}
              onChange={(e) => setLocalFiltro(e.target.value)}
            >
              <option value="todos">Todos los locales</option>
              {localesDisponibles.map((local) => (
                <option key={local} value={local}>
                  {local}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className={styles.empty}>Cargando tus entradas...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : ventasFiltradas.length === 0 ? (
          <div className={styles.empty}>
            <p>No encontramos entradas con los criterios seleccionados.</p>
            <small>Prueba quitando filtros o buscando por otro término.</small>
          </div>
        ) : (
          <div className={styles.cardsGrid}>
            {ventasFiltradas.map((venta) => (
              <article key={venta.ventaId} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <p className={styles.eventName}>{venta.evento.nombre}</p>
                    <p className={styles.cardMeta}>
                      <Calendar size={16} /> {formatDate(venta.evento.fechaHorarioInicio)}
                    </p>
                  </div>
                  <span
                    className={`${styles.statusChip} ${styles[venta.estado]}`}
                    aria-label={`Entrada ${statusCopy[venta.estado]}`}
                  >
                    {statusCopy[venta.estado]}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.cardMeta}>
                    <Map size={16} /> {venta.local?.nombre}
                  </p>
                  <p className={styles.cardMetaMuted}>{venta.local?.direccion}</p>

                  <div className={styles.tagsRow}>
                    <span className={styles.tag}>
                      <CurrencyDollar size={16} />
                      {currencyFormatter.format(venta.montoTotalFinal)}
                    </span>
                    <span className={styles.tag}>
                      <Ticket size={16} /> {venta.metodoDepago}
                    </span>
                    <span className={styles.tag}>
                      <Star size={16} /> {venta.puntosGanados} pts
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}