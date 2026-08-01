"use client";

import React from 'react';
import { StokBenihItem } from '@/app/types/stokBenih';

interface StokBenihDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: StokBenihItem | null;
}

export default function StokBenihDetailModal({
  isOpen,
  onClose,
  item,
}: StokBenihDetailModalProps) {
  if (!isOpen || !item) return null;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Aman':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <i className="ri-checkbox-circle-fill mr-1"></i> Aman
          </span>
        );
      case 'Exp < 30 Hari':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <i className="ri-error-warning-fill mr-1"></i> Exp &lt; 30 Hari
          </span>
        );
      case 'Expired':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <i className="ri-close-circle-fill mr-1"></i> Expired
          </span>
        );
    }
  };

  const available = Math.max(0, (item.stokKg || 0) - (item.reservedKg || 0));

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
              <h4 className="font-bold text-sm text-gray-800">Detail Stok Benih</h4>
              <span className="text-xs text-emerald-700 font-semibold">{item.batchLot}</span>
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
              <span className="text-gray-500 text-[11px] block">Status Stok</span>
              <div className="mt-1">{renderStatusBadge(item.status)}</div>
            </div>
            <div className="text-right">
              <span className="text-gray-500 text-[11px] block">Daya Tumbuh (%)</span>
              <span className="inline-block mt-1 font-extrabold text-emerald-700 text-sm bg-white px-2.5 py-0.5 rounded border border-emerald-200">
                {item.dayaTumbuh}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100 col-span-2">
              <span className="text-gray-500 block mb-0.5">Produk Benih</span>
              <span className="font-extrabold text-sm text-gray-900">{item.produkBenih}</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Lokasi Gudang</span>
              <span className="font-bold text-gray-800">{item.gudang}</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Batch / Lot</span>
              <span className="font-bold text-emerald-800">{item.batchLot}</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Tanggal Produksi</span>
              <span className="font-bold text-gray-800">{item.tanggalProduksi}</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Tanggal Expired</span>
              <span className="font-bold text-gray-800">{item.expired}</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Stok Total (Kg)</span>
              <span className="font-bold text-gray-800">{item.stokKg ? item.stokKg.toLocaleString('id-ID') : 0} Kg</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Stok Reserved (Kg)</span>
              <span className="font-bold text-amber-700">{item.reservedKg ? item.reservedKg.toLocaleString('id-ID') : 0} Kg</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100 col-span-2">
              <span className="text-gray-500 block mb-0.5">Stok Available (Kg)</span>
              <span className="font-extrabold text-sm text-emerald-700">{available.toLocaleString('id-ID')} Kg</span>
            </div>
          </div>

          {item.keterangan && (
            <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-lg text-amber-900">
              <span className="font-semibold block mb-0.5 text-amber-950">Keterangan:</span>
              <p className="mb-0 text-gray-700 leading-relaxed">{item.keterangan}</p>
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
