"use client";

import React from 'react';
import { KesiapanPanenItem } from '@/app/types/kesiapanPanen';

interface KesiapanPanenDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: KesiapanPanenItem | null;
}

export default function KesiapanPanenDetailModal({
  isOpen,
  onClose,
  item,
}: KesiapanPanenDetailModalProps) {
  if (!isOpen || !item) return null;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Siap Panen':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <i className="ri-checkbox-circle-fill mr-1"></i> Siap Panen
          </span>
        );
      case 'Akan Siap (3-7 Hari)':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <i className="ri-time-fill mr-1"></i> Akan Siap (3-7 Hari)
          </span>
        );
      case 'Akan Siap (8-14 Hari)':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300">
            <i className="ri-calendar-event-fill mr-1"></i> Akan Siap (8-14 Hari)
          </span>
        );
      case 'Belum Siap':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <i className="ri-close-circle-fill mr-1"></i> Belum Siap
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <i className="ri-eye-line text-lg"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-800">Detail Kesiapan Panen</h4>
              <span className="text-xs text-emerald-700 font-semibold">{item.kodeLahan}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="text-gray-500 text-[11px] block">Status Kesiapan</span>
              <div className="mt-1">{renderStatusBadge(item.statusKesiapan)}</div>
            </div>
            <div className="text-right">
              <span className="text-gray-500 text-[11px] block">Estimasi Yield (Kg/Ha)</span>
              <span className="inline-block mt-1 font-extrabold text-emerald-700 text-sm bg-white px-2.5 py-0.5 rounded border border-emerald-200">
                {item.yieldEst ? item.yieldEst.toLocaleString('id-ID') : 0} Kg/Ha
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Komoditas</span>
              <span className="font-bold text-gray-800">{item.komoditas}</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Varietas</span>
              <span className="font-bold text-gray-800">{item.varietas}</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Tanggal Tanam</span>
              <span className="font-bold text-gray-800">{item.tanggalTanam || '—'}</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Umur Tanaman</span>
              <span className="font-bold text-gray-800">{item.umurHst} HST</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100 col-span-2">
              <span className="text-gray-500 block mb-0.5">Prediksi Tanggal Panen</span>
              <span className="font-bold text-emerald-800">{item.prediksiPanen || '—'}</span>
            </div>
          </div>

          {item.catatan && (
            <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-lg text-amber-900">
              <span className="font-semibold block mb-0.5 text-amber-950">Catatan Kesiapan:</span>
              <p className="mb-0 text-gray-700 leading-relaxed">{item.catatan}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 flex justify-end bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md font-semibold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
