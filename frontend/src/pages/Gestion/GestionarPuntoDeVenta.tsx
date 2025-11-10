import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/Gestion/GestionarPuntoDeVenta.css";
import TablaAdmin from "../../components/TablaAdmin";

const GestionarPuntoDeVenta: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}>
      <Sidebar currentPath="gestionar-punto-venta" onToggleSidebar={setSidebarOpen}/>
      <main className="app-main">
        <h1 className="title">Panel de Gestión de Puntos de Venta</h1>
        <TablaAdmin tipoGestor="PuntoVenta"></TablaAdmin>
      </main>
    </div>
  );
};

export default GestionarPuntoDeVenta;
