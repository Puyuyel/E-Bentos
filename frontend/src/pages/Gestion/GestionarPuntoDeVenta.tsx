import React from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/Gestion/GestionarPuntoDeVenta.css";
import TablaAdmin from "../../components/TablaAdmin";

const GestionarPuntoDeVenta: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar currentPath="gestionar-punto-venta" />
      <main className="app-main">
        <h1 className="title">Panel de Gestión de Puntos de Venta</h1>
        <TablaAdmin tipoGestor="PuntoVenta"></TablaAdmin>
      </main>
    </div>
  );
};

export default GestionarPuntoDeVenta;
