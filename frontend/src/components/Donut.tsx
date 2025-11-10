import React from "react";
import { DonutChart } from "@carbon/charts-react";
import type { ChartProps } from "./util/types.ts";
import "@carbon/charts-react/styles.css";

const Donut: React.FC<ChartProps> = ({ data }) => {
  const options = {
    title: "Porcentaje de ingresos por local",
    resizable: true,
    legend: {
      position: "left",
      truncation: { type: "none" },
    },
    donut: {
      center: { label: "Locales" },
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
