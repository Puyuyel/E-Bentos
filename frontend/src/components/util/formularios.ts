import TablaCrudProductoraForm from "../AdminForms/TablaCrudProductoraForm";
import TablaCrudPuntoVentaForm from "../AdminForms/TablaCrudPuntoVentaForm";
import TablaCrudGestorLocalForm from "../AdminForms/TablaCrudGestorLocalForm";
import TablaCrudTaquilleroForm from "../AdminForms/TablaCrudTaquilleroForm";

export const formulariosCrud: Record<string, React.FC<any>> = {
  Productora: TablaCrudProductoraForm,
  PuntoVenta: TablaCrudPuntoVentaForm,
  GestorLocal: TablaCrudGestorLocalForm,
  Taquillero: TablaCrudTaquilleroForm,
  Organizador: TablaCrudGestorLocalForm,
  Duenho: TablaCrudGestorLocalForm,
};