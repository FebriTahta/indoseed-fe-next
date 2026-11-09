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
  onReset?: () => void;
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
    <div className="bg-white rounded-xl border border-gray-200/90 p-3 shadow-2xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
        {/* Left Side: Search & Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari no batch, komoditas, varietas, petani..."
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50/70 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                <i className="ri-close-circle-fill"></i>
              </button>
            )}
          </div>

          {/* Periode Dropdown */}
          <div className="relative w-full sm:w-36">
            <select
              value={filterPeriode}
              onChange={(e) => onPeriodeChange(e.target.value)}
              className="w-full appearance-none pl-3 pr-7 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
            >
              {periodeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <i className="ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs"></i>
          </div>

          {/* Komoditas Dropdown */}
          <div className="relative w-full sm:w-40">
            <select
              value={filterKomoditas}
              onChange={(e) => onKomoditasChange(e.target.value)}
              className="w-full appearance-none pl-3 pr-7 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
            >
              {komoditasOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <i className="ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs"></i>
          </div>

          {/* Status Dropdown */}
          <div className="relative w-full sm:w-36">
            <select
              value={filterStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full appearance-none pl-3 pr-7 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <i className="ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs"></i>
          </div>
        </div>

        {/* Right Side: Filter Toggle & Export Buttons */}
        <div className="flex items-center gap-2 self-end lg:self-center">
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              title="Reset Filter"
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <i className="ri-filter-line text-xs"></i>
              <span>Filter</span>
            </button>
          )}

          <button
            type="button"
            onClick={onExport || (() => alert('Mengekspor data treatment...'))}
            className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <i className="ri-download-2-line text-xs"></i>
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}
