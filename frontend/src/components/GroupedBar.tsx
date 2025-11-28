import React from "react";
import { GroupedBarChart } from "@carbon/charts-react";
import {ScaleTypes} from "@carbon/charts";
import type { ChartProps } from "./util/types.ts";
import type { BarChartOptions } from "@carbon/charts";
import "@carbon/charts-react/styles.css";

interface GroupedBarProps extends ChartProps {
  title?: string;
  yAxisTitle?: string;
}

const GroupedBar: React.FC<GroupedBarProps> = ({ 
  data, 
  title = "Ventas por tipo de Evento en Locales",
  yAxisTitle = "Ventas (S/.)"
}) => {
  const options: BarChartOptions = {
    title: title,
    axes: {
      left: {
        mapsTo: "value",
        title: yAxisTitle,
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