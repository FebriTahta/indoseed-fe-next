"use client";

import React from 'react';

interface HeaderSectionProps {
  onOpenAddModal: () => void;
  dateRangeText?: string;
}

export default function HeaderSection({
  onOpenAddModal,
  dateRangeText = '01/06/2026 - 30/06/2026',
}: HeaderSectionProps) {
  return (
    <div className="space-y-2">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <span className="text-emerald-700 font-medium">Produksi</span>
        <i className="ri-arrow-right-s-line text-xs"></i>
        <span className="text-gray-600 font-semibold">Treatment</span>
      </nav>

      {/* Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
            <i className="ri-flask-line text-2xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Treatment</h1>
            <p className="text-xs text-gray-500 mt-0.5 max-w-2xl">
              Proses perlakuan benih menggunakan bahan tertentu untuk meningkatkan kualitas, daya simpan, dan performa tumbuh.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center">
          {/* Tambah Proses Treatment Button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <i className="ri-add-line text-sm"></i>
            <span>Tambah Proses Treatment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
