import { PasswordInput, Select, SelectItem, TextInput, VStack } from "@carbon/react";
import { useEffect, useState } from "react";
import { listarPuntosVenta } from "../../services/puntoVentaService";
import type { PuntoVenta } from "../../types/puntoVenta.types";

interface TablaCrudTaquilleroFormProps {
  isReadOnly: boolean;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isOpen: boolean;
  accion: string;
  uniqueId: number;
  validationState: number;
}

const TablaCrudTaquilleroForm: React.FC<TablaCrudTaquilleroFormProps> = ({
  isReadOnly, formData, setFormData, accion, uniqueId, isOpen, validationState
}) => {
  const [errors, setErrors] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    email: '',
    telefono: '',
    contrasenha: '',
    puntoVentaId: ''
  });

  const [puntosVenta, setPuntosVenta] = useState<PuntoVenta[]>([]);

  // Cargar puntos de venta cuando se abre el diálogo
  useEffect(() => {
    if (isOpen) {
      listarPuntosVenta()
        .then((data) => {
          setPuntosVenta(data);
          if (accion === 'Agregar' && data.length > 0 && !formData.puntoVentaId) {
          setFormData(prev => ({
            ...prev,
            puntoVentaId: data[0].puntoventaId.toString()
          }));
        }
        })
        .catch((error) => {
          console.error('Error al cargar puntos de venta:', error);
        });
    }
  }, [isOpen]);

  // Validación de nombres
  const validarNombres = (value: string) => {
    if (!value || !value.trim()) return 'Los nombres son obligatorios';
    if (value.trim().length < 2) return 'Debe tener al menos 2 caracteres';
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(value)) return 'Solo se permiten letras';
    return '';
  };

  // Validación de apellidos
  const validarApellidos = (value: string) => {
    if (!value || !value.trim()) return 'Los apellidos son obligatorios';
    if (value.trim().length < 2) return 'Debe tener al menos 2 caracteres';
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(value)) return 'Solo se permiten letras';
    return '';
  };

  // Validación de DNI
  const validarDni = (value: string) => {
    if (!value) return 'El DNI es obligatorio';
    if (!/^\d{8}$/.test(value)) return 'El DNI debe tener exactamente 8 dígitos';
    return '';
  };

  // Validación de email
  const validarEmail = (value: string) => {
    if (!value) return 'El correo es obligatorio';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Correo inválido';
    return '';
  };

  // Validación de teléfono
  const validarTelefono = (value: string) => {
    if (!value) return 'El teléfono es obligatorio';
    if (!/^\d{9}$/.test(value)) return 'Debe tener exactamente 9 dígitos';
    return '';
  };

  // Validación de contraseña
  const validarContrasenha = (value: string) => {
    if (accion === 'Agregar' && !value) return 'La contraseña es obligatoria';
    if (value && value.length < 6) return 'Mínimo 6 caracteres';
    return '';
  };

  // Validación de punto de venta
  const validarPuntoVenta = (value: string) => {
    if (!value) return 'Debe seleccionar un punto de venta';
    return '';
  };

  useEffect(() => {
    if (validationState === 2) { // Solo aplicar validaciones cuando validationState es 2
      setErrors(prev => ({
        ...prev,
        nombres: validarNombres(formData.nombres || ''),
        apellidos: validarApellidos(formData.apellidos || ''),
        dni: validarDni(formData.dni || ''),
        email: validarEmail(formData.email || ''),
        telefono: validarTelefono(formData.telefono || ''),
        contrasenha: validarContrasenha(formData.contrasenha || '')
        //puntoVentaId: validarPuntoVenta(formData.puntoVentaId || '')
      }));
    }
  }, [validationState, formData]); // Se ejecuta cuando validationState o formData cambian

  return (
    <VStack gap={4}>
      <TextInput
        id={`nombres-${uniqueId}`}
        labelText="Nombres"
        value={formData.nombres || ''}
        onChange={(e) => {
          const value = e.target.value;
          setFormData(prev => ({ ...prev, nombres: value }));
          setErrors(prev => ({ ...prev, nombres: validarNombres(value) }));
        }}
        onBlur={() => setErrors(prev => ({ ...prev, nombres: validarNombres(formData.nombres || '') }))}
        readOnly={isReadOnly}
        invalid={!!errors.nombres && !isReadOnly}
        invalidText={errors.nombres}
        placeholder="Ingrese nombres"
      />
      <TextInput
        id={`apellidos-${uniqueId}`}
        labelText="Apellidos"
        value={formData.apellidos || ''}
        onChange={(e) => {
          const value = e.target.value;
          setFormData(prev => ({ ...prev, apellidos: value }));
          setErrors(prev => ({ ...prev, apellidos: validarApellidos(value) }));
        }}
        onBlur={() => setErrors(prev => ({ ...prev, apellidos: validarApellidos(formData.apellidos || '') }))}
        readOnly={isReadOnly}
        invalid={!!errors.apellidos && !isReadOnly}
        invalidText={errors.apellidos}
        placeholder="Ingrese apellidos"
      />
      <TextInput
        id={`dni-${uniqueId}`}
        labelText="DNI"
        value={formData.dni || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, ''); // Solo números
          setFormData(prev => ({ ...prev, dni: value }));
          setErrors(prev => ({ ...prev, dni: validarDni(value) }));
        }}
        onBlur={() => setErrors(prev => ({ ...prev, dni: validarDni(formData.dni || '') }))}
        readOnly={isReadOnly}
        invalid={!!errors.dni && !isReadOnly}
        invalidText={errors.dni}
        maxLength={8}
        placeholder="Ingrese 8 dígitos"
      />
      <TextInput
        id={`email-${uniqueId}`}
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
        labelText="Teléfono"
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
        onChange={(e) => {
          const value = e.target.value;
          setFormData(prev => ({ ...prev, contrasenha: value }));
          setErrors(prev => ({ ...prev, contrasenha: validarContrasenha(value) }));
        }}
        onBlur={() => setErrors(prev => ({ ...prev, contrasenha: validarContrasenha(formData.contrasenha || '') }))}
        readOnly={isReadOnly}
        invalid={!!errors.contrasenha && !isReadOnly}
        invalidText={errors.contrasenha}
        placeholder={accion === 'Agregar' ? 'Mínimo 6 caracteres' : 'Dejar vacío para no cambiar'}
      />

      <Select
        id={`punto-venta-${uniqueId}`}
        labelText="Punto de Venta"
        value={formData.puntoVentaId || ''}
        onChange={(e) => {
          const value = e.target.value;
          setFormData(prev => ({ ...prev, puntoVentaId: value }));
          setErrors(prev => ({ ...prev, puntoVentaId: validarPuntoVenta(value) }));
        }}
        readOnly={isReadOnly}
        invalid={!!errors.puntoVentaId && !isReadOnly}
        invalidText={errors.puntoVentaId}
      >
        {puntosVenta.map((pv) => (
          <SelectItem 
            key={pv.puntoventaId} 
            value={pv.puntoventaId.toString()} 
            text={pv.nombre} 
          />
        ))}
      </Select>

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

export default TablaCrudTaquilleroForm;