import React from 'react';

export default function RingkasanKomoditas() {
  const commoditiesData = [
    { name: 'Padi', percent: 45, area: '19,00 Ha', color: 'bg-emerald-600', hex: '#16a34a' },
    { name: 'Jagung', percent: 25, area: '10,62 Ha', color: 'bg-blue-600', hex: '#2563eb' },
    { name: 'Kedelai', percent: 15, area: '6,37 Ha', color: 'bg-purple-600', hex: '#9333ea' },
    { name: 'Kacang Hijau', percent: 10, area: '4,25 Ha', color: 'bg-amber-600', hex: '#d97706' },
    { name: 'Sorgum', percent: 5, area: '2,26 Ha', color: 'bg-gray-400', hex: '#9ca3af' },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg mb-6 overflow-hidden">
      <div className="box-header p-4 border-b border-defaultborder">
        <h3 className="box-title text-sm font-bold text-gray-800">Ringkasan per Komoditas</h3>
      </div>
      <div className="box-body p-4 flex flex-col sm:flex-row items-center gap-5">
        {/* Donut Chart SVG */}
        <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            {/* Track */}
            <path
              className="text-gray-100 stroke-current"
              strokeWidth="4.5"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Padi 45% */}
            <path
              className="text-emerald-600 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="45, 100"
              strokeDashoffset="0"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Jagung 25% */}
            <path
              className="text-blue-600 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="25, 100"
              strokeDashoffset="-45"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Kedelai 15% */}
            <path
              className="text-purple-600 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="15, 100"
              strokeDashoffset="-70"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Kacang Hijau 10% */}
            <path
              className="text-amber-600 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="10, 100"
              strokeDashoffset="-85"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Sorgum 5% */}
            <path
              className="text-gray-400 stroke-current"
              strokeWidth="4.5"
              strokeDasharray="5, 100"
              strokeDashoffset="-95"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 w-full text-xs">
          {commoditiesData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded ${item.color}`}></span>
                <span className="font-medium text-gray-700">{item.name}</span>
              </div>
              <span className="text-gray-500 font-medium text-[11px]">{item.percent}% ({item.area})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
