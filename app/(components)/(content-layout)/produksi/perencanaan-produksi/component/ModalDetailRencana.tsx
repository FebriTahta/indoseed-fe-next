import React from 'react';
import { PerencanaanProduksi } from '@/app/types/perencanaanProduksi';

interface ModalDetailRencanaProps {
  isOpen: boolean;
  onClose: () => void;
  item: PerencanaanProduksi | null;
  onEdit: (item: PerencanaanProduksi) => void;
  onCetak: (item: PerencanaanProduksi) => void;
}

export default function ModalDetailRencana({
  isOpen,
  onClose,
  item,
  onEdit,
  onCetak
}: ModalDetailRencanaProps) {
  if (!isOpen || !item) return null;

  const percentage = Math.min(100, Math.max(0, item.produksiTerpenuhi || 0));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-800">{item.komoditas} - {item.varietas}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Nomor Perencanaan: {item.noPerencanaan}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          {/* Target & Realisasi Highlight Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/40 border border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Realisasi Target Produksi & Pemenuhan Benih
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                {percentage}% Terpenuhi
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100 shadow-xs">
                <span className="text-[10px] text-gray-500 block">Target Produksi</span>
                <span className="text-sm font-bold text-gray-800">{item.targetProduksi.toLocaleString('id-ID')} kg</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100 shadow-xs">
                <span className="text-[10px] text-gray-500 block">Aktual Terpenuhi</span>
                <span className="text-sm font-bold text-emerald-700">{(item.aktualProduksi || 0).toLocaleString('id-ID')} kg</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100 shadow-xs">
                <span className="text-[10px] text-gray-500 block">Kebutuhan Benih</span>
                <span className="text-sm font-bold text-amber-700">{(item.kebutuhanBenih || 0).toLocaleString('id-ID')} kg</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100 shadow-xs">
                <span className="text-[10px] text-gray-500 block">Luas Lahan</span>
                <span className="text-sm font-bold text-purple-700">{item.targetLuasLahan} ha</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3.5 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Grid Informasi Rinci */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/70 space-y-2.5">
              <h4 className="font-bold text-gray-800 text-xs border-b border-gray-200/70 pb-1.5 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Parameter Agronomi
              </h4>
              <div className="flex justify-between">
                <span className="text-gray-500">Komoditas:</span>
                <span className="font-semibold text-gray-800">{item.komoditas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Varietas:</span>
                <span className="font-semibold text-gray-800">{item.varietas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Metode Tanam:</span>
                <span className="font-semibold text-gray-800">{item.metodeTanam}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimasi Hasil per Ha:</span>
                <span className="font-semibold text-gray-800">{item.estimasiHasilPerHa} kg/ha</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/70 space-y-2.5">
              <h4 className="font-bold text-gray-800 text-xs border-b border-gray-200/70 pb-1.5 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Jadwal & Penanggung Jawab
              </h4>
              <div className="flex justify-between">
                <span className="text-gray-500">Periode Produksi:</span>
                <span className="font-semibold text-gray-800">{item.periode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimasi Panen:</span>
                <span className="font-semibold text-gray-800">{item.estimasiPanen || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Petani Penanggung Jawab:</span>
                <span className="font-semibold text-gray-800">{item.namaPetani || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status Lahan:</span>
                <span className="font-semibold text-emerald-700">Tersedia {item.targetLuasLahan} Ha</span>
              </div>
            </div>
          </div>

          {/* Catatan & Spesifikasi Mutu */}
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/70">
            <h4 className="font-bold text-amber-900 text-xs mb-1">Catatan & Rencana Mutu</h4>
            <p className="text-gray-700 leading-relaxed text-[11px]">
              {item.catatan || 'Fokus pada kualitas benih dan pertumbuhan optimal untuk mencapai target produksi benih bersertifikasi standar.'}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <button
            onClick={() => onCetak(item)}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Cetak Dokumen</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Edit Rencana
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
