import React, {useState} from 'react';
import Sidebar from '../components/Sidebar';
import FilterBar from '../components/FilterBar'; 
import '../styles/Reporte.css';

const ReporteEvento: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  
  // Esta función recibe los cambios desde el FilterBar
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    console.log("Filtros aplicados:", { ...filters, ...newFilters });
  };
  
  return (
    <div className="reporte-local-container">
      <Sidebar currentPath="reporte-local" />

      <div className="content">
        <h1 className="page-title">
          Visión General de <span className="highlight">Eventos</span>
        </h1>
        <FilterBar onFilterChange={handleFilterChange} />
      </div>
    </div>
  );
};

export default ReporteEvento;