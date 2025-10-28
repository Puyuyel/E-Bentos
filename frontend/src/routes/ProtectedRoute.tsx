import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface ProtectedRouteProps {
    children: JSX.Element;
    requiredRole?: string; // para filtrar por el rol
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = (
    {children, requiredRole}
) => {
    const { isLoggedIn, user } = useAuthStore();
    const location = useLocation();

    if (!isLoggedIn) {
        return (<Navigate to="/login" state={{ from: location }} replace />)
    }

    // Para validar por rol
    if (requiredRole && user?.rol !== requiredRole) {
        return (<div> No tienes permisos para acceder a esta página </div>)
    }

    // Finalmente, si todo sale bien -> usuario logeado y rol apropiado
    return children;
}