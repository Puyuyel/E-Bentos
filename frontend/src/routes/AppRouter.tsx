import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Login from "../pages/Access/Login";
import Register from "../pages/Access/Register";
import ForgetPass from "../pages/Access/ForgetPass";
import CodigoVerificacion from "../pages/Access/CodigoVerificacion";
import NewPassword from "../pages/Access/NewPassword";
import GestionarGestorLocal from "../pages/Gestion/GestionarGestorLocal";
import GestionarLocales from "../pages/Gestion/GestorLocal/GestionarLocales";
import VenueCRUD from "../pages/Gestion/GestorLocal/VenueCRUD";
import GestionarProductora from "../pages/Gestion/GestionarProductora";
import GestionarPuntoDeVenta from "../pages/Gestion/GestionarPuntoDeVenta";
import GestionarTaquillero from "../pages/Gestion/GestionarTaquillero";
import GestionarDuenhoLocal from "../pages/Gestion/DuenhoLocal/GestionarDuenhoLocal";
import VerDetalleEvento from "../pages/Cliente/VerDetalleEvento";
import ComprarEvento from "../pages/Cliente/ComprarEvento";
import ReporteCliente from "../pages/Reportes/ReporteCliente";
import ReporteEvento from "../pages/Reportes/ReporteEvento";
import ReporteLocal from "../pages/Reportes/ReporteLocal";
import ReporteOrganizador from "../pages/Reportes/ReporteOrganizador";
import ReporteProductora from "../pages/Reportes/ReporteProductora";
import ReporteTaquillero from "../pages/Reportes/ReporteTaquillero";
import GestionarEvento from "../pages/Gestion/GestionEvento/GestionarEvento";
import EventoCRUD from "../pages/Gestion/GestionEvento/EventoCRUD";

import { ProtectedRoute } from "./ProtectedRoute";
import GestionarOrganizador from "../pages/GestionProductora/GestionarOrganizadores";
import Metas from "../pages/GestionProductora/Metas";
import MainEbentos from "../components/Cliente/MainEbentos";
import GestionarDuenhos from "../pages/Gestion/GestorLocal/GestionarDuenhos";
import GestionarSolicitudes from "../pages/Gestion/DuenhoLocal/GestionarSolicitudes";
import MisEntradas from "../pages/Cliente/MisEntradas";
import MiPerfil from "../pages/Cliente/MiPerfil";

