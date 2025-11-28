import React from "react";
import { DonutChart } from "@carbon/charts-react";
import type { ChartProps } from "./util/types.ts";
import "@carbon/charts-react/styles.css";

interface DonutProps extends ChartProps {
  title?: string;
  centerLabel?: string;
}

const Donut: React.FC<DonutProps> = ({ data, title = "Porcentaje de ingresos por local", centerLabel = "Ingresos Totales (S/.)" }) => {
  const options = {
    title: title,
    resizable: true,
    legend: {
      position: "left",
      truncation: { type: "none" },
    },
    donut: {
      center: { label: centerLabel },
    },
    height: "400px",
  };

  return (
    <div>
      <DonutChart data={data} options={options} />
    </div>
  );
};

export default Donut;