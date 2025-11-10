import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/Reportes/ReporteTaquillero.css";

const ReporteTaquillero: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}>
      <Sidebar currentPath="reporte-taquillero" onToggleSidebar={setSidebarOpen}/>
      <main className="app-main">
        <h1 className="title">Reporte de Taquilleros</h1>
      </main>
    </div>
  );
};

export default ReporteTaquillero;
