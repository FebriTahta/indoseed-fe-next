"use client";

import React, { useState } from 'react';
import { TreatmentBatchItem } from '@/app/types/treatment';

interface ModalLihatDokumentasiTreatmentProps {
  isOpen: boolean;
  onClose: () => void;
  item: TreatmentBatchItem | null;
}

export default function ModalLihatDokumentasiTreatment({
  isOpen,
  onClose,
  item,
}: ModalLihatDokumentasiTreatmentProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  if (!isOpen || !item) return null;

  const photos =
    item.fotoDokumentasi && item.fotoDokumentasi.length > 0
      ? item.fotoDokumentasi
      : [
          'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=800&auto=format&fit=crop&q=70',
          'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=70',
          'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=70',
          'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&auto=format&fit=crop&q=70',
        ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[92vh] overflow-hidden border border-gray-100 flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Dokumentasi Foto Treatment - {item.kodeBatch}
            </h3>
            <p className="text-[11px] text-gray-500">
              {item.komoditas} ({item.varietas}) | {item.metodeTreatment || item.treatment} | Petani: {item.petani || '-'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Main Large Image */}
          <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden bg-black/5 border border-gray-200 relative group">
            <img
              src={photos[selectedPhotoIndex] || photos[0]}
              alt={`Foto besar ${selectedPhotoIndex + 1}`}
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-md backdrop-blur-xs">
              Foto {selectedPhotoIndex + 1} dari {photos.length}
            </div>
          </div>

          {/* Thumbnails Row */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
            {photos.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedPhotoIndex === idx
                    ? 'border-emerald-600 ring-2 ring-emerald-200 scale-102'
                    : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={p}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-end bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
