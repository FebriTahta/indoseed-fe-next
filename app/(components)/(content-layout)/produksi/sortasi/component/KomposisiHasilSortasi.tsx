import React from 'react';

export default function KomposisiHasilSortasi() {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Komposisi Hasil Sortasi</h3>
        <select className="form-select text-xs py-1 px-2 border border-gray-300 rounded-md text-gray-700 bg-white">
          <option>PN-2606-0001</option>
          <option>PN-2606-0002</option>
          <option>PN-2606-0003</option>
        </select>
      </div>

      <div className="box-body p-4 text-xs">
        {/* Multi-segment Horizontal Progress Bar */}
        <div className="w-full h-3 bg-gray-100 rounded-full flex overflow-hidden mb-4">
          <div className="bg-emerald-600 h-full" style={{ width: '86.5%' }} title="Hasil Lulus: 86.5%"></div>
          <div className="bg-amber-500 h-full" style={{ width: '8.3%' }} title="Butir Rusak: 8.3%"></div>
          <div className="bg-orange-500 h-full" style={{ width: '3.1%' }} title="Kotoran: 3.1%"></div>
          <div className="bg-rose-500 h-full" style={{ width: '2.1%' }} title="Hampa: 2.1%"></div>
        </div>

        {/* 4 Metric Columns */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <span className="font-extrabold text-emerald-700 text-xs block">86,5%</span>
            <span className="text-[10px] text-gray-500 block font-medium">Hasil Lulus</span>
            <span className="text-[10px] text-gray-800 font-bold">8.750 Kg</span>
          </div>

          <div>
            <span className="font-extrabold text-amber-700 text-xs block">8,3%</span>
            <span className="text-[10px] text-gray-500 block font-medium">Butir Rusak</span>
            <span className="text-[10px] text-gray-800 font-bold">840 Kg</span>
          </div>

          <div>
            <span className="font-extrabold text-orange-700 text-xs block">3,1%</span>
            <span className="text-[10px] text-gray-500 block font-medium">Kotoran</span>
            <span className="text-[10px] text-gray-800 font-bold">310 Kg</span>
          </div>

          <div>
            <span className="font-extrabold text-rose-700 text-xs block">2,1%</span>
            <span className="text-[10px] text-gray-500 block font-medium">Hampa</span>
            <span className="text-[10px] text-gray-800 font-bold">210 Kg</span>
          </div>
        </div>
      </div>
    </div>
  );
}
