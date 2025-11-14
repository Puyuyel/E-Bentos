export function obtenerFecha(fechaISO: string): string {
  const fecha = new Date(fechaISO);

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dia = fecha.getDate();
  const mes = meses[fecha.getMonth()];

  let horas = fecha.getHours();
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  const ampm = horas >= 12 ? "pm" : "am";

  // Convertir al formato 12 horas
  horas = horas % 12 || 12;

  return `${dia} de ${mes} - ${horas}:${minutos}${ampm}`;
}
