"use client";

import React from 'react';

interface TrenSeriesItem {
  tanggal: string;
  suhu: number;
  rh: number;
}

interface TrenSuhuRhChartProps {
  location?: string;
  series: TrenSeriesItem[];
}

export default function TrenSuhuRhChart({
  location = 'Gudang Benih Bersih – Zona A (7 Hari Terakhir)',
  series,
}: TrenSuhuRhChartProps) {
  // Chart dimensions
  const width = 480;
  const height = 180;
  const paddingLeft = 45;
  const paddingRight = 40;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Temperature scale: 20°C to 32°C
  const minTemp = 20;
  const maxTemp = 32;

  // RH scale: 40% to 70%
  const minRh = 40;
  const maxRh = 70;

  const getYTemp = (temp: number) => {
    const clamped = Math.max(minTemp, Math.min(maxTemp, temp));
    const ratio = (clamped - minTemp) / (maxTemp - minTemp);
    return paddingTop + chartHeight * (1 - ratio);
  };

  const getYRh = (rh: number) => {
    const clamped = Math.max(minRh, Math.min(maxRh, rh));
    const ratio = (clamped - minRh) / (maxRh - minRh);
    return paddingTop + chartHeight * (1 - ratio);
  };

  const getX = (index: number) => {
    if (series.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (series.length - 1)) * chartWidth;
  };

  // Build SVG path strings
  const tempPath = series.length > 0
    ? series
        .map((item, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getYTemp(item.suhu)}`)
        .join(' ')
    : '';

  const rhPath = series.length > 0
    ? series
        .map((item, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getYRh(item.rh)}`)
        .join(' ')
    : '';

  const tempGridLevels = [20, 22, 24, 26, 28, 30, 32];

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm hover:shadow transition-shadow flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">Tren Suhu &amp; Kelembapan</h3>
          <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
            Realtime
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-4">{location}</p>

        {/* SVG Dual-Axis Chart */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-44 select-none"
            style={{ minWidth: '380px' }}
          >
            {/* Grid lines and Left Y-Axis (Temp) & Right Y-Axis (RH) */}
            {tempGridLevels.map((temp) => {
              const y = getYTemp(temp);
              // Calculate equivalent RH for this gridline
              const rhEquivalent = Math.round(minRh + ((temp - minTemp) / (maxTemp - minTemp)) * (maxRh - minRh));
              return (
                <g key={temp}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeDasharray="2,2"
                    strokeWidth="1"
                  />
                  {/* Left Label: Suhu */}
                  <text
                    x={paddingLeft - 8}
                    y={y + 3.5}
                    fontSize="9"
                    fill="#94a3b8"
                    textAnchor="end"
                    fontFamily="inherit"
                  >
                    {temp.toFixed(1).replace('.', ',')}
                  </text>
                  {/* Right Label: RH */}
                  <text
                    x={width - paddingRight + 8}
                    y={y + 3.5}
                    fontSize="9"
                    fill="#94a3b8"
                    textAnchor="start"
                    fontFamily="inherit"
                  >
                    {rhEquivalent}
                  </text>
                </g>
              );
            })}

            {/* Left Axis Title */}
            <text
              transform={`rotate(-90)`}
              x={-(paddingTop + chartHeight / 2)}
              y="12"
              fontSize="8.5"
              fill="#059669"
              textAnchor="middle"
              fontWeight="600"
            >
              Suhu (°C)
            </text>

            {/* Right Axis Title */}
            <text
              transform={`rotate(90)`}
              x={paddingTop + chartHeight / 2}
              y={-(width - 8)}
              fontSize="8.5"
              fill="#d97706"
              textAnchor="middle"
              fontWeight="600"
            >
              RH (%)
            </text>

            {/* X Axis Labels */}
            {series.map((item, idx) => (
              <text
                key={idx}
                x={getX(idx)}
                y={height - 10}
                fontSize="9"
                fill="#64748b"
                textAnchor="middle"
              >
                {item.tanggal}
              </text>
            ))}

            {/* Line: RH (Yellow) */}
            {rhPath && (
              <path
                d={rhPath}
                fill="none"
                stroke="#eab308"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Points: RH */}
            {series.map((item, idx) => (
              <circle
                key={`rh-dot-${idx}`}
                cx={getX(idx)}
                cy={getYRh(item.rh)}
                r="3.5"
                fill="#ffffff"
                stroke="#eab308"
                strokeWidth="2"
              />
            ))}

            {/* Line: Suhu (Green) */}
            {tempPath && (
              <path
                d={tempPath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Points: Suhu */}
            {series.map((item, idx) => (
              <circle
                key={`suhu-dot-${idx}`}
                cx={getX(idx)}
                cy={getYTemp(item.suhu)}
                r="3.5"
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Legend at bottom */}
      <div className="flex items-center justify-center gap-6 pt-3 mt-1 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm"></span>
          <span>Suhu (°C)</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-sm"></span>
          <span>RH (%)</span>
        </div>
      </div>
    </div>
  );
}
