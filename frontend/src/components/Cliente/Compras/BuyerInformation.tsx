import React from "react";
import { Button, TextInput, Form, Stack } from "@carbon/react";
import { ArrowLeft, ArrowRight } from "@carbon/icons-react";

interface BuyerInformationProps {
  onNext: (data: BuyerData) => void;
  onBack: () => void;
}

export interface BuyerData {
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
}

export function BuyerInformation({ onNext, onBack }: BuyerInformationProps) {
  const [formData, setFormData] = React.useState<BuyerData>({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
  });

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const handleChange = (field: keyof BuyerData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es obligatorio";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = "El número de identificación es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "0.5rem" }}
        >
          Información del comprador
        </h1>
        <p style={{ color: "#525252" }}>
          Por favor, completa tus datos para continuar
        </p>
      </div>

      <Form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
        }}
      >
        <Stack gap={6}>
          <TextInput
            id="fullName"
            labelText="Nombre completo"
            placeholder="Juan Pérez García"
            value={formData.fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("fullName", e.target.value)
            }
            invalid={!!errors.fullName}
            invalidText={errors.fullName}
            size="lg"
          />

          <TextInput
            id="email"
            labelText="Correo electrónico"
            placeholder="ejemplo@correo.com"
            type="email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("email", e.target.value)
            }
            invalid={!!errors.email}
            invalidText={errors.email}
            size="lg"
          />

          <TextInput
            id="phone"
            labelText="Teléfono"
            placeholder="+34 600 000 000"
            type="tel"
            value={formData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("phone", e.target.value)
            }
            invalid={!!errors.phone}
            invalidText={errors.phone}
            size="lg"
          />

          <TextInput
            id="idNumber"
            labelText="Número de identificación"
            placeholder="DNI, Pasaporte, etc."
            value={formData.idNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("idNumber", e.target.value)
            }
            invalid={!!errors.idNumber}
            invalidText={errors.idNumber}
            size="lg"
          />

          <div style={{ display: "flex", gap: "1rem", paddingTop: "1rem" }}>
            <Button
              kind="secondary"
              size="lg"
              onClick={onBack}
              renderIcon={ArrowLeft}
              style={{ flex: 1 }}
            >
              Volver
            </Button>
            <Button
              type="submit"
              kind="primary"
              size="lg"
              renderIcon={ArrowRight}
              style={{ flex: 1 }}
            >
              Continuar
            </Button>
          </div>
        </Stack>
      </Form>
    </div>
  );
}
