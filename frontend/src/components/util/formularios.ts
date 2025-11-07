import TablaCrudProductoraForm from "../TablaCrudProductoraForm";
import TablaCrudPuntoVentaForm from "../TablaCrudPuntoVentaForm";
import TablaCrudGestorLocalForm from "../TablaCrudGestorLocalForm";
import TablaCrudTaquilleroForm from "../TablaCrudTaquilleroForm";

import { createRef } from "react";

export const formulariosCrud: Record<string, React.FC<any>> = {
  Productora: TablaCrudProductoraForm,
  PuntoVenta: TablaCrudPuntoVentaForm,
  GestorLocal: TablaCrudGestorLocalForm,
  Taquillero: TablaCrudTaquilleroForm,
};