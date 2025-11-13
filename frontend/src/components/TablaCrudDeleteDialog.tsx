import { Dialog, DialogHeader, DialogTitle, DialogControls, DialogCloseButton, DialogBody, DialogFooter } from "@carbon/react/lib/components/Dialog";
import { IconButton, Button , VStack } from "@carbon/react";
import { TrashCan } from "@carbon/icons-react";
import { useState } from "react";
import { eliminarProductora } from "../services/productoraService";
import type { Productora } from "../types/productora.types";
import { eliminarPuntoVenta } from "../services/puntoVentaService";
import type { PuntoVenta } from "../types/puntoVenta.types";
import type { GestorLocal } from "../types/gestorLocal.types";
import { eliminarGestorLocal, eliminarOrganizador, eliminarTaquillero } from "../services/gestorLocalService";

interface ConfirmDeleteDialogProps {
  entidad: string;
  raw: any;
  onDelete: () => void;
}

const TablaCrudDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  entidad, raw, onDelete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  //console.log(raw as PuntoVenta);
  const handleDelete = async () => {
    //console.log('delete');
    console.log(raw as Productora);
    setIsDeleting(true);
    try {
      switch (entidad) {
        case 'Productora':
          await eliminarProductora((raw as Productora).usuarioId);
          break;
        case 'PuntoVenta':
          await eliminarPuntoVenta((raw as PuntoVenta).puntoventaId);
          break;
        case 'GestorLocal':
          await eliminarGestorLocal((raw as GestorLocal).usuarioId);
          break;
        case 'Taquillero':
          await eliminarTaquillero((raw as GestorLocal).usuarioId);
          break;
        case 'Organizador':
          await eliminarOrganizador((raw as GestorLocal).usuarioId);
          break;
      }
      await onDelete();

      console.log("Eliminación exitosa");
      setIsOpen(false);
    } catch (err) {
      console.error("Error al eliminar" + err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <IconButton
        size="sm"
        align="bottom"
        kind="primary"
        label="Eliminar"
        onClick={() => {
            setIsOpen(true);
        }}
      >
        <TrashCan size={12}/>
      </IconButton>

      <Dialog
        modal
        open={isOpen}
        onRequestClose={() => setIsOpen(false)}
        aria-labelledby="delete-title"
      >
        <DialogHeader>
          <DialogTitle id="delete-title">Confirmar eliminación</DialogTitle>
          <DialogControls>
            <DialogCloseButton onClick={() => setIsOpen(false)} />
          </DialogControls>
        </DialogHeader>

        <DialogBody>
          <VStack gap={4}>
            <p>
              ¿Estás seguro que deseas eliminar <strong>{entidad}</strong>? Esta acción no se puede deshacer.
            </p>
          </VStack>
        </DialogBody>

        <DialogFooter>
          <Button
            kind="secondary"
            onClick={() => setIsOpen(false)}
            type="button"
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            kind="danger"
            onClick={() => handleDelete()}
            type="button"
            disabled={isDeleting}
          >
            Sí, eliminar
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default TablaCrudDeleteDialog;