"use client";

import React from 'react';
import { KomposisiStokData } from '@/app/types/manajemenStok';

interface KomposisiStokDonutProps {
  data?: KomposisiStokData;
}

export default function KomposisiStokDonut({ data }: KomposisiStokDonutProps) {
  const total = data?.totalStok || 12860;
  const lolosPercent = data?.lolosQc?.percent || 77.8;
  const karantinaPercent = data?.karantina?.percent || 9.6;
  const ditahanPercent = data?.ditahan?.percent || 2.6;
  const alokasiPercent = data?.dialokasikan?.percent || 10.1;

  // Circumference = 100 with r=15.9155
  // Offsets
  const offsetLolos = 0;
  const offsetKarantina = -(lolosPercent);
  const offsetDitahan = -(lolosPercent + karantinaPercent);
  const offsetAlokasi = -(lolosPercent + karantinaPercent + ditahanPercent);

  return (
    <div className="bg-white border border-gray-200/80 shadow-xs rounded-xl p-5 flex flex-col justify-between h-full">
      {/* Title */}
      <div className="mb-4">
        <h3 className="font-bold text-sm text-gray-800">Komposisi Stok Benih</h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto">
        {/* SVG Donut Chart */}
        <div className="relative w-44 h-44 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background Circle */}
            <path
              className="text-gray-100"
              strokeWidth="4"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* 1. Lolos QC (Green #10b981) */}
            <path
              className="text-emerald-500"
              strokeDasharray={`${lolosPercent}, 100`}
              strokeDashoffset={`${offsetLolos}`}
              strokeWidth="4.2"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* 2. Karantina (Amber/Yellow #f59e0b) */}
            <path
              className="text-amber-500"
              strokeDasharray={`${karantinaPercent}, 100`}
              strokeDashoffset={`${offsetKarantina}`}
              strokeWidth="4.2"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* 3. Ditahan (Rose/Red #ef4444) */}
            <path
              className="text-rose-500"
              strokeDasharray={`${ditahanPercent}, 100`}
              strokeDashoffset={`${offsetDitahan}`}
              strokeWidth="4.2"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* 4. Dialokasikan (Blue #3b82f6) */}
            <path
              className="text-blue-500"
              strokeDasharray={`${alokasiPercent}, 100`}
              strokeDashoffset={`${offsetAlokasi}`}
              strokeWidth="4.2"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-base font-extrabold text-gray-900 leading-tight">
              {total.toLocaleString('id-ID')} kg
            </span>
            <span className="text-[11px] text-gray-400 font-medium leading-none mt-0.5">
              Total Stok
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-2.5 text-xs">
          {/* Lolos QC */}
          <div className="flex items-center justify-between text-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
              <span className="font-medium text-gray-700">Lolos QC</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-900 mr-1.5">
                : {(data?.lolosQc?.kg || 10000).toLocaleString('id-ID')} kg
              </span>
              <span className="text-gray-400 font-normal">
                ({lolosPercent.toLocaleString('id-ID')}%)
              </span>
            </div>
          </div>

          {/* Karantina */}
          <div className="flex items-center justify-between text-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0"></span>
              <span className="font-medium text-gray-700">Karantina</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-900 mr-1.5">
                : {(data?.karantina?.kg || 1230).toLocaleString('id-ID')} kg
              </span>
              <span className="text-gray-400 font-normal">
                ({karantinaPercent.toLocaleString('id-ID')}%)
              </span>
            </div>
          </div>

          {/* Ditahan */}
          <div className="flex items-center justify-between text-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0"></span>
              <span className="font-medium text-gray-700">Ditahan</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-900 mr-1.5">
                : {(data?.ditahan?.kg || 330).toLocaleString('id-ID')} kg
              </span>
              <span className="text-gray-400 font-normal">
                ({ditahanPercent.toLocaleString('id-ID')}%)
              </span>
            </div>
          </div>

          {/* Dialokasikan */}
          <div className="flex items-center justify-between text-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0"></span>
              <span className="font-medium text-gray-700">Dialokasikan</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-900 mr-1.5">
                : {(data?.dialokasikan?.kg || 1300).toLocaleString('id-ID')} kg
              </span>
              <span className="text-gray-400 font-normal">
                ({alokasiPercent.toLocaleString('id-ID')}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

