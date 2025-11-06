import React from "react";
import {
  UsersIcon,
  LogoutIcon,
  UserCircleIcon,
  GoalIcon,
} from "./icons";

import { Callout } from "@carbon/react";
import { useNavigate } from "react-router-dom";
import "../styles/SidebarGestor.css";

import { useState } from "react";
import { logoutService } from "../services/logoutService";
import { useAuthStore } from "../store/useAuthStore";

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
  const { user } = useAuthStore();
  const rol = user?.rol.toString().toLowerCase();
  const rolCapitalized = rol
    ? rol.charAt(0).toUpperCase() + rol.slice(1)
    : "Desconocido";

  const handleCerrarSessionClick = async () => {
    try {
      setLoading(true);
      const llamadaAPI = await logoutService();
      if (llamadaAPI === LLAMADA_EXITOSA) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 1000); // 1000 ms = 1 segundo
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (route?: string) => {
    if (route) navigate(`/${rol}/${route}`);
  };
  const manageItems: NavEntry[] = [
    {
      icon: <UsersIcon />,
      label: "Organizadores",
      route: "gestionar-organizador",
    },
    {
      icon: <GoalIcon />,
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
          <h3 className="nav-section-title">CUENTA</h3>
          <div className="cuenta-container">
            <div className="cuenta-content">
              <UserCircleIcon className="cuenta-avatar" />
              <div>
                <p className="cuenta-nombre">José Reyes Chávez</p>
                <p className="cuenta-rol">{rolCapitalized}</p>
              </div>
            </div>
          </div>
        </div>
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
