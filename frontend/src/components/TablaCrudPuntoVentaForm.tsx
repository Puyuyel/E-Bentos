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
}

const TablaCrudPuntoVentaForm: React.FC<TablaCrudPuntoVentaFormProps> = ({
  isReadOnly, formData, setFormData, isOpen, accion
}) => {
  
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [provincias, setProvincias] = useState<any[]>([]);
  const [distritos, setDistritos] = useState<any[]>([]);

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

  useEffect(() => {
    console.log("FormData actualizado:", formData);
  }, [formData]);

  return (
    <VStack gap={4}>
      <TextInput
        id="nombre"
        labelText="Nombre"
        value={formData.nombre || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
        readOnly={isReadOnly}
      />
      <TextInput
        id="direccion"
        labelText="Dirección"
        value={formData.direccion || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
        readOnly={isReadOnly}
      />

      <Select
        id="departamento"
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
      >
        {departamentos.map(dep => (
          <SelectItem key={dep.departamentoId} value={dep.departamentoId.toString()} text={dep.nombre} />
        ))}
      </Select>

      <Select
        id="provincia"
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
      >
        {provinciasFiltradas.map(prov => (
          <SelectItem key={prov.provinciaId} value={prov.provinciaId} text={prov.nombre} />
        ))}
      </Select>

      <Select
        id="distrito"
        labelText="Distrito"
        value={formData.distritoId || ''}
        onChange={(e) => setFormData(prev => ({ 
          ...prev, 
          distritoId: e.target.value,
          distritoNombre: e.target.selectedOptions[0]?.text || ''
        }))}
        disabled={isReadOnly || !formData.provinciaId}
        readOnly={isReadOnly}
      >
        {distritosFiltrados.map(dist => (
          <SelectItem key={dist.distritoId} value={dist.distritoId} text={dist.nombre} />
        ))}
      </Select>
      
      <Select
        id="estado"
        labelText="Estado"
        value={formData.estado || 'Activo'}
        onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
        readOnly={isReadOnly}
      >
        <SelectItem value="Activo" text="Activo" />
        <SelectItem value="Inactivo" text="Inactivo" />
      </Select>
    </VStack>
  );
};

export default TablaCrudPuntoVentaForm;