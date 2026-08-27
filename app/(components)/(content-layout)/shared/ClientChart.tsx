"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ClientChartProps {
  options: any;
  series: any[];
  type: "line" | "area" | "bar" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "boxPlot" | "radar" | "polarArea" | "rangeBar" | "rangeArea" | "treemap";
  height?: string | number;
  width?: string | number;
  className?: string;
  id?: string;
  dataKey?: string | number; // Used to force remount when data changes
}

export default function ClientChart({ options, series, type, height = 'auto', width = '100%', className, id, dataKey }: ClientChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    setChartKey(Math.random());
  }, []);

  if (!isMounted) {
    return (
      <div style={{ minHeight: height }} className={`w-full flex items-center justify-center ${className || ''}`}>
        <span className="text-gray-400 text-xs animate-pulse">Memuat grafik...</span>
      </div>
    );
  }

  const finalKey = dataKey !== undefined ? `chart-${chartKey}-${dataKey}` : `chart-${chartKey}`;

  return (
    <div id={id} style={{ minHeight: height }} className={className}>
      <ReactApexChart key={finalKey} options={options} series={series} type={type} height={height} width={width} />
    </div>
  );
}
