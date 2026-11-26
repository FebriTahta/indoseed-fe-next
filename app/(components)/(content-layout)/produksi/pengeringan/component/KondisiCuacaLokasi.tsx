"use client";

import React from 'react';

export default function KondisiCuacaLokasi() {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
        <h3 className="text-sm font-bold text-gray-800">Kondisi Cuaca Lokasi</h3>
        <span className="text-[10px] text-gray-400 font-medium">Sumber: BMKG</span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
        <i className="ri-map-pin-line text-emerald-600"></i>
        <span className="font-semibold text-gray-700">Jember, Jawa Timur</span>
      </div>

      {/* Main Temperature & Weather Graphic */}
      <div className="flex items-center justify-between bg-amber-50/40 p-3 rounded-lg border border-amber-100 mb-3">
        <div className="flex items-center gap-3">
          <div className="text-amber-500 text-3xl">
            <i className="ri-sun-cloudy-line"></i>
          </div>
          <div>
            <span className="text-2xl font-black text-gray-900 leading-none block">28°C</span>
            <span className="text-xs text-gray-600 font-medium">Cerah Berawan</span>
          </div>
        </div>
      </div>

      {/* Weather Metrics */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100">
          <span className="text-gray-500">Kelembaban</span>
          <span className="font-bold text-gray-800">65%</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100">
          <span className="text-gray-500">Kecepatan Angin</span>
          <span className="font-bold text-gray-800">12 km/jam Timur</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100">
          <span className="text-gray-500">Curah Hujan</span>
          <span className="font-bold text-gray-800">0 mm</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100">
          <span className="text-gray-500">Update Terakhir</span>
          <span className="font-bold text-gray-800">07:30 WIB</span>
        </div>
      </div>
    </div>
  );
}
