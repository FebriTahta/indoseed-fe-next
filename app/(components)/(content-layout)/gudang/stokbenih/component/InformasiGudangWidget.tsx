"use client";

import React from 'react';

export default function InformasiGudangWidget() {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
        <h3 className="text-xs font-bold text-gray-800">Informasi</h3>
      </div>

      <div className="space-y-2.5 text-xs text-gray-600">
        <div className="flex items-start gap-2">
          <i className="ri-information-fill text-blue-500 text-sm mt-0.5 flex-shrink-0"></i>
          <span>Stok tersedia sudah memperhitungkan reserved (Sales Order).</span>
        </div>

        <div className="flex items-start gap-2">
          <i className="ri-checkbox-circle-fill text-emerald-500 text-sm mt-0.5 flex-shrink-0"></i>
          <span>Gunakan metode FEFO untuk pengambilan stok.</span>
        </div>

        <div className="flex items-start gap-2">
          <i className="ri-error-warning-fill text-amber-500 text-sm mt-0.5 flex-shrink-0"></i>
          <span>Pastikan kondisi penyimpanan sesuai standar ISO.</span>
        </div>
      </div>
    </div>
  );
}
