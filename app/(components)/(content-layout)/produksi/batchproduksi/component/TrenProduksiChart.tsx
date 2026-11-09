"use client";

import React from 'react';

interface TrenItem {
  minggu: string;
  target: number;
  realisasi: number;
}

interface TrenProduksiChartProps {
  data?: TrenItem[];
}

export default function TrenProduksiChart({
  data = [
    { minggu: 'Minggu 1', target: 350, realisasi: 300 },
    { minggu: 'Minggu 2', target: 450, realisasi: 420 },
    { minggu: 'Minggu 3', target: 700, realisasi: 650 },
    { minggu: 'Minggu 4', target: 750, realisasi: 680 },
  ],
}: TrenProduksiChartProps) {
  // Chart dimensions
  const width = 280;
  const height = 120;
  const paddingLeft = 32;
  const paddingRight = 15;
  const paddingTop = 12;
  const paddingBottom = 22;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxVal = 1000;

  // Convert (index, value) to (x, y)
  const getX = (index: number) => paddingLeft + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => paddingTop + chartHeight - (val / maxVal) * chartHeight;

  // Path generators
  const realisasiPoints = data.map((d, i) => `${getX(i)},${getY(d.realisasi)}`).join(' L ');
  const realisasiPath = `M ${realisasiPoints}`;

  const targetPoints = data.map((d, i) => `${getX(i)},${getY(d.target)}`).join(' L ');
  const targetPath = `M ${targetPoints}`;

  // Area under realisasi path
  const areaPath = `M ${getX(0)},${getY(0)} L ${realisasiPoints} L ${getX(data.length - 1)},${getY(0)} Z`;

  return (
    <div className="bg-white border border-gray-200/80 shadow-xs rounded-xl p-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-gray-800">Tren Produksi Batch</h4>
        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1 text-slate-400">
            <span className="w-3 h-0.5 bg-slate-300 inline-block"></span>
            <span>Target</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 font-medium">
            <span className="w-3 h-0.5 bg-emerald-500 inline-block"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 -ml-2.5"></span>
            <span className="ml-1">Realisasi</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full relative my-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="realisasiGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines and Y-axis labels */}
          {[0, 250, 500, 750, 1000].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="8"
                  className="fill-gray-400 font-sans"
                >
                  {val === 1000 ? '1.000' : val}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#realisasiGrad)" />

          {/* Target line */}
          <path
            d={targetPath}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Realisasi line */}
          <path
            d={realisasiPath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Dots on Realisasi */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={getX(i)}
              cy={getY(d.realisasi)}
              r="3"
              fill="#059669"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          ))}

          {/* X-axis labels */}
          {data.map((d, i) => (
            <text
              key={i}
              x={getX(i)}
              y={height - 4}
              textAnchor="middle"
              fontSize="8"
              className="fill-gray-400 font-sans font-medium"
            >
              {d.minggu}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
