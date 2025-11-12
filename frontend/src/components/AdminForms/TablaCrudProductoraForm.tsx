import { TextInput, Select, SelectItem, VStack, PasswordInput } from "@carbon/react";
import { useEffect, useState } from "react";

//Aquí podrín estar todos los dialogs de los cruds

interface TablaCrudProductoraFormProps{
  isReadOnly: boolean;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  accion: String;
  uniqueId?: number;
  validationState: number;
}

const TablaCrudProductoraForm: React.FC<TablaCrudProductoraFormProps> = ({
  isReadOnly, formData, setFormData, accion, uniqueId, validationState
}) => {

  const [errors, setErrors] = useState({
    telefono: '',
    ruc: '',
    email: ''
  });

  const validarTelefono = (value: string) => {
    if (!value) return 'El teléfono es obligatorio';
    if (!/^\d{9}$/.test(value)) return 'Debe tener exactamente 9 dígitos';
    return '';
  };

  // Función de validación de RUC
  const validarRuc = (value: string) => {
    if (!value) return 'El RUC es obligatorio';
    if (!/^\d{11}$/.test(value)) return 'El RUC debe tener 11 dígitos';
    return '';
  };

  // Función de validación de email
  const validarEmail = (value: string) => {
    if (!value) return 'El correo es obligatorio';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Correo inválido';
    return '';
  };

  // Validación que se ejecuta solo cuando `validationState` es 2
  useEffect(() => {
    if (validationState === 2) { // Solo aplicar validaciones cuando validationState es 2
      setErrors(prev => ({
        ...prev,
        telefono: validarTelefono(formData.telefono || ''),
        ruc: validarRuc(formData.ruc || ''),
        email: validarEmail(formData.email || '')
      }));
    }
  }, [validationState, formData]);

  return (
    <VStack gap={4}>
      <TextInput
        id={`ruc-${uniqueId}`}
        labelText="RUC"
        value={formData.ruc || ''}
        onChange={(e) => {
          const value = e.target.value;
          setFormData(prev => ({ ...prev, ruc: value }));
          setErrors(prev => ({ ...prev, ruc: validarRuc(value) }));
        }}
        onBlur={() => setErrors(prev => ({ ...prev, ruc: validarRuc(formData.ruc || '') }))}
        readOnly={isReadOnly}
        invalid={!!errors.ruc && !isReadOnly}
        invalidText={errors.ruc}
        maxLength={11}
        placeholder="Ingrese 11 dígitos"
      />
      <TextInput
        id={`razon-social-${uniqueId}`}
        labelText="Razón Social"
        value={formData.razonSocial || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, razonSocial: e.target.value }))}
        readOnly={isReadOnly}
      />
      <TextInput
        id={`nombre-comercial-${uniqueId}`}
        labelText="Nombre Comercial"
        value={formData.nombreComercial || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, nombreComercial: e.target.value }))}
        readOnly={isReadOnly}
      />
      <TextInput
        id={`correo-${uniqueId}`}
        labelText="Correo Electrónico"
        value={formData.email || ''}
        onChange={(e) => {
          const value = e.target.value;
          setFormData(prev => ({ ...prev, email: value }));
          setErrors(prev => ({ ...prev, email: validarEmail(value) }));
        }}
        onBlur={() => setErrors(prev => ({ ...prev, email: validarEmail(formData.email || '') }))}
        readOnly={isReadOnly}
        invalid={!!errors.email && !isReadOnly}
        invalidText={errors.email}
        type="email"
      />
      <TextInput
        id={`telefono-${uniqueId}`}
        labelText="Teléfono de Contacto"
        value={formData.telefono || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, ''); // Solo números
          setFormData(prev => ({ ...prev, telefono: value }));
          setErrors(prev => ({ ...prev, telefono: validarTelefono(value) }));
        }}
        onBlur={() => setErrors(prev => ({ ...prev, telefono: validarTelefono(formData.telefono || '') }))}
        readOnly={isReadOnly}
        invalid={!!errors.telefono && !isReadOnly}
        invalidText={errors.telefono}
        maxLength={9}
        placeholder="Ingrese 9 dígitos"
      />
      <PasswordInput
        id={`contrasenha-${uniqueId}`}
        labelText="Contraseña"
        value={formData.contrasenha || ''}
        type="password"
        onChange={(e) => setFormData(prev => ({ ...prev, contrasenha: e.target.value }))}
        readOnly={isReadOnly}
      />
      {(accion === 'Editar') && (
        <Select
          id={`estado-${uniqueId}`}
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