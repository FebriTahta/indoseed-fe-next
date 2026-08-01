import React from 'react';

export default function GrafikLingkungan() {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Grafik Lingkungan (GH-03)</h3>
        <select className="form-select text-xs py-1 px-2 border border-gray-300 rounded-md text-gray-700 bg-white">
          <option>7 Hari Terakhir</option>
          <option>30 Hari Terakhir</option>
        </select>
      </div>

      <div className="box-body p-4 space-y-4 text-xs">
        {/* 1. Suhu Udara (°C) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-gray-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Suhu Udara (°C)
            </span>
            <span className="font-bold text-gray-800">28,4 °C</span>
          </div>
          <div className="w-full h-16">
            <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
              <line x1="0" y1="30" x2="200" y2="30" stroke="#e2e8f0" strokeDasharray="3 3" />
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                points="10,40 40,25 70,35 100,20 130,30 160,18 190,22"
              />
              <circle cx="190" cy="22" r="3" fill="#10b981" />
            </svg>
          </div>
        </div>

        {/* 2. Kelembaban Udara (%) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-gray-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Kelembaban Udara (%)
            </span>
            <span className="font-bold text-gray-800">68,2 %</span>
          </div>
          <div className="w-full h-16">
            <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
              <line x1="0" y1="30" x2="200" y2="30" stroke="#e2e8f0" strokeDasharray="3 3" />
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                points="10,25 40,35 70,22 100,38 130,28 160,32 190,26"
              />
              <circle cx="190" cy="26" r="3" fill="#3b82f6" />
            </svg>
          </div>
        </div>

        {/* 3. Kelembaban Tanah (%) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-gray-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span> Kelembaban Tanah (%)
            </span>
            <span className="font-bold text-gray-800">61,5 %</span>
          </div>
          <div className="w-full h-16">
            <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
              <line x1="0" y1="30" x2="200" y2="30" stroke="#e2e8f0" strokeDasharray="3 3" />
              <polyline
                fill="none"
                stroke="#d97706"
                strokeWidth="2"
                points="10,45 40,40 70,42 100,35 130,38 160,32 190,34"
              />
              <circle cx="190" cy="34" r="3" fill="#d97706" />
            </svg>
          </div>
        </div>

        {/* X Axis Dates */}
        <div className="flex justify-between text-[9px] text-gray-400 border-t border-gray-100 pt-2">
          <span>05/06</span>
          <span>06/06</span>
          <span>07/06</span>
          <span>08/06</span>
          <span>09/06</span>
          <span>10/06</span>
          <span>11/06</span>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-4 text-[10px] text-gray-500 pt-1">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-gray-600 inline-block"></span> Rata-rata
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 border-t border-dashed border-gray-400 inline-block"></span> Target
          </span>
        </div>
      </div>
    </div>
  );
}
