// types.ts
export interface ChartDatum {
  key: string;
  value: number;
  group?: string; // opcional, para gráficos agrupados (como GroupedBar)
}

export interface ChartProps {
  data: ChartDatum[];
}
