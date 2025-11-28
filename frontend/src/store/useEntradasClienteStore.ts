import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BuyerData } from "../types/cliente.types";

type TicketSelection = { [ticketId: number]: number };

interface EntradasStore {
  cliente: BuyerData;
  metodoPago: string;
  reservaId: number;
  ventaId: number;
  pendingSelections: Record<number, TicketSelection>;
  saveSelections: (eventId: number, tickets: TicketSelection) => void;
  getSelections: (eventId: number) => TicketSelection | undefined;
  clearSelections: (eventId: number) => void;
  clearAll: () => void;
  setCorreoCli: (correo: string) => void;
  setCvvTarjeta: (cvv: string) => void;
  setFechaVencimiento: (fechaVen: string) => void;
  setNombreTitular: (nombreTitular: string) => void;
  setNumTarjeta: (numTarjeta: string) => void;
  setMetodoPago: (metodo: string) => void;
  setReservaId: (reservaId: number) => void;
  setVentaId: (reservaId: number) => void;
}

export const useEntradasClienteStore = create<EntradasStore>()(
  persist(
    (set, get) => ({
      pendingSelections: {},
      cliente: {
        correoCli: "",
        cvvTarjeta: "",
        fechaVencimiento: "",
        nombreTitularTarjeta: "",
        numTarjeta: "",
      },
      metodoPago: "TARJETA_DE_CREDITO", // Se inicia con tarjeta de crédito
      reservaId: -1,
      ventaId: -1,
      saveSelections: (eventId, tickets) =>
        set((state) => ({
          pendingSelections: { ...state.pendingSelections, [eventId]: tickets },
        })),
      getSelections: (eventId) => get().pendingSelections[eventId],
      clearSelections: (eventId) =>
        set((state) => {
          const copy = { ...state.pendingSelections };
          delete copy[eventId];
          return { pendingSelections: copy };
        }),
      clearAll: () => set({ pendingSelections: {} }),
      setCorreoCli: (correo) =>
        set((state) => ({
          cliente: { ...state.cliente, correoCli: correo },
        })),

      setCvvTarjeta: (cvv) =>
        set((state) => ({
          cliente: { ...state.cliente, cvvTarjeta: cvv },
        })),

      setFechaVencimiento: (fechaVen) =>
        set((state) => ({
          cliente: { ...state.cliente, fechaVencimiento: fechaVen },
        })),

      setNombreTitular: (nombreTitular) =>
        set((state) => ({
          cliente: { ...state.cliente, nombreTitularTarjeta: nombreTitular },
        })),

      setNumTarjeta: (numTarjeta) =>
        set((state) => ({
          cliente: { ...state.cliente, numTarjeta },
        })),
      setMetodoPago: (metodo) => {
        if (metodo) {
          set({ metodoPago: metodo });
        }
      },
      setReservaId: (reserva) => {
        if (reserva) {
          set({ reservaId: reserva });
        }
      },
      setVentaId: (venta) => {
        if (venta) {
          set({ ventaId: venta });
        }
      },
    }),
    { name: "entradas-cliente-storage" }
  )
);

export type { TicketSelection };
