import { TextInput, VStack } from "@carbon/react";

interface TablaCrudTaquilleroFormProps {
  isReadOnly: boolean;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  accion: string;
}

const TablaCrudTaquilleroForm: React.FC<TablaCrudTaquilleroFormProps> = ({
  isReadOnly,
  formData,
  setFormData,
  accion
}) => {
  return (
    <VStack gap={4}>
      <TextInput
        id="nombres"
        labelText="Nombres"
        value={formData.nombres || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, nombres: e.target.value }))}
        readOnly={isReadOnly}
      />
      <TextInput
        id="apellidos"
        labelText="Apellidos"
        value={formData.apellidos || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
        readOnly={isReadOnly}
      />
      <TextInput
        id="dni"
        labelText="DNI"
        value={formData.dni || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
        readOnly={isReadOnly}
      />
      <TextInput
        id="email"
        labelText="Correo Electrónico"
        value={formData.email || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        readOnly={isReadOnly}
      />
      <TextInput
        id="telefono"
        labelText="Teléfono"
        value={formData.telefono || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
        readOnly={isReadOnly}
      />
      <TextInput
        id="punto-venta-nombre"
        labelText="Punto de Venta"
        value={formData.puntoVentaNombre || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, puntoVentaNombre: e.target.value }))}
        readOnly={isReadOnly}
      />
      <TextInput
        id="punto-venta-direccion"
        labelText="Dirección del Punto de Venta"
        value={formData.puntoVentaDireccion || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, puntoVentaDireccion: e.target.value }))}
        readOnly={isReadOnly}
      />
    </VStack>
  );
};

export default TablaCrudTaquilleroForm;