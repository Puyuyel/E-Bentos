import React, { use } from "react";
import "../../styles/Cliente/EventCard.css";
import { LocationIcon } from "../icons";
import type { Evento } from "../../types/event.types";
import { useNavigate } from "react-router-dom";
import VerDetalleEvento from "../../pages/Cliente/VerDetalleEvento";
import { añadirVista } from "../../services/ClientServices/eventService";

const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

interface EventCardProps {
  event: Evento;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  // 🎯 Genera un número aleatorio entre 0 y 1, y lo compara con la popularidad
  // Ejemplo: si popularidad = 0.8 → 80% de probabilidad de ser grande
  const isLarge = Math.random() < event.popularidad;

  const imageSrc = isLarge ? event.posterVertical : event.posterHorizontal;

  const handleClickCard = async () => {
    try {
      console.log("Añadiendo vista para el evento ID:", event.eventoId);
      await añadirVista(event.eventoId);
    } catch (error) {
      console.error("Error al añadir vista:", error);
    }
    navigate(`/cliente/ver-detalle-evento/${event.eventoId}`);
  };

  return (
    <div
      style={{
        cursor: "pointer",
      }}
      onClick={handleClickCard}
      className={`event-card ${isLarge ? "md:row-span-2" : ""}`}
    >
      <div className="event-card-image-container">
        <img
          src={`${imageBaseUrl}/${imageSrc}`}
          alt={event.nombreEvento}
          className="event-card-image"
        />
      </div>
      <div className="event-card-info">
        <div className="event-card-header">
          <h3 className="event-card-title">{event.nombreEvento}</h3>
          <span className="event-card-price">
            Desde S/.{event.zonaDeMenorPrecio}
          </span>
        </div>
        <p className="event-card-date">
          {new Date(event.fecha).toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
        <div className="event-card-location">
          <LocationIcon className="location-icon" />
          <span>{event.nombreLocal}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
