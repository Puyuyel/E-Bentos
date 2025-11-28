import { create } from "zustand";
import { persist } from "zustand/middleware";
import { listarEventos } from "../services/ClientServices/eventService";
import type { Evento } from "../types/event.types";

interface EventosState {
  events: Evento[];
  filteredEvents: Evento[];
  category: string;
  sortBy: "popularidad" | "fecha";
  searchTerm: string;
  eventSearched: string;
  loadEvents: () => Promise<void>;
  setCategory: (category: string) => void;
  setSortBy: (sortBy: "popularidad" | "fecha") => void;
  setSearchTerm: (searchTerm: string) => void;
  clear: () => void;
  setEventSearchedByID: (id: number) => void;
}

export const useEventos = create<EventosState>()(
  persist(
    (set, get) => ({
      events: [],
      eventSearched: "",
      filteredEvents: [],
      category: "Todos",
      sortBy: "popularidad",
      searchTerm: "",

      loadEvents: async () => {
        try {
          const data = await listarEventos();
          const category = get().category || "Todos";
          const sortBy = get().sortBy || "popularidad";
          const searchTerm = get().searchTerm || "";
          const filtered = applyFilters(data, category, searchTerm);
          const sorted = sortByType(filtered, sortBy);
          set({ events: data, filteredEvents: sorted });
        } catch (error) {
          console.error("Error cargando eventos:", error);
        }
      },

      setCategory: (category: string) => {
        const events = get().events || [];
        const sortBy = get().sortBy || "popularidad";
        const searchTerm = get().searchTerm || "";
        const filtered = applyFilters(events, category, searchTerm);
        const sorted = sortByType(filtered, sortBy);
        set({ category, filteredEvents: sorted });
      },

      setSortBy: (sortBy: "popularidad" | "fecha") => {
        const filteredEvents = get().filteredEvents || [];
        const sorted = sortByType(filteredEvents, sortBy);
        set({ sortBy, filteredEvents: sorted });
      },

      setSearchTerm: (searchTerm: string) => {
        const events = get().events || [];
        const category = get().category || "Todos";
        const sortBy = get().sortBy || "popularidad";
        const filtered = applyFilters(events, category, searchTerm);
        const sorted = sortByType(filtered, sortBy);
        set({ searchTerm, filteredEvents: sorted });
      },

      clear: () =>
        set({
          events: [],
          filteredEvents: [],
          category: "Todos",
          sortBy: "popularidad",
          searchTerm: "",
        }),

      setEventSearchedByID: (id: number) => {
        const events = get().events || [];
        const found = events.find((e) => e.eventoId === id);
        if (found) {
          set({ eventSearched: found.nombreEvento });
        } else {
          set({ eventSearched: "" });
        }
      },
    }),
    {
      name: "eventos-storage",
      partialize: (state) => ({
        category: state.category,
        sortBy: state.sortBy,
        searchTerm: state.searchTerm,
      }),
    }
  )
);

const applyFilters = (
  events: Evento[],
  category: string,
  searchTerm: string
): Evento[] => {
  let filtered = [...events];

  // Filtrar por categoría
  if (category !== "Todos") {
    filtered = filtered.filter(
      (e) => e.nombreCategoria.toUpperCase() === category.toUpperCase()
    );
  }

  // Filtrar por término de búsqueda
  if (searchTerm.trim()) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.nombreEvento.toLowerCase().includes(searchLower) ||
        e.nombreLocal.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

const sortByType = (
  events: Evento[],
  sortBy: "popularidad" | "fecha"
): Evento[] => {
  const sorted = [...events];
  if (sortBy === "fecha") {
    sorted.sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
  } else {
    sorted.sort((a, b) => b.popularidad - a.popularidad);
  }
  return sorted;
};
