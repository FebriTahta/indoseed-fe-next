"use client";

import React from 'react';

interface ModalInformasiPeranProps {
  isOpen: boolean;
  onClose: () => void;
}

const DAFTAR_PERAN = [
  {
    nama: 'Kepala Produksi',
    deskripsi: 'Bertanggung jawab atas seluruh kegiatan produksi.',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'ri-vip-crown-line text-emerald-600',
  },
  {
    nama: 'Penanggung Jawab',
    deskripsi: 'Bertanggung jawab pada area/modul tertentu di lokasi.',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: 'ri-team-line text-indigo-600',
  },
  {
    nama: 'Koordinator Lapangan',
    deskripsi: 'Mengkoordinasikan jadwal tanam, petani mitra, dan kegiatan di petak lahan.',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: 'ri-map-pin-user-line text-blue-600',
  },
  {
    nama: 'Staff QC',
    deskripsi: 'Melakukan inspeksi mutu lapangan, roguing, dan verifikasi sertifikasi benih.',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: 'ri-shield-check-line text-teal-600',
  },
];

const DAFTAR_AREA_MODUL = [
  {
    nama: 'Produksi',
    deskripsi: 'Kegiatan produksi benih.',
    icon: 'ri-seedling-line text-emerald-600 bg-emerald-50',
  },
  {
    nama: 'QC & Laboratorium',
    deskripsi: 'Pengujian dan kontrol kualitas.',
    icon: 'ri-flask-line text-cyan-600 bg-cyan-50',
  },
  {
    nama: 'Gudang',
    deskripsi: 'Penyimpanan benih dan bahan.',
    icon: 'ri-store-2-line text-amber-600 bg-amber-50',
  },
  {
    nama: 'Pengeringan',
    deskripsi: 'Proses pengeringan benih.',
    icon: 'ri-sun-line text-orange-600 bg-orange-50',
  },
  {
    nama: 'Inventory',
    deskripsi: 'Pengelolaan stok dan persediaan.',
    icon: 'ri-box-3-line text-purple-600 bg-purple-50',
  },
  {
    nama: 'Lainnya',
    deskripsi: 'Area lain sesuai kebutuhan.',
    icon: 'ri-apps-line text-gray-600 bg-gray-100',
  },
];

export default function ModalInformasiPeran({ isOpen, onClose }: ModalInformasiPeranProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white text-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-bold shadow-2xs">
              <i className="ri-information-line"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Informasi Peran & Area / Modul
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Panduan struktur peran dan cakupan tanggung jawab divisi kerja.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
            title="Tutup Modal"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Section: Daftar Peran */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-800 font-bold text-xs uppercase tracking-wider">
              <i className="ri-user-star-line text-[#055127] text-sm"></i>
              <span>Daftar Peran</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DAFTAR_PERAN.map((item) => (
                <div
                  key={item.nama}
                  className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xs transition-all flex flex-col gap-1.5"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white shadow-2xs flex items-center justify-center text-base">
                      <i className={item.icon}></i>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${item.badgeBg}`}
                    >
                      {item.nama}
                    </span>
                  </div>
                  <p className="text-gray-600 text-[11px] leading-relaxed pl-1">
                    {item.deskripsi}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Daftar Area / Modul */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-800 font-bold text-xs uppercase tracking-wider">
              <i className="ri-layout-grid-line text-[#055127] text-sm"></i>
              <span>Daftar Area / Modul</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DAFTAR_AREA_MODUL.map((item) => (
                <div
                  key={item.nama}
                  className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xs transition-all flex items-start gap-3"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 ${item.icon}`}
                  >
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800 text-xs">{item.nama}</h5>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                      {item.deskripsi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note Callout */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-base">
              <i className="ri-lightbulb-line"></i>
            </div>
            <p className="text-[11px] text-emerald-900 leading-relaxed font-medium pt-0.5">
              Satu orang dapat memiliki lebih dari satu tanggung jawab pada area/modul yang berbeda sesuai kebutuhan perusahaan.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#055127] hover:bg-[#043e1e] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
