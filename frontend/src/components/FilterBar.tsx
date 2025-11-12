import React, {useEffect, useState} from 'react';
import '../styles/FilterBar.css';
import {
  DatePicker,
  DatePickerInput,
  Select,
  SelectItem,
} from '@carbon/react';
import { getLocales } from '../services/localService';
import { listarProductoras } from '../services/productoraService';

interface FilterBarProps {
  onFilterChange?: (filters: {
    fechaInicio?: string;
    fechaFin?: string;
    categoriaEvento?: string;
    local?: string;
    productora?: string;
  }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  
  const [locales, setLocales] = useState<{ localId: number; nombre: string }[]>([]);
  const [productoras, setProductoras] = useState<{ usuarioId: number; nombreComercial: string }[]>([]);

  useEffect(() => {
    // Cargar locales
    async function fetchLocales() {
      try {
        const data = await getLocales();
        setLocales(data);
      } catch (error) {
        console.error(error);
      }
    }

    // Cargar productoras
    async function fetchProductoras() {
      try {
        const data = await listarProductoras();
        setProductoras(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchLocales();
    fetchProductoras();
  }, []);  
  
  const handleSelectChange = (id: string, value: string) => {
    if (onFilterChange) onFilterChange({ [id]: value });
  };

  const handleDateChange = (id: string, date: Date | null) => {
    if (onFilterChange) onFilterChange({ [id]: date?.toISOString() || '' });
  };

  return (
    <div className="filters-row">
      {/* DatePickers */}
      <DatePicker
        datePickerType="single"
        className="filter-item"
        onChange={(dates) => handleDateChange('fechaInicio', dates[0])}
      >
        <DatePickerInput
          placeholder="mm/dd/yyyy"
          labelText="Fecha inicio"
          id="date-picker-inicio"
        />
      </DatePicker>

      <DatePicker
        datePickerType="single"
        className="filter-item"
        onChange={(dates) => handleDateChange('fechaFin', dates[0])}
      >
        <DatePickerInput
          placeholder="mm/dd/yyyy"
          labelText="Fecha fin"
          id="date-picker-fin"
        />
      </DatePicker>

      {/* Selects */}
      <Select
        id="categoriaEvento"
        labelText="Categoría de Evento"
        className="filter-item"
        defaultValue="default"
        onChange={(e) =>
          handleSelectChange('categoriaEvento', e.target.value)
        }
      >
        <SelectItem text="Elija una categoría de evento" value="default" />
        <SelectItem text="Concierto" value="CONCIERTO" />
        <SelectItem text="Teatro" value="TEATRO" />
        <SelectItem text="Musical" value="MUSICAL" />
        <SelectItem text="Entretenimiento" value="ENTRETENIMIENTO" />
      </Select>

      <Select
        id="local"
        labelText="Local"
        className="filter-item"
        defaultValue="default"
        onChange={(e) => handleSelectChange('local', e.target.value)}
      >
        <SelectItem text="Elija un local" value="default" />
        {locales.map((l) => (
          <SelectItem key={l.localId} text={l.nombre} value={l.nombre} />
        ))}
      </Select>

      <Select
        id="productora"
        labelText="Productora"
        className="filter-item"
        defaultValue="default"
        onChange={(e) => handleSelectChange('productora', e.target.value)}
      >
        <SelectItem text="Elija una productora" value="default" />
        {productoras.map((p) => (
          <SelectItem
            key={p.usuarioId}
            text={p.nombreComercial}
            value={p.nombreComercial}
          />
        ))}
      </Select>
    </div>
  );
};

export default FilterBar;
