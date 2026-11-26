"use client";

import React from 'react';
import { TahapanProduksiItem } from '@/app/types/batchProduksi';

interface TahapanProduksiProgressProps {
  items: TahapanProduksiItem[];
}

export default function TahapanProduksiProgress({ items }: TahapanProduksiProgressProps) {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
        <h3 className="text-sm font-bold text-gray-800">Tahapan Produksi</h3>
        <button type="button" className="text-xs font-semibold text-emerald-700 hover:underline">
          Lihat Detail
        </button>
      </div>

      {/* Progress Bars List */}
      <div className="space-y-2.5 text-xs">
        {items.map((tahap, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                <i className={`${tahap.icon} text-emerald-700 text-sm`}></i>
                <span>{tahap.namaTahap}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-gray-400 font-normal">{tahap.completedBatch}/{tahap.totalBatch} Batch</span>
                <span className="font-bold text-gray-800 w-8 text-right">{tahap.percentage}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${
                  tahap.percentage === 100
                    ? 'bg-emerald-600'
                    : tahap.percentage >= 70
                    ? 'bg-emerald-500'
                    : tahap.percentage >= 35
                    ? 'bg-teal-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${tahap.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
