import React from "react";
import { LollipopChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import type{ LollipopChartOptions } from "@carbon/charts";
import type { ChartProps } from "./util/types.ts";
import "@carbon/charts-react/styles.css";

interface LollipopProps extends ChartProps {
  title?: string;
  desc?: string;
}

const Lollipop: React.FC<LollipopProps> = ({ data, title="Ingresos totales por local", desc="Ingresos totales en nuevos soles (S/.)"}) => {
  const options: LollipopChartOptions = {
    title: title,
    axes: {
      left: {
        title: "Locales",
        scaleType: ScaleTypes.LABELS,
        mapsTo: "key",
      },
      bottom: {
        title: desc,
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
