import { create } from "zustand";

interface ResetPassState {
  email: string;
  codigo: string;
  nuevaContrasenha: string;
  setEmail: (email: string) => void;
  setCodigo: (codigo: string) => void;
  setNuevaContrasenha: (nuevaContrasenha: string) => void;
  clear: () => void;
}

export const useResetPassStore = create<ResetPassState>((set) => ({
  codigo: "",
  nuevaContrasenha: "",
  email: "",
  setEmail: (email: string) => set({ email }),
  setCodigo: (codigo: string) => set({ codigo }),
  setNuevaContrasenha: (nuevaContrasenha: string) => set({ nuevaContrasenha }),
  clear: () => set({ codigo: "", nuevaContrasenha: "", email: "" }),
}));
