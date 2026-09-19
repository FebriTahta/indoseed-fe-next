"use client";

import React from 'react';
import { PemeriksaanStats } from '@/app/types/pemeriksaanLahan';

interface PemeriksaanFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  komoditas: string;
  onKomoditasChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  periode: string;
  onPeriodeChange: (val: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAddModal: () => void;
  stats: PemeriksaanStats | null;
}

export default function PemeriksaanFilterBar({
  search,
  onSearchChange,
  komoditas,
  onKomoditasChange,
  status,
  onStatusChange,
  periode,
  onPeriodeChange,
  activeTab,
  onTabChange,
  onOpenAddModal,
  stats,
}: PemeriksaanFilterBarProps) {
  const tabs = [
    { key: 'semua', label: 'Semua', count: null },
    { key: 'pemeriksaan', label: 'Pemeriksaan', count: stats?.tabCounts?.pemeriksaan ?? 24 },
    { key: 'offtype', label: 'Off Type', count: stats?.tabCounts?.offType ?? 6 },
    { key: 'roguing', label: 'Roguing', count: stats?.tabCounts?.roguing ?? 4 },
    { key: 'selesai', label: 'Selesai', count: stats?.tabCounts?.selesai ?? 18 },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Top Filter Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-100 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari jadwal tanam, komoditas, petani, lahan, atau nomor pemeriksaan..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50/70 border border-gray-200/80 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Periode Input */}
        <div className="relative min-w-[190px]">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50/70 border border-gray-200/80 rounded-lg text-xs text-gray-700 cursor-pointer hover:bg-white transition-all">
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-400 font-medium -mb-0.5">Periode</span>
              <span className="font-medium text-gray-700">
                {periode || '01/06/2026 - 30/06/2026'}
              </span>
            </div>
            <i className="ri-calendar-line text-gray-400 text-sm ml-2"></i>
          </div>
        </div>

        {/* Komoditas Dropdown */}
        <div className="min-w-[150px]">
          <select
            value={komoditas}
            onChange={(e) => onKomoditasChange(e.target.value)}
            aria-label="Filter Komoditas"
            className="w-full px-3 py-2.5 bg-gray-50/70 border border-gray-200/80 rounded-lg text-xs text-gray-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer transition-all"
          >
            <option value="Semua Komoditas">Semua Komoditas</option>
            <option value="Kangkung">Kangkung</option>
            <option value="Cabai">Cabai</option>
            <option value="Tomat">Tomat</option>
            <option value="Padi">Padi</option>
            <option value="Terong">Terong</option>
            <option value="Wortel">Wortel</option>
            <option value="Jagung">Jagung</option>
            <option value="Kedelai">Kedelai</option>
            <option value="Semangka">Semangka</option>
            <option value="Melon">Melon</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="min-w-[140px]">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter Status"
            className="w-full px-3 py-2.5 bg-gray-50/70 border border-gray-200/80 rounded-lg text-xs text-gray-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer transition-all"
          >
            <option value="Semua Status">Semua Status</option>
            <option value="Memenuhi">Memenuhi</option>
            <option value="Perlu Roguing">Perlu Roguing</option>
            <option value="Tidak Memenuhi">Tidak Memenuhi</option>
          </select>
        </div>

        {/* + Tambah Pemeriksaan Button */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="bg-[#055127] hover:bg-[#04401f] text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all whitespace-nowrap active:scale-[0.99]"
        >
          <i className="ri-add-line text-sm"></i>
          Tambah Pemeriksaan
        </button>
      </div>

      {/* Quick Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#055127] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/80'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-emerald-800 text-emerald-100'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
