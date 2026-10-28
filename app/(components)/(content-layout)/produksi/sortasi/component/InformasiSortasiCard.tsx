"use client";

import React from 'react';

export default function InformasiSortasiCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
          <i className="ri-information-line"></i>
        </div>
        <h4 className="text-xs font-bold text-gray-800 tracking-tight">Informasi</h4>
      </div>

      {/* Main ISO content */}
      <div className="flex items-start gap-3 bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-100 my-auto">
        <div className="w-9 h-9 rounded-full bg-emerald-100/90 text-emerald-700 flex items-center justify-center text-lg shrink-0 border border-emerald-200">
          <i className="ri-shield-check-line"></i>
        </div>
        <div>
          <h5 className="text-xs font-bold text-emerald-900 leading-snug">
            Sesuai standar ISO 9001:2015
          </h5>
          <p className="text-[11px] text-emerald-800/80 leading-relaxed mt-1">
            Proses sortasi dilakukan sesuai dengan SOP yang telah ditetapkan dan diawasi oleh Quality Control.
          </p>
        </div>
      </div>

      {/* Link */}
      <div className="pt-3 border-t border-gray-100">
        <a
          href="#sop-sortasi"
          onClick={(e) => {
            e.preventDefault();
            alert('SOP Sortasi ISO 9001:2015: Klausul 8.5.1 - Pengendalian Proses Sortasi & Pemisahan Mutu Benih.');
          }}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 group transition-colors"
        >
          <span>Lihat SOP Sortasi</span>
          <i className="ri-arrow-right-s-line group-hover:translate-x-0.5 transition-transform"></i>
        </a>
      </div>
    </div>
  );
}
