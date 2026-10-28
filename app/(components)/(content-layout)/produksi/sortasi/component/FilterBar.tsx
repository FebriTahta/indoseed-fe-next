"use client";

import React from 'react';

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  filterPeriode: string;
  onPeriodeChange: (val: string) => void;
  periodeOptions: string[];
  filterKomoditas: string;
  onKomoditasChange: (val: string) => void;
  komoditasOptions: string[];
  filterStatus: string;
  onStatusChange: (val: string) => void;
  statusOptions: string[];
  onReset: () => void;
  onExport?: () => void;
}

export default function FilterBar({
  search,
  onSearchChange,
  filterPeriode,
  onPeriodeChange,
  periodeOptions,
  filterKomoditas,
  onKomoditasChange,
  komoditasOptions,
  filterStatus,
  onStatusChange,
  statusOptions,
  onReset,
  onExport,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/90 p-3 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Left Filters */}
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nomor batch, komoditas, varietas, atau petani..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-hidden focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>

        {/* Periode Select */}
        <div className="relative min-w-[140px]">
          <select
            value={filterPeriode}
            onChange={(e) => onPeriodeChange(e.target.value)}
            className="w-full appearance-none pl-3 pr-7 py-1.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-hidden focus:bg-white focus:border-emerald-500 cursor-pointer"
          >
            {periodeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <i className="ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
        </div>

        {/* Komoditas Select */}
        <div className="relative min-w-[140px]">
          <select
            value={filterKomoditas}
            onChange={(e) => onKomoditasChange(e.target.value)}
            className="w-full appearance-none pl-3 pr-7 py-1.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-hidden focus:bg-white focus:border-emerald-500 cursor-pointer"
          >
            {komoditasOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <i className="ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
        </div>

        {/* Status Select */}
        <div className="relative min-w-[130px]">
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full appearance-none pl-3 pr-7 py-1.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-hidden focus:bg-white focus:border-emerald-500 cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <i className="ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
        </div>
      </div>

      {/* Right Buttons */}
      <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
        >
          <i className="ri-refresh-line text-xs"></i>
          <span>Reset</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#078836] hover:bg-[#06732d] rounded-lg transition-colors shadow-2xs"
        >
          <i className="ri-download-2-line text-xs"></i>
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
