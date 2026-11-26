"use client";

import React from 'react';

export default function RingkasanStokPerGudangDonut() {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
        <h3 className="text-xs font-bold text-gray-800">Ringkasan Stok Benih per Gudang</h3>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* SVG Donut Chart */}
        <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background Circle */}
            <path
              className="text-gray-100"
              strokeWidth="4"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Gudang A: 50.9% (Dark Blue/Teal #0f172a / #0e7490) */}
            <path
              className="text-[#0e7490]"
              strokeDasharray="50.9, 100"
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Gudang B: 34.9% (Emerald #10b981) offset -50.9 */}
            <path
              className="text-emerald-500"
              strokeDasharray="34.9, 100"
              strokeDashoffset="-50.9"
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Gudang C: 14.2% (Amber #f59e0b) offset -85.8 */}
            <path
              className="text-amber-500"
              strokeDasharray="14.2, 100"
              strokeDashoffset="-85.8"
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-extrabold text-gray-900 leading-tight">2.456 Kg</span>
            <span className="text-[9px] text-gray-400 font-medium leading-none">Total Stok</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 space-y-2 text-[11px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#0e7490]"></span>
              <span className="text-gray-600 font-medium">Gudang A</span>
            </div>
            <span className="font-bold text-gray-800">1.250 Kg <span className="text-[10px] text-gray-400 font-normal">(50,9%)</span></span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500"></span>
              <span className="text-gray-600 font-medium">Gudang B</span>
            </div>
            <span className="font-bold text-gray-800">856 Kg <span className="text-[10px] text-gray-400 font-normal">(34,9%)</span></span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-500"></span>
              <span className="text-gray-600 font-medium">Gudang C</span>
            </div>
            <span className="font-bold text-gray-800">350 Kg <span className="text-[10px] text-gray-400 font-normal">(14,2%)</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
