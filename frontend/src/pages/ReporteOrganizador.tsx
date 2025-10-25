import React from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/ReporteOrganizador.css';

const ReporteOrganizador: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar currentPath="reporte-organizador" />
      <main className="app-main">
        <h1 className="title">Reporte de Organizadores</h1>
      </main>
    </div>
  );
};

export default ReporteOrganizador;