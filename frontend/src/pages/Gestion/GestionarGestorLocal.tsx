import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/Gestion/GestionarGestorLocal.css";
import TablaAdmin from "../../components/TablaAdmin";

const GestionarGestorLocal: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}>
      <Sidebar currentPath="gestionar-gestor-local" onToggleSidebar={setSidebarOpen}/>
      <main className="app-main">
        <h1 className="title">Panel de Gestión de Gestores Locales</h1>
        {/* <TablaAdmin tipoGestor="GestorLocal"></TablaAdmin> */}
      </main>
    </div>
  );
};

export default GestionarGestorLocal;
