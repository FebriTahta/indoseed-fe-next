"use client";

import React from 'react';
import { ManajemenStokStats } from '@/app/types/manajemenStok';

interface LaporanStokModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats?: ManajemenStokStats;
  onExportCsv?: () => void;
}

export default function LaporanStokModal({
  isOpen,
  onClose,
  stats,
  onExportCsv,
}: LaporanStokModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <i className="ri-bar-chart-2-line text-xl"></i>
            </div>
            <div>
              <h4 className="font-bold text-base text-gray-900">Ringkasan Laporan Stok</h4>
              <p className="text-xs text-gray-500 font-medium">Periode: November 2026</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-gray-500 block mb-0.5">Total SKU Terdaftar</span>
              <span className="text-lg font-extrabold text-gray-900">{stats?.totalSkuAktif || 128} SKU</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-gray-500 block mb-0.5">Total Saldo Benih Fisik</span>
              <span className="text-lg font-extrabold text-emerald-700">
                {(stats?.komposisi.totalStok || 12860).toLocaleString('id-ID')} kg
              </span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 space-y-3">
            <h5 className="font-bold text-gray-800 text-xs border-b border-gray-100 pb-2">
              Distribusi Kelaikan QC
            </h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Lolos QC (Siap Dijual)
                </span>
                <span className="font-bold text-gray-900">
                  {(stats?.komposisi.lolosQc.kg || 10000).toLocaleString('id-ID')} kg ({stats?.komposisi.lolosQc.percent || 77.8}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-700 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Karantina (Dalam Pengujian)
                </span>
                <span className="font-bold text-gray-900">
                  {(stats?.komposisi.karantina.kg || 1230).toLocaleString('id-ID')} kg ({stats?.komposisi.karantina.percent || 9.6}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-700 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Ditahan (Perlu Re-treatment/Afkir)
                </span>
                <span className="font-bold text-gray-900">
                  {(stats?.komposisi.ditahan.kg || 330).toLocaleString('id-ID')} kg ({stats?.komposisi.ditahan.percent || 2.6}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-700 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Ter-alokasi ke Pesanan
                </span>
                <span className="font-bold text-gray-900">
                  {(stats?.komposisi.dialokasikan.kg || 1300).toLocaleString('id-ID')} kg ({stats?.komposisi.dialokasikan.percent || 10.1}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (onExportCsv) onExportCsv();
            }}
            className="px-3.5 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <i className="ri-download-line"></i>
            Unduh CSV
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

