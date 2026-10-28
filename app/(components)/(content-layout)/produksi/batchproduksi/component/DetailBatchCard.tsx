"use client";

import React from 'react';
import { BatchProduksiItem } from '@/app/types/batchProduksi';

interface DetailBatchCardProps {
  item: BatchProduksiItem | null;
  onViewTahapan?: () => void;
}

export default function DetailBatchCard({
  item,
  onViewTahapan,
}: DetailBatchCardProps) {
  if (!item) {
    return (
      <div className="bg-white border border-gray-200/80 shadow-xs rounded-xl p-6 text-center text-gray-400 text-xs">
        <i className="ri-flask-line text-3xl text-gray-300 block mb-2"></i>
        Pilih salah satu batch produksi di tabel untuk melihat rincian detail.
      </div>
    );
  }

  const renderStatusBadge = (s: string) => {
    switch (s) {
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Selesai
          </span>
        );
      case 'Dalam Proses':
      case 'Proses':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Dalam Proses
          </span>
        );
      case 'Tertunda':
      case 'Reject':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Tertunda
          </span>
        );
      case 'Persiapan':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Persiapan
          </span>
        );
    }
  };

  // Default tahapan steps
  const tahapanList = item.tahapanList && item.tahapanList.length > 0 ? item.tahapanList : [
    { nama: 'Rencana Tanam', tanggal: '01 Jun 2026 - 02 Jun 2026', status: 'Selesai' },
    { nama: 'Penanaman', tanggal: '03 Jun 2026 - 05 Jun 2026', status: 'Selesai' },
    { nama: 'Monitoring', tanggal: '06 Jun 2026 - 12 Jun 2026', status: 'Selesai' },
    { nama: 'Pengeringan', tanggal: '13 Jun 2026 - 15 Jun 2026', status: 'Selesai' },
    { nama: 'Sortasi', tanggal: '16 Jun 2026 - 17 Jun 2026', status: 'Selesai' },
    { nama: 'Treatment', tanggal: '18 Jun 2026', status: 'Selesai' },
  ];

  // Photo based on commodity
  const getImageForCommodity = (komoditas: string) => {
    if (item.foto) return item.foto;
    const k = komoditas?.toLowerCase() || '';
    if (k.includes('melon')) {
      return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80';
    } else if (k.includes('cabai')) {
      return 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80';
    } else if (k.includes('tomat')) {
      return 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80';
    } else if (k.includes('padi')) {
      return 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80';
    }
    return 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80';
  };

  const realisasiText = item.hasilKg !== undefined && item.hasilKg > 0
    ? `${item.hasilKg.toLocaleString('id-ID')} kg (${item.yieldPercent || Math.round((item.hasilKg / (item.targetKg || 1)) * 100)}%)`
    : '-';

  return (
    <div className="bg-white border border-gray-200/80 shadow-xs rounded-xl overflow-hidden text-xs">
      {/* Top Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="ri-file-list-3-line text-emerald-600 text-base"></i>
          <h3 className="font-bold text-sm text-gray-800">Detail Batch Produksi</h3>
        </div>
        <div>{renderStatusBadge(item.status)}</div>
      </div>

      <div className="p-4 space-y-4">
        {/* Batch Code and Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
            <i className="ri-flask-line"></i>
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 leading-tight">{item.kodeBatch}</h4>
            <p className="text-[11px] text-gray-500 font-medium">
              {item.komoditas} / {item.varietas}
            </p>
          </div>
        </div>

        {/* 2-column Metadata & Photo Container */}
        <div className="grid grid-cols-12 gap-3">
          {/* Metadata Grid (7 cols) */}
          <div className="col-span-7 grid grid-cols-2 gap-y-2.5 gap-x-2 text-[11px]">
            <div>
              <span className="text-gray-400 block text-[10px]">Komoditas</span>
              <span className="font-semibold text-gray-800">{item.komoditas}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Varietas</span>
              <span className="font-semibold text-gray-800">{item.varietas}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Lahan / Greenhouse</span>
              <span className="font-semibold text-gray-800">{item.lokasi || item.lahan || 'GH-001'}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Tanggal Mulai</span>
              <span className="font-semibold text-gray-800">{item.tanggalMulai}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Tanggal Selesai</span>
              <span className="font-semibold text-gray-800">{item.tanggalSelesai || '-'}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Target Produksi</span>
              <span className="font-semibold text-gray-800">
                {item.targetKg ? `${item.targetKg.toLocaleString('id-ID')} kg` : '-'}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-400 block text-[10px]">Realisasi Produksi</span>
              <span className="font-semibold text-gray-800">{realisasiText}</span>
            </div>
          </div>

          {/* Documentation Photo (5 cols) */}
          <div className="col-span-5 relative rounded-lg overflow-hidden border border-gray-100 h-28 bg-gray-50">
            <img
              src={getImageForCommodity(item.komoditas)}
              alt="Dokumentasi Produksi"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
              <i className="ri-camera-line text-[10px]"></i>
              <span>Dokumentasi Produksi</span>
            </div>
          </div>
        </div>

        {/* Tahapan Produksi Section */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <h5 className="font-bold text-xs text-gray-800">Tahapan Produksi</h5>
          </div>

          {/* Stepper Vertical */}
          <div className="relative pl-5 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-100">
            {tahapanList.map((tahap, idx) => (
              <div key={idx} className="relative flex items-center justify-between text-[11px]">
                {/* Dot */}
                <div className="absolute -left-5 top-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                  <i className="ri-check-line text-xs font-bold"></i>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 block leading-tight">{tahap.nama}</span>
                  <span className="text-[10px] text-gray-400">{tahap.tanggal}</span>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                    Selesai
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-right">
            <button
              type="button"
              onClick={onViewTahapan}
              className="text-emerald-700 hover:text-emerald-800 font-semibold text-[11px] inline-flex items-center gap-1"
            >
              Lihat Detail Tahapan <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>

        {/* Dokumen Section */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5 mb-2">
            <i className="ri-file-text-line text-emerald-600 text-xs"></i>
            <h5 className="font-bold text-xs text-gray-800">Dokumen</h5>
          </div>

          <div className="space-y-1.5">
            {[
              { id: '1', name: 'Berita Acara Produksi' },
              { id: '2', name: 'Sertifikat QC' },
              { id: '3', name: 'Laporan Produksi' },
            ].map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50/80 hover:bg-slate-100/80 transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-2">
                  <i className="ri-file-pdf-line text-rose-500 text-sm"></i>
                  <span className="text-[11px] font-medium text-gray-700">{doc.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Mengunduh dokumen: ${doc.name}`)}
                  className="text-emerald-700 hover:text-emerald-800 font-semibold text-[10px] flex items-center gap-1"
                >
                  Download <i className="ri-download-line"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
