import { TextInput, Select, SelectItem, VStack } from "@carbon/react";

//Aquí podrín estar todos los dialogs de los cruds

const TablaCrudDialogForm: React.FC = () => {
  return (
    <VStack gap={4}>
      <TextInput
        id="ruc"
        labelText="RUC"
        defaultValue="20123456789"
        readOnly
      />
      <TextInput
        id="razon-social"
        labelText="Razón Social"
        defaultValue="Productora Andina SAC"
        readOnly
      />
      <TextInput
        id="nombre-comercial"
        labelText="Nombre Comercial"
        defaultValue="CineAndes"
        readOnly
      />
      <TextInput
        id="correo"
        labelText="Correo Electrónico"
        defaultValue="contacto@cineandes.pe"
        readOnly
      />
      <TextInput
        id="telefono"
        labelText="Teléfono de Contacto"
        defaultValue="+51 987 654 321"
        readOnly
      />
      <Select
        id="estado"
        labelText="Estado"
        defaultValue="activo"
        disabled
      >
        <SelectItem value="activo" text="Activo" />
        <SelectItem value="inactivo" text="Inactivo" />
      </Select>
    </VStack>
  );
};

export default TablaCrudDialogForm;