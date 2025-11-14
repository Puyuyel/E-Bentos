import React, { useEffect } from 'react';
import EventCard from './EventCard';
import "../../styles/Cliente/EventGrid.css";
import { useEventos } from '../../store/useEventos';


const EventGrid: React.FC = () => {
  const events = useEventos((s) => s.filteredEvents);
  const allEvents = useEventos((s) => s.events);
  const loadEvents = useEventos((s) => s.loadEvents);

  useEffect(() => {
    if (!allEvents || allEvents.length === 0) {
      loadEvents();
    }
  }, [allEvents, loadEvents]);

  return (
    <div>
      <div className="event-grid">
        {events.map(event => (
          <EventCard
            key={event.eventoId}
            event={event}
          />
        ))}
      </div>
    </div>
  );
};

export default EventGrid;
