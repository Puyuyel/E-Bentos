import React from 'react';
import '../styles/FilterBar.css';
import {
  DatePicker,
  DatePickerInput,
  Select,
  SelectItem,
} from '@carbon/react';

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
        <SelectItem text="Elija un evento" value="default" />
        <SelectItem text="Concierto" value="concierto" />
        <SelectItem text="Teatro" value="teatro" />
        <SelectItem text="Festival" value="festival" />
      </Select>

      <Select
        id="local"
        labelText="Local"
        className="filter-item"
        defaultValue="default"
        onChange={(e) => handleSelectChange('local', e.target.value)}
      >
        <SelectItem text="Elija un local" value="default" />
        <SelectItem text="Local A" value="A" />
        <SelectItem text="Local B" value="B" />
        <SelectItem text="Local C" value="C" />
      </Select>

      <Select
        id="productora"
        labelText="Productora"
        className="filter-item"
        defaultValue="default"
        onChange={(e) => handleSelectChange('productora', e.target.value)}
      >
        <SelectItem text="Elija una productora" value="default" />
        <SelectItem text="Activa" value="activa" />
        <SelectItem text="Inactiva" value="inactiva" />
      </Select>
    </div>
  );
};

export default FilterBar;
