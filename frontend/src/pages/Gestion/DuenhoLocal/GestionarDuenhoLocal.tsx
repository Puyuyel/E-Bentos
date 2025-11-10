import React from "react";
import SidebarGestor from "../../../components/SidebarGestor.tsx";
import "../../../styles/Gestion/GestionarGestorLocal.css";
import VenueListDuenhoLocal from "./VenueListDuenhoLocal.tsx";

const GestionarGestorLocal: React.FC = () => {
  return (
    <div className="app-container">
      <SidebarGestor currentPath="gestionar-local" />
      <main className="app-main">
        <h1 className="title">Panel de Gestión de Locales</h1>
        <VenueListDuenhoLocal />
      </main>
    </div>
  );
};

export default GestionarGestorLocal;
