import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/Reportes/ReporteCliente.css";

const ReporteCliente: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}>
      <Sidebar currentPath="reporte-cliente" onToggleSidebar={setSidebarOpen}/>
      <main className="app-main">
        <h1 className="title">Reporte de Clientes</h1>
      </main>
    </div>
  );
};

export default ReporteCliente;
