import React from "react";
import { AreaChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import type { ChartDatum } from "./util/types.ts";
import "@carbon/charts-react/styles.css";

interface AreaChartROIProps {
  data: ChartDatum[];
  title?: string;
}

const AreaChartROI: React.FC<AreaChartROIProps> = ({ 
  data, 
  title = "Cantidad de Eventos por ROI y Mes"
}) => {
  // Transformar los datos de ChartDatum al formato que necesita AreaChart
  const areaChartData = data.map(item => ({
    group: item.group || '',
    date: item.key, // Usamos la key como fecha
    value: item.value
  }));

  const options = {
    title: title,
    axes: {
      bottom: {
        title: 'Periodo',
        mapsTo: 'date',
        scaleType: ScaleTypes.TIME
      },
      left: {
        mapsTo: 'value',
        title: 'Cantidad de Eventos', // Cambiado de "ROI (%)" a "Cantidad de Eventos"
        scaleType: ScaleTypes.LINEAR
      }
    },
    tooltip: {
      alwaysShowRulerTooltip: true
    },
    color: {
      scale: {
        "Eventos con ROI Positivo": "#0f62fe", // Azul Carbon
        "Eventos con ROI Negativo": "#da1e28"  // Rojo Carbon
      }
    },
    height: "400px",
    resizable: true,
    legend: {
      enabled: true,
      position: "bottom"
    }
  };

  return (
    <div>
      <AreaChart data={areaChartData} options={options} />
    </div>
  );
};

export default AreaChartROI;