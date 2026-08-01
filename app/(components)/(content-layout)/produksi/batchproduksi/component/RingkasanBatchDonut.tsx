"use client";

import React from 'react';

export default function RingkasanBatchDonut() {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
        <h3 className="text-sm font-bold text-gray-800">Ringkasan Batch Produksi</h3>
        <span className="text-[10px] text-gray-400 font-medium">Update terakhir: 11/06/2026 14:30 WIB</span>
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
            {/* Selesai: 57.14% (emerald) */}
            <path
              className="text-emerald-500"
              strokeDasharray="57.14, 100"
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Proses: 32.14% (blue) offset */}
            <path
              className="text-blue-500"
              strokeDasharray="32.14, 100"
              strokeDashoffset="-57.14"
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Reject: 3.57% (rose) offset */}
            <path
              className="text-rose-500"
              strokeDasharray="3.57, 100"
              strokeDashoffset="-89.28"
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Belum Mulai: 7.14% (gray) offset */}
            <path
              className="text-slate-300"
              strokeDasharray="7.14, 100"
              strokeDashoffset="-92.85"
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-gray-400 font-medium">Total Batch</span>
            <span className="text-xl font-extrabold text-gray-900 leading-none">56</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
              <span className="text-gray-600 font-medium">Selesai</span>
            </div>
            <span className="font-bold text-gray-800">32 <span className="text-[10px] text-gray-400 font-normal">(57,14%)</span></span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
              <span className="text-gray-600 font-medium">Proses</span>
            </div>
            <span className="font-bold text-gray-800">18 <span className="text-[10px] text-gray-400 font-normal">(32,14%)</span></span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
              <span className="text-gray-600 font-medium">Reject</span>
            </div>
            <span className="font-bold text-gray-800">2 <span className="text-[10px] text-gray-400 font-normal">(3,57%)</span></span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-300"></span>
              <span className="text-gray-600 font-medium">Belum Mulai</span>
            </div>
            <span className="font-bold text-gray-800">4 <span className="text-[10px] text-gray-400 font-normal">(7,14%)</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
