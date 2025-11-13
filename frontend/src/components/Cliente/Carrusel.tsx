import React, { useState, useEffect, useCallback } from 'react';
import { CAROUSEL_ITEMS } from './constants';
import '../../styles/Cliente/Carrusel.css';
import { Button } from '@carbon/react';
import { ChevronRightIcon, ChevronLeftIcon } from '../icons';

const Carrusel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === CAROUSEL_ITEMS.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? CAROUSEL_ITEMS.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  return (
    <>
      <div className="carousel-container">
        {/* Carrusel de imágenes */}
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {CAROUSEL_ITEMS.map((item) => (
            <div key={item.id} className="carousel-slide">
              <img src={item.imageUrl} alt="Event" className="carousel-image" />
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
        {CAROUSEL_ITEMS.map((_, index) => (
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
