"use client";

import React from 'react';
import { PenanggungJawab } from '@/app/types/penanggungJawab';

interface ModalDetailPersonelProps {
  isOpen: boolean;
  onClose: () => void;
  item: PenanggungJawab | null;
  onEdit: (item: PenanggungJawab) => void;
}

export default function ModalDetailPersonel({
  isOpen,
  onClose,
  item,
  onEdit,
}: ModalDetailPersonelProps) {
  if (!isOpen || !item) return null;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-bold shadow-2xs">
              <i className="ri-user-search-line"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Detail Personel & Tanggung Jawab
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {item.kodePersonel || 'PJ-XXX'} • {item.nama}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Identity Header Box */}
          <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center text-lg font-bold shadow-xs">
                {item.nama ? item.nama.charAt(0).toUpperCase() : 'P'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{item.nama}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[11px] font-bold text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                    {item.kodePersonel || '-'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.peran === 'Kepala Produksi'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}
                  >
                    {item.peran || 'Penanggung Jawab'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  item.status === 'Aktif'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.status === 'Aktif' ? 'bg-emerald-500' : 'bg-gray-400'
                  }`}
                ></span>
                {item.status}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-400 block uppercase font-semibold">
                Area / Modul
              </span>
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mt-1">
                <i className="ri-layout-grid-line text-emerald-600"></i>
                {item.areaModul || '-'}
              </span>
            </div>

            <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-400 block uppercase font-semibold">
                Lokasi Penugasan
              </span>
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mt-1">
                <i className="ri-map-pin-line text-emerald-600"></i>
                {item.lokasi || '-'}
              </span>
            </div>

            <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-400 block uppercase font-semibold">
                Nomor Handphone
              </span>
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mt-1">
                <i className="ri-phone-line text-emerald-600"></i>
                {item.noHp || '-'}
              </span>
            </div>

            <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-400 block uppercase font-semibold">
                Alamat Email
              </span>
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mt-1 break-all">
                <i className="ri-mail-line text-emerald-600"></i>
                {item.email || '-'}
              </span>
            </div>

            <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-400 block uppercase font-semibold">
                Tanggal Mulai Tugas
              </span>
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mt-1">
                <i className="ri-calendar-line text-emerald-600"></i>
                {formatDate(item.tanggalMulai)}
              </span>
            </div>

            <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-400 block uppercase font-semibold">
                Tanggal Selesai
              </span>
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mt-1">
                <i className="ri-calendar-check-line text-emerald-600"></i>
                {formatDate(item.tanggalSelesai)}
              </span>
            </div>
          </div>

          {/* Catatan */}
          <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100">
            <span className="text-[10px] text-gray-400 block uppercase font-semibold mb-1">
              Catatan & Keterangan Tambahan
            </span>
            <p className="text-xs text-gray-700 leading-relaxed italic">
              {item.catatan || 'Tidak ada catatan tambahan.'}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(item);
            }}
            className="px-4 py-2 bg-[#055127] hover:bg-[#043e1e] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
          >
            <i className="ri-edit-line"></i>
            <span>Edit Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
