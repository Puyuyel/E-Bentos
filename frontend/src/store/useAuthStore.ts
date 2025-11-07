// src/store/useAuthStore.ts
import { create } from "zustand";
import { login } from "../services/authService"; // tu servicio API
import type { LoginCredentials } from "../types/auth.types";

interface User {
  id?: string;
  loginCreds: LoginCredentials;
  rol: string; // o "role" según tu backend
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  displayName: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setDisplayName: (name: string) => void;
}

export const useAuthStore = create<AuthState>((set : any) => ({
  user: null,
  isLoggedIn: false,
  displayName: null,

  // Llama al backend real
  login: async (loginCreds: LoginCredentials) => {
    try {
      const response = await login(loginCreds); // devuelve { email, rol, ... }
      const userResponse = {
        id: response.id,
        email: loginCreds.email,
        rol: response.role,
      };
      set({ user: userResponse, isLoggedIn: true , dispatchEvent: null});
      return userResponse.rol;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  },

  logout: () => {
    // opcional: llamar a /logout en tu API
    set({ user: null, isLoggedIn: false, displayName: null });
  },

  setUser: (user : any) => {
    set({ user, isLoggedIn: !!user });
  },

  setDisplayName: (name: any) => {
    set({ displayName: name });
  },
}));
