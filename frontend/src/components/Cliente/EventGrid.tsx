
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { type Event, EVENTS } from './constants';
import EventCard from './EventCard';
import "../../styles/Cliente/EventGrid.css";

const EventGrid: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    // Simulate fetching more data. In a real app, this would be an API call.
    const newEvents = EVENTS.slice(0, page * 7); 
    if (newEvents.length >= EVENTS.length) {
      setHasMore(false);
    }
    setEvents(newEvents);
    setPage(prev => prev + 1);
  }, [page]);

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loader, hasMore, loadMore]);
  
  return (
    <div>
      <div className="event-grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <div ref={loader} className="loader" />
      {/*{!hasMore && <p className="no-more-events">No hay más eventos que mostrar.</p>}*/}
    </div>
  );
};

export default EventGrid;