import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/Reportes/ReporteProductora.css";

const ReporteProductora: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}>
      <Sidebar currentPath="reporte-productora" onToggleSidebar={setSidebarOpen}/>
      <main className="app-main">
        <h1 className="title">Reporte de Productoras</h1>
      </main>
    </div>
  );
};

export default ReporteProductora;
