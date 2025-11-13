import React, { useState, useEffect } from 'react';
import { CAROUSEL_ITEMS } from './constants';
import '../../styles/Cliente/Carrusel.css';
import { Button } from '@carbon/react';
import { ChevronRightIcon, ChevronLeftIcon } from '../icons';
import { listarEventos } from '../../services/ClientServices/eventService';
const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

const Carrusel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselEvents, setCarouselEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchCarouselEvents = async () => {
      try {
        const events = await listarEventos();
        setCarouselEvents(events.slice(0, 5));
      } catch (error) {
        console.error('Error cargando eventos para carrusel:', error);
        setCarouselEvents(CAROUSEL_ITEMS);
      }
    };
    fetchCarouselEvents();
  }, []);

  const slides = carouselEvents.length > 0 ? carouselEvents : CAROUSEL_ITEMS;
  const slideCount = slides.length;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (slideCount > 0 ? (prevIndex + 1) % slideCount : 0));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (slideCount > 0 ? (prevIndex - 1 + slideCount) % slideCount : 0));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (slideCount > 0 ? (prevIndex + 1) % slideCount : 0));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [slideCount]);

  return (
    <>
      <div className="carousel-container">
        {/* Carrusel de imágenes */}
        <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {slides.map((s, idx) => (
            <div key={(s as any).eventoId ?? (s as any).id ?? idx} className="carousel-slide">
              <img
                src={
                  `${imageBaseUrl ? `${imageBaseUrl}/` : ''}${(s as any).posterHorizontal ?? (s as any).posterVertical ?? ''}`
                }
                alt={(s as any).nombreEvento ?? (s as any).date ?? 'Event'}
                className="carousel-image"
              />
            </div>
          ))}
        </div>

        {/* Botón fijo (NO se mueve con el carrusel) */}
        <div className="carousel-fixed-button">
          <Button kind="primary" renderIcon={ChevronRightIcon} size="lg">
            Comprar
          </Button>
        </div>

        {/* Flechas */}
        <button onClick={prevSlide} className="carousel-arrow left" aria-label="Anterior">
          <ChevronLeftIcon className="arrow-icon" />
        </button>

        <button onClick={nextSlide} className="carousel-arrow right" aria-label="Siguiente">
          <ChevronRightIcon className="arrow-icon" />
        </button>
      </div>

      {/* Dots: fuera del contenedor para que no queden sobre la imagen ni se recorten */}
      <div className="carousel-dots">
        {slides.map((_, index: number) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            aria-label={`Ir a slide ${index + 1}`}
            type="button"
          />
        ))}
      </div>
    </>
  );
};

export default Carrusel;
