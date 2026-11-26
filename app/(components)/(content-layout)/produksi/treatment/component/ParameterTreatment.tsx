import React from 'react';

export default function ParameterTreatment() {
  const specs = [
    { label: 'Metode Aplikasi', value: 'Coating Drum' },
    { label: 'Suhu Ruang', value: '25 - 28 °C' },
    { label: 'Kelembaban', value: '45 - 60 %' },
    { label: 'Kecepatan Drum', value: '25 - 30 RPM' },
    { label: 'Waktu Aplikasi', value: '8 - 12 Menit' },
    { label: 'Standar Loss Maksimal', value: '≤ 5%' },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Parameter Treatment</h3>
        <a href="#" className="text-xs text-emerald-700 font-semibold hover:underline">Lihat Detail</a>
      </div>

      <div className="box-body p-4 flex items-center justify-between gap-4 text-xs">
        {/* Spec List */}
        <div className="space-y-1.5 flex-1">
          {specs.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-[11px]">
              <span className="text-gray-500 font-medium">{item.label}</span>
              <span className="font-bold text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Chemical Seed / Shield Illustration Box */}
        <div className="w-24 h-24 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-center relative shrink-0">
          <div className="w-14 h-14 rounded-full bg-emerald-100/90 border border-emerald-300 flex items-center justify-center text-emerald-700">
            <i className="ri-shield-check-fill text-3xl"></i>
          </div>
          <div className="absolute -top-1 -right-1 text-blue-500">
            <i className="ri-drop-fill text-base"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
