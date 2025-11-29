import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Lollipop from "../../components/Lollipop";
import GroupedBar from "../../components/GroupedBar";
import Donut from "../../components/Donut";
import Gauge from "../../components/Gauge";
import FilterBar from "../../components/FilterBar.tsx";
import "../../styles/Reportes/Reporte.css";
import "../../styles/CargaSpinner.css";
import { getReporteGeneral } from "../../services/reporteGeneralService.ts";
import type { ChartDatum } from "../../components/util/types.ts";
import { calculateGaugeData } from "../../components/util/calculateGaugeData.ts";

interface ReporteLocalItem {
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

const ReporteLocal: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reportes, setReportes] = useState<ReporteLocalItem[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getReporteGeneral();
        console.log("Datos del backend:", data);
        setReportes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Mover el cálculo de datos antes del return
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

    const costoTotal = dataToDisplay.reduce(
      (acc, r) => acc + Number(r.costoTotalEvento),
      0
    );

    // ROI CORREGIDO: (Ganancia Total - Inversión Total) / Inversión Total * 100
    const roiPromedio =
      costoTotal > 0 ? ((ingresosTotales - costoTotal) / costoTotal) * 100 : 0;

    // Datos para ingresos por categoría
    // Datos para ingresos por estado y categoría (GroupedBar modificado)
    // Datos para ingresos por categoría y estado (GroupedBar corregido)
    const ingresosPorCategoriaYEstado = dataToDisplay.reduce<
      Record<string, Record<string, number>>
    >((acc, r) => {
      const categoria = r.categoriaEvento;
      const estado = r.estadoEvento;

      if (!acc[categoria]) {
        acc[categoria] = {};
      }

      if (!acc[categoria][estado]) {
        acc[categoria][estado] = 0;
      }

      acc[categoria][estado] += Number(r.montoRecaudado);
      return acc;
    }, {});

    // Preparar datos para GroupedBar con categorías como grupo principal y estados como sub-grupo
    const ingresosCategoriaEstadoData: ChartDatum[] = [];

    // Crear datos en el formato que GroupedBar necesita
    Object.entries(ingresosPorCategoriaYEstado).forEach(
      ([categoria, estados]) => {
        Object.entries(estados).forEach(([estado, monto]) => {
          ingresosCategoriaEstadoData.push({
            group: categoria, // Categoría como grupo principal (aparecerá en leyenda)
            key: estado, // Estado como sub-grupo (aparecerá en eje X)
            value: monto,
          });
        });
      }
    );

    // Si no hay datos, crear datos vacíos para evitar errores
    if (ingresosCategoriaEstadoData.length === 0) {
      const estadosUnicos = [
        ...new Set(dataToDisplay.map((r) => r.estadoEvento)),
      ];
      const categoriasUnicas = [
        ...new Set(dataToDisplay.map((r) => r.categoriaEvento)),
      ];

      categoriasUnicas.forEach((categoria) => {
        estadosUnicos.forEach((estado) => {
          ingresosCategoriaEstadoData.push({
            group: categoria,
            key: estado,
            value: 0,
          });
        });
      });
    }
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

    // En el ReporteEvento.tsx, reemplaza la sección del área chart con esto:

    // Datos para el Area Chart de ROI por mes
    // Datos para el Area Chart de CANTIDAD de eventos por ROI por mes
    const eventosPorROIPorMes = dataToDisplay.reduce<
      Record<
        string,
        {
          positivos: number;
          negativos: number;
          nombre: string;
        }
      >
    >((acc, evento) => {
      const fecha = new Date(evento.fechaEvento);
      const mesKey = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      const nombreMes = fecha.toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      });

      const inversion = Number(evento.costoTotalEvento);
      const ganancia = Number(evento.montoRecaudado);
      const roi =
        inversion > 0 ? ((ganancia - inversion) / inversion) * 100 : 0;

      if (!acc[mesKey]) {
        acc[mesKey] = {
          positivos: 0,
          negativos: 0,
          nombre: nombreMes,
        };
      }

      // CONTAR eventos por tipo de ROI
      if (roi >= 0) {
        acc[mesKey].positivos += 1;
      } else {
        acc[mesKey].negativos += 1;
      }

      return acc;
    }, {} as Record<string, { positivos: number; negativos: number; nombre: string }>);

    // Preparar datos para el Area Chart en formato ChartDatum - CANTIDAD de eventos
    const eventosROIAreaData: ChartDatum[] = [];

    Object.entries(eventosPorROIPorMes)
      .sort(([mesA], [mesB]) => mesA.localeCompare(mesB))
      .forEach(([mesKey, datosMes]) => {
        const fecha = new Date(mesKey + "-15");
        const fechaFormateada = fecha.toISOString().split("T")[0];

        // Agregar datos para eventos POSITIVOS
        eventosROIAreaData.push({
          group: "Eventos con ROI Positivo",
          key: fechaFormateada,
          value: datosMes.positivos,
        });

        // Agregar datos para eventos NEGATIVOS
        eventosROIAreaData.push({
          group: "Eventos con ROI Negativo",
          key: fechaFormateada,
          value: datosMes.negativos,
        });
      });

    const eventosConROIPositivo = dataToDisplay.filter((evento) => {
      const inversion = Number(evento.costoTotalEvento);
      const ganancia = Number(evento.montoRecaudado);
      const roi =
        inversion > 0 ? ((ganancia - inversion) / inversion) * 100 : 0;
      return roi >= 0;
    }).length;

    const eventosConROINegativo = dataToDisplay.filter((evento) => {
      const inversion = Number(evento.costoTotalEvento);
      const ganancia = Number(evento.montoRecaudado);
      const roi =
        inversion > 0 ? ((ganancia - inversion) / inversion) * 100 : 0;
      return roi < 0;
    }).length;


  const totalAforo = dataToDisplay.reduce(
    (acc, r) => acc + Number(r.aforoLocal),
    0
  );
  const totalAsistentes = dataToDisplay.reduce(
    (acc, r) => acc + Number(r.asistentes),
    0
  );

  const ingresosPorLocal = dataToDisplay.reduce<Record<number, number>>(
    (acc, r) => {
      acc[r.idLocal] = (acc[r.idLocal] || 0) + Number(r.montoRecaudado);
      return acc;
    },
    {}
  );

  const incomeData: ChartDatum[] = Object.entries(ingresosPorLocal).map(
    ([idLocal, montoTotal]) => {
      const local = dataToDisplay.find((r) => r.idLocal === Number(idLocal));
      return {
        group: local?.nombreLocal || `Local ${idLocal}`,
        key: idLocal,
        value: montoTotal,
      };
    }
  );

  const groupedData: ChartDatum[] = dataToDisplay.map((r) => ({
    group: r.categoriaEvento,
    key: r.nombreLocal,
    value: r.montoRecaudado,
  }));

  return (
    <div
      className={`app-container ${
        sidebarOpen ? "sidebar-visible" : "sidebar-hidden"
      }`}
    >
      <Sidebar currentPath="reporte-local" onToggleSidebar={setSidebarOpen} />

      <main className="app-main">
        <h1 className="title">Visión General de Locales</h1>

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
                <h3>Eventos ROI Positivo</h3>
                <div className="metric-value positive">
                  {eventosConROIPositivo}
                </div>
              </div>
              <div className="metric-card">
                <h3>Eventos ROI Negativo</h3>
                <div className="metric-value negative">
                  {eventosConROINegativo}
                </div>
              </div>
              <div className="metric-card">
                <h3>ROI Total</h3>
                <div
                  className={`metric-value ${
                    roiPromedio >= 0 ? "positive" : "negative"
                  }`}
                >
                  {Math.round(roiPromedio * 100) / 100}%
                </div>
              </div>
            </div>
            <div className="chart-container">
              <div className="chart-item">
                <Gauge
                  totalCapacity={totalAforo}
                  usedCapacity={totalAsistentes}
                  title="Porcentaje de aforo utilizado"
                />
              </div>
              <div className="chart-item">
                <Donut
                  data={incomeData}
                  title="Porcentaje de ingresos por local"
                />
              </div>
              <div className="chart-item">
                <GroupedBar
                  data={groupedData}
                  title="Ventas por tipo de Evento en Locales"
                />
              </div>
              <div className="chart-item">
                <Lollipop data={incomeData} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ReporteLocal;
