"use client";

import React from 'react';
import { TreatmentBatchItem } from '@/app/types/treatment';

interface DetailTreatmentPanelProps {
  item: TreatmentBatchItem | null;
  onOpenDocModal?: () => void;
  onPrint?: () => void;
}

export default function DetailTreatmentPanel({
  item,
  onOpenDocModal,
}: DetailTreatmentPanelProps) {
  if (!item) {
    return (
      <div className="bg-white rounded-xl border border-gray-200/90 p-8 shadow-2xs text-center text-gray-400 text-xs">
        <i className="ri-information-line text-2xl text-gray-300 block mb-2"></i>
        Pilih salah satu batch treatment di tabel untuk melihat detail proses.
      </div>
    );
  }

  // Default photos
  const photos =
    item.fotoDokumentasi && item.fotoDokumentasi.length > 0
      ? item.fotoDokumentasi
      : [
          'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=500&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&auto=format&fit=crop&q=60',
        ];

  // Default Tahapan Proses
  const isSelesai = item.status === 'Selesai';
  const isDalamProses = item.status === 'Dalam Proses' || item.status === 'Proses';
  const tanggalShort = (item.tanggalProses || '02 Jun 2026').substring(0, 6);

  const tahapan = item.tahapanProses || [
    { nama: 'Persiapan', tanggal: tanggalShort, status: 'completed' },
    { nama: 'Perendaman', tanggal: tanggalShort, status: item.status === 'Menunggu' ? 'pending' : 'completed' },
    { nama: 'Pengeringan', tanggal: tanggalShort, status: isSelesai ? 'completed' : isDalamProses ? 'in_progress' : 'pending' },
    { nama: 'Selesai', tanggal: tanggalShort, status: isSelesai ? 'completed' : 'pending' },
  ];

  // Default Riwayat
  const riwayat = item.riwayatTreatment || [
    { tanggal: `${item.tanggalProses || '02 Jun 2026'} 14:35`, aktivitas: 'Proses selesai', operator: item.operator || 'Admin Produksi' },
    { tanggal: `${item.tanggalProses || '02 Jun 2026'} 10:20`, aktivitas: 'Pengeringan', operator: item.operator || 'Admin Produksi' },
    { tanggal: `${item.tanggalProses || '02 Jun 2026'} 08:10`, aktivitas: 'Perendaman', operator: item.operator || 'Admin Produksi' },
    { tanggal: `${item.tanggalProses || '02 Jun 2026'} 07:45`, aktivitas: 'Persiapan', operator: item.operator || 'Admin Produksi' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-4 space-y-4 text-xs">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <i className="ri-file-list-3-line text-emerald-600 text-sm"></i>
          <h3 className="text-xs font-bold text-gray-800">Detail Treatment</h3>
        </div>

        {/* Status Badge */}
        {isSelesai ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <i className="ri-check-line text-[10px]"></i> Selesai
          </span>
        ) : isDalamProses ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <i className="ri-loader-4-line animate-spin text-[10px]"></i> Dalam Proses
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <i className="ri-time-line text-[10px]"></i> Menunggu
          </span>
        )}
      </div>

      {/* Code & Top Info with Photo */}
      <div>
        <h2 className="text-base font-extrabold text-gray-900 tracking-tight mb-3">
          {item.kodeBatch}
        </h2>

        <div className="grid grid-cols-12 gap-3 items-start">
          {/* Attributes List */}
          <div className="col-span-7 space-y-2 text-[11px]">
            {/* Komoditas / Varietas */}
            <div className="flex items-start gap-2">
              <i className="ri-seedling-line text-emerald-600 mt-0.5 text-xs shrink-0"></i>
              <div>
                <span className="text-gray-400 block text-[10px]">Komoditas / Varietas</span>
                <span className="font-semibold text-gray-800">
                  {item.komoditas} / {item.varietas}
                </span>
              </div>
            </div>

            {/* Petani Mitra */}
            <div className="flex items-start gap-2">
              <i className="ri-user-line text-blue-600 mt-0.5 text-xs shrink-0"></i>
              <div>
                <span className="text-gray-400 block text-[10px]">Petani Mitra</span>
                <span className="font-semibold text-gray-800">
                  {item.petani || 'Budi Santoso'} ({item.petaniKode || 'BTN-001'})
                </span>
              </div>
            </div>

            {/* Lahan / Blok */}
            <div className="flex items-start gap-2">
              <i className="ri-home-4-line text-amber-600 mt-0.5 text-xs shrink-0"></i>
              <div>
                <span className="text-gray-400 block text-[10px]">Lahan / Blok</span>
                <span className="font-semibold text-gray-800">
                  {item.lahan || 'LHN-001 / Blok 01'}
                </span>
              </div>
            </div>

            {/* Tanggal Proses */}
            <div className="flex items-start gap-2">
              <i className="ri-calendar-line text-purple-600 mt-0.5 text-xs shrink-0"></i>
              <div>
                <span className="text-gray-400 block text-[10px]">Tanggal Proses</span>
                <span className="font-semibold text-gray-800">
                  {item.tanggalProses || item.tanggalSelesai || '02 Jun 2026'}
                </span>
              </div>
            </div>

            {/* Metode Treatment */}
            <div className="flex items-start gap-2">
              <i className="ri-flask-line text-emerald-600 mt-0.5 text-xs shrink-0"></i>
              <div>
                <span className="text-gray-400 block text-[10px]">Metode Treatment</span>
                <span className="font-semibold text-gray-800">
                  {item.metodeTreatment || item.treatment?.split(' ')[0] || 'Fungisida'}
                </span>
              </div>
            </div>

            {/* Bahan */}
            <div className="flex items-start gap-2">
              <i className="ri-test-tube-line text-teal-600 mt-0.5 text-xs shrink-0"></i>
              <div>
                <span className="text-gray-400 block text-[10px]">Bahan</span>
                <span className="font-semibold text-gray-800">
                  {item.bahan || 'Carbendazim'}
                </span>
              </div>
            </div>

            {/* Jumlah Benih */}
            <div className="flex items-start gap-2">
              <i className="ri-scales-3-line text-indigo-600 mt-0.5 text-xs shrink-0"></i>
              <div>
                <span className="text-gray-400 block text-[10px]">Jumlah Benih</span>
                <span className="font-bold text-gray-900">
                  {item.jumlahBenih ?? item.beratAwal ?? 200} kg
                </span>
              </div>
            </div>
          </div>

          {/* Right Thumbnail Photo */}
          <div className="col-span-5 flex flex-col items-center">
            <div className="w-full aspect-4/3 rounded-lg overflow-hidden border border-gray-200/90 shadow-2xs group relative cursor-pointer" onClick={onOpenDocModal}>
              <img
                src={photos[0]}
                alt="Proses treatment benih"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity">
                <i className="ri-zoom-in-line text-base"></i>
              </div>
            </div>
            <span className="text-[10px] text-gray-400 mt-1.5 text-center">
              Proses treatment benih
            </span>
          </div>
        </div>
      </div>

      {/* Tahapan Proses Stepper */}
      <div className="pt-2 border-t border-gray-100">
        <h4 className="text-[11px] font-bold text-gray-800 mb-3 flex items-center gap-1.5">
          <i className="ri-node-tree text-emerald-600"></i>
          <span>Tahapan Proses</span>
        </h4>

        <div className="relative flex items-center justify-between px-1">
          {/* Connecting line */}
          <div className="absolute left-4 right-4 top-3 h-0.5 bg-emerald-500 z-0"></div>

          {tahapan.map((step, idx) => {
            const isStepDone = step.status === 'completed';
            const isStepInProgress = step.status === 'in_progress';

            return (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-2xs ${
                    isStepDone
                      ? 'bg-emerald-600'
                      : isStepInProgress
                      ? 'bg-blue-600 ring-2 ring-blue-200 animate-pulse'
                      : 'bg-gray-300'
                  }`}
                >
                  {isStepDone ? (
                    <i className="ri-check-line"></i>
                  ) : isStepInProgress ? (
                    <i className="ri-loader-4-line text-[10px]"></i>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span className="text-[10px] font-semibold text-gray-800 mt-1 block">
                  {step.nama}
                </span>
                <span className="text-[9px] text-gray-400 block">{step.tanggal || tanggalShort}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Foto Dokumentasi */}
      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
            <i className="ri-camera-3-line text-emerald-600"></i>
            <span>Foto Dokumentasi</span>
          </h4>
          <button
            type="button"
            onClick={onOpenDocModal}
            className="text-[10px] text-emerald-600 font-semibold hover:text-emerald-700 hover:underline cursor-pointer"
          >
            Lihat Semua
          </button>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {photos.slice(0, 4).map((img, i) => (
            <div
              key={i}
              onClick={onOpenDocModal}
              className="aspect-square rounded-md overflow-hidden border border-gray-200 hover:border-emerald-400 cursor-pointer group relative"
            >
              <img
                src={img}
                alt={`Dokumentasi ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Catatan Box */}
      <div className="pt-2 border-t border-gray-100">
        <h4 className="text-[11px] font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
          <i className="ri-chat-1-line text-emerald-600"></i>
          <span>Catatan</span>
        </h4>
        <div className="bg-gray-50/90 rounded-lg p-2.5 border border-gray-200/80 space-y-2">
          <p className="text-[11px] text-gray-700 italic leading-relaxed">
            &ldquo;{item.catatan || 'Benih terlihat sehat dan tidak ada kontaminasi. Siap untuk proses pengemasan.'}&rdquo;
          </p>
          <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-gray-200/60">
            <span className="flex items-center gap-1">
              <i className="ri-user-star-line text-emerald-600"></i>
              <span>Dibuat Oleh: {item.dibuatOleh || 'Admin Produksi'}</span>
            </span>
            <span>{item.tanggalProses || '02 Jun 2026'} 14:35</span>
          </div>
        </div>
      </div>

      {/* Riwayat Treatment Timeline */}
      <div className="pt-2 border-t border-gray-100">
        <h4 className="text-[11px] font-bold text-gray-800 mb-2.5 flex items-center gap-1.5">
          <i className="ri-history-line text-emerald-600"></i>
          <span>Riwayat Treatment</span>
        </h4>

        <div className="space-y-2.5 relative pl-4 before:absolute before:left-1.5 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-emerald-200">
          {riwayat.map((rw, i) => (
            <div key={i} className="relative flex items-start justify-between gap-2 text-[10px]">
              {/* Dot */}
              <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 border-2 border-white shadow-2xs"></div>
              <div>
                <span className="text-gray-400 block text-[9.5px]">{rw.tanggal}</span>
                <span className="font-semibold text-gray-800 block">{rw.aktivitas}</span>
              </div>
              <span className="text-gray-400 text-[9.5px] self-center shrink-0">
                {rw.operator || 'Admin Produksi'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
