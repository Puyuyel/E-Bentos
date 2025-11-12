import TablaCrudButtonDialog from "./TablaCrudButtonDialog";
import TablaCrudDeleteDialog from "./TablaCrudDeleteDialog";

interface TablaCrudButtonsProps {
  entidad: string;
  datos: string[];
  onActualizar: () => void;
  raw?: any;
  uniqueId: number;
}

const TablaCrudButtons: React.FC<TablaCrudButtonsProps> = ({
  entidad,
  datos,
  raw,
  onActualizar,
  uniqueId
}) => {
  //console.log(raw);
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          margin: "0.5rem",
        }}
      >
        <TablaCrudButtonDialog entidad={entidad} accion="Visualizar" datos={datos} raw={raw} onActualizar={()=>{}} uniqueId={uniqueId*100}></TablaCrudButtonDialog>
      </div>
      <div
        style={{
          margin: "0.5rem",
        }}
      >
        <TablaCrudButtonDialog entidad={entidad} accion="Editar" datos={datos} raw={raw} onActualizar={onActualizar} uniqueId={uniqueId}></TablaCrudButtonDialog>
      </div>
      <div
        style={{
          margin: "0.5rem",
        }}
      >
        <TablaCrudDeleteDialog
          entidad={entidad}
          raw={raw}
          onDelete={onActualizar}
        ></TablaCrudDeleteDialog>
      </div>
    </div>
  );
};

export default TablaCrudButtons;
