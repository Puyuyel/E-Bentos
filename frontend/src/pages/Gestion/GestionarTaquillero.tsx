import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/Gestion/GestionarTaquillero.css";
import TablaAdmin from "../../components/TablaAdmin";

const GestionarTaquillero: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}>
      <Sidebar currentPath="gestionar-taquillero" onToggleSidebar={setSidebarOpen}/>
      <main className="app-main">
        <h1 className="title">Panel de Gestión de Taquilleros</h1>
        {/* <TablaAdmin tipoGestor="Taquillero"></TablaAdmin> */}
      </main>
    </div>
  );
};

export default GestionarTaquillero;
