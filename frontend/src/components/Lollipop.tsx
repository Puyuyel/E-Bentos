import React from "react";
import { LollipopChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import type{ LollipopChartOptions } from "@carbon/charts";
import type { ChartProps } from "./util/types.ts";
import "@carbon/charts-react/styles.css";

const Lollipop: React.FC<ChartProps> = ({ data }) => {
  const options: LollipopChartOptions = {
    title: "Ingresos totales por local",
    axes: {
      left: {
        title: "Locales",
        scaleType: ScaleTypes.LABELS,
        mapsTo: "key",
      },
      bottom: {
        title: "Ingresos totales en nuevos soles (S/.)",
        mapsTo: "value",
      },
    },
    points: { radius: 6 },
    height: "400px",
    resizable: true,
    legend: { enabled: true, position: "bottom" },
  };

  return (
    <div>
      <LollipopChart data={data} options={options} />
    </div>
  );
};

export default Lollipop;
