// src/store/useAuthStore.ts
import { create } from "zustand";
import { login } from "../services/authService"; // tu servicio API
import type { LoginCredentials } from "../types/auth.types";

interface User {
  loginCreds: LoginCredentials;
  rol: string; // o "role" según tu backend
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,

  // Llama al backend real
  login: async (loginCreds: LoginCredentials) => {
    try {
      const response = await login(loginCreds); // devuelve { email, rol, ... }
      const userResponse = {
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
    // opcional: llamar a /logout en tu API
    set({ user: null, isLoggedIn: false });
  },

  setUser: (user) => {
    set({ user, isLoggedIn: !!user });
  },
}));
