import React, { useEffect, useState } from "react";
import GestionarProductora from './pages/GestionarProductora';
import GestionarGestorLocal from './pages/GestionarGestorLocal';
import GestionarTaquillero from './pages/GestionarTaquillero';
import GestionarPuntoDeVenta from './pages/GestionarPuntoDeVenta';
import ReporteEvento from './pages/ReporteEvento';
import ReporteLocal from './pages/ReporteLocal';
import ReporteCliente from './pages/ReporteCliente';
import ReporteProductora from './pages/ReporteProductora';
import ReporteOrganizador from './pages/ReporteOrganizador';
import ReporteTaquillero from './pages/ReporteTaquillero';

const App: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  useEffect((): void => {
    fetch("/api/hello")
      .then((res: Response): Promise<{ message: string; status: boolean }> => res.json())
      .then((data: { message: string; status: boolean }): void => setMessage(data.message))
      .catch((err: Error): void => console.error(err));
  }, []);

  const [route, setRoute] = useState<string>(() => window.location.hash.replace('#/', '') || '');

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace('#/', ''));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Rutas de gestión
  if (route === 'gestionar-productora') {
    return <GestionarProductora />;
  }
  if (route === 'gestionar-gestor-local') {
    return <GestionarGestorLocal />;
  }
  if (route === 'gestionar-taquillero') {
    return <GestionarTaquillero />;
  }
  if (route === 'gestionar-punto-venta') {
    return <GestionarPuntoDeVenta />;
  }

  // Rutas de reportes
  if (route === 'reporte-evento') {
    return <ReporteEvento />;
  }
  if (route === 'reporte-local') {
    return <ReporteLocal />;
  }
  if (route === 'reporte-cliente') {
    return <ReporteCliente />;
  }
  if (route === 'reporte-productora') {
    return <ReporteProductora />;
  }
  if (route === 'reporte-organizador') {
    return <ReporteOrganizador />;
  }
  if (route === 'reporte-taquillero') {
    return <ReporteTaquillero />;
  }

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <div style={{
        textAlign: "center"
      }}>
        <h1>React + Spring Boot</h1>
        <p>{message || "Cargando..."}</p>
        <div style={{ marginTop: 20 }}>
          <button
            type="button"
            onClick={() => { window.location.hash = '#/gestionar-productora'; }}
            style={{
              padding: '10px 18px',
              fontSize: 16,
              borderRadius: 6,
              cursor: 'pointer',
              border: '1px solid #0b5cff',
              background: '#0b5cff',
              color: 'white'
            }}
          >
            Ir al panel de administrador
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
