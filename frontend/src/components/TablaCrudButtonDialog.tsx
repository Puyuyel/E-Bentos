import { Button, IconButton, Select, SelectItem, TextInput, VStack } from "@carbon/react";
import { View, Edit, TrashCan } from '@carbon/icons-react';
import { Dialog, DialogBody, DialogCloseButton, DialogControls, DialogFooter, DialogHeader, DialogSubtitle, DialogTitle } from "@carbon/react/lib/components/Dialog";
import { useState } from "react";
import TablaCrudDialogForm from "./TablaCrudDialogForm";

interface TablaCrudButtonDialogProps {
  entidad: string;
  accion: string;
}

const TablaCrudButtonDialog: React.FC<TablaCrudButtonDialogProps> = ({
  entidad, accion
}) => {
  const [isOpen, setIsOpen] = useState(false);
  /**********************************
  Esta es la sección que arma los botones de Visualizar, Editar o Eliminar.
  Puede hacerse más genérico y armar una botonera personalizada con los parámetros, pero eso después...
  División del código:
  - Botón con icono (acción)
  + Dialogo:
    - Cuerpo del dialogo --> Revisar 'TablaCrudDialogForm.txs', podría ser implementado para todos los cruds
    - Footer del dialogo (botones)
  ***********************************/
  return (
    <>
      <IconButton
          size="sm"
          align="bottom"
          kind="primary"
          label={accion}
          onClick={() => {
            // Añadir lógica para abrir el diálogo de delete
            // Provisional
            if(['Visualizar', 'Editar'].includes(accion))
              setIsOpen(true);
          }}
        >
          {(accion == 'Visualizar')? <View size={12}/> : ((accion == 'Editar')? <Edit size={12}/> : <TrashCan size={12}/>)}
        </IconButton>

      <Dialog
        aria-labelledby="title"
        modal
        open={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <DialogHeader>
          <DialogTitle id="title">
            {accion + ' ' + entidad}
          </DialogTitle>
          <DialogControls>
            <DialogCloseButton onClick={() => setIsOpen(false)} />
          </DialogControls>
        </DialogHeader>

        <DialogBody>
          <VStack gap={4}>
            <TablaCrudDialogForm></TablaCrudDialogForm>
          </VStack>
        </DialogBody>

        <DialogFooter>
          <Button
            kind="secondary"
            onClick={() => setIsOpen(false)}
            type="button"
          >
            Cancelar
          </Button>
          <Button
            kind="primary"
            onClick={() => {
              setIsOpen(false);
            }}
            type="button"
          >
            Guardar
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default TablaCrudButtonDialog;