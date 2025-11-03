import React from "react";
import { GaugeChart } from "@carbon/charts-react";
import "@carbon/charts-react/styles.css";
import type { GaugeChartOptions } from "@carbon/charts";

interface GaugeProps {
  totalCapacity: number;
  usedCapacity: number;
}

const Gauge: React.FC<GaugeProps> = ({ totalCapacity, usedCapacity }) => {
  const percentage = Math.round((usedCapacity / totalCapacity) * 100);

  // Estado del gauge
  let status: "success" | "warning" | "danger" = "success";
  if (percentage >= 85) status = "danger";
  else if (percentage >= 70) status = "warning";

  // 👇 Estructura que Carbon necesita para mostrar el número dentro
  const data = [
    {
      group: "value",
      value: percentage,
    },
    {
      group: "delta",
      value: percentage - 50, // diferencia respecto a un valor de referencia (opcional)
    },
  ];

  const options: GaugeChartOptions = {
    title: "Porcentaje de aforo utilizado",
    resizable: true,
    height: "400px",
    gauge: {
      type: "semi",
      status,
    },
    color: {
      scale: {
        value:
          status === "danger"
            ? "#da1e28"
            : status === "warning"
            ? "#f1c21b"
            : "#24a148",
      },
    },
  };

  return (
    <div>
      <GaugeChart data={data} options={options} />
    </div>

  );
};

export default Gauge;
