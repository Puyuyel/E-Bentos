import React from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/Reportes/ReporteProductora.css";

const ReporteProductora: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar currentPath="reporte-productora" />
      <main className="app-main">
        <h1 className="title">Reporte de Productoras</h1>
      </main>
    </div>
  );
};

export default ReporteProductora;
