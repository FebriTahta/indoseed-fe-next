"use client";

import React from 'react';

interface BahanRankingItem {
  nama: string;
  persentase: number;
}

interface BahanTreatmentTerbanyakCardProps {
  data?: BahanRankingItem[];
}

export default function BahanTreatmentTerbanyakCard({
  data,
}: BahanTreatmentTerbanyakCardProps) {
  const defaultData: BahanRankingItem[] = [
    { nama: 'Carbendazim', persentase: 20 },
    { nama: 'Imidakloprid', persentase: 15 },
    { nama: 'Mancozeb', persentase: 12 },
    { nama: 'Thiamethoxam', persentase: 10 },
    { nama: 'Propikonazol', persentase: 8 },
  ];

  const items = data && data.length > 0 ? data : defaultData;
  const maxPercent = 25; // Scale max for visual progress bar

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex items-center gap-1.5 pb-2 border-b border-gray-100">
        <i className="ri-flask-fill text-emerald-600 text-sm"></i>
        <h3 className="text-xs font-bold text-gray-800">Bahan Treatment Terbanyak</h3>
      </div>

      {/* List with Progress Bars */}
      <div className="space-y-2.5 pt-1">
        {items.map((it, idx) => {
          const barWidth = Math.min((it.persentase / maxPercent) * 100, 100);

          return (
            <div key={idx} className="flex items-center gap-3 text-xs">
              {/* Ingredient Name */}
              <div className="w-28 font-medium text-gray-700 text-[11px] truncate">
                {it.nama}
              </div>

              {/* Progress Track & Bar */}
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 hover:bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${barWidth}%` }}
                ></div>
              </div>

              {/* Percentage Text */}
              <div className="w-10 text-right font-bold text-gray-800 text-[11px]">
                {it.persentase}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
