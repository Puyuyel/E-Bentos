import TablaCrudButtonDialog from "./TablaCrudButtonDialog";

interface TablaCrudButtonsProps {
  entidad: string;
}

const TablaCrudButtons: React.FC<TablaCrudButtonsProps> = ({
  entidad
}) => {
  return(
    <div style={{ display: 'flex'}}>
      <div
        style={{
          margin: '0.5rem'
        }}
      >
        <TablaCrudButtonDialog entidad={entidad} accion="Visualizar"></TablaCrudButtonDialog>
      </div>
      <div
        style={{
          margin: '0.5rem'
        }}
      >
        <TablaCrudButtonDialog entidad={entidad} accion="Editar"></TablaCrudButtonDialog>
      </div>
      <div
        style={{
          margin: '0.5rem'
        }}
      >
        <TablaCrudButtonDialog entidad={entidad} accion="Eliminar"></TablaCrudButtonDialog>
      </div>
  </div>
  );
}

export default TablaCrudButtons;