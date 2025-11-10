import React, { useState } from "react";
import SidebarGestor from "../../../components/SidebarGestor";
import TablaAdmin from "../../../components/TablaAdmin";

const GestionarEvento: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}>
      <SidebarGestor currentPath="gestionar-evento" onToggleSidebar={setSidebarOpen}/>
      <main className="app-main">
        <h1 className="title">Listado de Eventos</h1>
        <TablaAdmin tipoGestor="Productora"></TablaAdmin>
      </main>
    </div>
  );
};

export default GestionarEvento;
