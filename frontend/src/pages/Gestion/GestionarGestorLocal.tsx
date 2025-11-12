import React from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/Gestion/GestionarGestorLocal.css";
import TablaAdmin from "../../components/TablaAdmin";

const GestionarGestorLocal: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar currentPath="gestionar-gestor-local" />
      <main className="app-main">
        <h1 className="title">Panel de Gestión de Gestores Locales</h1>
        <TablaAdmin tipoGestor="GestorLocal"></TablaAdmin>
      </main>
    </div>
  );
};

export default GestionarGestorLocal;
