"use client";

import React from 'react';

interface StatusDistribution {
  selesai?: { count: number; percent: number };
  dalamProses?: { count: number; percent: number };
  tertunda?: { count: number; percent: number };
  persiapan?: { count: number; percent: number };
}

interface StatusBatchProduksiBarProps {
  distribution?: StatusDistribution;
}

export default function StatusBatchProduksiBar({
  distribution = {
    selesai: { count: 14, percent: 50 },
    dalamProses: { count: 12, percent: 43 },
    tertunda: { count: 2, percent: 7 },
    persiapan: { count: 2, percent: 7 },
  },
}: StatusBatchProduksiBarProps) {
  const items = [
    {
      label: 'Selesai',
      count: distribution.selesai?.count ?? 14,
      percent: distribution.selesai?.percent ?? 50,
      color: 'bg-emerald-500',
    },
    {
      label: 'Dalam Proses',
      count: distribution.dalamProses?.count ?? 12,
      percent: distribution.dalamProses?.percent ?? 43,
      color: 'bg-amber-400',
    },
    {
      label: 'Tertunda',
      count: distribution.tertunda?.count ?? 2,
      percent: distribution.tertunda?.percent ?? 7,
      color: 'bg-rose-500',
    },
    {
      label: 'Persiapan',
      count: distribution.persiapan?.count ?? 2,
      percent: distribution.persiapan?.percent ?? 7,
      color: 'bg-blue-500',
    },
  ];

  return (
    <div className="bg-white border border-gray-200/80 shadow-xs rounded-xl p-4 flex flex-col justify-between h-full">
      {/* Title */}
      <h4 className="text-xs font-bold text-gray-800 mb-3">Status Batch Produksi</h4>

      {/* Progress Bars */}
      <div className="space-y-2.5 my-auto">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 text-xs">
            <span className="w-24 text-gray-600 font-medium text-[11px] flex-shrink-0">
              {item.label}
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{ width: `${item.percent}%` }}
              ></div>
            </div>
            <span className="w-16 text-right text-gray-700 font-semibold text-[11px] flex-shrink-0">
              {item.count}{' '}
              <span className="text-gray-400 font-normal">({item.percent}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
