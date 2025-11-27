import React from "react";
import SidebarGestor from "../../../components/SidebarGestor.tsx";
import TablaSolicitudes from "../../../components/Solicitudes/TablaSolicitudes.tsx";
import "../../../styles/Gestion/GestionarGestorLocal.css";

const GestionarSolicitudes: React.FC = () => {
  return (
    <div className="app-container">
      <SidebarGestor currentPath="gestionar-solicitud" />
      <main className="app-main">
        <h1 className="title">Panel de Gestión de Solicitudes</h1>
        <TablaSolicitudes />
      </main>
    </div>
  );
};

export default GestionarSolicitudes;