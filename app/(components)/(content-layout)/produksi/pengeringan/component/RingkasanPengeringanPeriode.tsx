"use client";

import React from 'react';

export default function RingkasanPengeringanPeriode() {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
        <h3 className="text-sm font-bold text-gray-800">Ringkasan Pengeringan (Periode)</h3>
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between items-center py-1 border-b border-gray-100">
          <span className="text-gray-600">Total Batch</span>
          <span className="font-bold text-gray-800">56</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-gray-100">
          <span className="text-gray-600">Total Berat Masuk</span>
          <span className="font-bold text-gray-800">125.650 Kg</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-gray-100">
          <span className="text-gray-600">Total Berat Keluar</span>
          <span className="font-bold text-gray-800">119.320 Kg</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-gray-100">
          <span className="text-gray-600">Rata-rata Penurunan Kadar Air</span>
          <span className="font-extrabold text-emerald-700">16,8% → 12,3%</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-gray-100">
          <span className="text-gray-600">Selesai</span>
          <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">42 (75%)</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-gray-100">
          <span className="text-gray-600">Dalam Proses</span>
          <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">12 (21%)</span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-gray-600">Bermasalah</span>
          <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">2 (4%)</span>
        </div>
      </div>
    </div>
  );
}
