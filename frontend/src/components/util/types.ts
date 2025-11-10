// types.ts
export interface ChartDatum {
  key: string;
  value: number;
  group?: string; // opcional, para gráficos agrupados (como GroupedBar)
}

export interface ChartProps {
  data: ChartDatum[];
}

export interface GaugeProps {
  data: { group: string; value: number }[];
  status?: "success" | "warning" | "danger";
  title?: string;
  delta?: number;
}
