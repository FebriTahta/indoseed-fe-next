import React from 'react';

export default function RingkasanHariIniTreatment() {
  const summaryData = [
    { label: 'Seed Coating', weight: '8.750 Kg', percent: '47,04%', color: 'bg-emerald-600' },
    { label: 'Fungisida', weight: '5.200 Kg', percent: '27,96%', color: 'bg-rose-600' },
    { label: 'Insektisida', weight: '3.600 Kg', percent: '19,35%', color: 'bg-blue-600' },
    { label: 'Bio Treatment', weight: '1.050 Kg', percent: '5,65%', color: 'bg-gray-400' },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <div>
          <h3 className="box-title text-sm font-bold text-gray-800">Ringkasan Hari Ini</h3>
          <span className="text-[10px] text-gray-400 block mt-0.5">Update terakhir: 11/06/2026 14:30 WIB</span>
        </div>
      </div>

      <div className="box-body p-4 flex flex-col sm:flex-row items-center gap-5">
        {/* SVG Donut Chart */}
        <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            {/* Background track */}
            <path
              className="text-gray-100 stroke-current"
              strokeWidth="4.5"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Seed Coating 47.04% */}
            <path
              className="text-emerald-600 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="47.04, 100"
              strokeDashoffset="0"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Fungisida 27.96% */}
            <path
              className="text-rose-600 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="27.96, 100"
              strokeDashoffset="-47.04"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Insektisida 19.35% */}
            <path
              className="text-blue-600 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="19.35, 100"
              strokeDashoffset="-75.0"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Bio Treatment 5.65% */}
            <path
              className="text-gray-400 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="5.65, 100"
              strokeDashoffset="-94.35"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>

          {/* Donut Center Text */}
          <div className="absolute text-center flex flex-col items-center justify-center">
            <span className="text-[9px] text-gray-400 font-medium">Total Diproses</span>
            <span className="text-xs font-extrabold text-gray-800 leading-tight">18.600</span>
            <span className="text-[9px] text-gray-500 font-semibold">Kg</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex flex-col gap-2 w-full text-xs">
          {summaryData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded ${item.color}`}></span>
                <span className="font-medium text-gray-700">{item.label}</span>
              </div>
              <span className="text-gray-600 font-semibold text-[11px]">
                {item.weight} <span className="text-gray-400 font-normal">({item.percent})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
