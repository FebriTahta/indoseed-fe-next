"use client";

import React from 'react';
import { KesiapanPanenItem } from '@/app/types/kesiapanPanen';

interface PrediksiPanenChartProps {
  items?: KesiapanPanenItem[];
}

export default function PrediksiPanenChart({ items = [] }: PrediksiPanenChartProps) {
  const safeItems = items || [];
  const totalYield = safeItems.reduce((acc, item) => acc + (item.yieldEst || 0), 0);
  const avgYield = safeItems.length > 0 ? Math.round(totalYield / safeItems.length) : 0;

  // Build dynamic bars grouped by harvest prediction dates or sample top items
  const groupedByDate: { [key: string]: number } = {};
  safeItems.forEach((item) => {
    const rawDate = item.prediksiPanen || 'TBD';
    const dateLabel = rawDate.length > 5 ? rawDate.substring(0, 5) : rawDate;
    groupedByDate[dateLabel] = (groupedByDate[dateLabel] || 0) + (item.yieldEst || 0);
  });

  const dateEntries = Object.entries(groupedByDate).slice(0, 7);
  const maxYieldInGroup = Math.max(...dateEntries.map(([, y]) => y), 1);

  const defaultBars = [
    { date: '12/06', height: '65%' },
    { date: '13/06', height: '75%' },
    { date: '14/06', height: '60%' },
    { date: '15/06', height: '50%' },
    { date: '16/06', height: '70%' },
    { date: '17/06', height: '55%' },
    { date: '18/06', height: '58%' },
  ];

  const bars = dateEntries.length > 0
    ? dateEntries.map(([date, yieldVal]) => ({
        date,
        height: `${Math.max(20, Math.min(100, Math.round((yieldVal / maxYieldInGroup) * 100)))}%`,
        yieldVal,
      }))
    : defaultBars;

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Prediksi Panen (Mendekati Panen)</h3>
        <span className="text-xs text-emerald-700 font-semibold">{items.length} Data Lahan</span>
      </div>

      <div className="box-body p-4">
        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 pb-3 border-b border-gray-100 text-xs">
          <div>
            <span className="text-gray-400 block text-[10px] mb-0.5">Total Prediksi Hasil</span>
            <span className="text-sm font-extrabold text-gray-800">
              {totalYield.toLocaleString('id-ID')} Kg
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] mb-0.5">Rata-rata Yield Est.</span>
            <span className="text-sm font-extrabold text-gray-800">
              {avgYield.toLocaleString('id-ID')} Kg/Ha
            </span>
          </div>
        </div>

        {/* Bar Chart Visual */}
        <div className="relative h-32 w-full flex items-end justify-between px-2 pt-4">
          <div className="absolute inset-x-0 top-0 border-b border-gray-100"></div>
          <div className="absolute inset-x-0 top-1/4 border-b border-gray-100"></div>
          <div className="absolute inset-x-0 top-2/4 border-b border-gray-100"></div>
          <div className="absolute inset-x-0 top-3/4 border-b border-gray-100"></div>

          {bars.map((bar: any, idx: number) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 z-10 w-full" title={bar.yieldVal ? `${bar.date}: ${bar.yieldVal.toLocaleString('id-ID')} Kg` : bar.date}>
              <div
                className="w-4 bg-emerald-600 rounded-t hover:bg-emerald-700 transition-all cursor-pointer"
                style={{ height: bar.height }}
              ></div>
              <span className="text-[9px] text-gray-500 font-medium">{bar.date}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 mt-2">
          <span className="w-2.5 h-2.5 bg-emerald-600 rounded-sm inline-block"></span>
          <span>Prediksi Hasil (Kg)</span>
        </div>
      </div>
    </div>
  );
}
