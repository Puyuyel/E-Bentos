import TablaCrudProductoraForm from "../AdminForms/TablaCrudProductoraForm";
import TablaCrudPuntoVentaForm from "../AdminForms/TablaCrudPuntoVentaForm";
import TablaCrudGestorLocalForm from "../AdminForms/TablaCrudGestorLocalForm";
import TablaCrudTaquilleroForm from "../AdminForms/TablaCrudTaquilleroForm";

import { createRef } from "react";

export const formulariosCrud: Record<string, React.FC<any>> = {
  Productora: TablaCrudProductoraForm,
  PuntoVenta: TablaCrudPuntoVentaForm,
  GestorLocal: TablaCrudGestorLocalForm,
  Taquillero: TablaCrudTaquilleroForm,
};