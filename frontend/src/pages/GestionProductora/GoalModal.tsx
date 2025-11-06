import React, { useEffect, useState } from 'react';
import {
  Modal,
  Button,
  Form,
  ComboBox,
  TextInput,
  Grid,
  Column,
} from '@carbon/react';
import type { Goal } from './Metas';

type EventoItem = {
  id: string;
  text: string;
};

interface SalesGoalModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Goal>) => void; // Solo enviará los campos que maneja
  goalToEdit: Goal | null;
  eventosList: EventoItem[]; // Necesita la lista de eventos para el ComboBox
}

// Datos de ejemplo para el ComboBox
const eventos = [
  { id: 'evento-1', text: 'Concierto de Rock 2025' },
  { id: 'evento-2', text: 'Feria Gastronómica Local' },
  { id: 'evento-3', text: 'Maratón de la Ciudad' },
];

const GoalModal: React.FC<SalesGoalModalProps> = ({
  open,
  onClose,
  onSave,
  goalToEdit,
  eventosList,
}) => {
  // --- ESTADO INTERNO DEL FORMULARIO ---
  const [selectedEvent, setSelectedEvent] = useState<EventoItem | null>(null);
  const [incomeGoal, setIncomeGoal] = useState("");
  const [conversionRateGoal, setConversionRateGoal] = useState("");
  const [ticketsToSell, setTicketsToSell] = useState("");
  // ... (añade aquí el "Precio promedio" si lo incluyes)

  // Determina el modo basado en la prop
  const isEditMode = !!goalToEdit;

  // --- SINCRONIZAR ESTADO AL ABRIR EL MODAL ---
  useEffect(() => {
    if (open) {
      if (isEditMode && goalToEdit) {
        // MODO EDITAR: Poblar campos desde 'goalToEdit'
        
        // Encuentra el objeto EventoItem que coincide con el nombre en la meta
        const matchingEvent =
          eventosList.find((e) => e.text === goalToEdit.eventName) || null;
        
        setSelectedEvent(matchingEvent);
        setIncomeGoal(goalToEdit.incomeGoal.toString());
        setConversionRateGoal(goalToEdit.conversionRateGoal.toString());
        setTicketsToSell(goalToEdit.ticketsToSell.toString());
      } else {
        // MODO CREAR: Resetear todos los campos
        setSelectedEvent(null);
        setIncomeGoal("");
        setConversionRateGoal("");
        setTicketsToSell("");
      }
    }
  }, [open, goalToEdit, isEditMode, eventosList]); // Se ejecuta cada vez que el modal se abre

  // --- MANEJAR EL ENVÍO ---
  const handleSubmit = () => {
    if (!selectedEvent) {
      // (Aquí puedes añadir validación, ej: mostrar un error)
      console.error("Seleccione un evento");
      return;
    }

    // Prepara los datos para enviar al padre (Metas)
    const formData: Partial<Goal> = {
      eventName: selectedEvent.text,
      incomeGoal: parseFloat(incomeGoal) || 0,
      conversionRateGoal: parseFloat(conversionRateGoal) || 0,
      ticketsToSell: parseInt(ticketsToSell) || 0,
    };

    onSave(formData); // Llama a la función onSave del padre
  };

  return (
    <Modal
      open={open}
      onRequestClose={onClose}
      onRequestSubmit={handleSubmit}
      modalHeading={isEditMode ? "Editar meta de ventas" : "Nueva meta de ventas"}
      primaryButtonText="Aceptar"
      secondaryButtonText="Cancelar"
    >
      <Form>
        <div style={{ marginBottom: "1rem" }}>
          <ComboBox
            id="evento-combobox"
            titleText="Seleccione un evento"
            placeholder="Buscar..."
            items={eventosList}
            itemToString={(item) => (item ? item.text : "")}
            onChange={({ selectedItem }) => setSelectedEvent(selectedItem || null)}
            selectedItem={selectedEvent}
            disabled={isEditMode} 
          />
        </div>

        <Grid>
          <Column lg={8} md={4} sm={4}>
            <TextInput
              id="meta-ingresos"
              labelText="Meta de ingresos"
              placeholder="Ej: 50.000"
              value={incomeGoal}
              onChange={(e) => setIncomeGoal(e.target.value)}
            />
          </Column>
          <Column lg={8} md={4} sm={4}>
            <TextInput
              id="tasa-conversion"
              labelText="Tasa de conversión (Ej: 0.80)"
              placeholder="Ej: 0.80"
              value={conversionRateGoal}
              onChange={(e) => setConversionRateGoal(e.target.value)}
            />
          </Column>
          <Column lg={8} md={4} sm={4}>
            <TextInput
              id="cantidad-tickets"
              labelText="Cantidad de tickets por vender"
              placeholder="Ej: 300"
              value={ticketsToSell}
              onChange={(e) => setTicketsToSell(e.target.value)}
            />
          </Column>
          {/* Aquí iría el "Precio promedio del ticket" si lo tuvieras 
            en tu interfaz 'Goal'.
          */}
        </Grid>
      </Form>
    </Modal>
  );
};

export default GoalModal;