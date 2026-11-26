import React from 'react';
import { PerencanaanStats } from '@/app/types/perencanaanProduksi';

interface StatCardsProps {
  stats: PerencanaanStats;
}

export default function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      title: 'Total Rencana Produksi',
      value: stats.totalRencana || 12,
      unit: 'periode',
      trend: '↑ 2 dari bulan lalu',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Total Target Produksi',
      value: `${(stats.totalTargetProduksi || 4850).toLocaleString('id-ID')} kg`,
      unit: '',
      trend: '↑ 12% dari bulan lalu',
      iconBg: 'bg-sky-50 text-sky-600 border border-sky-100',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-4a5 5 0 100-10 5 5 0 000 10zm0-2a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      )
    },
    {
      title: 'Total Kebutuhan Benih',
      value: `${(stats.totalKebutuhanBenih || 2850).toLocaleString('id-ID')} kg`,
      unit: '',
      trend: '↑ 8% dari bulan lalu',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    },
    {
      title: 'Total Luas Lahan',
      value: `${stats.totalLuasLahan || 25} ha`,
      unit: '',
      trend: '↑ 5% dari bulan lalu',
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: 'Jumlah Petani',
      value: stats.jumlahPetani || 8,
      unit: '',
      trend: '↑ 1 dari bulan lalu',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm hover:shadow transition-all duration-200 flex items-start justify-between"
        >
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium mb-1.5">{card.title}</p>
            <div className="flex items-baseline mb-2">
              <span className="text-2xl font-bold text-gray-800 tracking-tight">{card.value}</span>
              {card.unit && <span className="text-xs font-normal text-gray-500 ml-1.5">{card.unit}</span>}
            </div>
            <div className="flex items-center text-[11px] font-medium text-emerald-600">
              <span>{card.trend}</span>
            </div>
          </div>
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${card.iconBg}`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
