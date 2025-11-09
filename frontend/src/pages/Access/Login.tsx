import { AuthLayout } from "../../layouts/AuthLayout";
import FormLogin from "../../components/Access/FormLogin";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import EbentosIcon from "../../assets/ebentos-white-logo-big.png";
import LoginBackground from "../../assets/concert-blue.png";

import type { LoginCredentials } from "../../types/auth.types";
import { useAuthStore } from "../../store/useAuthStore";

import { useState } from "react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn, user } = useAuthStore();

  // Función para obtener la ruta según el rol
  const getRouteByRole = (rol: string): string => {
    const roleRoutes: Record<string, string> = {
      ADMIN: "/admin/gestionar-productora",
      CLIENTE: "/admin/gestionar-productora",
      PRODUCTORA: "/productora/gestionar-organizador",
      "GESTOR LOCAL": "/gestor_local/gestionar-local",
      "DUENHO LOCAL": "/duenholocal/home",
      TAQUILLERO: "/taquillero/home",
    };

    return roleRoutes[rol] || "/";
  };

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isLoggedIn && user) {
      const route = getRouteByRole(user.rol);
      navigate(route, { replace: true });
    }
  }, [isLoggedIn, user, navigate]);

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = async (credentials: LoginCredentials) => {
    try {
      const rol = await login(credentials);
      console.log("Rol:", rol);
      const route = getRouteByRole(rol);
      navigate(route, { replace: true });
    } catch (error: any) {
      throw new Error(error.message + " ... Inténtelo nuevamente. :(");
    }
  };

  return (
    <AuthLayout backgroundImage={LoginBackground} logo={EbentosIcon}>
      <FormLogin
        onRegisterClick={handleRegisterClick}
        onLoginClick={handleLoginClick}
      />
    </AuthLayout>
  );
};

export default Login;
