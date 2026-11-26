import React from 'react';

export default function RingkasanKondisiGreenhouse() {
  const summaryData = [
    { label: 'Kondisi Baik', unit: '13 Unit', percent: '72,22%', color: 'bg-emerald-600' },
    { label: 'Perlu Perhatian', unit: '2 Unit', percent: '11,11%', color: 'bg-amber-500' },
    { label: 'Kondisi Buruk', unit: '1 Unit', percent: '5,56%', color: 'bg-rose-600' },
    { label: 'Tidak Aktif', unit: '2 Unit', percent: '11,11%', color: 'bg-gray-300' },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <div>
          <h3 className="box-title text-sm font-bold text-gray-800">Ringkasan Kondisi Greenhouse</h3>
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
            {/* Kondisi Baik 72.22% */}
            <path
              className="text-emerald-600 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="72.22, 100"
              strokeDashoffset="0"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Perlu Perhatian 11.11% */}
            <path
              className="text-amber-500 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="11.11, 100"
              strokeDashoffset="-72.22"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Kondisi Buruk 5.56% */}
            <path
              className="text-rose-600 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="5.56, 100"
              strokeDashoffset="-83.33"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Tidak Aktif 11.11% */}
            <path
              className="text-gray-300 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="11.11, 100"
              strokeDashoffset="-88.89"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>

          {/* Donut Center Text */}
          <div className="absolute text-center flex flex-col items-center justify-center">
            <span className="text-[10px] text-gray-400 font-medium">Total</span>
            <span className="text-sm font-extrabold text-gray-800 leading-tight">18</span>
            <span className="text-[9px] text-gray-500 font-semibold">Unit</span>
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
                {item.unit} <span className="text-gray-400 font-normal">({item.percent})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
