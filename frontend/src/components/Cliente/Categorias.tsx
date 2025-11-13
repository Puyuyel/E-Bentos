import React, { useState } from 'react';
import "../../styles/Cliente/Categorias.css";

const categories = ['Todos', 'Conciertos', 'Musicales', 'Teatro', 'Deportes', 'Entretenimiento'];

const Categories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeSort, setActiveSort] = useState('Popularidad');

  const handleToggle = () => {
    setActiveSort(prev => (prev === 'Popularidad' ? 'Fecha' : 'Popularidad'));
  };

  return (
    <div className="categories-container">
      <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`category-button ${activeCategory === category ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>
      {/* --- SECCIÓN MODIFICADA --- */}
      <div className="sort-container">
        <span className="sort-label">Ordenar por:</span>
        
        {/* Contenedor principal del toggle que maneja el click */}
        <div className="sort-toggle" onClick={handleToggle}>
          
          {/* La "píldora" azul que se desliza */}
          <div 
            className={`sort-toggle-slider ${activeSort === 'Fecha' ? 'active' : ''}`}
          ></div>
          
          {/* Los textos siempre están visibles */}
          <div className="sort-toggle-text">Popularidad</div>
          <div className="sort-toggle-text">Fecha</div>

        </div>
      </div>
      {/* --- FIN DE LA SECCIÓN MODIFICADA --- */}
    </div>
  );
};

export default Categories;
