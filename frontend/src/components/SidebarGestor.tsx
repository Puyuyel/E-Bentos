import React, { useEffect } from "react";
import {
  UsersIcon,
  LogoutIcon,
  UserCircleIcon,
  GoalIcon,
  TicketIcon,
  CalendarIcon,
  OfficeBuildingIcon,
  ClipboardIcon,
  DocumentReportIcon,
} from "./icons";

import { Callout } from "@carbon/react";
import { useNavigate } from "react-router-dom";
import "../styles/SidebarGestor.css";

import { useState } from "react";
import { logoutService } from "../services/logoutService";
import { useAuthStore } from "../store/useAuthStore";
import { useGetGestor, useGetProductora } from "../services/dataService";

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
  onToggleSidebar?: (open: boolean) => void;
}

const SidebarGestor: React.FC<SidebarProps> = ({
  currentPath = "",
  onToggleSidebar,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, displayName, setDisplayName } = useAuthStore();
  const rol = user?.rol.toString().toLowerCase();
  let rolCapitalized = rol
    ? rol.charAt(0).toUpperCase() + rol.slice(1)
    : "Desconocido";

  if (rolCapitalized === "Duenho_local") {
    rolCapitalized = "Dueño_local";
  }

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    onToggleSidebar?.(newState); // Notifica al padre
  };

  useEffect(() => {
    const fetchProfileName = async () => {
      // Si no hay usuario o rol, no hagas nada
      if (!user?.id || !rol) {
        return;
      }

      // Si el nombre YA está en el store, ¡no hagas nada!
      if (displayName) {
        return;
      }

      try {
        // --- AQUÍ VA TU LÓGICA DE ROLES ---
        let fetchedName: string | null = null;

        switch (rol) {
          case "productora":
            const dataProductora = await useGetProductora(user.id);
            fetchedName = dataProductora.response.nombreComercial;
            break;

          case "gestor_local":
          case "duenho_local":
          case "organizador_eventos":
            const dataGestor = await useGetGestor(user.id);
            console.log("dataGestor: ", dataGestor);
            fetchedName =
              dataGestor.response.nombres + " " + dataGestor.response.apellidos;
            break;

          default:
            fetchedName = "Desconocido"; // O un valor por defecto
        }

        if (fetchedName) {
          setDisplayName(fetchedName); // <-- ¡GUARDAR EN EL STORE GLOBAL!
        }
      } catch (err: any) {
        console.error("Error al cargar el nombre del perfil:", err);
      }
    };

    fetchProfileName();

    // Depende del 'user.id' y 'displayName'
  }, [user?.id, rol, displayName, setDisplayName]);

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
    setSidebarOpen(false);
  };

  const getManageItemsByRol = (rol: string): NavEntry[] => {
    switch (rol) {
      case "productora":
        return [
          {
            icon: <UsersIcon />,
            label: "Organizadores",
            route: "gestionar-organizador",
          },
          { icon: <GoalIcon />, label: "Metas", route: "metas" },
        ];

      case "gestor_local":
        return [
          {
            icon: <UsersIcon />,
            label: "Dueños de local",
            route: "gestionar-duenhos-de-local",
          },
          {
            icon: <OfficeBuildingIcon />,
            label: "Locales",
            route: "gestionar-local",
          },
          {
            icon: <DocumentReportIcon />,
            label: "Registro de locales",
            route: "registrar-local",
          },
        ];

      case "duenho_local":
        return [
          {
            icon: <OfficeBuildingIcon />,
            label: "Locales",
            route: "gestionar-local",
          },
          {
            icon: <ClipboardIcon />,
            label: "Solicitudes",
            route: "gestionar-solicitudes",
          },
        ];

      case "organizador_eventos":
        return [
          {
            icon: <CalendarIcon />,
            label: "Eventos",
            route: "gestionar-evento",
          },
          {
            icon: <TicketIcon />,
            label: "Promociones",
            route: "gestionar-promocion",
          },
        ];

      default:
        return [];
    }
  };

  const manageItems: NavEntry[] = getManageItemsByRol(rol || "");

  return (
    <>
      {/* Botón hamburguesa visible solo en móvil */}
      <button className="hamburger-button" onClick={toggleSidebar}>
        ☰
      </button>
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
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
                  <p className="cuenta-nombre">
                    {displayName || "Cargando..."}
                  </p>
                  <p className="cuenta-rol">
                    {rolCapitalized || "Cargando..."}
                  </p>
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
    </>
  );
};

export default SidebarGestor;
