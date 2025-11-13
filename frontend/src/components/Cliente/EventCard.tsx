import React from 'react';
import type { Event } from './constants';
import "../../styles/Cliente/EventCard.css";
import { LocationIcon } from '../icons';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className={`event-card ${event.gridClass ? 'md:row-span-2' : ''}`}>
      <div className="event-card-image-container">
        <img src={event.imageUrl} alt={event.title} className="event-card-image" />
      </div>
      <div className="event-card-info">
        <div className="event-card-header">
          <h3 className="event-card-title">{event.title}</h3>
          <span className="event-card-price">
            Desde S/.{event.price}
          </span>
        </div>
        <p className="event-card-date">{event.date}</p>
        <div className="event-card-location">
          <LocationIcon className="location-icon" />
          <span>{event.location}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;