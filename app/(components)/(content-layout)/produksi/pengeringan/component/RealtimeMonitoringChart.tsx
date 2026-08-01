"use client";

import React from 'react';

export default function RealtimeMonitoringChart() {
  // SVG Mock Chart Points for Trend Suhu (°C) & Trend Kadar Air (%)
  // Suhu: around 42.3°C (green line)
  // Kadar Air: decreasing from 20% down to 12.8% (blue line)

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-gray-800">Monitoring Real-time DR-01</h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Beroperasi
          </span>
        </div>
        <button type="button" className="text-xs font-semibold text-emerald-700 hover:underline">
          Lihat Detail
        </button>
      </div>

      {/* Grid: Left 2 Charts (7 cols), Right Mini Stats (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Side: 2 Trend Graphs */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Trend Suhu (°C) */}
          <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold text-gray-700">Trend Suhu (°C)</span>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                42,3°C
              </span>
            </div>
            <div className="h-32 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 80">
                {/* Grid lines */}
                <line x1="0" y1="20" x2="200" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="0" y1="40" x2="200" y2="40" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="200" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />

                {/* Y-axis labels */}
                <text x="5" y="15" fill="#94a3b8" fontSize="8">60</text>
                <text x="5" y="35" fill="#94a3b8" fontSize="8">45</text>
                <text x="5" y="55" fill="#94a3b8" fontSize="8">15</text>

                {/* Line Path for Suhu */}
                <path
                  d="M 20,55 L 40,48 L 60,35 L 80,38 L 100,36 L 120,40 L 140,35 L 160,42 L 180,38 L 195,36"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />

                {/* Points */}
                <circle cx="20" cy="55" r="3" fill="#10b981" />
                <circle cx="60" cy="35" r="3" fill="#10b981" />
                <circle cx="100" cy="36" r="3" fill="#10b981" />
                <circle cx="140" cy="35" r="3" fill="#10b981" />
                <circle cx="195" cy="36" r="4" fill="#047857" stroke="#fff" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="flex justify-between text-[9px] text-gray-400 mt-1">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>24:00</span>
            </div>
          </div>

          {/* Trend Kadar Air (%) */}
          <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold text-gray-700">Trend Kadar Air (%)</span>
              <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                12,8%
              </span>
            </div>
            <div className="h-32 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 80">
                {/* Grid lines */}
                <line x1="0" y1="20" x2="200" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="0" y1="40" x2="200" y2="40" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="200" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />

                {/* Y-axis labels */}
                <text x="5" y="15" fill="#94a3b8" fontSize="8">30</text>
                <text x="5" y="45" fill="#94a3b8" fontSize="8">10</text>
                <text x="5" y="70" fill="#94a3b8" fontSize="8">0</text>

                {/* Line Path for Kadar Air */}
                <path
                  d="M 20,25 L 40,32 L 60,38 L 80,40 L 100,45 L 120,48 L 140,46 L 160,50 L 180,52 L 195,54"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                />

                {/* Points */}
                <circle cx="20" cy="25" r="3" fill="#3b82f6" />
                <circle cx="60" cy="38" r="3" fill="#3b82f6" />
                <circle cx="100" cy="45" r="3" fill="#3b82f6" />
                <circle cx="140" cy="46" r="3" fill="#3b82f6" />
                <circle cx="195" cy="54" r="4" fill="#1d4ed8" stroke="#fff" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="flex justify-between text-[9px] text-gray-400 mt-1">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>24:00</span>
            </div>
          </div>
        </div>

        {/* Right Side: Mini Stats inside box */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-2.5">
          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <i className="ri-temp-hot-line text-lg"></i>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block leading-tight">Suhu Saat Ini</span>
              <span className="font-extrabold text-sm text-gray-800">42,3°C</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <i className="ri-drop-line text-lg"></i>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block leading-tight">Kadar Air Rata-rata</span>
              <span className="font-extrabold text-sm text-gray-800">12,8%</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <i className="ri-time-line text-lg"></i>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block leading-tight">Durasi Berjalan</span>
              <span className="font-extrabold text-xs text-gray-800">6 Jam 30 Menit</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <i className="ri-scales-3-line text-lg"></i>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block leading-tight">Berat Dalam Proses</span>
              <span className="font-extrabold text-xs text-gray-800">8.000 Kg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
