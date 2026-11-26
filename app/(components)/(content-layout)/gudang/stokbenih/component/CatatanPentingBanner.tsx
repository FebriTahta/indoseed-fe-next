"use client";

import React from 'react';

export default function CatatanPentingBanner() {
  return (
    <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
          <i className="ri-seedling-line text-xl"></i>
        </div>
        <div>
          <h4 className="font-bold text-xs text-emerald-950 mb-0.5">Catatan Penting</h4>
          <p className="text-xs text-emerald-800 mb-0">
            Pastikan setiap batch benih telah melalui proses QC dan memiliki sertifikat benih yang valid.
          </p>
        </div>
      </div>

      <button
        type="button"
        className="px-3.5 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-800 rounded-md font-semibold text-xs transition-colors shadow-2xs"
      >
        Lihat Sertifikat Benih
      </button>
    </div>
  );
}
