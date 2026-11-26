"use client";

import React from 'react';

interface KomoditasItem {
  name: string;
  kg: number;
  percent: number;
  color: string;
}

interface ProduksiPerKomoditasDonutProps {
  totalKg?: string;
  data?: KomoditasItem[];
}

export default function ProduksiPerKomoditasDonut({
  totalKg = '2.480 kg',
  data = [
    { name: 'Melon', kg: 980, percent: 39.5, color: '#06b6d4' },
    { name: 'Cabai', kg: 620, percent: 25.0, color: '#0ea5e9' },
    { name: 'Tomat', kg: 480, percent: 19.4, color: '#f59e0b' },
    { name: 'Padi', kg: 250, percent: 10.1, color: '#eab308' },
    { name: 'Selada', kg: 150, percent: 6.0, color: '#ef4444' },
  ],
}: ProduksiPerKomoditasDonutProps) {
  // Calculate SVG strokeDasharray & strokeDashoffset
  let accumulatedPercent = 0;
  const segments = data.map((item) => {
    const strokeDasharray = `${item.percent} ${100 - item.percent}`;
    const strokeDashoffset = -accumulatedPercent;
    accumulatedPercent += item.percent;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="bg-white border border-gray-200/80 shadow-xs rounded-xl p-4 flex flex-col justify-between h-full">
      {/* Title */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <h4 className="text-xs font-bold text-gray-800">Produksi per Komoditas</h4>
      </div>

      <div className="flex items-center justify-between gap-3 my-auto">
        {/* Donut Chart */}
        <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background Ring */}
            <path
              className="text-gray-100"
              strokeWidth="4.2"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Segments */}
            {segments.map((seg, idx) => (
              <path
                key={idx}
                stroke={seg.color}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeWidth="4.2"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            ))}
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[11px] font-bold text-gray-900 leading-tight">{totalKg}</span>
            <span className="text-[9px] text-gray-400 font-medium">Total Produksi</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-1.5 text-[11px]">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="text-gray-600 font-medium">{item.name}</span>
              </div>
              <span className="text-gray-800 font-semibold">
                {item.kg} kg{' '}
                <span className="text-gray-400 font-normal">
                  ({item.percent.toString().replace('.', ',')}%)
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
