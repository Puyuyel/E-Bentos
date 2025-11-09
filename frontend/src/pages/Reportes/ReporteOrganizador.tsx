import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/Reportes/ReporteOrganizador.css";

const ReporteOrganizador: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}>
      <Sidebar currentPath="reporte-organizador" onToggleSidebar={setSidebarOpen}/>
      <main className="app-main">
        <h1 className="title">Reporte de Organizadores</h1>
      </main>
    </div>
  );
};

export default ReporteOrganizador;
