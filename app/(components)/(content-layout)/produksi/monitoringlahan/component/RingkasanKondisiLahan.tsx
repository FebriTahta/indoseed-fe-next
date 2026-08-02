import React from 'react';

export default function RingkasanKondisiLahan() {
  const summaryData = [
    { label: 'Kondisi Baik', area: '52,25 Ha', percent: '60,47%', color: 'bg-emerald-600' },
    { label: 'Perlu Perhatian', area: '10,05 Ha', percent: '11,63%', color: 'bg-amber-500' },
    { label: 'Kondisi Buruk', area: '2,00 Ha', percent: '2,33%', color: 'bg-rose-600' },
    { label: 'Belum Tanam', area: '22,15 Ha', percent: '25,57%', color: 'bg-blue-600' },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-xs rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <div>
          <h3 className="box-title text-sm font-bold text-gray-800">Ringkasan Kondisi Lahan</h3>
          <span className="text-[10px] text-gray-400 block mt-0.5">Update terakhir: 11/06/2026 14:30 WIB</span>
        </div>
      </div>

      <div className="box-body p-4 flex flex-col sm:flex-row items-center gap-5">
        {/* SVG Donut Chart with Center Text */}
        <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            {/* Background track */}
            <path
              className="text-gray-100 stroke-current"
              strokeWidth="4.5"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Kondisi Baik 60.47% */}
            <path
              className="text-emerald-600 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="60.47, 100"
              strokeDashoffset="0"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Perlu Perhatian 11.63% */}
            <path
              className="text-amber-500 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="11.63, 100"
              strokeDashoffset="-60.47"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Kondisi Buruk 2.33% */}
            <path
              className="text-rose-600 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="2.33, 100"
              strokeDashoffset="-72.1"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Belum Tanam 25.57% */}
            <path
              className="text-blue-600 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="25.57, 100"
              strokeDashoffset="-74.43"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>

          {/* Center Donut Text */}
          <div className="absolute text-center flex flex-col items-center justify-center">
            <span className="text-[10px] text-gray-400 font-medium leading-none">Total Lahan</span>
            <span className="text-sm font-extrabold text-gray-800 leading-tight mt-0.5">86,45</span>
            <span className="text-[9px] text-gray-500 font-semibold leading-none">Ha</span>
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
                {item.area} <span className="text-gray-400 font-normal">({item.percent})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
