import React from 'react';

export default function ParameterLingkungan() {
  const parameters = [
    { label: 'Suhu Udara', value: '28,4 °C', icon: 'ri-temp-hot-line', color: 'text-blue-500', sparkColor: '#3b82f6' },
    { label: 'Kelembaban Udara', value: '68,2 %', icon: 'ri-drop-line', color: 'text-sky-500', sparkColor: '#0ea5e9' },
    { label: 'Kelembaban Tanah', value: '61,5 %', icon: 'ri-plant-line', color: 'text-emerald-600', sparkColor: '#10b981' },
    { label: 'Intensitas Cahaya', value: '7500 lux', icon: 'ri-sun-line', color: 'text-amber-500', sparkColor: '#f59e0b' },
    { label: 'CO₂', value: '420 ppm', icon: 'ri-windy-line', color: 'text-teal-600', sparkColor: '#0d9488' },
    { label: 'Kecepatan Angin', value: '1,6 m/s', icon: 'ri-speed-line', color: 'text-indigo-500', sparkColor: '#6366f1' },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Parameter Lingkungan (Rata-rata)</h3>
        <a href="#" className="text-xs text-emerald-700 font-semibold hover:underline">Lihat Detail</a>
      </div>

      <div className="box-body p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {parameters.map((p, idx) => (
          <div key={idx} className="p-3 border border-gray-100 rounded-lg bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-1">
              <i className={`${p.icon} ${p.color} text-base`}></i>
              <span className="text-[11px] text-gray-500 font-medium">{p.label}</span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-sm font-extrabold text-gray-800">{p.value}</span>
              {/* Mini Sparkline SVG */}
              <svg className="w-12 h-5" viewBox="0 0 50 20">
                <polyline
                  fill="none"
                  stroke={p.sparkColor}
                  strokeWidth="2"
                  points="2,14 10,8 18,12 26,6 34,10 42,4 48,7"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
