"use client";

import React from 'react';
import { GudangBahanStats } from '@/app/types/gudangBahanBelumDiproses';

interface StatsCardsProps {
  stats: GudangBahanStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const formatDecimal = (num: number) => {
    return num.toFixed(1).replace('.', ',');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Lot */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100/70 text-emerald-700 flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <span className="text-xs text-gray-500 font-medium block">Total Lot</span>
          <div className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none my-1">
            {stats.totalLot}
          </div>
          <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <span>↑</span>
            <span>{stats.totalLotDelta} dari bulan lalu</span>
          </div>
        </div>
      </div>

      {/* 2. Total Berat Masuk */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100/70 text-emerald-700 flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <span className="text-xs text-gray-500 font-medium block">Total Berat Masuk</span>
          <div className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none my-1">
            {formatNumber(stats.totalBeratMasuk)} kg
          </div>
          <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <span>↑</span>
            <span>{stats.totalBeratMasukDeltaPercent}% dari bulan lalu</span>
          </div>
        </div>
      </div>

      {/* 3. Rata-rata Kadar Air */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100/70 text-emerald-700 flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <span className="text-xs text-gray-500 font-medium block">Rata-rata Kadar Air</span>
          <div className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none my-1">
            {formatDecimal(stats.rataRataKadarAir)}%
          </div>
          <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <span>↑</span>
            <span>-3,2% dari bulan lalu</span>
          </div>
        </div>
      </div>

      {/* 4. Lokasi Penyimpanan */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100/70 text-emerald-700 flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <span className="text-xs text-gray-500 font-medium block">Lokasi Penyimpanan</span>
          <div className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none my-1">
            {stats.lokasiCount} Lokasi
          </div>
          <div className="text-xs font-normal text-gray-500 truncate">
            {stats.lokasiNames || 'A, B, C (Zona Gudang)'}
          </div>
        </div>
      </div>
    </div>
  );
}
