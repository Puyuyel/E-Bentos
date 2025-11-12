import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  ComboBox,
  TextInput,
  Grid,
  Column,
} from "@carbon/react";
import type { Goal } from "./Metas";
import "../../styles/GestionProductora/GoalModal.css";
import { listarEventosDisponibles } from "../../services/goalService";

type EventoItem = {
  id: string;
  text: string;
};

interface SalesGoalModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Goal>) => void; // Solo enviará los campos que maneja
  goalToEdit: Goal | null;
}

const GoalModal: React.FC<SalesGoalModalProps> = ({
  open,
  onClose,
  onSave,
  goalToEdit,
}) => {
  // --- ESTADO INTERNO DEL FORMULARIO ---
  const [selectedEvent, setSelectedEvent] = useState<EventoItem | null>(null);
  const [incomeGoal, setIncomeGoal] = useState("");
  const [conversionRateGoal, setConversionRateGoal] = useState("");
  const [ticketsToSell, setTicketsToSell] = useState("");
  const [incomeGoalInvalid, setIncomeGoalInvalid] = useState(false);
  const [conversionRateInvalid, setConversionRateInvalid] = useState(false);
  const [ticketsToSellInvalid, setTicketsToSellInvalid] = useState(false);
  const [eventosList, setEventosList] = useState<EventoItem[]>([]);
  const [loadingEventos, setLoadingEventos] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchEventos = async () => {
        setLoadingEventos(true);
        try {
          const eventos = await listarEventosDisponibles();

          // Adaptar la respuesta de la API al formato { id, text } que espera el ComboBox
          const eventosAdapted: EventoItem[] = eventos.map((e) => ({
            id: String(e.eventoId),
            text: e.nombre,
          }));

          setEventosList(eventosAdapted);
        } catch (error) {
          console.error("Error al cargar eventos disponibles:", error);
        } finally {
          setLoadingEventos(false);
        }
      };

      fetchEventos();
    } else {
      // Si el modal se cierra, opcionalmente puedes limpiar la lista
      setEventosList([]);
    }
  }, [open]);

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
    const income = parseFloat(incomeGoal);
    const conversion = parseFloat(conversionRateGoal);
    const tickets = parseInt(ticketsToSell);

    const isIncomeInvalid = isNaN(income) || income < 0;
    const isConversionInvalid =
      isNaN(conversion) || conversion < 0 || conversion > 100;
    const isTicketsInvalid = isNaN(tickets) || tickets < 0;

    setIncomeGoalInvalid(isIncomeInvalid);
    setConversionRateInvalid(isConversionInvalid);
    setTicketsToSellInvalid(isTicketsInvalid);

    if (
      !selectedEvent ||
      isIncomeInvalid ||
      isConversionInvalid ||
      isTicketsInvalid
    ) {
      console.error(
        "Formulario inválido. Corrija los errores antes de continuar."
      );
      return;
    }

    const formData: Partial<Goal> = {
      id: Number(selectedEvent.id), // ← enviamos el id real del evento
      eventName: selectedEvent.text,
      incomeGoal: income,
      conversionRateGoal: conversion / 100,
      ticketsToSell: tickets,
    };

    onSave(formData);
  };

  return (
    <Modal
      open={open}
      onRequestClose={onClose}
      onRequestSubmit={handleSubmit}
      modalHeading={
        isEditMode ? "Editar meta de ventas" : "Nueva meta de ventas"
      }
      primaryButtonText="Aceptar"
      secondaryButtonText="Cancelar"
    >
      <Form>
        <div className="form-grid-combobox">
          <ComboBox
            id="evento-combobox"
            titleText="Seleccione un evento"
            placeholder={loadingEventos ? "Cargando eventos..." : "Buscar..."}
            items={eventosList}
            itemToString={(item) => (item ? item.text : "")}
            onChange={({ selectedItem }) =>
              setSelectedEvent(selectedItem || null)
            }
            invalid={!selectedEvent}
            invalidText="Debe seleccionar un evento"
            selectedItem={selectedEvent}
            disabled={isEditMode || loadingEventos}
          />
        </div>

        <Grid>
          <Column lg={8} md={4} sm={4} className="form-grid">
            <TextInput
              id="meta-ingresos"
              labelText="Meta de ingresos"
              placeholder="Ej: 50.000"
              value={incomeGoal}
              onChange={(e) => {
                const value = e.target.value;
                setIncomeGoal(value);
                setIncomeGoalInvalid(parseFloat(value) < 0);
              }}
              invalid={incomeGoalInvalid}
              invalidText="Debe ser un número positivo"
            />
          </Column>
          <Column lg={8} md={4} sm={4} className="form-grid">
            <TextInput
              id="tasa-conversion"
              labelText="Tasa de conversión (Ej: 80)"
              placeholder="Ej: 80"
              value={conversionRateGoal}
              onChange={(e) => {
                const value = e.target.value;
                setConversionRateGoal(value);
                const num = parseFloat(value);
                setConversionRateInvalid(num < 0 || num > 100);
              }}
              invalid={conversionRateInvalid}
              invalidText="Debe estar entre 0 y 100"
            />
          </Column>
          <Column lg={8} md={4} sm={4}>
            <TextInput
              id="cantidad-tickets"
              labelText="Cantidad de tickets por vender"
              placeholder="Ej: 300"
              value={ticketsToSell}
              onChange={(e) => {
                const value = e.target.value;
                setTicketsToSell(value);
                setTicketsToSellInvalid(parseInt(value) < 0);
              }}
              invalid={ticketsToSellInvalid}
              invalidText="Debe ser un número positivo"
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
