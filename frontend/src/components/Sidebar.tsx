import React from "react";
import {
  DocumentReportIcon,
  OfficeBuildingIcon,
  TicketIcon,
  ShoppingCartIcon,
  CalendarIcon,
  UsersIcon,
  ChartBarIcon,
  LogoutIcon,
} from "./icons";

import { Callout } from "@carbon/react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

import { useState } from "react";
import { logoutService } from "../services/logoutService";
import { useAuthStore } from "../store/useAuthStore"; // AÑADIR ESTA IMPORTACIÓN

const LLAMADA_EXITOSA = 200;

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  route?: string;
  onClick?: () => void;
  disabled?: boolean; // AÑADIR ESTA PROP
}

type NavEntry = {
  icon: React.ReactNode;
  label: string;
  route: string;
};

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  active = false,
  onClick,
  disabled = false,
}) => {
  return (
    <a
      onClick={disabled ? undefined : onClick}
      className={`nav-item ${active ? "nav-item-active" : ""} ${
        disabled ? "nav-item-disabled" : ""
      }`}
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
    >
      {icon}
      <span className="nav-label">{label}</span>
    </a>
  );
};

interface SidebarProps {
  currentPath?: string;
  onToggleSidebar?: (open: boolean) => void;
}


const Sidebar: React.FC<SidebarProps> = ({ currentPath = "" , onToggleSidebar})  => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    onToggleSidebar?.(newState); // Notifica al padre
  };

  const handleCerrarSessionClick = async () => {
    try {
      setLoading(true);
      const llamadaAPI = await logoutService();

      if (llamadaAPI === LLAMADA_EXITOSA) {
        setShowSuccess(true);

        // Esperar 1 segundo antes de limpiar y redirigir
        setTimeout(() => {
          logout();
        }, 1000);
      }
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error);
      // Si falla, redirigir
      logout();
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (route?: string) => {
    if (route) navigate(`/admin/${route}`);
  };
  const manageItems: NavEntry[] = [
    {
      icon: <DocumentReportIcon />,
      label: "Productoras",
      route: "gestionar-productora",
    },
    {
      icon: <OfficeBuildingIcon />,
      label: "Gestores de locales",
      route: "gestionar-gestor-local",
    },
    {
      icon: <TicketIcon />,
      label: "Taquilleros",
      route: "gestionar-taquillero",
    },
    {
      icon: <ShoppingCartIcon />,
      label: "Puntos de venta",
      route: "gestionar-punto-venta",
    },
  ];

  const reportItems: NavEntry[] = [
    { icon: <CalendarIcon />, label: "Eventos", route: "reporte-evento" },
    { icon: <OfficeBuildingIcon />, label: "Locales", route: "reporte-local" },
    { icon: <UsersIcon />, label: "Clientes", route: "reporte-cliente" },
    {
      icon: <DocumentReportIcon />,
      label: "Productoras",
      route: "reporte-productora",
    },
    {
      icon: <ChartBarIcon />,
      label: "Organizadores",
      route: "reporte-organizador",
    },
    { icon: <TicketIcon />, label: "Taquilleros", route: "reporte-taquillero" },
  ];

  return (
    <>
      <button className="hamburger-button" onClick={toggleSidebar}>
        ☰
      </button>
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="logo-container">
          <img
            src={`${imageBaseUrl}/ebentos-logo-morado.png`}
            alt="e-Bentos Logo"
            className="logo"
          />
          <span className="logo-text">e-Bentos</span>
        </div>

        <nav className="sidebar-nav">
          <div>
            <h3 className="nav-section-title">Gestionar</h3>
            <div className="nav-group">
              {manageItems.map((item, index) => (
                <NavItem
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  active={currentPath === item.route}
                  onClick={() => handleNavigate(item.route)}
                />
              ))}
            </div>
          </div>
          <div>
            <h3 className="nav-section-title">Reportes</h3>
            <div className="nav-group">
              {reportItems.map((item, index) => (
                <NavItem
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  active={currentPath === item.route}
                  onClick={() => handleNavigate(item.route)}
                />
              ))}
            </div>
          </div>
        </nav>

        <div className="logout-container">
          <NavItem
            icon={<LogoutIcon />}
            label="Cerrar sesión"
            onClick={handleCerrarSessionClick}
            disabled={loading}
          />
        </div>
        {showSuccess && (
          <Callout
            kind="success"
            statusIconDescription="notification"
            title="¡Sesión cerrada exitosamente!"
            subtitle="Redirigiendo..."
          />
        )}
      </aside>
    </>
  );
};

export default Sidebar;
