import React from 'react';
import type { Goal } from './Metas';
import GoalCard from './GoalCard';
import '../../styles/GestionProductora/GoalList.css';

interface GoalsListProps {
  goals: Goal[];
  onEdit: (goal: Goal) => void;
  onDelete: (id: number) => void;
}

const GoalsList: React.FC<GoalsListProps> = ({ goals, onEdit, onDelete }) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const activeGoals = goals
    .filter(goal => {
      const endDate = new Date(goal.eventEndDate);
      endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset());
      endDate.setHours(0, 0, 0, 0);
      return endDate >= now;
    })
    .sort((a, b) => new Date(a.eventEndDate).getTime() - new Date(b.eventEndDate).getTime());

  const pastGoals = goals
    .filter(goal => {
      const endDate = new Date(goal.eventEndDate);
      endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset());
      endDate.setHours(0, 0, 0, 0);
      return endDate < now;
    })
    .sort((a, b) => new Date(b.eventEndDate).getTime() - new Date(a.eventEndDate).getTime());

  return (
    <div>
      <h2 className="goalslist-title">Metas Activas</h2>
      {activeGoals.length > 0 ? (
        <div className="goalslist-grid">
          {activeGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <div className="goalslist-empty">
          <p>No hay metas activas en este momento.</p>
        </div>
      )}

      {pastGoals.length > 0 && (
        <>
          <h2 className="goalslist-title mt">Metas Pasadas</h2>
          <div className="goalslist-grid">
            {pastGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GoalsList;
