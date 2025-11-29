import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Lollipop from "../../components/Lollipop";
import GroupedBar from "../../components/GroupedBar";
import Donut from "../../components/Donut";
import Gauge from "../../components/Gauge";
import AreaChartROI from "../../components/AreaChartROI";
import FilterBar from "../../components/FilterBar.tsx";
import "../../styles/Reportes/Reporte.css";
import "../../styles/CargaSpinner.css";
import { getReporteGeneral } from "../../services/reporteGeneralService.ts";
import type { ChartDatum } from "../../components/util/types.ts";

interface ReporteProductoraItem {
  categoriaEvento: string;
  nombreProductora: string;
  idEvento: number;
  fechaEvento: string;
  idLocal: number;
  nombreLocal: string;
  aforoLocal: number;
  idProductora: number;
  montoRecaudado: number;
  asistentes: number;
  costoTotalEvento: number;
  estadoEvento: string;
  metaTickets: number;
  nombreEvento: string;
  metaIngresos: number;
}

const ReporteProductora: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reportes, setReportes] = useState<ReporteProductoraItem[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getReporteGeneral();
        console.log("Datos del backend para productoras:", data);
        setReportes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filtrado de datos (manteniendo tu lógica original)
  const filteredReportes = reportes.filter((r) => {
    const fecha = new Date(r.fechaEvento);
    const fechaInicio = filters.fechaInicio
      ? new Date(filters.fechaInicio)
      : null;
    const fechaFin = filters.fechaFin ? new Date(filters.fechaFin) : null;

    if (fechaInicio && fechaFin) {
      if (fecha < fechaInicio || fecha > fechaFin) return false;
    } else if (fechaInicio) {
      if (fecha < fechaInicio) return false;
    } else if (fechaFin) {
      if (fecha > fechaFin) return false;
    }

    if (filters.categoriaEvento && filters.categoriaEvento !== "default") {
      if (
        r.categoriaEvento?.toLowerCase() !==
        filters.categoriaEvento.toLowerCase()
      ) {
        return false;
      }
    }

    if (filters.productora && filters.productora !== "default") {
      if (
        r.nombreProductora?.toLowerCase() !== filters.productora.toLowerCase()
      ) {
        return false;
      }
    }

    return true;
  });

  const hayFiltrosActivos =
    filters.fechaInicio ||
    filters.fechaFin ||
    (filters.categoriaEvento && filters.categoriaEvento !== "default") ||
    (filters.productora && filters.productora !== "default");

  const dataToDisplay = hayFiltrosActivos ? filteredReportes : reportes;
  const noDataAvailable = dataToDisplay.length === 0;

  // Métricas principales
  const cantidadEventos = dataToDisplay.length;
  const ingresosTotales = dataToDisplay.reduce(
    (acc, r) => acc + Number(r.montoRecaudado),
    0
  );

  const costoTotal = dataToDisplay.reduce(
    (acc, r) => acc + Number(r.costoTotalEvento),
    0
  );

  const roiPromedio =
    costoTotal > 0 ? ((ingresosTotales - costoTotal) / costoTotal) * 100 : 0;

  // DATOS MODIFICADOS: GroupedBar invertido - Estados dentro de cada Productora
  const eventosPorEstadoYProductora = dataToDisplay.reduce<
    Record<string, Record<string, number>>
  >((acc, r) => {
    const estado = r.estadoEvento;
    const productora = r.nombreProductora;

    if (!acc[estado]) {
      acc[estado] = {};
    }

    if (!acc[estado][productora]) {
      acc[estado][productora] = 0;
    }

    acc[estado][productora] += 1; // Contar eventos
    return acc;
  }, {});

  const eventosEstadoProductoraData: ChartDatum[] = [];

  Object.entries(eventosPorEstadoYProductora).forEach(
    ([estado, productoras]) => {
      Object.entries(productoras).forEach(([productora, cantidad]) => {
        eventosEstadoProductoraData.push({
          group: estado, // Estado como grupo principal (leyenda)
          key: productora, // Productora como sub-grupo (eje X)
          value: cantidad,
        });
      });
    }
  );

  // Si no hay datos, crear datos vacíos
  if (eventosEstadoProductoraData.length === 0) {
    const estadosUnicos = [
      ...new Set(dataToDisplay.map((r) => r.estadoEvento)),
    ];
    const productorasUnicas = [
      ...new Set(dataToDisplay.map((r) => r.nombreProductora)),
    ];

    estadosUnicos.forEach((estado) => {
      productorasUnicas.forEach((productora) => {
        eventosEstadoProductoraData.push({
          group: estado,
          key: productora,
          value: 0,
        });
      });
    });
  }

  // Datos para ingresos por productora a lo largo del tiempo (AreaChart)
  const ingresosPorProductoraPorMes = dataToDisplay.reduce<
    Record<string, Record<string, number>>
  >((acc, evento) => {
    const productora = evento.nombreProductora;
    const fecha = new Date(evento.fechaEvento);
    const mesKey = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    if (!acc[mesKey]) {
      acc[mesKey] = {};
    }

    if (!acc[mesKey][productora]) {
      acc[mesKey][productora] = 0;
    }

    acc[mesKey][productora] += Number(evento.montoRecaudado);
    return acc;
  }, {});

  const ingresosProductoraAreaData: ChartDatum[] = [];

  Object.entries(ingresosPorProductoraPorMes)
    .sort(([mesA], [mesB]) => mesA.localeCompare(mesB))
    .forEach(([mesKey, productoras]) => {
      const fecha = new Date(mesKey + "-15");
      const fechaFormateada = fecha.toISOString().split("T")[0];

      Object.entries(productoras).forEach(([productora, ingresos]) => {
        ingresosProductoraAreaData.push({
          group: productora,
          key: fechaFormateada,
          value: ingresos,
        });
      });
    });

  // Datos para ROI por productora (Lollipop)
  const roiPorProductora = dataToDisplay.reduce<
    Record<string, { ingresos: number; costos: number; eventos: number }>
  >((acc, evento) => {
    const productora = evento.nombreProductora;

    if (!acc[productora]) {
      acc[productora] = {
        ingresos: 0,
        costos: 0,
        eventos: 0,
      };
    }

    acc[productora].ingresos += Number(evento.montoRecaudado) || 0;
    acc[productora].costos += Number(evento.costoTotalEvento) || 0;
    acc[productora].eventos += 1;

    return acc;
  }, {});

  const roiProductoraData: ChartDatum[] = Object.entries(roiPorProductora).map(
    ([productora, datos]) => {
      // ROI = (Ingresos - Costos) / Costos * 100
      // Pero con validaciones para evitar divisiones por cero y valores extremos
      let roi = 0;

      if (datos.costos > 0) {
        roi = ((datos.ingresos - datos.costos) / datos.costos) * 100;
      } else if (datos.ingresos > 0) {
        // Si no hay costos pero sí ingresos, ROI sería infinito, lo limitamos
        roi = 1000; // O algún valor límite
      }

      // Limitar ROI a un rango razonable para evitar valores extremos
      const roiLimitado = Math.max(Math.min(roi, 1000), -100);

      return {
        group: productora,
        key: productora,
        value: Math.round(roiLimitado * 100) / 100,
      };
    }
  );

  // Métricas para gauges
  const totalMetaIngresos = dataToDisplay.reduce(
    (acc, r) => acc + Number(r.metaIngresos || 0),
    0
  );

  const totalMetaTickets = dataToDisplay.reduce(
    (acc, r) => acc + Number(r.metaTickets || 0),
    0
  );

  const totalAsistentes = dataToDisplay.reduce(
    (acc, r) => acc + Number(r.asistentes),
    0
  );

  const porcentajeCumplimientoIngresos =
    totalMetaIngresos > 0 ? (ingresosTotales / totalMetaIngresos) * 100 : 0;

  const porcentajeCumplimientoTickets =
    totalMetaTickets > 0 ? (totalAsistentes / totalMetaTickets) * 100 : 0;

  return (
    <div
      className={`app-container ${
        sidebarOpen ? "sidebar-visible" : "sidebar-hidden"
      }`}
    >
      <Sidebar
        currentPath="reporte-productora"
        onToggleSidebar={setSidebarOpen}
      />

      <main className="app-main">
        <h1 className="title">Reporte de Productoras</h1>

        <FilterBar
          onFilterChange={(newFilter) => {
            setFilters((prev) => ({ ...prev, ...newFilter }));
          }}
        />

        {loading ? (
          <div className="loader">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : noDataAvailable ? (
          <div className="no-data-message">
            <div className="icon">📊</div>
            <h2>No hay datos para los criterios seleccionados</h2>
            <p>Intenta ajustar los filtros para ver resultados.</p>
          </div>
        ) : (
          <>
            <div className="metrics-row">
              <div className="metric-card">
                <h3>Cantidad de Eventos</h3>
                <div className="metric-value">{cantidadEventos}</div>
              </div>
              <div className="metric-card">
                <h3>Ingresos Totales</h3>
                <div className="metric-value">
                  S/. {ingresosTotales.toLocaleString()}
                </div>
              </div>
              <div className="metric-card">
                <h3>ROI Promedio</h3>
                <div
                  className={`metric-value ${
                    roiPromedio >= 0 ? "positive" : "negative"
                  }`}
                >
                  {Math.round(roiPromedio * 100) / 100}%
                </div>
              </div>
              <div className="metric-card">
                <h3>Productoras Activas</h3>
                <div className="metric-value">
                  {new Set(dataToDisplay.map((r) => r.nombreProductora)).size}
                </div>
              </div>
            </div>

            <div className="chart-container">
              {/* Gauges de cumplimiento */}
              <div className="chart-item">
                <Gauge
                  totalCapacity={100}
                  usedCapacity={porcentajeCumplimientoIngresos}
                  title="Cumplimiento de Meta de Ingresos"
                />
              </div>
              <div className="chart-item">
                <Gauge
                  totalCapacity={100}
                  usedCapacity={porcentajeCumplimientoTickets}
                  title="Cumplimiento de Meta de Tickets"
                />
              </div>

              {/* Gráficos principales */}
              <div className="chart-item">
                <GroupedBar
                  data={eventosEstadoProductoraData}
                  title="Estados de Eventos por Productora"
                  yAxisTitle="Cantidad de Eventos"
                />
              </div>

              <div className="chart-item">
                <AreaChartROI
                  data={ingresosProductoraAreaData}
                  title="Ingresos por Productora a lo Largo del Tiempo"
                  yAxisTitle="Ingresos (S/.)"
                />
              </div>

              <div className="chart-item">
                <Lollipop
                  data={roiProductoraData}
                  title="ROI por Productora (%)"
                  desc="Índice de Retorno de Inversión en porcentaje"
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ReporteProductora;
