"use client";

import React from 'react';
import { ReferensiJadwalTanamItem } from '@/app/types/pemeriksaanLahan';

interface ModalTambahPemeriksaanProps {
  isOpen: boolean;
  onClose: () => void;
  eligibleJadwals: ReferensiJadwalTanamItem[];
  loadingEligible: boolean;
}

export default function ModalTambahPemeriksaan({
  isOpen,
  onClose,
  eligibleJadwals,
  loadingEligible,
}: ModalTambahPemeriksaanProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-gray-100 transform transition-all animate-scaleUp">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#055127] text-white flex items-center justify-center text-sm shadow-xs">
              <i className="ri-add-line"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Tambah Pemeriksaan Lapangan</h3>
              <p className="text-[11px] text-gray-500">Form input pemeriksaan kemurnian varietas lahan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Modal Body - Placeholder as requested */}
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center text-3xl mx-auto mb-4 shadow-xs">
            <i className="ri-file-list-3-line"></i>
          </div>

          <h4 className="text-base font-bold text-gray-900 mb-1">
            Form Siap Menerima Referensi
          </h4>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed mb-6">
            Area form modal ini dikosongkan sementara sesuai arahan Anda. Begitu Anda memberikan referensi tampilan UI inputnya, komponen form akan segera diisikan secara lengkap.
          </p>

          {/* Info Card: Eligible Jadwal Tanam Found */}
          <div className="bg-gray-50/90 rounded-xl p-4 border border-gray-200/70 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <i className="ri-database-2-line text-emerald-600"></i>
                Data Jadwal Tanam Eligible
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {loadingEligible ? 'Memuat...' : `${eligibleJadwals.length} Jadwal Siap`}
              </span>
            </div>

            <p className="text-[11px] text-gray-500 mb-2">
              Sistem telah otomatis memfilter Jadwal Tanam yang:
            </p>
            <ul className="text-[11px] text-gray-600 space-y-1 pl-4 list-disc">
              <li>Status Jadwal = <strong className="text-emerald-700">Disetujui</strong></li>
              <li>Status Persetujuan Produksi = <strong className="text-emerald-700">Disetujui</strong></li>
              <li>Belum dipanen / belum dibuatkan referensi panennya</li>
            </ul>

            {eligibleJadwals.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200/70 flex flex-wrap gap-1.5">
                {eligibleJadwals.slice(0, 4).map((j) => (
                  <span
                    key={j.id}
                    className="text-[10px] px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700 font-mono"
                  >
                    {j.kodeJadwalTanam} ({j.komoditas})
                  </span>
                ))}
                {eligibleJadwals.length > 4 && (
                  <span className="text-[10px] text-gray-400 self-center">
                    +{eligibleJadwals.length - 4} lainnya
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
