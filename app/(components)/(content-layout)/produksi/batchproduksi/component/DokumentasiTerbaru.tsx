"use client";

import React from 'react';
import { DokumenTerbaruItem } from '@/app/types/batchProduksi';

interface DokumentasiTerbaruProps {
  items: DokumenTerbaruItem[];
}

export default function DokumentasiTerbaru({ items }: DokumentasiTerbaruProps) {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
        <h3 className="text-sm font-bold text-gray-800">Dokumentasi Terbaru</h3>
        <button type="button" className="text-xs font-semibold text-emerald-700 hover:underline">
          Lihat Semua
        </button>
      </div>

      {/* Horizontal Cards */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {items.map((doc) => (
          <div
            key={doc.id}
            className="flex-shrink-0 w-28 p-2 rounded-lg border border-gray-200 bg-slate-50/70 hover:bg-white hover:shadow-xs transition-all text-center flex flex-col items-center justify-between"
          >
            {/* PDF Thumbnail */}
            <div className="w-12 h-14 bg-white border border-gray-300 rounded shadow-xs flex flex-col justify-between p-1 relative mb-1.5">
              <div className="space-y-1">
                <div className="h-1 bg-gray-200 rounded w-full"></div>
                <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                <div className="h-1 bg-gray-200 rounded w-1/2"></div>
              </div>
              <span className="bg-rose-600 text-white text-[8px] font-bold px-1 py-0.2 rounded self-end">
                PDF
              </span>
            </div>

            {/* Doc Title & Timestamp */}
            <span className="text-[10px] font-bold text-gray-800 line-clamp-2 leading-tight mb-1">
              {doc.judul}
            </span>
            <span className="text-[9px] text-gray-400 font-medium block">
              {doc.waktu}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
