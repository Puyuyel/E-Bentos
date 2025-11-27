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
          <div className="chart-container">
            <div className="chart-item">
              <Gauge
                totalCapacity={totalAforo}
                usedCapacity={totalAsistentes}
              />
            </div>
            <div className="chart-item">
              <Donut data={incomeData} />
            </div>
            <div className="chart-item">
              <GroupedBar data={groupedData} />
            </div>
            <div className="chart-item">
              <Lollipop data={incomeData} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReporteLocal;
