"use client";

import React from 'react';
import { StokBenihBersihItem } from '@/app/types/manajemenStok';

interface ManajemenStokDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: StokBenihBersihItem | null;
  onOpenKartuStok?: (item: StokBenihBersihItem) => void;
}

export default function ManajemenStokDetailModal({
  isOpen,
  onClose,
  item,
  onOpenKartuStok,
}: ManajemenStokDetailModalProps) {
  if (!isOpen || !item) return null;

  const renderStatusQcBadge = (status: string) => {
    switch (status) {
      case 'Lolos QC':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <i className="ri-checkbox-circle-fill text-emerald-600 text-sm"></i>
            Lolos QC
          </span>
        );
      case 'Karantina':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <i className="ri-time-fill text-amber-600 text-sm"></i>
            Karantina
          </span>
        );
      case 'Ditahan':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <i className="ri-lock-fill text-rose-600 text-sm"></i>
            Ditahan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
              <i className="ri-seedling-line text-xl"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base text-gray-900">{item.noLot}</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  Kelas: {item.kelas}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                {item.varietas} • {item.komoditas} • Batch: {item.kodeBatch}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Top Status & Saldo Summary Bar */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
            <div className="flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-200 pb-2 sm:pb-0">
              <span className="text-[11px] text-gray-400 mb-1">Status QC</span>
              <div>{renderStatusQcBadge(item.statusQc)}</div>
            </div>
            <div className="border-b sm:border-b-0 sm:border-r border-slate-200 pb-2 sm:pb-0">
              <span className="text-[11px] text-gray-500 block mb-0.5">Stok Fisik</span>
              <span className="text-base font-extrabold text-gray-900">
                {item.stokFisik.toLocaleString('id-ID')} <span className="text-xs font-medium text-gray-500">kg</span>
              </span>
            </div>
            <div className="border-b sm:border-b-0 sm:border-r border-slate-200 pb-2 sm:pb-0">
              <span className="text-[11px] text-gray-500 block mb-0.5">Dialokasikan</span>
              <span className="text-base font-extrabold text-blue-600">
                {item.dialokasikan.toLocaleString('id-ID')} <span className="text-xs font-medium text-gray-500">kg</span>
              </span>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 block mb-0.5">Tersedia</span>
              <span className="text-base font-extrabold text-emerald-700">
                {item.tersedia.toLocaleString('id-ID')} <span className="text-xs font-medium text-gray-500">kg</span>
              </span>
            </div>
          </div>

          {/* Section 1: Informasi Lot & Produksi */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
              <i className="ri-file-info-line text-emerald-600 text-sm"></i>
              <h5 className="font-bold text-gray-800 text-xs">Identitas Lot & Produksi</h5>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-gray-400 block text-[10px]">Nomor Lot</span>
                <span className="font-bold text-gray-900 text-xs">{item.noLot}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Batch Produksi</span>
                <span className="font-bold text-emerald-700 text-xs">{item.kodeBatch}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Varietas Benih</span>
                <span className="font-semibold text-gray-800">{item.varietas}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Komoditas</span>
                <span className="font-semibold text-gray-800">{item.komoditas}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Kelas Benih</span>
                <span className="font-bold text-gray-800">{item.kelas}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Tanggal Masuk Gudang</span>
                <span className="font-semibold text-gray-800">{item.tglMasuk}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Referensi Hasil Pengujian QC */}
          <div className="bg-emerald-50/40 border border-emerald-200/70 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <i className="ri-shield-check-line text-emerald-700 text-sm"></i>
                <h5 className="font-bold text-emerald-900 text-xs">Hasil Pengujian Laboratorium QC</h5>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded-full">
                {item.qcReference?.noPengujian || 'TST-QC-001'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                <span className="text-gray-400 block text-[10px]">Daya Berkecambah</span>
                <span className="text-sm font-extrabold text-emerald-700">
                  {item.qcReference?.dayaBerkecambah ? `${item.qcReference.dayaBerkecambah}%` : '-'}
                </span>
                <span className="text-[9px] text-gray-400 block">Min. 80.0%</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                <span className="text-gray-400 block text-[10px]">Kadar Air</span>
                <span className="text-sm font-extrabold text-gray-900">
                  {item.qcReference?.kadarAir ? `${item.qcReference.kadarAir}%` : '-'}
                </span>
                <span className="text-[9px] text-gray-400 block">Maks. 12.0%</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                <span className="text-gray-400 block text-[10px]">Kemurnian Fisik</span>
                <span className="text-sm font-extrabold text-gray-900">
                  {item.qcReference?.kemurnianFisik ? `${item.qcReference.kemurnianFisik}%` : '-'}
                </span>
                <span className="text-[9px] text-gray-400 block">Min. 98.0%</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                <span className="text-gray-400 block text-[10px]">Petugas Penguji</span>
                <span className="text-xs font-bold text-gray-800 block truncate">
                  {item.qcReference?.petugasQc || 'Analis QC'}
                </span>
                <span className="text-[9px] text-gray-400 block">{item.qcReference?.tanggalPengujian || '-'}</span>
              </div>
            </div>

            {item.qcReference?.catatanQc && (
              <div className="p-2.5 bg-white rounded-lg border border-emerald-100">
                <span className="text-[10px] text-gray-500 font-semibold block mb-0.5">Catatan & Rekomendasi QC:</span>
                <p className="text-[11px] text-gray-700 leading-relaxed italic">
                  &ldquo;{item.qcReference.catatanQc}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Lokasi Penyimpanan di Gudang */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
              <i className="ri-map-pin-line text-emerald-600 text-sm"></i>
              <h5 className="font-bold text-gray-800 text-xs">Lokasi Penyimpanan di Gudang</h5>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-gray-400 block text-[10px]">Nama Gudang</span>
                <span className="font-semibold text-gray-800 text-xs">{item.gudang}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Lokasi Rak / Bin</span>
                <span className="font-bold text-emerald-700 text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {item.lokasi}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenKartuStok) onOpenKartuStok(item);
            }}
            className="px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <i className="ri-history-line"></i>
            Buka Kartu Stok
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

