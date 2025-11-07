import React, { useState } from "react";
import SidebarGestor from "../../components/SidebarGestor";
import "../../styles/GestionProductora/GestionarOrganizadores.css";

const GestionarOrganizador: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}>
      <SidebarGestor currentPath="gestionar-organizador" onToggleSidebar={setSidebarOpen}/>
      <main className="app-main">
        <h1 className="title">Panel de Gestión de Organizadores</h1>
      </main>
    </div>
  );
};

export default GestionarOrganizador;
