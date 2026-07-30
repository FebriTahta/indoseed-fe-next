import React from 'react';

export default function KomposisiTreatmentHariIni() {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Komposisi Treatment Hari Ini</h3>
        <select className="form-select text-xs py-1 px-2 border border-gray-300 rounded-md text-gray-700 bg-white">
          <option>Semua Treatment</option>
          <option>Seed Coating</option>
          <option>Fungisida</option>
        </select>
      </div>

      <div className="box-body p-4 text-xs">
        {/* Multi-segment Horizontal Progress Bar */}
        <div className="w-full h-3 bg-gray-100 rounded-full flex overflow-hidden mb-4">
          <div className="bg-emerald-600 h-full" style={{ width: '47.0%' }} title="Seed Coating: 47.0%"></div>
          <div className="bg-rose-600 h-full" style={{ width: '28.0%' }} title="Fungisida: 28.0%"></div>
          <div className="bg-blue-600 h-full" style={{ width: '19.4%' }} title="Insektisida: 19.4%"></div>
          <div className="bg-gray-400 h-full" style={{ width: '5.6%' }} title="Bio Treatment: 5.6%"></div>
        </div>

        {/* 4 Metric Columns */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <span className="font-extrabold text-emerald-700 text-xs block">47,0%</span>
            <span className="text-[10px] text-gray-500 block font-medium">Seed Coating</span>
            <span className="text-[10px] text-gray-800 font-bold">8.750 Kg</span>
          </div>

          <div>
            <span className="font-extrabold text-rose-700 text-xs block">28,0%</span>
            <span className="text-[10px] text-gray-500 block font-medium">Fungisida</span>
            <span className="text-[10px] text-gray-800 font-bold">5.200 Kg</span>
          </div>

          <div>
            <span className="font-extrabold text-blue-700 text-xs block">19,4%</span>
            <span className="text-[10px] text-gray-500 block font-medium">Insektisida</span>
            <span className="text-[10px] text-gray-800 font-bold">3.600 Kg</span>
          </div>

          <div>
            <span className="font-extrabold text-gray-700 text-xs block">5,6%</span>
            <span className="text-[10px] text-gray-500 block font-medium">Bio Treatment</span>
            <span className="text-[10px] text-gray-800 font-bold">1.050 Kg</span>
          </div>
        </div>
      </div>
    </div>
  );
}
