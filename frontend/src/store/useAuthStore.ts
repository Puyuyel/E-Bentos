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
          loginCreds.contrasenha = "";
          const userResponse = {
            id: response.id,
            loginCreds: loginCreds,
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
