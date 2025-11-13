import React from 'react';
import "../../styles/Cliente/Categorias.css";

import { useEventos } from '../../store/useEventos';

const categories = ['Todos', 'Concierto', 'Musical', 'Teatro', 'Entretenimiento'];

const Categories: React.FC = () => {
  const category = useEventos((s) => s.category);
  const setCategory = useEventos((s) => s.setCategory);
  const setSortBy = useEventos((s) => s.setSortBy);
  const [activeSort, setActiveSort] = React.useState('Popularidad');

  const handleToggle = () => {
    const newSort = activeSort === 'Popularidad' ? 'Fecha' : 'Popularidad';
    setActiveSort(newSort);
    setSortBy(newSort.toLowerCase() as 'popularidad' | 'fecha');
  };

  return (
    <div className="categories-container">
      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat === 'Todos' ? 'Todos' : cat.toUpperCase())}
            className={`category-button ${category === (cat === 'Todos' ? 'Todos' : cat.toUpperCase()) ? 'active' : ''}`}
          >
            {cat}
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
