import React from "react";
import SidebarGestor from "../../components/SidebarGestor";
import "../../styles/GestionProductora/GestionarOrganizadores.css";

const GestionarOrganizador: React.FC = () => {
  return (
    <div className="app-container">
      <SidebarGestor currentPath="gestionar-organizadores" />
      <main className="app-main">
        <h1 className="title">Panel de Gestión de Organizadores</h1>
      </main>
    </div>
  );
};

export default GestionarOrganizador;
