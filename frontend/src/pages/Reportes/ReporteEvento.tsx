import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import GroupedBar from "../../components/GroupedBar";
import Donut from "../../components/Donut";
import Gauge from "../../components/Gauge";
import FilterBar from "../../components/FilterBar.tsx";
import "../../styles/Reportes/Reporte.css";
import "../../styles/CargaSpinner.css";
import { getReporteGeneral } from "../../services/reporteGeneralService.ts";
import type { ChartDatum } from "../../components/util/types.ts";
import AreaChartROI from "../../components/AreaChartROI.tsx";

interface ReporteEventoItem {
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
}

const ReporteEvento: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reportes, setReportes] = useState<ReporteEventoItem[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getReporteGeneral();
        console.log("Datos del backend para eventos:", data);
        setReportes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filtrado de datos
  const filteredReportes = reportes.filter((r) => {
    const fecha = new Date(r.fechaEvento);
    const fechaInicio = filters.fechaInicio
      ? new Date(filters.fechaInicio)
      : null;
    const fechaFin = filters.fechaFin ? new Date(filters.fechaFin) : null;

    // Filtrar por fecha
    if (fechaInicio && fechaFin) {
      if (fecha < fechaInicio || fecha > fechaFin) return false;
    } else if (fechaInicio) {
      if (fecha < fechaInicio) return false;
    } else if (fechaFin) {
      if (fecha > fechaFin) return false;
    }

    // Filtrar por categoría
    if (filters.categoriaEvento && filters.categoriaEvento !== "default") {
      if (
        r.categoriaEvento?.toLowerCase() !==
        filters.categoriaEvento.toLowerCase()
      ) {
        return false;
      }
    }

    // Filtrar por local
    if (filters.local && filters.local !== "default") {
      if (r.nombreLocal?.toLowerCase() !== filters.local.toLowerCase()) {
        return false;
      }
    }

    // Filtrar por productora
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
    (filters.local && filters.local !== "default") ||
    (filters.productora && filters.productora !== "default");

  const dataToDisplay = hayFiltrosActivos ? filteredReportes : reportes;
  const noDataAvailable = dataToDisplay.length === 0;

  // Métricas principales
  const cantidadEventos = dataToDisplay.length;
  const ingresosTotales = dataToDisplay.reduce(
    (acc, r) => acc + Number(r.montoRecaudado),
    0
  );

  // ROI promedio para el gauge
  const roiPromedio =
    dataToDisplay.length > 0
      ? dataToDisplay.reduce((acc, evento) => {
          const inversion = Number(evento.costoTotalEvento);
          const ganancia = Number(evento.montoRecaudado);
          const roi =
            inversion > 0 ? ((ganancia - inversion) / inversion) * 100 : 0;
          return acc + roi;
        }, 0) / dataToDisplay.length
      : 0;

  // Datos para ingresos por categoría
  const ingresosPorCategoria = dataToDisplay.reduce<Record<string, number>>(
    (acc, r) => {
      acc[r.categoriaEvento] =
        (acc[r.categoriaEvento] || 0) + Number(r.montoRecaudado);
      return acc;
    },
    {}
  );

  const ingresosCategoriaData: ChartDatum[] = Object.entries(
    ingresosPorCategoria
  ).map(([categoria, montoTotal]) => ({
    group: categoria,
    key: categoria,
    value: montoTotal,
  }));

  // Datos para estados de eventos
  const eventosPorEstado = dataToDisplay.reduce<Record<string, number>>(
    (acc, r) => {
      acc[r.estadoEvento] = (acc[r.estadoEvento] || 0) + 1;
      return acc;
    },
    {}
  );

  const estadosData: ChartDatum[] = Object.entries(eventosPorEstado).map(
    ([estado, cantidad]) => ({
      group: estado,
      key: estado,
      value: cantidad,
    })
  );

  // CORRECCIÓN: Datos para ingresos por mes
  const ingresosPorMes = dataToDisplay.reduce<
    Record<string, { nombre: string; monto: number }>
  >((acc, r) => {
    const fecha = new Date(r.fechaEvento);
    const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    const nombreMes = fecha.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });

    if (!acc[mes]) {
      acc[mes] = { nombre: nombreMes, monto: 0 };
    }
    acc[mes].monto += Number(r.montoRecaudado);
    return acc;
  }, {});

  // En el ReporteEvento.tsx, reemplaza la sección del área chart con esto:

  // Datos para el Area Chart de ROI por mes
  const roisPorMes = dataToDisplay.reduce<
    Record<string, { positivos: number[]; negativos: number[] }>
  >((acc, evento) => {
    const fecha = new Date(evento.fechaEvento);
    const mesKey = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    const inversion = Number(evento.costoTotalEvento);
    const ganancia = Number(evento.montoRecaudado);
    const roi = inversion > 0 ? ((ganancia - inversion) / inversion) * 100 : 0;

    if (!acc[mesKey]) {
      acc[mesKey] = { positivos: [], negativos: [] };
    }

    if (roi >= 0) {
      acc[mesKey].positivos.push(roi);
    } else {
      acc[mesKey].negativos.push(roi);
    }

    return acc;
  }, {});

  // Preparar datos para el Area Chart en formato ChartDatum
  const roiAreaData: ChartDatum[] = [];

  Object.entries(roisPorMes)
    .sort(([mesA], [mesB]) => mesA.localeCompare(mesB))
    .forEach(([mesKey, rois]) => {
      const fecha = new Date(mesKey + "-15");
      const fechaFormateada = fecha.toISOString().split("T")[0];

      // Calcular ROI promedio positivo para este mes
      if (rois.positivos.length > 0) {
        const roiPromedioPositivo =
          rois.positivos.reduce((sum, roi) => sum + roi, 0) /
          rois.positivos.length;
        roiAreaData.push({
          group: "ROI Positivo",
          key: fechaFormateada, // Usamos la fecha como key
          value: Math.round(roiPromedioPositivo * 100) / 100,
        });
      }

      // Calcular ROI promedio negativo para este mes
      if (rois.negativos.length > 0) {
        const roiPromedioNegativo =
          rois.negativos.reduce((sum, roi) => sum + roi, 0) /
          rois.negativos.length;
        roiAreaData.push({
          group: "ROI Negativo",
          key: fechaFormateada, // Usamos la fecha como key
          value: Math.round(roiPromedioNegativo * 100) / 100,
        });
      }
    });

  return (
    <div
      className={`app-container ${
        sidebarOpen ? "sidebar-visible" : "sidebar-hidden"
      }`}
    >
      <Sidebar currentPath="reporte-evento" onToggleSidebar={setSidebarOpen} />

      <main className="app-main">
        <h1 className="title">Reporte de Eventos</h1>

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
            {/* Métricas principales */}
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
            </div>

            {/* Gráficos */}
            <div className="chart-container">
              <div className="chart-item">
                <Gauge
                  totalCapacity={100} // ROI máximo esperado (100%)
                  usedCapacity={Math.max(0, Math.min(100, roiPromedio))} // ROI entre 0% y 100%
                  title="ROI Promedio de Eventos"
                />
              </div>
              <div className="chart-item full-width">
                <GroupedBar
                  data={ingresosCategoriaData}
                  title="Ingresos por Categoría de Evento"
                />
              </div>
              <div className="chart-item">
                <Donut
                  data={estadosData}
                  title="Distribución de Estados de Eventos"
                />
              </div>
              <div className="chart-item full-width">
                <AreaChartROI
                  data={roiAreaData}
                  title="Evolución de ROI Positivo vs Negativo por Mes"
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ReporteEvento;
