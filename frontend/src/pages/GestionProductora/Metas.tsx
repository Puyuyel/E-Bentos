import { useState } from "react";
import SidebarGestor from "../../components/SidebarGestor";
import "../../styles/GestionProductora/Metas.css";
import GoalsList from "./GoalsList";
import { Button } from "@carbon/react";
import { Add } from "@carbon/icons-react";
import GoalModal from "./GoalModal";

export interface Goal {
  id: number;
  eventName: string;
  eventEndDate: string;
  incomeGoal: number;
  incomeAchieved: number;
  conversionRateGoal: number;
  conversionRateAchieved: number;
  ticketsToSell: number;
  ticketsSold: number;
}

const getTodayString = () => {
  const today = new Date();
  // Ajuste para la zona horaria local (ej. -05:00)
  // Si no se hace esto, new Date() puede dar el día anterior si es UTC
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().split("T")[0];
};

export const initialGoals: Goal[] = [
  {
    id: 1,
    eventName: "Gira Mundial de Rock",
    // ESCENARIO: Faltan 3 meses, pero va MUY MAL (Rojo)
    eventEndDate: "2026-02-15", 
    incomeGoal: 150000,
    incomeAchieved: 25000,       // -> 16.6% (Rojo)
    conversionRateGoal: 10,
    conversionRateAchieved: 3,  // -> 30% (Rojo)
    ticketsToSell: 3000,
    ticketsSold: 750,           // -> 25% (Rojo)
  },
  {
    id: 2,
    eventName: "Feria Gastronómica Local",
    // ESCENARIO: Falta 1 mes, va REGULAR (Amarillo)
    eventEndDate: "2025-12-15",
    incomeGoal: 75000,
    incomeAchieved: 45000,       // -> 60% (Amarillo)
    conversionRateGoal: 20,
    conversionRateAchieved: 13, // -> 65% (Amarillo)
    ticketsToSell: 500,
    ticketsSold: 200,           // -> 40% (Amarillo)
  },
  {
    id: 3,
    eventName: "Concierto Acústico",
    // ESCENARIO: Finaliza HOY, rendimiento MIXTO
    eventEndDate: getTodayString(),
    incomeGoal: 40000,
    incomeAchieved: 30000,       // -> 75% (Verde)
    conversionRateGoal: 15,
    conversionRateAchieved: 8,  // -> 53.3% (Amarillo)
    ticketsToSell: 800,
    ticketsSold: 200,           // -> 25% (Rojo)
  },
  {
    id: 4,
    eventName: "Festival de Jazz 2025",
    // ESCENARIO: Evento PASADO, éxito total (Verde)
    eventEndDate: "2025-10-01",
    incomeGoal: 60000,
    incomeAchieved: 65000,       // -> 108% (Verde)
    conversionRateGoal: 25,
    conversionRateAchieved: 25, // -> 100% (Verde)
    ticketsToSell: 1000,
    ticketsSold: 1150,          // -> 115% (Verde)
  },
  {
    id: 5,
    eventName: "Maratón de la Ciudad",
    // ESCENARIO: Faltan 4 meses, va BIEN (Verde)
    eventEndDate: "2026-03-01",
    incomeGoal: 25000,
    incomeAchieved: 20000,       // -> 80% (Verde)
    conversionRateGoal: 30,
    conversionRateAchieved: 22, // -> 73.3% (Verde)
    ticketsToSell: 400,
    ticketsSold: 350,           // -> 87.5% (Verde)
  },
  {
    id: 6,
    eventName: "Conferencia de Tech 2024",
    // ESCENARIO: Evento PASADO, fracaso (Rojo/Amarillo)
    eventEndDate: "2024-03-15",
    incomeGoal: 100000,
    incomeAchieved: 35000,       // -> 35% (Rojo)
    conversionRateGoal: 20,
    conversionRateAchieved: 8,  // -> 40% (Amarillo)
    ticketsToSell: 1500,
    ticketsSold: 450,           // -> 30% (Rojo)
  },
];

const eventosDeEjemplo = [
  { id: "evento-1", text: "Festival de Rock 2023" },
  { id: "evento-2", text: "Conferencia de Tecnología 2024" },
  { id: "evento-3", text: "Oktoberfest Edición Lima" },
  { id: "evento-4", text: "Maratón de la Ciudad" },
];

const Metas: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Abre el modal para crear una nueva meta
  const handleOpenAddModal = () => {
    setEditingGoal(null); // Asegura que no haya ninguna meta "en edición"
    setIsModalOpen(true);
  };

  // Abre el modal para editar una meta existente
  const handleOpenEditModal = (goal: Goal) => {
    setEditingGoal(goal); // Guarda la meta que se está editando
    setIsModalOpen(true);
  };
  
  // Cierra el modal y limpia el estado de edición
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  const handleSaveGoal = (formData: Partial<Goal>) => {
    if (editingGoal) {
      // MODO EDICIÓN: Fusiona los datos del form con la meta existente
      setGoals(
        goals.map((g) =>
          g.id === editingGoal.id ? { ...g, ...formData } : g
        )
      );
    } else {
      // MODO CREACIÓN: Crea una nueva meta
      const newGoal: Goal = {
        // Valores por defecto para los campos que el modal no maneja
        id: Date.now(), // ID temporal
        eventEndDate: new Date().toISOString().split("T")[0], // Fecha de ejemplo
        incomeAchieved: 0,
        conversionRateAchieved: 0,
        ticketsSold: 0,
        // Datos que vienen del formulario
        ...formData,
      } as Goal; // Forzamos el tipo porque sabemos que formData tiene lo necesario

      setGoals([newGoal, ...goals]);
    }

    handleCloseModal(); // Cierra el modal después de guardar
  };

  const handleDelete = (id: number) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
  };

  return (
    <div className="app-container">
      <SidebarGestor currentPath="metas" />
      <main className="app-main">
        {/* ... (tu header con el botón "Agregar") ... */}
        <div className="metas-header">
           <h1 className="title">Panel de Metas</h1>
           <Button className="add-button" renderIcon={Add} kind="primary" onClick={handleOpenAddModal}>
             Agregar
           </Button>
        </div>
        
        <div className="goals-wrapper">
          <GoalsList
            goals={goals}
            onEdit={handleOpenEditModal} // Pasa la función de abrir
            onDelete={handleDelete}
          />
        </div>
      </main>

      {/* Renderiza el modal aquí */}
      <GoalModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveGoal}
        goalToEdit={editingGoal}
        eventosList={eventosDeEjemplo} // 3. Pasa la lista de eventos
      />
    </div>
  );
};

export default Metas;
