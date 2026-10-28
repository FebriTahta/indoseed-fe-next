"use client";

import React, { useState } from 'react';
import { GudangBahanItem } from '@/app/types/gudangBahanBelumDiproses';
import { toast } from 'react-toastify';

interface DetailLotPanelProps {
  item: GudangBahanItem | null;
  onOpenMapModal: () => void;
  onOpenPhotoModal: () => void;
  onEdit: (item: GudangBahanItem) => void;
  onTransferPengeringan: (item: GudangBahanItem) => void;
}

export default function DetailLotPanel({
  item,
  onOpenMapModal,
  onOpenPhotoModal,
  onEdit,
  onTransferPengeringan,
}: DetailLotPanelProps) {
  const [copied, setCopied] = useState<boolean>(false);

  if (!item) {
    return (
      <div className="bg-white rounded-xl border border-gray-200/80 p-6 text-center text-gray-400">
        Pilih salah satu baris lot untuk melihat detail.
      </div>
    );
  }

  const handleCopyLot = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(item.noLot);
      setCopied(true);
      toast.info(`Nomor lot ${item.noLot} disalin ke clipboard`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const formatDecimal = (num: number) => {
    return num.toFixed(1).replace('.', ',');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Dalam Pengeringan':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Dalam Pengeringan
          </span>
        );
      case 'Menunggu Sortasi':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Menunggu Sortasi
          </span>
        );
      case 'Bahan Belum Diproses':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FBF2EA] text-[#8A4A28] border border-[#F2D7C2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A8582B]"></span>
            Bahan Belum Diproses
          </span>
        );
    }
  };

  // Timeline list based on item
  const timelineSteps = item.riwayatFlow && item.riwayatFlow.length > 0
    ? item.riwayatFlow
    : [
        {
          tahap: 'Panen',
          status: 'completed',
          tanggal: item.tanggalPanen ? `${formatDate(item.tanggalPanen)} 08:00` : '02 Jun 2026 08:00',
          keterangan: item.sumberPanen,
        },
        {
          tahap: 'Penerimaan Hasil Panen',
          status: 'completed',
          tanggal: `${formatDate(item.tanggalMasuk)} 09:15`,
          keterangan: item.noLot,
        },
        {
          tahap: 'Masuk Gudang Bahan Belum Diproses',
          status: 'active',
          tanggal: `${formatDate(item.tanggalMasuk)} 10:20`,
          keterangan: item.lokasi,
        },
        {
          tahap: 'Pengeringan',
          status: item.status === 'Dalam Pengeringan' ? 'in_progress' : 'pending',
          keterangan: item.status === 'Dalam Pengeringan' ? 'Sedang berlangsung' : '(Belum dilakukan)',
        },
        {
          tahap: 'Sortasi',
          status: item.status === 'Menunggu Sortasi' ? 'in_progress' : 'pending',
          keterangan: '(Belum dilakukan)',
        },
        { tahap: 'Treatment', status: 'pending', keterangan: '(Belum dilakukan)' },
        { tahap: 'QC / Pengujian', status: 'pending', keterangan: '(Belum dilakukan)' },
        { tahap: 'Release', status: 'pending', keterangan: '(Belum dilakukan)' },
      ];

  const photoUrl =
    item.foto ||
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-4 space-y-4">
      {/* 1. Header: Icon + Detail Lot and Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">Detail Lot</h3>
        </div>

        <div>{getStatusBadge(item.status)}</div>
      </div>

      {/* 2. Big Lot Code with Copy Icon */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-extrabold text-gray-900 tracking-tight">
          {item.noLot}
        </span>
        <button
          type="button"
          onClick={handleCopyLot}
          title="Salin Nomor Lot"
          className="text-gray-400 hover:text-emerald-700 transition-colors p-1 rounded hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      {/* 3. Info 2-Column Grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs">
        <div>
          <span className="text-[11px] text-gray-400 block font-normal">Sumber Panen</span>
          <span className="font-semibold text-gray-800">{item.sumberPanen}</span>
        </div>

        <div>
          <span className="text-[11px] text-gray-400 block font-normal">Petani</span>
          <span className="font-semibold text-gray-800">{item.petani || 'Budi Santoso'}</span>
        </div>

        <div>
          <span className="text-[11px] text-gray-400 block font-normal">Lahan</span>
          <span className="font-semibold text-gray-800">{item.lahan || 'LHN-001 / Blok 01'}</span>
        </div>

        <div>
          <span className="text-[11px] text-gray-400 block font-normal">Komoditas / Varietas</span>
          <span className="font-semibold text-gray-800">
            {item.komoditas} / {item.varietas}
          </span>
        </div>

        <div>
          <span className="text-[11px] text-gray-400 block font-normal">Tanggal Panen</span>
          <span className="font-semibold text-gray-800">{formatDate(item.tanggalPanen)}</span>
        </div>

        <div>
          <span className="text-[11px] text-gray-400 block font-normal">Tanggal Masuk Gudang</span>
          <span className="font-semibold text-gray-800">{formatDate(item.tanggalMasuk)}</span>
        </div>

        <div>
          <span className="text-[11px] text-gray-400 block font-normal">Berat Masuk</span>
          <span className="font-semibold text-gray-800">{formatNumber(item.beratMasuk)} kg</span>
        </div>

        <div>
          <span className="text-[11px] text-gray-400 block font-normal">Kadar Air Awal</span>
          <span className="font-semibold text-gray-800">{formatDecimal(item.kadarAir)}%</span>
        </div>
      </div>

      {/* 4. Lokasi Penyimpanan Section */}
      <div className="pt-2 border-t border-gray-100 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-emerald-600 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-semibold text-gray-800">Lokasi Penyimpanan</span>
          </div>

          <button
            type="button"
            onClick={onOpenMapModal}
            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
          >
            Peta Lokasi
          </button>
        </div>

        <div className="text-xs text-gray-600 pl-5">
          {item.lokasiDetail || `Gudang Produksi / ${item.lokasi}`}
        </div>

        {/* Thumbnail photo */}
        <div
          onClick={onOpenPhotoModal}
          className="relative group rounded-lg overflow-hidden border border-gray-200 cursor-pointer aspect-video sm:h-28 bg-gray-100"
        >
          <img
            src={photoUrl}
            alt="Penyimpanan Lot"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="px-2 py-1 rounded bg-black/60 text-white text-[10px] font-medium flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Perbesar Foto
            </span>
          </div>
        </div>
      </div>

      {/* 5. Riwayat Pergerakan Section */}
      <div className="pt-2 border-t border-gray-100 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-emerald-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Riwayat Pergerakan</span>
        </div>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-gray-200">
          {timelineSteps.map((step, idx) => {
            const isCompleted = step.status === 'completed' || step.status === 'active';
            const isActive = step.status === 'active';
            const isInProgress = step.status === 'in_progress';

            return (
              <div key={idx} className="relative text-xs">
                {/* Node icon */}
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isInProgress
                      ? 'bg-blue-600 text-white animate-pulse'
                      : 'bg-white border-2 border-gray-300 text-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <div className="font-semibold text-gray-800 leading-tight">
                    {step.tahap}
                  </div>
                  {step.tanggal ? (
                    <div className="text-[11px] text-gray-500 mt-0.5 flex items-center justify-between">
                      <span>{step.tanggal}</span>
                      {step.keterangan && (
                        <span className="font-mono text-[10px] text-gray-600 bg-gray-50 px-1 rounded">
                          {step.keterangan}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-[11px] text-gray-400 mt-0.5 italic">
                      {step.keterangan || '(Belum dilakukan)'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
