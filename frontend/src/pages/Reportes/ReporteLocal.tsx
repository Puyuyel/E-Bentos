import React, {useState} from 'react';
import Sidebar from '../../components/Sidebar';
import Lollipop from '../../components/Lollipop';
import GroupedBar from '../../components/GroupedBar';
import Donut from '../../components/Donut';
import Gauge from '../../components/Gauge';
import FilterBar from '../../components/FilterBar.tsx';
import '../../styles/Reportes/Reporte.css';
import type { ChartDatum } from "../../components/types.ts";

const ReporteLocal: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar currentPath="reporte-local" />
      <main className="app-main">
        <h1 className="title">Reporte de Locales</h1>
      </main>
    </div>
  );
};

export default ReporteLocal;
