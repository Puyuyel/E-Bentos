// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login } from "../services/authService";
import type { LoginCredentials } from "../types/auth.types";

interface User {
  id?: string;
  loginCreds: LoginCredentials;
  rol: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  displayName: string | null;
  login: (loginCreds: LoginCredentials) => Promise<string>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setDisplayName: (name: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      displayName: null,

      login: async (loginCreds: LoginCredentials) => {
        try {
          const response = await login(loginCreds);
          const userResponse = {
            id: response.id,
            email: loginCreds.email,
            rol: response.role,
          };
          set({ user: userResponse, isLoggedIn: true });
          return userResponse.rol;
        } catch (error) {
          console.error("Error en login:", error);
          throw error;
        }
      },

      logout: () => {
        console.log("🚪 Ejecutando logout...");
        set({ user: null, isLoggedIn: false, displayName: null });
        localStorage.removeItem("auth-storage");
        console.log("🔄 Redirigiendo a /login");
        window.location.href = "/login";
      },

      setUser: (user: User | null) => {
        set({ user, isLoggedIn: !!user });
      },

      setDisplayName: (name: string) => {
        set({ displayName: name });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

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
    // Si falla, redirigir inmediatamente
    logout();
  } finally {
    setLoading(false);
  }
};
