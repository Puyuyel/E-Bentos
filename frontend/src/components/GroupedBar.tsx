import React from "react";
import { GroupedBarChart } from "@carbon/charts-react";
import {ScaleTypes} from "@carbon/charts";
import type { ChartProps } from "./types.ts";
import type { BarChartOptions } from "@carbon/charts";
import "@carbon/charts-react/styles.css";

const GroupedBar: React.FC<ChartProps> = ({ data }) => {
  const options: BarChartOptions = {
    title: "Ventas por Mes y Local",
    axes: {
      left: {
        mapsTo: "value",
        title: "Ventas (S/.)",
      },
      bottom: {
        mapsTo: "key",
        scaleType: ScaleTypes.LABELS,
      },
    },
    height: "400px",
    resizable: true,
    legend: {
      enabled: true,
      position: "bottom",
    },
  };

  return (
    <div>
      <GroupedBarChart data={data} options={options} />
    </div>
  );
};

export default GroupedBar;
