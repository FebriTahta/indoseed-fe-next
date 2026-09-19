"use client";

import React, { useState } from 'react';
import { PanenItem } from '@/app/types/panen';

interface ModalLihatFotoProps {
  isOpen: boolean;
  onClose: () => void;
  item: PanenItem | null;
}

export default function ModalLihatFoto({
  isOpen,
  onClose,
  item,
}: ModalLihatFotoProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  if (!isOpen || !item) return null;

  const photos = Array.isArray(item.dokumentasi) && item.dokumentasi.length > 0
    ? item.dokumentasi
    : [
        { url: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=500&auto=format&fit=crop&q=60', caption: 'Lahan Panen', date: '28 Sep 2026', size: '1.4 MB' },
        { url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop&q=60', caption: 'Kualitas Buah', date: '28 Sep 2026', size: '2.1 MB' },
        { url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=60', caption: 'Pemetikan Buah', date: '28 Sep 2026', size: '1.8 MB' },
        { url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&auto=format&fit=crop&q=60', caption: 'Penimbangan', date: '28 Sep 2026', size: '1.9 MB' },
      ];

  const currentPhoto = photos[activeIdx] || photos[0];
  const currentUrl = typeof currentPhoto === 'string' ? currentPhoto : currentPhoto.url;
  const currentCaption = typeof currentPhoto === 'object' ? currentPhoto.caption : `Foto #${activeIdx + 1}`;
  const currentDate = typeof currentPhoto === 'object' ? currentPhoto.date : '28 Sep 2026';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-gray-950 rounded-2xl border border-gray-800 w-full max-w-3xl overflow-hidden flex flex-col text-white">
        {/* Top bar */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <i className="ri-image-line text-emerald-400"></i>
              Dokumentasi Panen - {item.kodePanen}
            </h4>
            <span className="text-[11px] text-gray-400">
              {item.komoditas} ({item.varietas}) • {item.petani}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Main Preview */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUrl}
            alt={currentCaption}
            className="max-w-full max-h-full object-contain"
          />

          {/* Navigation buttons */}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setActiveIdx((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
                className="absolute left-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
              >
                <i className="ri-arrow-left-s-line text-lg"></i>
              </button>

              <button
                type="button"
                onClick={() => setActiveIdx((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
                className="absolute right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
              >
                <i className="ri-arrow-right-s-line text-lg"></i>
              </button>
            </>
          )}

          <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 text-white text-[11px] font-semibold">
            {activeIdx + 1} / {photos.length}
          </div>
        </div>

        {/* Bottom thumbnail reel and caption */}
        <div className="p-4 bg-gray-900 border-t border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-white block">{currentCaption}</span>
            <span className="text-[10px] text-gray-400">{currentDate}</span>
          </div>

          <div className="flex items-center gap-2">
            {photos.map((p: any, idx: number) => {
              const u = typeof p === 'string' ? p : p.url;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-10 h-10 rounded-lg overflow-hidden border cursor-pointer transition-all ${
                    activeIdx === idx ? 'border-emerald-500 ring-2 ring-emerald-500/50' : 'border-gray-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
