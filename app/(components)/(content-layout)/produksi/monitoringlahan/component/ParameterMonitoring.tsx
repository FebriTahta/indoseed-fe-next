import React from 'react';

export default function ParameterMonitoring() {
  const parameters = [
    { label: 'Suhu Udara', value: '32,4 °C', icon: 'ri-temp-hot-line', color: 'text-rose-500' },
    { label: 'Kelembaban Udara', value: '68 %', icon: 'ri-drop-line', color: 'text-blue-500' },
    { label: 'Curah Hujan (7 Hari)', value: '42,6 mm', icon: 'ri-showers-line', color: 'text-sky-500' },
    { label: 'Kelembaban Tanah', value: '65 %', icon: 'ri-plant-line', color: 'text-emerald-600' },
    { label: 'Intensitas Cahaya', value: '7200 lux', icon: 'ri-sun-line', color: 'text-amber-500' },
    { label: 'Kecepatan Angin', value: '8,2 km/h', icon: 'ri-windy-line', color: 'text-indigo-500' },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-xs rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Parameter Monitoring</h3>
        <a href="#" className="text-xs text-emerald-700 font-semibold hover:underline">Lihat Semua</a>
      </div>

      <div className="box-body p-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Left Side: 6 Metrics */}
        <div className="space-y-2 text-xs">
          {parameters.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between p-1.5 rounded hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <i className={`${p.icon} ${p.color} text-sm`}></i>
                <span className="text-gray-600 font-medium">{p.label}</span>
              </div>
              <span className="font-bold text-gray-800">{p.value}</span>
            </div>
          ))}
        </div>

        {/* Right Side: Line Chart (Tren 7 Hari Terakhir) */}
        <div className="border-l border-gray-100 pl-4 space-y-2">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-gray-800 text-[11px]">Tren 7 Hari Terakhir</span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2 h-0.5 bg-emerald-600 inline-block"></span> Suhu (°C)
              </span>
              <span className="flex items-center gap-1 text-blue-600 font-semibold">
                <span className="w-2 h-0.5 bg-blue-600 inline-block"></span> Kelembaban (%)
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full h-28 relative">
            <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
              {/* Gridlines */}
              <line x1="0" y1="20" x2="200" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="50" x2="200" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="80" x2="200" y2="80" stroke="#f1f5f9" strokeWidth="1" />

              {/* Suhu Green Line */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                points="10,30 40,25 70,28 100,22 130,32 160,26 190,24"
              />
              <circle cx="10" cy="30" r="2.5" fill="#10b981" />
              <circle cx="40" cy="25" r="2.5" fill="#10b981" />
              <circle cx="70" cy="28" r="2.5" fill="#10b981" />
              <circle cx="100" cy="22" r="2.5" fill="#10b981" />
              <circle cx="130" cy="32" r="2.5" fill="#10b981" />
              <circle cx="160" cy="26" r="2.5" fill="#10b981" />
              <circle cx="190" cy="24" r="2.5" fill="#10b981" />

              {/* Kelembaban Blue Line */}
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                points="10,65 40,55 70,68 100,60 130,72 160,64 190,66"
              />
              <circle cx="10" cy="65" r="2.5" fill="#2563eb" />
              <circle cx="40" cy="55" r="2.5" fill="#2563eb" />
              <circle cx="70" cy="68" r="2.5" fill="#2563eb" />
              <circle cx="100" cy="60" r="2.5" fill="#2563eb" />
              <circle cx="130" cy="72" r="2.5" fill="#2563eb" />
              <circle cx="160" cy="64" r="2.5" fill="#2563eb" />
              <circle cx="190" cy="66" r="2.5" fill="#2563eb" />
            </svg>

            {/* X-axis Labels */}
            <div className="flex justify-between text-[9px] text-gray-400 mt-1">
              <span>05/06</span>
              <span>06/06</span>
              <span>07/06</span>
              <span>08/06</span>
              <span>09/06</span>
              <span>10/06</span>
              <span>11/06</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
