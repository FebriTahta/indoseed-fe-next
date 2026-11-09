"use client";

import React from 'react';
import { BatchProduksiItem } from '@/app/types/batchProduksi';

interface BatchProduksiDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BatchProduksiItem | null;
}

export default function BatchProduksiDetailModal({
  isOpen,
  onClose,
  item,
}: BatchProduksiDetailModalProps) {
  if (!isOpen || !item) return null;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Selesai
          </span>
        );
      case 'Dalam Proses':
      case 'Proses':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Dalam Proses
          </span>
        );
      case 'Tertunda':
      case 'Reject':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Tertunda
          </span>
        );
      case 'Persiapan':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Persiapan
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
              <i className="ri-flask-line text-lg"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-800">Detail Batch Produksi</h4>
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
              <span className="text-gray-500 text-[11px] block">Status Batch</span>
              <div className="mt-1">{renderStatusBadge(item.status)}</div>
            </div>
            <div className="text-right">
              <span className="text-gray-500 text-[11px] block">Capaian Realisasi</span>
              <span className="inline-block mt-1 font-extrabold text-emerald-700 text-sm bg-white px-2.5 py-0.5 rounded border border-emerald-200">
                {item.hasilKg ? `${item.hasilKg.toLocaleString('id-ID')} Kg` : '—'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50/70 rounded-lg border border-gray-100">
              <span className="text-gray-400 block text-[10px]">Komoditas</span>
              <span className="font-bold text-gray-800 text-xs">{item.komoditas}</span>
            </div>

            <div className="p-3 bg-gray-50/70 rounded-lg border border-gray-100">
              <span className="text-gray-400 block text-[10px]">Varietas</span>
              <span className="font-bold text-gray-800 text-xs">{item.varietas}</span>
            </div>

            <div className="p-3 bg-gray-50/70 rounded-lg border border-gray-100">
              <span className="text-gray-400 block text-[10px]">Lahan / Greenhouse</span>
              <span className="font-bold text-gray-800 text-xs">{item.lokasi || item.lahan || 'GH-001'}</span>
            </div>

            <div className="p-3 bg-gray-50/70 rounded-lg border border-gray-100">
              <span className="text-gray-400 block text-[10px]">Target Produksi</span>
              <span className="font-bold text-gray-800 text-xs">
                {item.targetKg ? `${item.targetKg.toLocaleString('id-ID')} Kg` : '-'}
              </span>
            </div>

            <div className="p-3 bg-gray-50/70 rounded-lg border border-gray-100">
              <span className="text-gray-400 block text-[10px]">Tanggal Mulai</span>
              <span className="font-semibold text-gray-800">{item.tanggalMulai}</span>
            </div>

            <div className="p-3 bg-gray-50/70 rounded-lg border border-gray-100">
              <span className="text-gray-400 block text-[10px]">Tanggal Selesai</span>
              <span className="font-semibold text-gray-800">{item.tanggalSelesai || '-'}</span>
            </div>

            <div className="p-3 bg-gray-50/70 rounded-lg border border-gray-100 col-span-2">
              <span className="text-gray-400 block text-[10px]">Referensi Gudang Bahan (Lot)</span>
              <span className="font-bold text-emerald-800 text-xs">{item.sumberBahan || item.noLot || '-'}</span>
            </div>
          </div>

          {item.catatan && (
            <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/80">
              <span className="text-amber-800 font-bold block text-[10px] mb-0.5">Catatan:</span>
              <p className="text-amber-900 text-xs leading-relaxed">{item.catatan}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex justify-end">
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
