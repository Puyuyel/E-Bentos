// src/util/calculateGaugeData.ts

export interface ReporteLocalItem {
  categoriaEvento: string;
  nombreProductora: string;
  idEvento: number;
  fechaEvento: string;
  idLocal: number;
  nombreLocal: string;
  aforoLocal: number;
  idProductora: number;
  montoRecaudado: number;
  asistentes: number;
}

export interface GaugeResult {
  data: { group: string; value: number }[];
  status: "success" | "warning" | "danger";
  ocupacionActual: number;
  ocupacionAnterior: number;
}

/**
 * Calcula la ocupación y delta para el gauge de locales
 * comparando el mes actual con el anterior.
 */
export function calculateGaugeData(reportes: ReporteLocalItem[]): GaugeResult {
  const now = new Date();
  const mesActual = now.getMonth();
  const anioActual = now.getFullYear();

  const mesAnterior = mesActual === 0 ? 11 : mesActual - 1;
  const anioAnterior = mesActual === 0 ? anioActual - 1 : anioActual;

  const reportesMesActual = reportes.filter((r) => {
    const fecha = new Date(r.fechaEvento);
    return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
  });

  const reportesMesAnterior = reportes.filter((r) => {
    const fecha = new Date(r.fechaEvento);
    return fecha.getMonth() === mesAnterior && fecha.getFullYear() === anioAnterior;
  });

  const totalAsistentesActual = reportesMesActual.reduce((acc, r) => acc + r.asistentes, 0);
  const totalAforoActual = reportesMesActual.reduce((acc, r) => acc + r.aforoLocal, 0);

  const totalAsistentesAnterior = reportesMesAnterior.reduce((acc, r) => acc + r.asistentes, 0);
  const totalAforoAnterior = reportesMesAnterior.reduce((acc, r) => acc + r.aforoLocal, 0);

  const ocupacionActual = totalAforoActual ? (totalAsistentesActual / totalAforoActual) * 100 : 0;
  const ocupacionAnterior = totalAforoAnterior ? (totalAsistentesAnterior / totalAforoAnterior) * 100 : 0;

  const delta = ocupacionActual - ocupacionAnterior;

  let status: "success" | "warning" | "danger" = "success";
  if (ocupacionActual >= 85) status = "danger";
  else if (ocupacionActual >= 70) status = "warning";

  const data = [
    { group: "value", value: ocupacionActual },
    { group: "delta", value: delta },
  ];

  return { data, status, ocupacionActual, ocupacionAnterior };
}
