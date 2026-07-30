import React from 'react';

export default function PrediksiPanenChart() {
  const bars = [
    { date: '12/06', height: '65%' },
    { date: '13/06', height: '75%' },
    { date: '14/06', height: '60%' },
    { date: '15/06', height: '50%' },
    { date: '16/06', height: '70%' },
    { date: '17/06', height: '55%' },
    { date: '18/06', height: '58%' },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Prediksi Panen (7 Hari ke Depan)</h3>
        <a href="#" className="text-xs text-emerald-700 font-semibold hover:underline">Lihat Detail</a>
      </div>

      <div className="box-body p-4">
        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 pb-3 border-b border-gray-100 text-xs">
          <div>
            <span className="text-gray-400 block text-[10px] mb-0.5">Total Prediksi Hasil</span>
            <span className="text-sm font-extrabold text-gray-800">32.450 Kg</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] mb-0.5">Rata-rata Yield Est.</span>
            <span className="text-sm font-extrabold text-gray-800">1.210 Kg/Ha</span>
          </div>
        </div>

        {/* Bar Chart SVG / Visual Representation */}
        <div className="relative h-32 w-full flex items-end justify-between px-2 pt-4">
          {/* Y Axis Grid lines */}
          <div className="absolute inset-x-0 top-0 border-b border-gray-100"></div>
          <div className="absolute inset-x-0 top-1/4 border-b border-gray-100"></div>
          <div className="absolute inset-x-0 top-2/4 border-b border-gray-100"></div>
          <div className="absolute inset-x-0 top-3/4 border-b border-gray-100"></div>

          {bars.map((bar, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 z-10 w-full">
              <div
                className="w-4 bg-emerald-600 rounded-t hover:bg-emerald-700 transition-all cursor-pointer"
                style={{ height: bar.height }}
              ></div>
              <span className="text-[9px] text-gray-500 font-medium">{bar.date}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 mt-2">
          <span className="w-2.5 h-2.5 bg-emerald-600 rounded-sm inline-block"></span>
          <span>Prediksi Hasil (Kg)</span>
        </div>
      </div>
    </div>
  );
}
