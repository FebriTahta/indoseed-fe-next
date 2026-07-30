import React from 'react';

export default function PetaSebaranLahan() {
  const plotData = [
    {
      id: 'LA-2605-0001',
      title: 'LA-2605-0001',
      sub: 'Padi - Inpari 32',
      area: '12,50 Ha',
      colorBg: 'bg-emerald-700/80 border-emerald-500',
      textColor: 'text-white',
      badge: null,
      top: '25%',
      left: '18%'
    },
    {
      id: 'LA-2605-0002',
      title: 'LA-2605-0002',
      sub: 'Jagung - Pioneer 21',
      area: '8,20 Ha',
      colorBg: 'bg-emerald-700/80 border-emerald-500',
      textColor: 'text-white',
      badge: null,
      top: '20%',
      left: '32%'
    },
    {
      id: 'LA-2605-0003',
      title: 'LA-2605-0003',
      sub: 'Kedelai - Anjasmoro',
      area: '10,00 Ha',
      colorBg: 'bg-amber-600/85 border-amber-400',
      textColor: 'text-white',
      badge: null,
      top: '28%',
      left: '52%'
    },
    {
      id: 'LA-2605-0004',
      title: 'LA-2605-0004',
      sub: 'Padi - Inpari 42',
      area: '9,75 Ha',
      colorBg: 'bg-emerald-700/80 border-emerald-500',
      textColor: 'text-white',
      badge: null,
      top: '55%',
      left: '24%'
    },
    {
      id: 'LA-2605-0005',
      title: 'LA-2605-0005',
      sub: 'Jagung - Bisi 18',
      area: '6,30 Ha',
      colorBg: 'bg-rose-700/85 border-rose-500',
      textColor: 'text-white',
      badge: 'warning',
      top: '52%',
      left: '42%'
    },
    {
      id: 'LA-2605-0006',
      title: 'LA-2605-0006',
      sub: 'Padi - Ciherang',
      area: '11,20 Ha',
      colorBg: 'bg-emerald-700/80 border-emerald-500',
      textColor: 'text-white',
      badge: null,
      top: '52%',
      left: '60%'
    },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Peta Sebaran Lahan</h3>
      </div>
      
      {/* Map Container with Satellite-style background pattern */}
      <div className="relative w-full h-[380px] bg-slate-900 overflow-hidden select-none">
        {/* Satellite Map Grid Background Image / Texture */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-65 scale-105"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80')`
          }}
        />

        {/* Floating Legend Box (top right) */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur border border-gray-200 rounded-lg p-3 shadow-md z-20 text-xs w-44">
          <h4 className="font-bold text-gray-800 text-[11px] mb-2 border-b border-gray-100 pb-1">Legenda Kondisi</h4>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-gray-700 font-medium">Baik</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-gray-700 font-medium">Perlu Perhatian</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-gray-700 font-medium">Buruk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
              <span className="text-gray-700 font-medium">Belum Tanam</span>
            </div>
          </div>
        </div>

        {/* Floating Zoom & Location Controls */}
        <div className="absolute bottom-16 right-4 bg-white/90 border border-gray-200 rounded-lg shadow-md flex flex-col divide-y text-xs text-gray-700 z-20 overflow-hidden">
          <button className="px-2.5 py-1.5 hover:bg-gray-100 font-bold">+</button>
          <button className="px-2.5 py-1.5 hover:bg-gray-100 font-bold">-</button>
        </div>
        <div className="absolute bottom-4 right-4 bg-white/90 border border-gray-200 rounded-lg p-2 shadow-md text-xs text-gray-700 z-20 cursor-pointer hover:bg-gray-100">
          <i className="ri-focus-3-line text-base text-gray-700"></i>
        </div>

        {/* Map Plot Polygons */}
        <div className="relative w-full h-full p-6">
          {plotData.map((plot) => (
            <div
              key={plot.id}
              className={`absolute border-2 rounded-xl p-2.5 backdrop-blur-sm cursor-pointer transform hover:scale-105 transition-all shadow-lg flex flex-col justify-center text-center ${plot.colorBg}`}
              style={{
                top: plot.top,
                left: plot.left,
                width: '135px',
                height: '75px',
                clipPath: 'polygon(10% 0%, 90% 0%, 100% 90%, 0% 100%)'
              }}
            >
              <span className="font-bold text-[11px] text-white tracking-wide block leading-tight">{plot.title}</span>
              <span className="text-[10px] text-white/90 font-medium truncate block my-0.5">{plot.sub}</span>
              <span className="text-[10px] text-white/80 font-semibold">{plot.area}</span>

              {plot.badge === 'warning' && (
                <div className="absolute -bottom-2 -right-1 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md animate-bounce">
                  <i className="ri-error-warning-fill"></i>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
