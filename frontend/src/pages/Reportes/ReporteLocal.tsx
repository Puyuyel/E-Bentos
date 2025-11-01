import React from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/Reportes/ReporteLocal.css";

const ReporteLocal: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar currentPath="reporte-local" />
      <main className="app-main">
        <h1 className="title">Reporte de Locales</h1>
      </main>
    </div>
  );
};

export default ReporteLocal;
