import React from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/Gestion/GestionarProductora.css";
import TablaAdmin from "../../components/TablaAdmin";

const GestionarProductora: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar currentPath="gestionar-productora" />
      <main className="app-main">
        <h1 className="title">Panel de Gestión de Productoras</h1>
        <TablaAdmin tipoGestor="Productora"></TablaAdmin>
      </main>
    </div>
  );
};

export default GestionarProductora;
