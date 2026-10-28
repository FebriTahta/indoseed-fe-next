"use client";

import React, { useState } from 'react';
import { SortasiBatchItem } from '@/app/types/sortasi';

interface ModalLihatDokumentasiProps {
  isOpen: boolean;
  onClose: () => void;
  item: SortasiBatchItem | null;
}

export default function ModalLihatDokumentasi({
  isOpen,
  onClose,
  item,
}: ModalLihatDokumentasiProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!isOpen || !item) return null;

  const photos =
    item.dokumentasi && item.dokumentasi.length > 0
      ? item.dokumentasi
      : [
          'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=500&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&auto=format&fit=crop&q=60',
        ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div>
            <h4 className="font-bold text-sm text-gray-800">
              Dokumentasi Sortasi — {item.kodeBatch}
            </h4>
            <span className="text-xs text-gray-500">
              {item.komoditas} ({item.varietas}) | Operator: {item.operator || 'Siti Nurhayati'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Main Photo Display */}
        <div className="p-4 flex-1 flex flex-col items-center justify-center bg-black/5 overflow-hidden">
          <div className="relative w-full h-80 rounded-xl overflow-hidden bg-black/20 flex items-center justify-center">
            <img
              src={photos[selectedPhotoIndex]}
              alt={`Dokumentasi ${selectedPhotoIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto p-1">
            {photos.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                  selectedPhotoIndex === idx
                    ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={p} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
