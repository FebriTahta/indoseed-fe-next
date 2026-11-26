import React from 'react';

export default function RingkasanHariIni() {
  const summaryData = [
    { label: 'Hasil Lulus', weight: '16.020 Kg', percent: '86,12%', color: 'bg-emerald-600' },
    { label: 'Hasil Tolak', weight: '2.580 Kg', percent: '13,88%', color: 'bg-rose-600' },
    { label: 'Dalam Proses', weight: '3.600 Kg', percent: '2 Batch', color: 'bg-blue-500' },
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
            {/* Hasil Lulus 86.12% */}
            <path
              className="text-emerald-600 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="86.12, 100"
              strokeDashoffset="0"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Hasil Tolak 13.88% */}
            <path
              className="text-rose-600 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="13.88, 100"
              strokeDashoffset="-86.12"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>

          {/* Donut Center Text */}
          <div className="absolute text-center flex flex-col items-center justify-center">
            <span className="text-[9px] text-gray-400 font-medium">Total Masuk</span>
            <span className="text-xs font-extrabold text-gray-800 leading-tight">18.600</span>
            <span className="text-[9px] text-gray-500 font-semibold">Kg</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex flex-col gap-2.5 w-full text-xs">
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
