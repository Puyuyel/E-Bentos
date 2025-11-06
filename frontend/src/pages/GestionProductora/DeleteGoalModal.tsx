import React from "react";
import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@carbon/react";
import { WarningAlt } from "@carbon/icons-react"; // Importa el icono de advertencia

interface DeleteGoalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  goalName: string; // Para mostrar el nombre de la meta
}

const DeleteGoalModal: React.FC<DeleteGoalModalProps> = ({
  open,
  onClose,
  onSubmit,
  goalName,
}) => {
  return (
    <ComposedModal open={open} onClose={onClose}>
      <ModalHeader
        title="¿Está seguro que desea eliminar esta meta?"
        closeModal={onClose}
      />
      
      {/* Este es el cuerpo personalizado para replicar tu imagen con el icono grande.
      */}
      <ModalBody style={{ textAlign: "center", padding: "2rem 1rem" }}>
        
        {/* El icono grande de advertencia */}
        <WarningAlt size={48} style={{ color: "#da1e28" }} /> 
        
        <p style={{ marginTop: "1rem" }}>
          Se eliminará permanentemente la meta para el evento: <strong>{goalName}</strong>.
        </p>
      </ModalBody>
      
      <ModalFooter>
        <Button kind="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          kind="danger" // El kind="danger" lo pone de color rojo
          onClick={onSubmit}
        >
          Eliminar
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
};

export default DeleteGoalModal;