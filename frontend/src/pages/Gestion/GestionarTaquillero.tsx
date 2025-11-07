import React from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/Gestion/GestionarTaquillero.css";
import TablaAdmin from "../../components/TablaAdmin";

const GestionarTaquillero: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar currentPath="gestionar-taquillero" />
      <main className="app-main">
        <h1 className="title">Panel de Gestión de Taquilleros</h1>
        {/* <TablaAdmin tipoGestor="Taquillero"></TablaAdmin> */}
      </main>
    </div>
  );
};

export default GestionarTaquillero;
