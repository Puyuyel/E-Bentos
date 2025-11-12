import React, {useState} from 'react';
import Sidebar from '../../components/Sidebar';
import FilterBar from '../../components/FilterBar'; 
import '../../styles/Reportes/Reporte.css';
import '../../styles/Reportes/ReporteEvento.css';

const ReporteEvento: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Esta función recibe los cambios desde el FilterBar
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    console.log("Filtros aplicados:", { ...filters, ...newFilters });
  };
  
  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}>
      <Sidebar currentPath="reporte-evento" onToggleSidebar={setSidebarOpen}/>

      <main className="app-main">
        <h1 className="title">
          Visión General de <span className="highlight">Eventos</span>
        </h1>
        <FilterBar onFilterChange={handleFilterChange} />
      </main>
    </div>
  );
};

export default ReporteEvento;
