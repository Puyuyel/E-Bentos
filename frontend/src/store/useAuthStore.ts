import { create } from "zustand";
import { persist } from "zustand/middleware";

// Tipo de usuario (puedes ampliarlo si tu API devuelve más datos)
interface User {
  email: string;
  name?: string;
}

// Estado global del auth
interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;

  // Funciones del store
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null, token?: string) => void;
}

// Store con persistencia en localStorage
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      // Simulación de login (aquí puedes conectar con tu API)
      login: async (email: string, password: string) => {
        // Ejemplo de "petición"
        const response = await fakeLoginApi(email, password);

        // Guardamos el usuario y token
        set({
          user: response.user,
          token: response.token,
          isLoggedIn: true,
        });
      },

      // Cierra sesión
      logout: () => {
        set({ user: null, token: null, isLoggedIn: false });
      },

      // Permite setear manualmente el usuario/token
      setUser: (user, token) => {
        set({
          user,
          token: token || null,
          isLoggedIn: !!user && !!token,
        });
      },
    }),
    {
      name: "auth-storage", // nombre en localStorage
    }
  )
);

// Simulación de API de login
async function fakeLoginApi(email: string, password: string) {
  // Aquí normalmente harías:
  // const res = await fetch("/api/login", { method: "POST", body: JSON.stringify({ email, password }) })
  // const data = await res.json()

  // Por ahora simulamos una respuesta
  return new Promise<{ user: User; token: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        user: { email, name: "Benny Baca" },
        token: "fake-jwt-token-12345",
      });
    }, 800);
  });
}
