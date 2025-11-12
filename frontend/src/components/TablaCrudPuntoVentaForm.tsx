import { TextInput, Select, SelectItem, VStack } from "@carbon/react";
import { useEffect, useState } from "react";
import { listarDepartamentos, listarDistritos, listarProvincias } from "../services/ubicacionService";
import type { Provincia, Distrito } from "../types/puntoVenta.types";

interface TablaCrudPuntoVentaFormProps {
  isReadOnly: boolean;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isOpen: boolean;
  accion: string;
  uniqueId: number;
  validationState: number;
}

const TablaCrudPuntoVentaForm: React.FC<TablaCrudPuntoVentaFormProps> = ({
  isReadOnly, formData, setFormData, isOpen, accion, uniqueId, validationState
}) => {
  
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [provincias, setProvincias] = useState<any[]>([]);
  const [distritos, setDistritos] = useState<any[]>([]);
  const [errors, setErrors] = useState({
    nombre: '',
    direccion: '',
    departamentoId: '',
    provinciaId: '',
    distritoId: '',
    estado: ''
  });

  useEffect(() => {
    if (isOpen) {
      listarDepartamentos().then(setDepartamentos);
      listarProvincias().then(setProvincias);
      listarDistritos().then(setDistritos);
    }
  }, [isOpen]);

  const provinciasFiltradas = (provincias as Provincia[]).filter(
    (prov) => prov.departamento.departamentoId?.toString() === formData.departamentoId
  );

  const distritosFiltrados = (distritos as Distrito[]).filter(
    (dist) => dist.provincia.provinciaId?.toString() === formData.provinciaId
  );

  // Funciones de validación
  const validarNombre = (value: string) => {
    if (!value.trim()) return 'El nombre es obligatorio';
    return '';
  };

  const validarDireccion = (value: string) => {
    if (!value.trim()) return 'La dirección es obligatoria';
    return '';
  };

  const validarDepartamento = (value: string) => {
    if (!value) return 'Debe seleccionar un departamento';
    return '';
  };

  const validarProvincia = (value: string) => {
    if (!value) return 'Debe seleccionar una provincia';
    return '';
  };

  const validarDistrito = (value: string) => {
    if (!value) return 'Debe seleccionar un distrito';
    return '';
  };

  const validarEstado = (value: string) => {
    if (!value) return 'El estado es obligatorio';
    return '';
  };

  // Validación cuando `validationState` es 2
  useEffect(() => {
    if (validationState === 2) {
      setErrors(prev => ({
        ...prev,
        nombre: validarNombre(formData.nombre || ''),
        direccion: validarDireccion(formData.direccion || ''),
        departamentoId: validarDepartamento(formData.departamentoId),
        provinciaId: validarProvincia(formData.provinciaId),
        distritoId: validarDistrito(formData.distritoId),
        estado: validarEstado(formData.estado || '')
      }));
    }
  }, [validationState, formData]);

  return (
    <VStack gap={4}>
      <TextInput
        id={`nombre-${uniqueId}`}
        labelText="Nombre"
        value={formData.nombre || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
        onBlur={() => setErrors(prev => ({ ...prev, nombre: validarNombre(formData.nombre || '') }))}
        readOnly={isReadOnly}
        invalid={!!errors.nombre && !isReadOnly}
        invalidText={errors.nombre}
        placeholder="Ingrese el nombre"
      />
      <TextInput
        id={`direccion-${uniqueId}`}
        labelText="Dirección"
        value={formData.direccion || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
        onBlur={() => setErrors(prev => ({ ...prev, direccion: validarDireccion(formData.direccion || '') }))}
        readOnly={isReadOnly}
        invalid={!!errors.direccion && !isReadOnly}
        invalidText={errors.direccion}
        placeholder="Ingrese la dirección"
      />

      <Select
        id={`departamento-${uniqueId}`}
        labelText="Departamento"
        value={formData.departamentoId || ''}
        onChange={(e) => {

          const depId = e.target.value;
          const depNombre = e.target.selectedOptions[0]?.text || '';

          // Filtrar provincias del nuevo departamento
          const nuevasProvincias = (provincias as Provincia[]).filter(
            (prov) => prov.departamento.departamentoId?.toString() === depId
          );
          const primeraProvinciaId = nuevasProvincias[0]?.provinciaId?.toString() || '';
          const primeraProvinciaNombre = nuevasProvincias[0]?.nombre || '';
          // Filtrar distritos de esa primera provincia
          const nuevosDistritos = (distritos as Distrito[]).filter(
            (dist) => dist.provincia.provinciaId?.toString() === primeraProvinciaId
          );
          const primerDistritoId = nuevosDistritos[0]?.distritoId?.toString() || '';
          const primerDistritoNombre = nuevosDistritos[0]?.nombre || '';

          setFormData(prev => ({
            ...prev,
            departamentoId: depId,
            departamentoNombre: depNombre,
            provinciaId: primeraProvinciaId,
            provinciaNombre: primeraProvinciaNombre,
            distritoId: primerDistritoId,
            distritoNombre: primerDistritoNombre
          }));
          
        }}
        readOnly={isReadOnly}
        invalid={!!errors.departamentoId && !isReadOnly}
        invalidText={errors.departamentoId}
      >
        {departamentos.map(dep => (
          <SelectItem key={dep.departamentoId} value={dep.departamentoId.toString()} text={dep.nombre} />
        ))}
      </Select>

      <Select
        id={`provincia-${uniqueId}`}
        labelText="Provincia"
        value={formData.provinciaId || ''}
        onChange={(e) => {

          const provId = e.target.value;
          const provNombre = e.target.selectedOptions[0]?.text || '';

          // Filtrar distritos de la nueva provincia
          const nuevosDistritos = (distritos as Distrito[]).filter(
            (dist) => dist.provincia.provinciaId?.toString() === provId
          );

          const primerDistritoId = nuevosDistritos[0]?.distritoId?.toString() || '';
          const primerDistritoNombre = nuevosDistritos[0]?.nombre || '';

          setFormData(prev => ({
            ...prev,
            provinciaId: provId,
            provinciaNombre: provNombre,
            distritoId: primerDistritoId,
            distritoNombre: primerDistritoNombre,
          }));
        }}
        disabled={isReadOnly || !formData.departamentoId}
        readOnly={isReadOnly}
        invalid={!!errors.provinciaId && !isReadOnly}
        invalidText={errors.provinciaId}
      >
        {provinciasFiltradas.map(prov => (
          <SelectItem key={prov.provinciaId} value={prov.provinciaId} text={prov.nombre} />
        ))}
      </Select>

      <Select
        id={`distrito-${uniqueId}`}
        labelText="Distrito"
        value={formData.distritoId || ''}
        onChange={(e) => setFormData(prev => ({ 
          ...prev, 
          distritoId: e.target.value,
          distritoNombre: e.target.selectedOptions[0]?.text || ''
        }))}
        disabled={isReadOnly || !formData.provinciaId}
        readOnly={isReadOnly}
        invalid={!!errors.distritoId && !isReadOnly}
        invalidText={errors.distritoId}
      >
        {distritosFiltrados.map(dist => (
          <SelectItem key={dist.distritoId} value={dist.distritoId} text={dist.nombre} />
        ))}
      </Select>
      
      <Select
        id={`estado-${uniqueId}`}
        labelText="Estado"
        value={formData.estado || 'Activo'}
        onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
        readOnly={isReadOnly}
        invalid={!!errors.estado && !isReadOnly}
        invalidText={errors.estado}
      >
        <SelectItem value="Activo" text="Activo" />
        <SelectItem value="Inactivo" text="Inactivo" />
      </Select>
    </VStack>
  );
};

export default TablaCrudPuntoVentaForm;