import React, { useState } from "react";
import type { Goal } from "./Metas";
import "../../styles/GestionProductora/GoalCard.css";
import { EditIcon, TrashIcon } from "../../components/icons";
import DeleteGoalModal from "./DeleteGoalModal";

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  formatAsCurrency?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  unit,
  formatAsCurrency = false,
}) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const formatValue = (num: number) =>
    formatAsCurrency
      ? `S/ ${num.toLocaleString("es-PE")}`
      : num.toLocaleString("es-PE");

  const getColorClass = (perc: number) => {
    if (perc <= 35) {
      return "red";
    }
    // Si es mayor a 35 (implícito) y menor a 70
    if (perc < 70) {
      return "yellow";
    }
    // Si es 70 o más (implícito)
    return "green";
  };

  const colorClass = getColorClass(percentage);

  return (
    <div>
      <div className="progress-container">
        <span className="progress-label">{label}</span>
        <span className="progress-value">
          {formatValue(value)} / <strong>{formatValue(max)} {unit}</strong> 
        </span>
      </div>
      <div className="progress-bar-bg">
        <div
          className={`progress-bar-fill ${colorClass}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: number) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  const {
    id,
    eventName,
    eventEndDate,
    incomeGoal,
    incomeAchieved,
    conversionRateGoal,
    conversionRateAchieved,
    ticketsToSell,
    ticketsSold,
  } = goal;

  const calculateDaysLeft = (endDateStr: string) => {
    const end = new Date(endDateStr);
    end.setMinutes(end.getMinutes() + end.getTimezoneOffset());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - today.getTime();
    if (diffTime < 0) return { days: 0, status: "Finalizado" };

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return { days: 0, status: "Finaliza hoy" };

    return {
      days: diffDays,
      status: `Faltan ${diffDays} día${diffDays > 1 ? "s" : ""}`,
    };
  };

  const { status } = calculateDaysLeft(eventEndDate);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    onDelete(id);
    setIsDeleteModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="goal-card">
        <div className="goal-header">
          <h3 className="goal-title">{eventName}</h3>
          <span
            className={`goal-status ${
              status === "Finalizado" ? "end" : "success"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="space-y-5">
          <ProgressBar
            label="Ingresos"
            value={incomeAchieved}
            max={incomeGoal}
            unit=""
            formatAsCurrency
          />
          <ProgressBar
            label="Tasa de Conversión"
            value={conversionRateAchieved}
            max={conversionRateGoal}
            unit="%"
          />
          <ProgressBar
            label="Tickets Vendidos"
            value={ticketsSold}
            max={ticketsToSell}
            unit="tickets"
          />
        </div>

        <div className="goal-card-actions">
          <button
            onClick={() => onEdit(goal)}
            className="btn-icon edit-btn"
            aria-label="Editar meta"
          >
            <EditIcon className="icon-card" />
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="btn-icon delete-btn"
            aria-label="Eliminar meta"
          >
            <TrashIcon className="icon-card" />
          </button>
        </div>
      </div>
      
      <DeleteGoalModal
        open={isDeleteModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleConfirmDelete}
        goalName={eventName}
      />
    </>
  );
};

export default GoalCard;
