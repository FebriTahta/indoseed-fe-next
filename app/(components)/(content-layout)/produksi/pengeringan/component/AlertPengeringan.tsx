"use client";

import React from 'react';
import { AlertPengeringanItem } from '@/app/types/pengeringan';

interface AlertPengeringanProps {
  alertList: AlertPengeringanItem[];
}

export default function AlertPengeringan({ alertList }: AlertPengeringanProps) {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
        <h3 className="text-sm font-bold text-gray-800">Alert & Peringatan</h3>
        <button type="button" className="text-xs font-semibold text-emerald-700 hover:underline">
          Lihat Semua
        </button>
      </div>

      <div className="space-y-3">
        {alertList.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-lg border flex items-start justify-between gap-3 text-xs ${
              item.tipe === 'danger'
                ? 'bg-rose-50/50 border-rose-200 text-rose-900'
                : 'bg-amber-50/50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5 ${
                  item.tipe === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                }`}
              >
                <i className={item.tipe === 'danger' ? 'ri-error-warning-line' : 'ri-alert-line'}></i>
              </div>
              <div>
                <span className="font-extrabold text-xs block mb-0.5">{item.judul}</span>
                <span className="font-bold text-[11px] block text-gray-900">{item.kodeBatchOrAlat}</span>
                <p className="text-[11px] text-gray-600 mb-0 mt-0.5">{item.deskripsi}</p>
              </div>
            </div>
            <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap flex-shrink-0">
              {item.waktu}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