const AppRouter: React.FC = () => {
  const { isLoggedIn, user } = useAuthStore();

  // Función para obtener la ruta según el rol
  const getRouteByRole = (rol: string): string => {
    const roleRoutes: Record<string, string> = {
      ADMIN: "/admin/gestionar-productora",
      CLIENTE: "/home",
      PRODUCTORA: "/productora/gestionar-organizador",
      ORGANIZADOR_EVENTOS: "/organizador/eventos",
      GESTOR_LOCAL: "/gestor_local/gestionar-local",
      DUENHO_LOCAL: "/duenho_local/gestionar-local",
      TAQUILLERO: "/home",
    };
    return roleRoutes[rol] || "/home";
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        {/* Rutas /login */}
        <Route path="/login" element={<Login />} />
        {/* Ruta /register */}
        <Route path="/register" element={<Register />} />
        {/* Ruta /forgetpass */}
        <Route path="/forgetpass" element={<ForgetPass />} />
        {/* Ruta /codigo_verificacion */}
        <Route path="/codigo_verificacion" element={<CodigoVerificacion />} />
        {/* Ruta /newpass */}
        <Route path="/newpass" element={<NewPassword />} />

        {/* Ruta raíz - redirige según autenticación y rol */}
        <Route
          path="/"
          element={
            isLoggedIn && user ? (
              <Navigate to={getRouteByRole(user.rol)} replace />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        {/* Ruta /home */}
        <Route path="/home" element={<MainEbentos />} />
        {/* RUTAS PROTEGIDAS */}
        {/* Ruta /gestionar gestor local */}
        <Route
          path="/admin/gestionar-gestor-local"
          element={
            <ProtectedRoute requiredRole="ADMIN">
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
        {/* Ruta /gestionar organizador */}
        <Route
          path="/productora/gestionar-organizador"
          element={
            <ProtectedRoute requiredRole="PRODUCTORA">
              <GestionarOrganizador />
            </ProtectedRoute>
          }
        />
        {/* Ruta /mostrar metas*/}
        <Route
          path="/productora/metas"
          element={
            <ProtectedRoute requiredRole="PRODUCTORA">
              <Metas />
            </ProtectedRoute>
          }
        />
        {/* RUTAS para GESTOR DE LOCAL */}
        {/* Ruta /listado duenhos*/}
        <Route
          path="/gestor_local/gestionar-duenhos-de-local"
          element={
            <ProtectedRoute requiredRole="GESTOR_LOCAL">
              <GestionarDuenhos />
            </ProtectedRoute>
          }
        />
        {/* Ruta /listado locales*/}
        <Route
          path="/gestor_local/gestionar-local"
          element={
            <ProtectedRoute requiredRole="GESTOR_LOCAL">
              <GestionarLocales />
            </ProtectedRoute>
          }
        />
        {/* Ruta /registro locales*/}
        <Route
          path="/gestor_local/registrar-local"
          element={
            <ProtectedRoute requiredRole="GESTOR_LOCAL">
              <VenueCRUD />
            </ProtectedRoute>
          }
        />
        {/* RUTAS para DUEÑO DE LOCAL */}
        {/* Ruta /listado locales*/}
        <Route
          path="/duenho_local/gestionar-solicitud"
          element={
            <ProtectedRoute requiredRole="DUENHO_LOCAL">
              <GestionarSolicitudes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/duenho_local/gestionar-local"
          element={
            <ProtectedRoute requiredRole="DUENHO_LOCAL">
              <GestionarDuenhoLocal />
            </ProtectedRoute>
          }
        />
        {/* RUTAS para ORGANIZADOR DE EVENTOS */}
        {/* Ruta /gestionar eventos*/}
        <Route
          path="/organizador/eventos"
          element={
            <ProtectedRoute requiredRole="ORGANIZADOR_EVENTOS">
              <GestionarEvento />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizador/eventos/crear"
          element={
            <ProtectedRoute requiredRole="ORGANIZADOR_EVENTOS">
              <EventoCRUD modo="crear" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizador/eventos/editar/:eventoId"
          element={
            <ProtectedRoute requiredRole="ORGANIZADOR_EVENTOS">
              <EventoCRUD modo="editar" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizador/eventos/ver/:eventoId"
          element={
            <ProtectedRoute requiredRole="ORGANIZADOR_EVENTOS">
              <EventoCRUD modo="visualizar" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizador/eventos/crear"
          element={
            <ProtectedRoute requiredRole="ORGANIZADOR_EVENTOS">
              <EventoCRUD modo="crear" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizador/eventos/editar/:eventoId"
          element={
            <ProtectedRoute requiredRole="ORGANIZADOR_EVENTOS">
              <EventoCRUD modo="editar" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizador/eventos/ver/:eventoId"
          element={
            <ProtectedRoute requiredRole="ORGANIZADOR_EVENTOS">
              <EventoCRUD modo="visualizar" />
            </ProtectedRoute>
          }
        />
        {/* RUTAS para CLIENTE */}
        {/* Ruta /ver detalle evento*/}
        <Route
          path={`/cliente/ver-detalle-evento/:eventoId`}
          element={<VerDetalleEvento />}
        />

        {/* Ruta /comprar entrada evento*/}
        <Route
          path={`/cliente/comprar-entradas-evento/:eventoId`}
          element={
            <ProtectedRoute requiredRole="CLIENTE">
              <ComprarEvento />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute requiredRole="CLIENTE">
              <MiPerfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mis-entradas"
          element={
            <ProtectedRoute requiredRole="CLIENTE">
              <MisEntradas />
            </ProtectedRoute>
          }
        />

        {/* Redirige cualquier ruta desconocida según rol o a /home */}
        <Route
          path="*"
          element={
            isLoggedIn && user ? (
              <Navigate to={getRouteByRole(user.rol)} replace />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
