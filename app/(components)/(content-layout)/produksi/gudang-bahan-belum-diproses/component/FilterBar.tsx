"use client";

import React from 'react';

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  filterKomoditas: string;
  onKomoditasChange: (val: string) => void;
  komoditasOptions: string[];
  filterVarietas: string;
  onVarietasChange: (val: string) => void;
  varietasOptions: string[];
  filterStatus: string;
  onStatusChange: (val: string) => void;
  statusOptions: string[];
  filterTanggal: string;
  onTanggalChange: (val: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export default function FilterBar({
  search,
  onSearchChange,
  filterKomoditas,
  onKomoditasChange,
  komoditasOptions,
  filterVarietas,
  onVarietasChange,
  varietasOptions,
  filterStatus,
  onStatusChange,
  statusOptions,
  filterTanggal,
  onTanggalChange,
  onApplyFilters,
  onResetFilters,
}: FilterBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onApplyFilters();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-3 sm:p-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        {/* Search input */}
        <div className="md:col-span-12 lg:col-span-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Cari nomor lot, sumber panen, komoditas, atau petani..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Komoditas */}
        <div className="md:col-span-3 lg:col-span-2">
          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Komoditas</label>
          <select
            value={filterKomoditas}
            onChange={(e) => onKomoditasChange(e.target.value)}
            className="w-full px-2.5 py-2 text-xs rounded-lg border border-gray-200 text-gray-700 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          >
            {komoditasOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Varietas */}
        <div className="md:col-span-3 lg:col-span-2">
          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Varietas</label>
          <select
            value={filterVarietas}
            onChange={(e) => onVarietasChange(e.target.value)}
            className="w-full px-2.5 py-2 text-xs rounded-lg border border-gray-200 text-gray-700 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          >
            {varietasOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="md:col-span-3 lg:col-span-2">
          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-2.5 py-2 text-xs rounded-lg border border-gray-200 text-gray-700 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Tanggal Masuk */}
        <div className="md:col-span-3 lg:col-span-2">
          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Tanggal Masuk</label>
          <div className="relative">
            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => onTanggalChange(e.target.value)}
              className="w-full px-2.5 py-2 text-xs rounded-lg border border-gray-200 text-gray-700 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="md:col-span-12 lg:col-span-1 flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={onResetFilters}
            title="Reset Filter"
            className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={onApplyFilters}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
