import { PasswordInput, Select, SelectItem, TextInput, VStack } from "@carbon/react";

interface TablaCrudGestorLocalFormProps {
  isReadOnly: boolean;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  accion: String;
}

const TablaCrudGestorLocalForm: React.FC<TablaCrudGestorLocalFormProps> = ({
  isReadOnly, formData, setFormData, accion
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
      <PasswordInput
        id="contrasenha"
        labelText="Contraseña"
        value={formData.contrasenha || ''}
        type="password"
        onChange={(e) => setFormData(prev => ({ ...prev, contrasenha: e.target.value }))}
        readOnly={isReadOnly}
      />
      {(accion === 'Editar') && (
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
        )
      }
    </VStack>
  );
};

export default TablaCrudGestorLocalForm;