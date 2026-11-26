"use client";

import React from 'react';

interface HeaderSectionProps {
  onOpenAddModal: () => void;
}

export default function HeaderSection({ onOpenAddModal }: HeaderSectionProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
      {/* Breadcrumb & Title */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
          <span className="hover:text-emerald-700 transition-colors font-medium">Produksi</span>
          <span>&gt;</span>
          <span className="text-gray-600 font-semibold">Sortasi</span>
        </nav>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg border border-emerald-200">
            <i className="ri-filter-3-line"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Sortasi</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Proses pemisahan benih berdasarkan ukuran, bentuk, dan kualitas untuk mendapatkan benih yang sesuai standar.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons & Date Range */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Date Filter Pill */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 shadow-2xs font-medium">
          <i className="ri-calendar-line text-gray-500"></i>
          <span>01/06/2026 - 30/06/2026</span>
          <i className="ri-arrow-down-s-line text-gray-400 text-xs"></i>
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 bg-[#078836] hover:bg-[#06732d] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
        >
          <i className="ri-add-line text-sm font-bold"></i>
          <span>Tambah Proses Sortasi</span>
        </button>
      </div>
    </div>
  );
}
