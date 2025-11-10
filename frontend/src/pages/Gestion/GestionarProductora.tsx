import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/Gestion/GestionarProductora.css";
import TablaAdmin from "../../components/TablaAdmin";

const GestionarProductora: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}>
      <Sidebar currentPath="gestionar-productora" onToggleSidebar={setSidebarOpen}/>
      <main className="app-main">
        <h1 className="title">Panel de Gestión de Productoras</h1>
        <TablaAdmin tipoGestor="Productora"></TablaAdmin>
      </main>
    </div>
  );
};

export default GestionarProductora;
