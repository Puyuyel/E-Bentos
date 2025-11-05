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
import "../styles/SidebarGestor.css";

import { useState } from "react";
import { logoutService } from "../services/logoutService";

const LLAMADA_EXITOSA = 200;

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  route?: string;
  onClick?: () => void;
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
}) => {
  return (
    <a
      onClick={onClick}
      className={`nav-item ${active ? "nav-item-active" : ""}`}
      style={{ cursor: "pointer" }}
    >
      {icon}
      <span className="nav-label">{label}</span>
    </a>
  );
};

interface SidebarProps {
  currentPath?: string;
}

const SidebarGestor: React.FC<SidebarProps> = ({ currentPath = "" }) => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCerrarSessionClick = async () => {
    try {
      setLoading(true);
      const llamadaAPI = await logoutService();
      if (llamadaAPI === LLAMADA_EXITOSA) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000); // 1000 ms = 1 segundo
      }
    } catch (error: any) {
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
      label: "Organizadores",
      route: "gestionar-organizador",
    },
    {
      icon: <TicketIcon />,
      label: "Metas",
      route: "metas",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <img
          src="/images/ebentos-logo-morado.png"
          alt="e-Bentos Logo"
          className="logo"
        />
        <span className="logo-text">e-Bentos</span>
      </div>

      <nav className="sidebar-nav">
        <div>
          <h3 className="nav-section-title">HERRAMIENTAS</h3>
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
          title="¡Session cerrada exitosamente!"
          subtitle="Redirigiendo ..."
        />
      )}
    </aside>
  );
};

export default SidebarGestor;
