"use client";

import React from 'react';
import { GudangBahanItem } from '@/app/types/gudangBahanBelumDiproses';

interface ModalLihatFotoProps {
  isOpen: boolean;
  onClose: () => void;
  item: GudangBahanItem | null;
}

export default function ModalLihatFoto({
  isOpen,
  onClose,
  item,
}: ModalLihatFotoProps) {
  if (!isOpen || !item) return null;

  const photoUrl =
    item.foto ||
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=90';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Dokumentasi Penyimpanan: {item.noLot}
            </h3>
            <p className="text-xs text-gray-500">
              {item.komoditas} / {item.varietas} • {item.lokasiDetail || `Gudang Produksi / ${item.lokasi}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Big Image */}
        <div className="relative bg-slate-950 flex items-center justify-center max-h-[60vh] overflow-hidden">
          <img
            src={photoUrl}
            alt={item.noLot}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50 text-xs">
          <div className="text-gray-600">
            Sumber Panen: <strong className="text-gray-800">{item.sumberPanen}</strong> | Berat: <strong className="text-gray-800">{item.beratMasuk} kg</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
