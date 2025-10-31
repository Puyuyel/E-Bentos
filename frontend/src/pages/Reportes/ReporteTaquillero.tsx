import React from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/Reportes/ReporteTaquillero.css";

const ReporteTaquillero: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar currentPath="reporte-taquillero" />
      <main className="app-main">
        <h1 className="title">Reporte de Taquilleros</h1>
      </main>
    </div>
  );
};

export default ReporteTaquillero;
