"use client";

import React from 'react';
import Link from 'next/link';

interface HeaderSectionProps {
  onOpenAddModal: () => void;
}

export default function HeaderSection({ onOpenAddModal }: HeaderSectionProps) {
  return (
    <div className="space-y-3">
      {/* Breadcrumb */}
      <nav className="flex items-center text-xs text-gray-500 gap-1.5 font-medium">
        <Link href="/produksi/perencanaan-produksi" className="hover:text-emerald-700 text-emerald-600 transition-colors">
          Produksi
        </Link>
        <span className="text-gray-400">&gt;</span>
        <span className="text-emerald-600">Penerimaan Hasil Panen</span>
        <span className="text-gray-400">&gt;</span>
        <span className="text-gray-500 font-normal">Gudang Bahan Belum Diproses</span>
      </nav>

      {/* Main Title & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-md flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Gudang Bahan Belum Diproses
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Data hasil panen yang sudah diterima dan disimpan di gudang bahan belum diproses sebelum masuk ke tahap pengeringan.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all duration-150 self-start sm:self-auto hover:shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Penerimaan Bahan</span>
        </button>
      </div>
    </div>
  );
}
