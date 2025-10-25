import React from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/GestionarProductora.css';

const GestionarProductora: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar currentPath="gestionar-productora" />
      <main className="app-main">
        <h1 className="title">Panel de Gestión de Productoras</h1>
      </main>
    </div>
  );
};

export default GestionarProductora;
