import { create } from "zustand";
import { persist } from "zustand/middleware";
import { listarEventos } from "../services/ClientServices/eventService";
import type { Evento } from "../types/event.types";

interface EventosState {
  events: Evento[];
  filteredEvents: Evento[];
  category: string;
  sortBy: 'popularidad' | 'fecha';
  loadEvents: () => Promise<void>;
  setCategory: (category: string) => void;
  setSortBy: (sortBy: 'popularidad' | 'fecha') => void;
  clear: () => void;
}

export const useEventos = create<EventosState>()(
  persist(
    (set, get) => ({
      events: [],
      filteredEvents: [],
      category: 'Todos',
      sortBy: 'popularidad',

      loadEvents: async () => {
        try {
          const data = await listarEventos();
          const category = get().category || 'Todos';
          const sortBy = get().sortBy || 'popularidad';
          const filtered = category === 'Todos' ? data : data.filter(e => e.nombreCategoria.toUpperCase() === category.toUpperCase());
          const sorted = sortByType(filtered, sortBy);
          set({ events: data, filteredEvents: sorted });
        } catch (error) {
          console.error('Error cargando eventos:', error);
        }
      },

      setCategory: (category: string) => {
        const events = get().events || [];
        const sortBy = get().sortBy || 'popularidad';
        const filtered = category === 'Todos' ? events : events.filter(e => {
          const match = e.nombreCategoria.toUpperCase() === category.toUpperCase();
          console.log(`Comparando: "${e.nombreCategoria}" (${e.nombreCategoria.toUpperCase()}) === "${category}" (${category.toUpperCase()}) = ${match}`);
          return match;
        });
        const sorted = sortByType(filtered, sortBy);
        console.log(`Categoría seleccionada: ${category}, eventos encontrados: ${filtered.length}`);
        set({ category, filteredEvents: sorted });
      },

      setSortBy: (sortBy: 'popularidad' | 'fecha') => {
        const filteredEvents = get().filteredEvents || [];
        const sorted = sortByType(filteredEvents, sortBy);
        set({ sortBy, filteredEvents: sorted });
      },

      clear: () => set({ events: [], filteredEvents: [], category: 'Todos', sortBy: 'popularidad' }),
    }),
    { name: 'eventos-storage' }
  )
);

const sortByType = (events: Evento[], sortBy: 'popularidad' | 'fecha'): Evento[] => {
  const sorted = [...events];
  if (sortBy === 'fecha') {
    sorted.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  } else {
    sorted.sort((a, b) => b.popularidad - a.popularidad);
  }
  return sorted;
};

