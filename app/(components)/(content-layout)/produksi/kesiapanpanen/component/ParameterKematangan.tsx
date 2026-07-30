import React from 'react';

export default function ParameterKematangan() {
  const parameters = [
    {
      title: 'Kadar Air',
      value: '18,5 %',
      target: 'Target 18-20%',
      icon: 'ri-drop-line',
      bgColor: 'bg-blue-100/90 text-blue-700',
    },
    {
      title: 'Warna Biji',
      value: 'Kuning 90%',
      target: 'Target 85-95%',
      icon: 'ri-key-line',
      bgColor: 'bg-amber-100/90 text-amber-700',
    },
    {
      title: 'Kekerasan Biji',
      value: 'Baik',
      target: 'Target Baik',
      icon: 'ri-shield-check-line',
      bgColor: 'bg-emerald-100/90 text-emerald-700',
    },
    {
      title: 'Isi Biji Bernas',
      value: '92,1 %',
      target: 'Target > 90%',
      icon: 'ri-seedling-line',
      bgColor: 'bg-emerald-100/90 text-emerald-700',
    },
    {
      title: 'Tangkai/Batang',
      value: 'Kering 85%',
      target: 'Target > 80%',
      icon: 'ri-plant-line',
      bgColor: 'bg-emerald-100/90 text-emerald-700',
    },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Parameter Kematangan (Rata-rata)</h3>
      </div>

      <div className="box-body p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {parameters.map((item, idx) => (
          <div key={idx} className="p-3 border border-gray-100 rounded-lg bg-slate-50/50 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${item.bgColor} flex items-center justify-center font-bold text-base shrink-0`}>
              <i className={item.icon}></i>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-medium block mb-0.5">{item.title}</span>
              <h4 className="text-sm font-extrabold text-gray-800 leading-tight mb-0.5">{item.value}</h4>
              <span className="text-[9px] text-gray-400 font-medium block">{item.target}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
