import { useEffect, useState } from "react";
import SidebarGestor from "../../components/SidebarGestor";
import "../../styles/GestionProductora/Metas.css";
import GoalsList from "./GoalsList";
import { Button } from "@carbon/react";
import { Add } from "@carbon/icons-react";
import GoalModal from "./GoalModal";
import {
  crearMeta,
  editarMeta,
  eliminarMeta,
  listarMetasProductora,
} from "../../services/goalService";

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

const Metas: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchMetas = async () => {
      try {
        const metas = await listarMetasProductora();

        // Adaptar los campos de la API al formato que usa la interfaz Goal
        const goalsAdapted: Goal[] = metas.map((m) => ({
          id: m.metaId,
          eventName: m.nombreEvento,
          eventEndDate: m.fechaHorarioInicio.split("T")[0],
          incomeGoal: m.metaIngresos,
          incomeAchieved: m.montoTotalRecaudado,
          conversionRateGoal: m.tasaConversion * 100,
          conversionRateAchieved:
            m.visitas > 0 ? (m.entradasVendidas / m.visitas) * 100 : 0,
          ticketsToSell: m.ticketsObjetivo,
          ticketsSold: m.entradasVendidas,
        }));

        setGoals(goalsAdapted);
      } catch (error) {
        console.error("Error al cargar las metas:", error);
      }
    };

    fetchMetas();
  }, []);

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

  const handleSaveGoal = async (formData: Partial<Goal>) => {
    try {
      if (editingGoal) {
        // 🟡 MODO EDICIÓN
        await editarMeta(editingGoal.id, {
          evento: { eventoId: editingGoal.id }, // o el id real del evento si lo guardas
          metaIngresos: formData.incomeGoal || 0,
          tasaConversion: formData.conversionRateGoal || 0,
          ticketsObjetivo: formData.ticketsToSell || 0,
          activo: 1,
        });

        // Refresca la lista desde la API
        const metas = await listarMetasProductora();
        const goalsAdapted: Goal[] = metas.map((m) => ({
          id: m.metaId,
          eventName: m.nombreEvento,
          eventEndDate: m.fechaHorarioInicio.split("T")[0],
          incomeGoal: m.metaIngresos,
          incomeAchieved: m.montoTotalRecaudado,
          conversionRateGoal: m.tasaConversion,
          conversionRateAchieved:
            m.visitas > 0 ? (m.entradasVendidas / m.visitas) * 100 : 0,
          ticketsToSell: m.ticketsObjetivo,
          ticketsSold: m.entradasVendidas,
        }));
        setGoals(goalsAdapted);
      } else {
        // 🟢 MODO CREACIÓN
        await crearMeta({
          evento: { eventoId: Number(formData.id) || 0 }, // id del evento seleccionado
          metaIngresos: formData.incomeGoal || 0,
          tasaConversion: formData.conversionRateGoal || 0,
          ticketsObjetivo: formData.ticketsToSell || 0,
          activo: 1,
        });

        // Refresca la lista
        const metas = await listarMetasProductora();
        const goalsAdapted: Goal[] = metas.map((m) => ({
          id: m.metaId,
          eventName: m.nombreEvento,
          eventEndDate: m.fechaHorarioInicio.split("T")[0],
          incomeGoal: m.metaIngresos,
          incomeAchieved: m.montoTotalRecaudado,
          conversionRateGoal: m.tasaConversion * 100,
          conversionRateAchieved:
            m.visitas > 0 ? (m.entradasVendidas / m.visitas) * 100 : 0,
          ticketsToSell: m.ticketsObjetivo,
          ticketsSold: m.entradasVendidas,
        }));
        setGoals(goalsAdapted);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar la meta:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await eliminarMeta(id);
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
    } catch (error) {
      console.error("Error al eliminar la meta:", error);
    }
  };

  return (
    <div
      className={`app-container ${
        sidebarOpen ? "sidebar-visible" : "sidebar-hidden"
      }`}
    >
      <SidebarGestor currentPath="metas" onToggleSidebar={setSidebarOpen} />
      <main className="app-main">
        {/* ... (tu header con el botón "Agregar") ... */}
        <div className="metas-header">
          <h1 className="title">Panel de Metas</h1>
          <Button
            className="add-button"
            renderIcon={Add}
            kind="primary"
            onClick={handleOpenAddModal}
          >
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
      />
    </div>
  );
};

export default Metas;
