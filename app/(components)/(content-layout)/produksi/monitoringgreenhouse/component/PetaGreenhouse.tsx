import React from 'react';

export default function PetaGreenhouse() {
  const plots = [
    { id: 'GH-01', label: 'GH-01', crop: 'Padi - Inpari 32', badge: 'Baik', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'GH-02', label: 'GH-02', crop: 'Jagung - Pioneer 21', badge: 'Baik', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'GH-03', label: 'GH-03', crop: 'Tomat - Servo', badge: 'Perlu Perhatian', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' },
    { id: 'GH-04', label: 'GH-04', crop: 'Cabai - Laris', badge: 'Baik', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'GH-05', label: 'GH-05', crop: 'Mentimun - Mistar', badge: 'Baik', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'GH-06', label: 'GH-06', crop: 'Padi - Inpari 32', badge: 'Aktif', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'GH-07', label: 'GH-07', crop: 'Kedelai - Anjasmoro', badge: 'Baik', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'GH-08', label: 'GH-08', crop: 'Tomat - Servo', badge: 'Buruk', badgeColor: 'bg-rose-100 text-rose-800 border-rose-300 font-bold' },
    { id: 'GH-09', label: 'GH-09', crop: 'Melon - Golden', badge: 'Baik', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'GH-10', label: 'GH-10', crop: 'Cabai - Laris', badge: 'Tidak Aktif', badgeColor: 'bg-slate-200 text-slate-700 border-slate-300' },
    { id: 'GH-11', label: 'GH-11', crop: 'Padi - Inpari 42', badge: 'Aktif', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'GH-12', label: 'GH-12', crop: 'Jagung - Bisi 18', badge: 'Perlu Perhatian', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' },
    { id: 'GH-13', label: 'GH-13', crop: 'Selada - Grand', badge: 'Baik', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'GH-14', label: 'GH-14', crop: 'Bayam - Hijau', badge: 'Baik', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'GH-15', label: 'GH-15', crop: 'Mentimun - Mistar', badge: 'Aktif', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Peta Greenhouse</h3>
      </div>

      {/* Greenhouse Visual Grid Container */}
      <div className="relative w-full p-5 bg-slate-900 overflow-hidden">
        {/* Satellite / Farm Background Texture */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 scale-105"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=80')`
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
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
              <span className="text-gray-700 font-medium">Tidak Aktif</span>
            </div>
          </div>
        </div>

        {/* Floating Controls (top left) */}
        <div className="absolute top-4 left-4 bg-white/90 border border-gray-200 rounded-lg shadow-md flex flex-col divide-y text-xs text-gray-700 z-20 overflow-hidden">
          <button className="px-2.5 py-1.5 hover:bg-gray-100 font-bold">+</button>
          <button className="px-2.5 py-1.5 hover:bg-gray-100 font-bold">-</button>
        </div>
        <div className="absolute bottom-4 left-4 bg-white/90 border border-gray-200 rounded-lg p-2 shadow-md text-xs text-gray-700 z-20 cursor-pointer hover:bg-gray-100">
          <i className="ri-focus-3-line text-base text-gray-700"></i>
        </div>

        {/* 15 Greenhouse Grid Layout (3 rows of 5 units) */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-4xl pr-48">
          {plots.map((plot) => (
            <div
              key={plot.id}
              className={`border-2 rounded-xl p-2.5 bg-white/90 backdrop-blur-md shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between items-center text-center ${
                plot.badge === 'Buruk' ? 'border-rose-500 ring-2 ring-rose-500/50 bg-rose-50/90' : 'border-gray-200/90'
              }`}
            >
              <span className="font-extrabold text-xs text-gray-800 tracking-wide mb-1">{plot.label}</span>
              <span className="text-[10px] text-gray-600 font-medium truncate w-full mb-1.5">{plot.crop}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-semibold border ${plot.badgeColor}`}>
                {plot.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
