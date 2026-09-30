import React from 'react';
import Link from 'next/navigation';
import { KontrakPanen } from '@/app/types/kontrakPanen';

interface ModalDetailKontrakProps {
  isOpen: boolean;
  item: KontrakPanen | null;
  onClose: () => void;
  onEdit: (item: KontrakPanen) => void;
}

export default function ModalDetailKontrak({
  isOpen,
  item,
  onClose,
  onEdit,
}: ModalDetailKontrakProps) {
  if (!isOpen || !item) return null;

  const formatDate = (isoStr?: string | null) => {
    if (!isoStr) return '-';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return isoStr;
    }
  };

  const renderStatusBadge = (st: string) => {
    switch (st) {
      case 'Aktif':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Aktif
          </span>
        );
      case 'Tidak Aktif':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Tidak Aktif
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            {st || 'Draft'}
          </span>
        );
    }
  };

  const minAge = Math.max(10, item.umurPanen - 5);
  const maxAge = item.umurPanen + 10;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-0">Detail Kontrak Panen</h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(item);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#078836] hover:bg-emerald-700 transition-colors shadow-2xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5">
            {/* Grid 1: No Kontrak & Periode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-[11px] font-medium text-gray-400 block mb-1">No. Kontrak</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-base font-extrabold text-gray-900 font-mono tracking-tight">
                    {item.noKontrak}
                  </span>
                  {renderStatusBadge(item.status)}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-medium text-gray-400 block mb-1">Periode Berlaku</span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {formatDate(item.periodeMulai)} - {formatDate(item.periodeSelesai)}
                  </span>
                </div>
              </div>
            </div>

            {/* Grid 2: Komoditas & Tipe Panenan & Nilai Kontrak */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-gray-100">
              {/* Komoditas */}
              <div>
                <span className="text-[11px] font-medium text-gray-400 block mb-1">Komoditas</span>
                <span className="text-xs font-bold text-gray-800">{item.komoditas}</span>
              </div>

              {/* Varietas */}
              <div>
                <span className="text-[11px] font-medium text-gray-400 block mb-1">Varietas</span>
                <span className="text-xs font-semibold text-gray-800">{item.varietas}</span>
              </div>

              {/* Tipe Panenan */}
              <div>
                <span className="text-[11px] font-medium text-gray-400 block mb-1">Tipe Panenan</span>
                {item.tipePanenan === 'Glondong / Fresh' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Glondong / Fresh
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                    OC / Benih
                  </span>
                )}
              </div>

              {/* Nilai Kontrak */}
              <div>
                <span className="text-[11px] font-medium text-gray-400 block mb-1">Nilai Kontrak</span>
                <div className="text-xs font-extrabold text-emerald-700">
                  Rp {item.nilaiKontrak.toLocaleString('id-ID')}
                  <span className="text-[10px] font-normal text-gray-500"> / {item.satuan}</span>
                </div>
              </div>
            </div>

            {/* Grid 3: Satuan, Umur Panen, Keterangan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-[11px] font-medium text-gray-400 block mb-1">Satuan</span>
                <span className="text-xs font-semibold text-gray-800">{item.satuan}</span>
              </div>

              <div>
                <span className="text-[11px] font-medium text-gray-400 block mb-1">Umur Panen</span>
                <span className="text-xs font-bold text-gray-900 bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200/60">
                  {item.umurPanen} HST
                </span>
              </div>

              <div className="md:col-span-3">
                <span className="text-[11px] font-medium text-gray-400 block mb-1">Keterangan</span>
                <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                  {item.keterangan || 'Tidak ada keterangan tambahan.'}
                </p>
              </div>
            </div>

            {/* Alert & Info Box */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex items-start gap-3">
              <div className="text-emerald-600 shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-xs text-emerald-900">
                <span className="font-bold">Standar Umur Panen Varietas (Informasi):</span>
                <div className="mt-0.5 font-medium">
                  {item.varietas} : <span className="font-bold">{minAge} - {maxAge} HST</span>
                </div>
              </div>
            </div>

            {/* Referensi box */}
            <div className="bg-slate-50 border border-gray-200/70 rounded-xl p-3 flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="font-semibold text-gray-700">Referensi:</span>
                <span className="text-emerald-700 hover:underline cursor-pointer">Standar Produksi</span>
                <span>|</span>
                <span className="text-emerald-700 hover:underline cursor-pointer">Parameter Produksi</span>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-end px-6 py-3.5 border-t border-gray-100 bg-gray-50/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Tutup
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
