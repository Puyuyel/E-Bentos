import React, {useState} from 'react';
import Sidebar from '../../components/Sidebar';
import Lollipop from '../../components/Lollipop';
import GroupedBar from '../../components/GroupedBar';
import Donut from '../../components/Donut';
import Gauge from '../../components/Gauge';
import FilterBar from '../../components/FilterBar.tsx';
import '../styles/Reporte.css';
import type { ChartDatum } from "../../components/types.ts";

const ReporteLocal: React.FC = () => {
  const sampleData: ChartDatum[] = [
    { key: "Local 1", value: 65000 },
    { key: "Local 2", value: 32000 },
    { key: "Local 3", value: 42000 },
    { key: "Local 4", value: 18000 },
  ];

  const groupedData: ChartDatum[] = [
    { group: "Local 1", key: "Enero", value: 65000 },
    { group: "Local 1", key: "Febrero", value: 29123 },
    { group: "Local 2", key: "Enero", value: 32432 },
    { group: "Local 2", key: "Febrero", value: 21312 },
  ];

  const [filters, setFilters] = useState<Record<string, any>>({});

  // Esta función recibe los cambios desde el FilterBar
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    console.log("Filtros aplicados:", { ...filters, ...newFilters });
  };
  
  return (
    <div className="reporte-container">
      <Sidebar currentPath="reporte-local" />

      <div className="content">
        <h1 className="page-title">
          Visión General de <span className="highlight">Locales</span>
        </h1>

        <FilterBar onFilterChange={handleFilterChange} />
        
        <div className="chart-container">
          <div className="chart-item">
            <Gauge totalCapacity={1000} usedCapacity={720} />
          </div>
          <div className="chart-item">
            <Donut data={groupedData}/>
          </div>
          <div className="chart-item">
            <GroupedBar data={groupedData}/>
          </div>
          <div className="chart-item">
            <Lollipop data={sampleData}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteLocal;
