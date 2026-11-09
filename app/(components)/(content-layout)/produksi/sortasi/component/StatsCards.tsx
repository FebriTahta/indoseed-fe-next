"use client";

import React from 'react';
import { SortasiStats } from '@/app/types/sortasi';

interface StatsCardsProps {
  stats: SortasiStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Batch Sortasi',
      value: stats.totalBatch.toString(),
      subtitle: 'dalam periode ini',
      icon: 'ri-calendar-check-line',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    },
    {
      title: 'Total Berat Masuk',
      value: stats.totalBeratMasukFormatted || `${stats.totalBeratMasuk.toLocaleString('id-ID')} kg`,
      subtitle: 'dari proses pengeringan',
      icon: 'ri-inbox-archive-line',
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-200',
    },
    {
      title: 'Total Berat Lolos',
      value: stats.totalBeratLolosFormatted || `${stats.totalBeratLolos.toLocaleString('id-ID')} kg`,
      subtitle: `${stats.persenLolos} dari berat masuk`,
      icon: 'ri-shopping-bag-3-line',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-200',
    },
    {
      title: 'Total Berat Reject',
      value: stats.totalBeratRejectFormatted || `${stats.totalBeratReject.toLocaleString('id-ID')} kg`,
      subtitle: `${stats.persenReject} dari berat masuk`,
      icon: 'ri-error-warning-line',
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-200',
    },
    {
      title: 'Rata-rata Kualitas',
      value: stats.rataRataKualitas,
      subtitle: '(berdasarkan standar)',
      icon: 'ri-award-line',
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5"
        >
          {/* Icon Circle */}
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${card.iconBg}`}
          >
            <i className={card.icon}></i>
          </div>

          {/* Texts */}
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-gray-500 block truncate">
              {card.title}
            </span>
            <div className="text-lg font-bold text-gray-900 tracking-tight leading-tight mt-0.5">
              {card.value}
            </div>
            <span className="text-[10px] text-gray-400 block truncate mt-0.5">
              {card.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
