// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Zona } from "../types/event.types";

interface ZonasEventoState {
  zonas: Zona[];
  titulo: string;
  lugar: string;
  fecha: string;
  eventoId: number;
  ubicacion: string;
  setZonas: (zonas: Zona[] | null) => void;
  setTitulo: (titulo: string) => void;
  setLugar: (lugar: string) => void;
  setFecha: (fecha: string) => void;
  setEventoID: (eventoId: number) => void;
  setUbicacion: (ubi: string) => void;
}

export const useZonasEventoStore = create<ZonasEventoState>()(
  persist(
    (set) => ({
      zonas: [],
      titulo: "",
      lugar: "",
      fecha: "",
      eventoId: -1,
      ubicacion: "",
      setZonas(zonas) {
        if (zonas) set({ zonas: zonas });
      },
      setTitulo(titulo) {
        if (titulo) set({ titulo: titulo });
      },
      setLugar(lugar) {
        if (lugar) set({ lugar: lugar });
      },
      setFecha(fecha) {
        if (fecha) set({ fecha: fecha });
      },
      setEventoID(eventoId) {
        if (eventoId) set({ eventoId: eventoId });
      },
      setUbicacion(ubi) {
        if (ubi) set({ ubicacion: ubi });
      },
    }),
    {
      name: "zonas-evento-storage",
    }
  )
);
