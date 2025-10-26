import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login"; // tu componente Login
import Register from "../pages/Register"; // tu componente Login
import GestionarGestorLocal from "../pages/GestionarGestorLocal";
import GestionarProductora from "../pages/GestionarProductora";
import GestionarPuntoDeVenta from "../pages/GestionarPuntoDeVenta";
import GestionarTaquillero from "../pages/GestionarTaquillero";
import ReporteCliente from "../pages/ReporteCliente";
import ReporteEvento from "../pages/ReporteEvento";
import ReporteLocal from "../pages/ReporteLocal";
import ReporteOrganizador from "../pages/ReporteOrganizador";
import ReporteProductora from "../pages/ReporteProductora";
import ReporteTaquillero from "../pages/ReporteTaquillero";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta /login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta /register */}
        <Route path="/register" element={<Register/>} />

        {/* Ruta /gestionar gestor local */}
        <Route path="/admin/gestionar-gestor-local" element={<GestionarGestorLocal/>} />

        {/* Ruta /gestionar productora */}
        <Route path="/admin/gestionar-productora" element={<GestionarProductora/>} />

        {/* Ruta /gestionar punto de venta */}
        <Route path="/admin/gestionar-punto-venta" element={<GestionarPuntoDeVenta/>} />

        {/* Ruta /gestionar taquillero */}
        <Route path="/admin/gestionar-taquillero" element={<GestionarTaquillero/>} />

        {/* Ruta /gestionar reporte cliente */}
        <Route path="/admin/reporte-cliente" element={<ReporteCliente/>} />

        {/* Ruta /gestionar reporte evento */}
        <Route path="/admin/reporte-evento" element={<ReporteEvento/>} />

        {/* Ruta /gestionar reporte local */}
        <Route path="/admin/reporte-local" element={<ReporteLocal/>} />

        {/* Ruta /gestionar reporte cliente */}
        <Route path="/admin/reporte-organizador" element={<ReporteOrganizador/>} />

        {/* Ruta /gestionar reporte cliente */}
        <Route path="/admin/reporte-productora" element={<ReporteProductora/>} />

        {/* Ruta /gestionar reporte cliente */}
        <Route path="/admin/reporte-taquillero" element={<ReporteTaquillero/>} />

        {/* Redirige cualquier ruta desconocida a /login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;