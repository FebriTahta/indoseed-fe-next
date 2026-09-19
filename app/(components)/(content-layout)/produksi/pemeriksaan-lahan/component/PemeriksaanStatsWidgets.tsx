"use client";

import React from 'react';
import { PemeriksaanStats } from '@/app/types/pemeriksaanLahan';

interface PemeriksaanStatsWidgetsProps {
  stats: PemeriksaanStats | null;
}

export default function PemeriksaanStatsWidgets({ stats }: PemeriksaanStatsWidgetsProps) {
  const total = stats?.totalPemeriksaan ?? 24;
  const memenuhi = stats?.memenuhiStandar ?? 16;
  const roguing = stats?.perluRoguing ?? 4;
  const tidakMemenuhi = stats?.tidakMemenuhi ?? 2;
  const avg = stats?.rataRataKemurnian ? String(stats.rataRataKemurnian).replace('.', ',') : '98,7';

  const cards = [
    {
      title: 'Total Pemeriksaan',
      value: total,
      subtext: '2 dari bulan lalu',
      trend: 'up',
      icon: 'ri-plant-line',
      iconBg: 'bg-emerald-100 text-emerald-700',
      isPercentage: false,
    },
    {
      title: 'Memenuhi Standar',
      value: memenuhi,
      subtext: '3 dari bulan lalu',
      trend: 'up',
      icon: 'ri-checkbox-circle-fill',
      iconBg: 'bg-blue-100 text-blue-600',
      isPercentage: false,
    },
    {
      title: 'Perlu Roguing',
      value: roguing,
      subtext: '1 dari bulan lalu',
      trend: 'up',
      icon: 'ri-alert-fill',
      iconBg: 'bg-amber-100 text-amber-600',
      isPercentage: false,
    },
    {
      title: 'Tidak Memenuhi',
      value: tidakMemenuhi,
      subtext: '1 dari bulan lalu',
      trend: 'down',
      icon: 'ri-close-circle-fill',
      iconBg: 'bg-rose-100 text-rose-600',
      isPercentage: false,
    },
    {
      title: 'Rata-rata Kemurnian',
      value: `${avg}%`,
      subtext: '0,5% dari bulan lalu',
      trend: 'up',
      icon: 'ri-leaf-fill',
      iconBg: 'bg-purple-100 text-purple-600',
      isPercentage: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((c, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-gray-100/90 p-4 shadow-xs flex items-center justify-between transition-all hover:shadow-sm"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">
              {c.title}
            </span>
            <div className="text-2xl font-bold text-gray-900 tracking-tight">
              {c.value}
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              {c.trend === 'up' ? (
                <span className="text-emerald-600 flex items-center font-medium">
                  <i className="ri-arrow-up-line text-xs mr-0.5"></i>
                  {c.subtext}
                </span>
              ) : (
                <span className="text-rose-600 flex items-center font-medium">
                  <i className="ri-arrow-down-line text-xs mr-0.5"></i>
                  {c.subtext}
                </span>
              )}
            </div>
          </div>

          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${c.iconBg}`}
          >
            <i className={c.icon}></i>
          </div>
        </div>
      ))}
    </div>
  );
}
