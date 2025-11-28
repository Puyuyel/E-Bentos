import React from "react";
import { GaugeChart } from "@carbon/charts-react";
import "@carbon/charts-react/styles.css";
import type { GaugeChartOptions } from "@carbon/charts";

interface GaugeROIProps {
  roiValue: number; // ROI en porcentaje (puede ser negativo)
  title?: string;
}

const GaugeROI: React.FC<GaugeROIProps> = ({ roiValue, title = "ROI de Eventos" }) => {
  // Normalizar el ROI para el gauge (entre -100% y 100%)
  const normalizedROI = Math.max(-100, Math.min(100, roiValue));
  const absoluteROI = Math.abs(normalizedROI);

  // Determinar color basado en el ROI
  let status: "success" | "warning" | "danger" = "danger";
  let gaugeColor = "#da1e28"; // Rojo por defecto (negativo)

  if (normalizedROI >= 0) {
    gaugeColor = "#24a148"; // Verde para positivo
    if (normalizedROI >= 20) status = "success";
    else if (normalizedROI >= 10) status = "warning";
    else status = "danger"; // ROI positivo pero bajo
  }

  const data = [
    {
      group: "value",
      value: absoluteROI, // Usamos el valor absoluto para la visualización
    },
  ];

  const options: GaugeChartOptions = {
    title: title,
    resizable: true,
    height: "400px",
    gauge: {
      type: "semi",
      status: normalizedROI >= 0 ? status : "danger",
      // Configuración adicional para mostrar el valor real
      alignment: "center",
    },
    color: {
      scale: {
        value: gaugeColor,
      },
    },
    // Personalizar el tooltip para mostrar el valor real (con signo)
    tooltip: {
      customHTML: (data: any[]) => {
        const value = data[0]?.value || 0;
        const displayValue = normalizedROI >= 0 ? value : -value;
        return `
          <div class="cds--tooltip__content">
            <p>ROI: <strong>${displayValue.toFixed(1)}%</strong></p>
            <p>${normalizedROI >= 0 ? "🟢 Positivo" : "🔴 Negativo"}</p>
          </div>
        `;
      }
    },
  };

  return (
    <div>
      <GaugeChart data={data} options={options} />
      {/* Indicador adicional del valor real */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '-20px', 
        fontSize: '14px',
        color: normalizedROI >= 0 ? '#24a148' : '#da1e28',
        fontWeight: 'bold'
      }}>
        ROI Real: {normalizedROI.toFixed(1)}%
      </div>
    </div>
  );
};

export default GaugeROI;