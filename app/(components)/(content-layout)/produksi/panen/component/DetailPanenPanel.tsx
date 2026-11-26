"use client";

import React from 'react';
import { PanenItem } from '@/app/types/panen';
import Link from 'next/link';

interface DetailPanenPanelProps {
  item: PanenItem | null;
  onClose: () => void;
  onOpenFotoModal: () => void;
}

export default function DetailPanenPanel({
  item,
  onClose,
  onOpenFotoModal,
}: DetailPanenPanelProps) {
  if (!item) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <i className="ri-check-line text-xs"></i>
            Selesai
          </span>
        );
      case 'Dalam Proses':
      case 'Berlangsung':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <i className="ri-time-line text-xs"></i>
            Dalam Proses
          </span>
        );
      case 'Tertunda':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <i className="ri-error-warning-line text-xs"></i>
            Tertunda
          </span>
        );
      case 'Menunggu':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <i className="ri-time-line text-xs"></i>
            Menunggu
          </span>
        );
    }
  };

  const calculatePercent = () => {
    if (!item.perkiraanHasil || item.perkiraanHasil <= 0 || !item.produksiKg) return null;
    const pct = ((item.produksiKg / item.perkiraanHasil) * 100).toFixed(1).replace('.', ',');
    return `${pct}%`;
  };

  const percentage = calculatePercent();

  // Photo thumbnails
  const photos = Array.isArray(item.dokumentasi) && item.dokumentasi.length > 0
    ? item.dokumentasi
    : [
        { url: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=500&auto=format&fit=crop&q=60', caption: 'Lahan Panen', date: '28 Sep 2026', size: '1.4 MB' },
        { url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop&q=60', caption: 'Kualitas Buah', date: '28 Sep 2026', size: '2.1 MB' },
        { url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=60', caption: 'Pemetikan Buah', date: '28 Sep 2026', size: '1.8 MB' },
        { url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&auto=format&fit=crop&q=60', caption: 'Penimbangan', date: '28 Sep 2026', size: '1.9 MB' },
      ];

  const isGlondong = item.jenisHasil?.includes('Glondong') || item.jenisHasil?.includes('Buah');

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 space-y-5 transition-all animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <i className="ri-seedling-line text-lg"></i>
          </div>
          <h3 className="text-sm font-bold text-gray-900">Detail Panen</h3>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge(item.status)}
          <button
            onClick={onClose}
            title="Tutup Detail"
            className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
      </div>

      {/* Main Title & Petani */}
      <div>
        <h2 className="text-base font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          {item.kodePanen}
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
          <i className="ri-user-3-line text-gray-400"></i>
          <span>{item.petani || 'Budi Santoso'} ({item.petaniKode || 'BTN-001'})</span>
        </div>
      </div>

      {/* Jenis Hasil Panen Card / Badge */}
      <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
          isGlondong ? 'bg-emerald-100/70 text-emerald-800' : 'bg-purple-100/70 text-purple-800'
        }`}>
          <i className={isGlondong ? 'ri-plant-line' : 'ri-seedling-line'}></i>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-medium block">Jenis Hasil Panen</span>
          <span className="text-xs font-bold text-gray-900">{item.jenisHasil || 'Glondong / Buah'}</span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3.5 text-xs">
        {/* Komoditas / Varietas */}
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center mt-0.5 flex-shrink-0">
            <i className="ri-leaf-line text-xs"></i>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-medium">Komoditas / Varietas</span>
            <span className="font-semibold text-gray-800">
              {item.komoditas} / {item.varietas}
            </span>
          </div>
        </div>

        {/* Lahan / Blok */}
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center mt-0.5 flex-shrink-0">
            <i className="ri-map-pin-line text-xs"></i>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-medium">Lahan / Blok</span>
            <span className="font-semibold text-gray-800">
              {item.lahan || item.blokLahan || 'LHN-001 / Blok 01'}
            </span>
          </div>
        </div>

        {/* Rencana Panen */}
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center mt-0.5 flex-shrink-0">
            <i className="ri-calendar-line text-xs"></i>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-medium">Rencana Panen</span>
            <span className="font-semibold text-gray-800">
              {item.rencanaPanen ? new Date(item.rencanaPanen).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
            </span>
          </div>
        </div>

        {/* Aktual Panen */}
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center mt-0.5 flex-shrink-0">
            <i className="ri-calendar-check-line text-xs"></i>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-medium">Aktual Panen</span>
            <span className="font-semibold text-gray-800">
              {item.status === 'Selesai' && item.tanggalPanen
                ? new Date(item.tanggalPanen).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                : '-'}
            </span>
          </div>
        </div>

        {/* Perkiraan Hasil */}
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center mt-0.5 flex-shrink-0">
            <i className="ri-scales-3-line text-xs"></i>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-medium">Perkiraan Hasil</span>
            <span className="font-semibold text-gray-800">
              {item.perkiraanHasil ? `${item.perkiraanHasil.toLocaleString('id-ID')} kg` : '1.500 kg'}
            </span>
          </div>
        </div>

        {/* Hasil Aktual */}
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center mt-0.5 flex-shrink-0">
            <i className="ri-checkbox-circle-line text-xs"></i>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-medium">Hasil Aktual</span>
            <span className="font-semibold text-gray-800">
              {item.produksiKg && item.produksiKg > 0
                ? `${item.produksiKg.toLocaleString('id-ID')} kg ${percentage ? `(${percentage})` : ''}`
                : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Hasil Panen Metric Summary */}
      <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
        <span className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
          <i className="ri-dashboard-line text-emerald-700"></i>
          Hasil Panen
        </span>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-white p-2.5 rounded-lg border border-gray-100">
            <span className="text-[10px] text-gray-400 block">
              {isGlondong && item.jumlahBuah ? 'Jumlah Buah' : 'Jumlah Panen'}
            </span>
            <span className="font-extrabold text-gray-900 text-sm">
              {isGlondong && item.jumlahBuah && item.jumlahBuah > 0
                ? `${item.jumlahBuah.toLocaleString('id-ID')} buah`
                : `${(item.beratBruto || item.produksiKg || 1520).toLocaleString('id-ID')} kg`}
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-gray-100">
            <span className="text-[10px] text-gray-400 block">Berat Netto</span>
            <span className="font-extrabold text-emerald-700 text-sm">
              {(item.beratNetto || item.produksiKg || 1480).toLocaleString('id-ID')} kg
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-gray-100">
            <span className="text-[10px] text-gray-400 block">Luas Dipanen</span>
            <span className="font-bold text-gray-800 text-xs">
              {(item.luasHa || 1.0).toFixed(2).replace('.', ',')} Ha
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-gray-100">
            <span className="text-[10px] text-gray-400 block">Kondisi Hasil</span>
            <span className="font-bold text-emerald-700 text-xs">
              {item.kondisiHasil || 'Baik'}
            </span>
          </div>
        </div>
      </div>

      {/* Status Pengolahan */}
      <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <i className="ri-loader-4-line text-sm animate-spin"></i>
          </div>
          <div>
            <span className="text-[10px] text-amber-700 block font-medium">Status Pengolahan</span>
            <span className="text-xs font-bold text-amber-900">
              {item.statusPengolahan || 'Menunggu Pengolahan'}
            </span>
          </div>
        </div>

        <Link
          href="/produksi/pengeringan"
          className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-0.5"
        >
          Lihat Proses Pengolahan <i className="ri-arrow-right-s-line text-sm"></i>
        </Link>
      </div>

      {/* Dokumentasi Panen */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
            <i className="ri-image-line text-emerald-700"></i>
            <span>Dokumentasi Panen</span>
          </div>
          <button
            type="button"
            onClick={onOpenFotoModal}
            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            Lihat Semua
          </button>
        </div>

        {/* 4 Photo Thumbnails */}
        <div className="grid grid-cols-4 gap-2">
          {photos.slice(0, 4).map((photo: any, idx: number) => {
            const url = typeof photo === 'string' ? photo : photo.url;
            const isLast = idx === 3 && photos.length > 4;
            const extraCount = photos.length - 4;

            return (
              <div
                key={idx}
                onClick={onOpenFotoModal}
                className="aspect-square rounded-lg overflow-hidden border border-gray-200 relative cursor-pointer group bg-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Dokumentasi ${idx + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=500&auto=format&fit=crop&q=60';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {isLast && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xs">
                    +{extraCount + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Catatan */}
      {item.catatan && (
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
            <i className="ri-file-text-line text-gray-400"></i>
            Catatan
          </span>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 italic">
            "{item.catatan}"
          </div>
        </div>
      )}

      {/* Footer Meta */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-1.5">
          <i className="ri-user-line text-xs"></i>
          <span>Dicatat oleh: <strong className="text-gray-700 font-semibold">{item.penanggungJawab || item.dibuatOleh || 'Admin Produksi'}</strong></span>
        </div>
        <span>29 Sep 2026 10:45</span>
      </div>
    </div>
  );
}
