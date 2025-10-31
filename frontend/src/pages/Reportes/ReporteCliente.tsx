import React from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/Reportes/ReporteCliente.css";

const ReporteCliente: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar currentPath="reporte-cliente" />
      <main className="app-main">
        <h1 className="title">Reporte de Clientes</h1>
      </main>
    </div>
  );
};

export default ReporteCliente;
