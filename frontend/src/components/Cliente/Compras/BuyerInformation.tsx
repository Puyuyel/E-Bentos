import React from "react";
import {
  Button,
  TextInput,
  Form,
  Stack,
  Modal,
  InlineLoading,
} from "@carbon/react";
import yapeLogo from "../../../assets/yapeLogo.jpeg";
import {
  ArrowLeft,
  ArrowRight,
  Checkmark,
  WarningAlt,
} from "@carbon/icons-react";
import { useAuthStore } from "../../../store/useAuthStore";

import type { BuyerData } from "../../../types/cliente.types";
import { useEntradasClienteStore } from "../../../store/useEntradasClienteStore";
import { useZonasEventoStore } from "../../../store/useZonasEventoStore";
import { comprarEntradasService } from "../../../services/ClientServices/comprarEntradasService";

interface BuyerInformationProps {
  onNext: (data: BuyerData) => void;
  onBack: () => void;
}

export function BuyerInformation({ onNext, onBack }: BuyerInformationProps) {
  const { user } = useAuthStore();
  const clienteId = user?.id;
  const { eventoId } = useZonasEventoStore();
  const {
    setCorreoCli,
    setCvvTarjeta,
    setFechaVencimiento,
    setNombreTitular,
    setNumTarjeta,
    setMetodoPago,
    getSelections,
    setReservaId,
  } = useEntradasClienteStore();
  const [paymentMethod, setPaymentMethod] = React.useState<
    "TARJETA_DE_CREDITO" | "YAPE"
  >("TARJETA_DE_CREDITO");
  const [formData, setFormData] = React.useState<BuyerData>({
    nombreTitularTarjeta: "",
    fechaVencimiento: "",
    cvvTarjeta: "",
    numTarjeta: "",
    correoCli: "",
  });

  const tickets = getSelections(eventoId);

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [processResult, setProcessResult] = React.useState<
    null | "success" | "error"
  >(null);

  const handleChange = (field: keyof BuyerData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    // If payment method is TARJETA, validate card fields
    if (paymentMethod === "TARJETA_DE_CREDITO") {
      if (!formData.nombreTitularTarjeta.trim()) {
        newErrors.nombreTitularTarjeta = "El nombre completo es obligatorio";
      }

      if (!formData.fechaVencimiento.trim()) {
        newErrors.fechaVencimiento = "La fecha de vencimiento es obligatoria.";
      }

      if (!formData.cvvTarjeta.trim()) {
        newErrors.cvvTarjeta = "El código de seguridad es obligatorio.";
      }

      if (!formData.numTarjeta.trim()) {
        newErrors.numTarjeta = "El número de tarjeta es obligatorio.";
      }

      if (formData.numTarjeta.length != 19) {
        newErrors.numTarjeta = "El número de tarjeta debe ser de 16 dígitos.";
      }
    }

    // correo only required when TAQUILLERO role (same behaviour as before)
    if (user?.rol === "TAQUILLERO") {
      if (!formData.correoCli.trim()) {
        newErrors.correoCli = "El correo electrónico es obligatorio";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]/.test(formData.correoCli)) {
        newErrors.correoCli = "Ingresa un correo electrónico válido.";
      }
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

  const handleComprarEntradas = async () => {
    // Validate form first; do not proceed if invalid
    if (!validateForm()) {
      return;
    }

    // show loading modal
    setIsProcessing(true);
    setProcessResult(null);

    try {
      let response;
      if (tickets && clienteId)
        response = await comprarEntradasService(tickets, Number(clienteId));
      console.log("Se ejecutó la compra, response: ", response);
      // comprarEntradasService may return either axios response or direct data
      const raw = response?.data ?? response;
      console.log("reserva response data:", raw);

      // extract reservaId from possible shapes
      let parsedReservaId = 0;
      if (raw == null) {
        parsedReservaId = 0;
      } else if (typeof raw === "number") {
        parsedReservaId = raw;
      } else if (
        Array.isArray(raw) &&
        raw.length > 0 &&
        typeof raw[0] === "number"
      ) {
        parsedReservaId = raw[0];
      } else if (typeof raw === "object" && (raw as any).reservaId != null) {
        parsedReservaId = Number((raw as any).reservaId);
      } else if (typeof raw === "string") {
        const maybe = Number(raw);
        parsedReservaId = Number.isFinite(maybe) ? maybe : 0;
      }

      console.log("parsedReservaId", parsedReservaId);
      if (
        parsedReservaId &&
        Number.isFinite(parsedReservaId) &&
        parsedReservaId > 0
      ) {
        setReservaId(parsedReservaId);
        setProcessResult("success");
        // advance to next phase only after user confirms success modal
      } else {
        setProcessResult("error");
      }
    } catch (error: any) {
      console.log("error al momento de pagar. ", error?.message ?? error);
      setProcessResult("error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
      {/* Processing modal */}
      <Modal
        open={isProcessing}
        passiveModal
        modalHeading="Recibiendo el pago..."
        onRequestClose={() => {}}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <InlineLoading description="Recibiendo el pago..." />
        </div>
      </Modal>

      {/* Success modal */}
      <Modal
        open={processResult === "success"}
        modalHeading="Pago recibido"
        primaryButtonText="Aceptar"
        onRequestSubmit={() => {
          setProcessResult(null);
          onNext(formData);
        }}
        onRequestClose={() => setProcessResult(null)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Checkmark size={24} />
          <span>El pago fue recibido correctamente</span>
        </div>
      </Modal>

      {/* Error modal */}
      <Modal
        open={processResult === "error"}
        modalHeading="Error en el pago"
        primaryButtonText="Cerrar"
        onRequestSubmit={() => setProcessResult(null)}
        onRequestClose={() => setProcessResult(null)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <WarningAlt size={24} />
          <span>El pago no fue recibido correctamente</span>
        </div>
      </Modal>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "0.5rem" }}
        >
          Información del comprador en el pago
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
          {/* Payment method selector */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="button"
              onClick={() => {
                setPaymentMethod("TARJETA_DE_CREDITO");
                setMetodoPago("TARJETA_DE_CREDITO");
              }}
              aria-pressed={paymentMethod === "TARJETA_DE_CREDITO"}
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: 8,
                color: "black",
                border:
                  paymentMethod === "TARJETA_DE_CREDITO"
                    ? "2px solid #0f62fe"
                    : "1px solid #e5e5e5",
                background:
                  paymentMethod === "TARJETA_DE_CREDITO" ? "#f0f6ff" : "white",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              TARJETA
            </button>

            <button
              type="button"
              onClick={() => {
                setPaymentMethod("YAPE");
                setMetodoPago("YAPE");
              }}
              aria-pressed={paymentMethod === "YAPE"}
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: 8,
                color: "black",
                border:
                  paymentMethod === "YAPE"
                    ? "2px solid #0f62fe"
                    : "1px solid #e5e5e5",
                background: paymentMethod === "YAPE" ? "#f0f6ff" : "white",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              YAPE
            </button>
          </div>

          {paymentMethod === "TARJETA_DE_CREDITO" ? (
            <>
              <TextInput
                id="nombreTitularTarjeta"
                labelText="Nombre del titular"
                placeholder="Ejm: Juan Pérez"
                value={formData.nombreTitularTarjeta}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange("nombreTitularTarjeta", e.target.value);
                  setNombreTitular(e.target.value);
                }}
                invalid={!!errors.nombreTitularTarjeta}
                invalidText={errors.nombreTitularTarjeta}
                size="lg"
              />

              <div
                style={{
                  display: "flex",
                  gap: "2rem",
                }}
              >
                <TextInput
                  id="fechaVencimiento"
                  labelText="Fecha de vencimiento"
                  placeholder="Ejm: 11/25"
                  value={formData.fechaVencimiento}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange("fechaVencimiento", e.target.value);
                    setFechaVencimiento(e.target.value);
                  }}
                  invalid={!!errors.fechaVencimiento}
                  invalidText={errors.fechaVencimiento}
                  size="lg"
                />

                <TextInput
                  id="cvvTarjeta"
                  labelText="CVV"
                  placeholder="Ejm: 123"
                  value={formData.cvvTarjeta}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange("cvvTarjeta", e.target.value);
                    setCvvTarjeta(e.target.value);
                  }}
                  invalid={!!errors.cvvTarjeta}
                  invalidText={errors.cvvTarjeta}
                  size="lg"
                />
              </div>

              <TextInput
                id="numTarjeta"
                labelText="Número de tarjeta"
                placeholder="Ejm: 1111 0000 1010 0011"
                value={formData.numTarjeta}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange("numTarjeta", e.target.value);
                  setNumTarjeta(e.target.value);
                }}
                invalid={!!errors.numTarjeta}
                invalidText={errors.numTarjeta}
                size="lg"
              />
            </>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "1rem 0",
              }}
            >
              <div
                style={{
                  borderRadius: 8,
                  padding: "1rem",
                  background: "#fff",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={yapeLogo}
                  alt="Yape QR"
                  style={{ maxWidth: 220, maxHeight: 220 }}
                />
              </div>
            </div>
          )}

          {user?.rol == "TAQUILLERO" && (
            <TextInput
              id="correoCli"
              labelText="Correo del cliente"
              placeholder="Ejm: correo@ebentos.com"
              value={formData.correoCli}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange("correoCli", e.target.value);
                setCorreoCli(e.target.value);
              }}
              invalid={!!errors.correoCli}
              invalidText={errors.correoCli}
              size="lg"
            />
          )}

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
              type="button"
              kind="primary"
              size="lg"
              onClick={handleComprarEntradas}
              renderIcon={ArrowRight}
              style={{ flex: 1 }}
            >
              Pagar
            </Button>
          </div>
        </Stack>
      </Form>
    </div>
  );
}
