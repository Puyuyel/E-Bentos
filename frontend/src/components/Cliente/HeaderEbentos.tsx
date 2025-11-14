import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/ebentos-white-logo.png";
import "../../styles/Cliente/HeaderEbentos.css";
import { HeaderName, Search } from "@carbon/react";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon } from "../icons";
// Ajusta la importación según donde tengas el store
import { useAuthStore } from "../../store/useAuthStore";
import { useEventos } from "../../store/useEventos";

const Header: React.FC = () => {
  const navigate = useNavigate();
  // Ajusta según la API de tu useAuthStore (puede ser { user, logout } o hooks independientes)
  const { user, logout } = useAuthStore();
  const setSearchTerm = useEventos((s) => s.setSearchTerm);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const esRutaHome = window.location.pathname === "/home";

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const goTo = (path: string) => {
    setOpen(false);
    // si no usas react-router, reemplaza por window.location.href = path
    navigate(path);
  };

  const handleLogout = async () => {
    setOpen(false);
    if (logout) {
      await logout();
    } else {
      // fallback: elimina cookie/localStorage y recarga
      // document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.reload();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };


  return (
    <header className="header-total">
      <div className="header-container">
        <div className={`${esRutaHome ? "header-content" : "search-hidden"}`}>
          <img src={logo} alt="e-Bentos logo" className="header-logo" />
          <div className="logo-text">e-Bentos</div>
        </div>

        {/* --- SECCIÓN CENTRAL (BUSCADOR) --- */}
        <div className="header-search">
          <Search
            labelText="Buscar"
            placeholder="Buscar eventos, artistas o lugares..."
            size="lg"
            onChange={handleSearchChange}
          />
        </div>

        <nav className="nav">
          {!user ? (
            <>
              <a href="/login" className="nav-link">
                Ingresar
              </a>
              <a href="/register" className="nav-button">
                Registrarse
              </a>
            </>
          ) : (
            <div
              className="user-menu"
              ref={menuRef}
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              <button
                className="user-button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={open}
                title={user.name || "Usuario"}
              >
                {/* avatar: UsersIcon (svg) */}
                <UserCircleIcon className="user-initials" />
              </button>

              {open && (
                <div className="user-dropdown" role="menu">
                  <button className="user-item" onClick={() => goTo("/perfil")}>
                    Mi perfil
                  </button>
                  <button
                    className="user-item"
                    onClick={() => goTo("/mis-entradas")}
                  >
                    Mis entradas
                  </button>
                  <button
                    className="user-item"
                    onClick={() => goTo("/mis-puntos")}
                  >
                    Mis puntos
                  </button>
                  <div className="dropdown-separator" />
                  <button className="user-item logout" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
