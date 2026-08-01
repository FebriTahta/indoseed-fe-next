import React from 'react';

export default function ParameterSortasiStandar() {
  const specs = [
    { label: 'Komoditas', value: 'Padi' },
    { label: 'Varietas', value: 'Inpari 32' },
    { label: 'Standar Kadar Air', value: '12% - 14%' },
    { label: 'Kadar Air Maksimal', value: '14%' },
    { label: 'Kotoran Maksimal', value: '2%' },
    { label: 'Butir Rusak Maksimal', value: '1%' },
    { label: 'Butir Hampa Maksimal', value: '1%' },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Parameter Sortasi Standar</h3>
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

        {/* Rice Ear Illustration Box */}
        <div className="w-24 h-24 rounded-lg bg-amber-50/60 border border-amber-100 flex items-center justify-center shrink-0">
          <i className="ri-plant-fill text-amber-500 text-5xl opacity-80"></i>
        </div>
      </div>
    </div>
  );
}
