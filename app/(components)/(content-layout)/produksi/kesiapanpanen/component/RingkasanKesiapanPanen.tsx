import React from 'react';

export default function RingkasanKesiapanPanen() {
  const summaryData = [
    { label: 'Siap Panen', area: '28,32 Ha', percent: '32,72%', color: 'bg-emerald-600' },
    { label: 'Akan Siap (3-7 Hari)', area: '21,15 Ha', percent: '24,45%', color: 'bg-amber-500' },
    { label: 'Akan Siap (8-14 Hari)', area: '18,60 Ha', percent: '21,47%', color: 'bg-purple-600' },
    { label: 'Belum Siap', area: '15,38 Ha', percent: '17,76%', color: 'bg-rose-600' },
    { label: 'Tidak Aktif', area: '2,99 Ha', percent: '3,46%', color: 'bg-gray-300' },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <div>
          <h3 className="box-title text-sm font-bold text-gray-800">Ringkasan Kesiapan Panen</h3>
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
            {/* Siap Panen 32.72% */}
            <path
              className="text-emerald-600 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="32.72, 100"
              strokeDashoffset="0"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Akan Siap 3-7 Hari 24.45% */}
            <path
              className="text-amber-500 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="24.45, 100"
              strokeDashoffset="-32.72"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Akan Siap 8-14 Hari 21.47% */}
            <path
              className="text-purple-600 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="21.47, 100"
              strokeDashoffset="-57.17"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Belum Siap 17.76% */}
            <path
              className="text-rose-600 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="17.76, 100"
              strokeDashoffset="-78.64"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Tidak Aktif 3.46% */}
            <path
              className="text-gray-300 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="3.46, 100"
              strokeDashoffset="-96.4"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>

          {/* Donut Center Text */}
          <div className="absolute text-center flex flex-col items-center justify-center">
            <span className="text-[10px] text-gray-400 font-medium">Total Lahan</span>
            <span className="text-sm font-extrabold text-gray-800 leading-tight">86,45</span>
            <span className="text-[9px] text-gray-500 font-semibold">Ha</span>
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
