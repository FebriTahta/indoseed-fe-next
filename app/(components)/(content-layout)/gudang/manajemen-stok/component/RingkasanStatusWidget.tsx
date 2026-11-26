"use client";

import React from 'react';
import Link from 'next/link';
import { RingkasanStatusData } from '@/app/types/manajemenStok';

interface RingkasanStatusWidgetProps {
  data?: RingkasanStatusData;
}

export default function RingkasanStatusWidget({ data }: RingkasanStatusWidgetProps) {
  const belumDiproses = data?.belumDiproses || 8450;
  const karantina = data?.karantina || 1230;
  const lolosQc = data?.lolosQc || 10000;

  return (
    <div className="bg-white border border-gray-200/80 shadow-xs rounded-xl p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-bold text-sm text-gray-800">Ringkasan Status Benih</h3>
        <p className="text-[11px] text-gray-500 mt-0.5">
          Terhubung dengan alur produksi dan QC, namun terpisah dari stok packing, bahan treatment, dan barang umum.
        </p>
      </div>

      {/* 3 Mini Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Card 1: Belum Diproses */}
        <div className="p-3.5 rounded-xl border border-amber-200/70 bg-amber-50/40 flex flex-col justify-between transition-all hover:shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <i className="ri-time-line text-base"></i>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-gray-600 block">Belum Diproses</span>
              <span className="text-base font-extrabold text-gray-900">
                {belumDiproses.toLocaleString('id-ID')} kg
              </span>
            </div>
          </div>
          <Link
            href="/produksi/batchproduksi"
            className="text-[11px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-1 group"
          >
            Lihat Status Produksi
            <i className="ri-arrow-right-line transition-transform group-hover:translate-x-0.5 text-xs"></i>
          </Link>
        </div>

        {/* Card 2: Karantina */}
        <div className="p-3.5 rounded-xl border border-yellow-200/70 bg-amber-50/30 flex flex-col justify-between transition-all hover:shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <i className="ri-shield-line text-base"></i>
            </div>
            <div>
              <span className="text-[11px] font-medium text-gray-500 block">Karantina</span>
              <span className="text-base font-extrabold text-gray-900">
                {karantina.toLocaleString('id-ID')} kg
              </span>
            </div>
          </div>
          <Link
            href="/qc/pemeriksaan-pengujian"
            className="text-[11px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-1 group"
          >
            Lihat Detail Karantina
            <i className="ri-arrow-right-line transition-transform group-hover:translate-x-0.5 text-xs"></i>
          </Link>
        </div>

        {/* Card 3: Lolos QC */}
        <div className="p-3.5 rounded-xl border border-emerald-200/70 bg-emerald-50/30 flex flex-col justify-between transition-all hover:shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <i className="ri-checkbox-circle-line text-base"></i>
            </div>
            <div>
              <span className="text-[11px] font-medium text-gray-500 block">Lolos QC</span>
              <span className="text-base font-extrabold text-gray-900">
                {lolosQc.toLocaleString('id-ID')} kg
              </span>
            </div>
          </div>
          <Link
            href="/qc/hasil-pengujian"
            className="text-[11px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-1 group"
          >
            Lihat Hasil QC
            <i className="ri-arrow-right-line transition-transform group-hover:translate-x-0.5 text-xs"></i>
          </Link>
        </div>
      </div>

      {/* Info Box Footer */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
        <i className="ri-information-line text-blue-600 text-base flex-shrink-0 mt-0.5"></i>
        <p className="text-[11px] text-gray-600 leading-relaxed">
          Stok berubah melalui transaksi <span className="font-semibold text-gray-700">Barang Masuk</span>,{' '}
          <span className="font-semibold text-gray-700">Barang Keluar</span>,{' '}
          <span className="font-semibold text-gray-700">Transfer Stok</span>, dan{' '}
          <span className="font-semibold text-gray-700">Stock Opname</span>. Perubahan saldo manual dibatasi untuk menjaga audit trail ISO.
        </p>
      </div>
    </div>
  );
}

