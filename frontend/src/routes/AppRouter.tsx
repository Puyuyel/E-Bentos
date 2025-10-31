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

import { ProtectedRoute } from "./ProtectedRoute"; // importa tu wrapper

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        {/* Rutas /login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta /register */}
        <Route path="/register" element={<Register />} />

        {/* RUTAS PROTEGIDAS */}
        {/* Ruta /gestionar gestor local */}
        <Route
          path="/admin/gestionar-gestor-local"
          element={
            <ProtectedRoute>
              <GestionarGestorLocal />
            </ProtectedRoute>
          }
        />

        {/* Ruta /gestionar productora */}
        <Route
          path="/admin/gestionar-productora"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <GestionarProductora />
            </ProtectedRoute>
          }
        />

        {/* Ruta /gestionar punto de venta */}
        <Route
          path="/admin/gestionar-punto-venta"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <GestionarPuntoDeVenta />
            </ProtectedRoute>
          }
        />

        {/* Ruta /gestionar taquillero */}
        <Route
          path="/admin/gestionar-taquillero"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <GestionarTaquillero />
            </ProtectedRoute>
          }
        />

        {/* Ruta /gestionar reporte cliente */}
        <Route
          path="/admin/reporte-cliente"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <ReporteCliente />
            </ProtectedRoute>
          }
        />

        {/* Ruta /gestionar reporte evento */}
        <Route
          path="/admin/reporte-evento"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <ReporteEvento />
            </ProtectedRoute>
          }
        />

        {/* Ruta /gestionar reporte local */}
        <Route
          path="/admin/reporte-local"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <ReporteLocal />
            </ProtectedRoute>
          }
        />

        {/* Ruta /gestionar reporte cliente */}
        <Route
          path="/admin/reporte-organizador"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <ReporteOrganizador />
            </ProtectedRoute>
          }
        />

        {/* Ruta /gestionar reporte cliente */}
        <Route
          path="/admin/reporte-productora"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <ReporteProductora />
            </ProtectedRoute>
          }
        />

        {/* Ruta /gestionar reporte cliente */}
        <Route
          path="/admin/reporte-taquillero"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <ReporteTaquillero />
            </ProtectedRoute>
          }
        />

        {/* Ruta /reportes */}
        <Route path="/reporte-local" element={<ReporteLocal />} />

        <Route path="/reporte-evento" element={<ReporteEvento />} />

        {/* Redirige cualquier ruta desconocida a /login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
