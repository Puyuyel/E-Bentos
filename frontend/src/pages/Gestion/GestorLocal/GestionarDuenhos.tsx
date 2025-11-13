import React, { useState } from "react";
import "../../../styles/Gestion/GestionarGestorLocal.css";
import TablaAdmin from "../../../components/TablaAdmin";
import SidebarGestor from "../../../components/SidebarGestor";

const GestionarDuenhos: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}>
      <SidebarGestor currentPath="gestionar-duenhos-de-local" onToggleSidebar={setSidebarOpen}/>
      <main className="app-main">
        <h1 className="title">Panel de Gestión de Gestores Locales</h1>
        <TablaAdmin tipoGestor="Duenho"></TablaAdmin>
      </main>
    </div>
  );
};

export default GestionarDuenhos;