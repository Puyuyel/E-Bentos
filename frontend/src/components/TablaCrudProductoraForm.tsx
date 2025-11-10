import { TextInput, Select, SelectItem, VStack, PasswordInput } from "@carbon/react";

//Aquí podrín estar todos los dialogs de los cruds

interface TablaCrudProductoraFormProps{
  isReadOnly: boolean;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  accion: String;
}

const TablaCrudProductoraForm: React.FC<TablaCrudProductoraFormProps> = ({
  isReadOnly, formData, setFormData, accion
}) => {

  return (
    <VStack gap={4}>
      <TextInput
        id="ruc"
        labelText="RUC"
        value={formData.ruc || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, ruc: e.target.value }))}
        readOnly={isReadOnly}
        //disabled={true}
      />
      <TextInput
        id="razon-social"
        labelText="Razón Social"
        value={formData.razonSocial || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, razonSocial: e.target.value }))}
        readOnly={isReadOnly}
      />
      <TextInput
        id="nombre-comercial"
        labelText="Nombre Comercial"
        value={formData.nombreComercial || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, nombreComercial: e.target.value }))}
        readOnly={isReadOnly}
      />
      <TextInput
        id="correo"
        labelText="Correo Electrónico"
        value={formData.email || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        readOnly={isReadOnly}
      />
      <TextInput
        id="telefono"
        labelText="Teléfono de Contacto"
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

export default TablaCrudProductoraForm;