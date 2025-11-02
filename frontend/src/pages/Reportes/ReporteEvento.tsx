import React, {useState} from 'react';
import Sidebar from '../../components/Sidebar';
import FilterBar from '../../components/FilterBar'; 
import '../../styles/Reportes/Reporte.css';

const ReporteEvento: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar currentPath="reporte-evento" />
      <main className="app-main">
        <h1 className="title">Reporte de Eventos</h1>
      </main>
    </div>
  );
};

export default ReporteEvento;
