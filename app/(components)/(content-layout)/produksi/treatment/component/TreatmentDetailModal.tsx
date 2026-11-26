"use client";

import React from 'react';
import { TreatmentBatchItem } from '@/app/types/treatment';

interface TreatmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: TreatmentBatchItem | null;
}

export default function TreatmentDetailModal({
  isOpen,
  onClose,
  item,
}: TreatmentDetailModalProps) {
  if (!isOpen || !item) return null;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <i className="ri-checkbox-circle-fill mr-1"></i> Selesai
          </span>
        );
      case 'Proses':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <i className="ri-loader-4-line animate-spin mr-1"></i> Proses
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <i className="ri-time-fill mr-1"></i> Pending
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
              <h4 className="font-bold text-sm text-gray-800">Detail Batch Treatment</h4>
              <span className="text-xs text-emerald-700 font-semibold">{item.kodeBatch}</span>
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
              <span className="text-gray-500 text-[11px] block">Status Treatment</span>
              <div className="mt-1">{renderStatusBadge(item.status)}</div>
            </div>
            <div className="text-right">
              <span className="text-gray-500 text-[11px] block">Loss / Susut (%)</span>
              <span className="inline-block mt-1 font-extrabold text-rose-600 text-sm bg-white px-2.5 py-0.5 rounded border border-rose-200">
                {item.loss ? `${item.loss.toFixed(2).replace('.', ',')}%` : '—'}
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
              <span className="text-gray-500 block mb-0.5">Jenis Treatment</span>
              <span className="font-bold text-emerald-800">{item.treatment}</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Dosis Penggunaan</span>
              <span className="font-bold text-gray-800">{item.dosis}</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Berat Awal (Kg)</span>
              <span className="font-bold text-gray-800">{item.beratAwal ? item.beratAwal.toLocaleString('id-ID') : 0} Kg</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Berat Akhir (Kg)</span>
              <span className="font-bold text-emerald-700">{item.beratAkhir ? item.beratAkhir.toLocaleString('id-ID') : 0} Kg</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Operator</span>
              <span className="font-bold text-gray-800">{item.operator}</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Tanggal Selesai</span>
              <span className="font-bold text-gray-800">{item.tanggalSelesai}</span>
            </div>
          </div>

          {item.catatan && (
            <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-lg text-amber-900">
              <span className="font-semibold block mb-0.5 text-amber-950">Catatan Treatment:</span>
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
