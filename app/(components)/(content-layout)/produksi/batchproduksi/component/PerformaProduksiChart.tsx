"use client";

import React from 'react';

export default function PerformaProduksiChart() {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
        <h3 className="text-sm font-bold text-gray-800">Performa Produksi (30 Hari Terakhir)</h3>
        <button type="button" className="text-xs font-semibold text-emerald-700 hover:underline">
          Lihat Detail
        </button>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-center bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
        <div>
          <span className="text-[10px] text-gray-400 font-medium block">Total Target</span>
          <span className="font-extrabold text-xs text-gray-800">89.500 Kg</span>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-medium block">Total Hasil</span>
          <span className="font-extrabold text-xs text-emerald-700">78.250 Kg</span>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-medium block">Rata-rata Yield</span>
          <span className="font-extrabold text-xs text-purple-700">87,46%</span>
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="h-28 w-full relative pt-2">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 240 70">
          {/* Grid lines */}
          <line x1="0" y1="15" x2="240" y2="15" stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1="0" y1="35" x2="240" y2="35" stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1="0" y1="55" x2="240" y2="55" stroke="#f1f5f9" strokeDasharray="3 3" />

          {/* Y-axis labels */}
          <text x="5" y="12" fill="#94a3b8" fontSize="7">15K</text>
          <text x="5" y="32" fill="#94a3b8" fontSize="7">10K</text>
          <text x="5" y="52" fill="#94a3b8" fontSize="7">5K</text>
          <text x="5" y="67" fill="#94a3b8" fontSize="7">0</text>

          {/* Line Path for Hasil Produksi (Kg) */}
          <path
            d="M 25,50 L 50,42 L 75,45 L 100,42 L 125,35 L 150,48 L 175,32 L 200,35 L 225,44"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
          />

          {/* Points */}
          <circle cx="25" cy="50" r="2.5" fill="#10b981" />
          <circle cx="75" cy="45" r="2.5" fill="#10b981" />
          <circle cx="125" cy="35" r="2.5" fill="#10b981" />
          <circle cx="175" cy="32" r="3" fill="#047857" stroke="#fff" strokeWidth="1" />
          <circle cx="225" cy="44" r="2.5" fill="#10b981" />
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between text-[9px] text-gray-400 mt-1 px-4">
          <span>12 Mei</span>
          <span>19 Mei</span>
          <span>26 Mei</span>
          <span>02 Jun</span>
          <span>09 Jun</span>
        </div>
      </div>

      {/* Legend Indicator */}
      <div className="flex justify-center items-center gap-1.5 text-[10px] text-gray-500 mt-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
        <span>Hasil Produksi (Kg)</span>
      </div>
    </div>
  );
}
