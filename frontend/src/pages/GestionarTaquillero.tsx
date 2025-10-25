import React from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/GestionarTaquillero.css';

const GestionarTaquillero: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar currentPath="gestionar-taquillero" />
      <main className="app-main">
        <h1 className="title">Panel de Gestión de Taquilleros</h1>
      </main>
    </div>
  );
};

export default GestionarTaquillero;