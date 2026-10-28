"use client";

import React from 'react';
import { SortasiBatchItem } from '@/app/types/sortasi';

interface DetailSortasiPanelProps {
  item: SortasiBatchItem | null;
  onOpenDocModal?: () => void;
  onPrint?: () => void;
}

export default function DetailSortasiPanel({
  item,
  onOpenDocModal,
  onPrint,
}: DetailSortasiPanelProps) {
  if (!item) {
    return (
      <div className="bg-white rounded-xl border border-gray-200/90 p-8 shadow-2xs text-center text-gray-400 text-xs">
        <i className="ri-information-line text-2xl text-gray-300 block mb-2"></i>
        Pilih salah satu batch sortasi di tabel untuk melihat detail.
      </div>
    );
  }

  const bMasuk = item.beratMasuk || 500;
  const bLolos = item.hasilLulus || 460;
  const bReject = item.hasilTolak || 40;
  const recovery = item.recovery || (bMasuk > 0 ? (bLolos / bMasuk) * 100 : 92);
  const rejectPercent = bMasuk > 0 ? (bReject / bMasuk) * 100 : 8;

  // SVG Donut calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const lolosStroke = (recovery / 100) * circumference;
  const rejectStroke = circumference - lolosStroke;

  // Rincian Reject fallback
  const rincianReject =
    item.rincianReject && item.rincianReject.length > 0
      ? item.rincianReject
      : [
          { jenis: 'Benih hampa', berat: 18, persentase: 3.6 },
          { jenis: 'Ukuran < standar', berat: 12, persentase: 2.4 },
          { jenis: 'Kerusakan fisik', berat: 7, persentase: 1.4 },
          { jenis: 'Lainnya', berat: 3, persentase: 0.6 },
        ];

  // Dokumentasi photos fallback
  const dokumentasi =
    item.dokumentasi && item.dokumentasi.length > 0
      ? item.dokumentasi
      : [
          'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=500&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&auto=format&fit=crop&q=60',
        ];

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-4 space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <i className="ri-file-list-3-line text-emerald-600 text-sm"></i>
          <h3 className="text-xs font-bold text-gray-800">Detail Proses Sortasi</h3>
        </div>

        {/* Status Badge */}
        {item.status === 'Selesai' ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <i className="ri-check-line text-[10px]"></i> Selesai
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <i className="ri-loader-4-line animate-spin text-[10px]"></i> Proses
          </span>
        )}
      </div>

      {/* Code & Thumbnail Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
            <i className="ri-hashtag text-emerald-600"></i>
            <span>{item.kodeBatch}</span>
          </div>

          {/* Metadata items with icons */}
          <div className="space-y-1.5 mt-2.5 text-[11px] text-gray-600">
            <div className="flex items-center gap-2">
              <i className="ri-drop-line text-blue-500 w-3.5 text-center shrink-0"></i>
              <span>
                <span className="text-gray-400">Komoditas / Varietas:</span>{' '}
                <strong className="text-gray-800 font-semibold">
                  {item.komoditas} / {item.varietas}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <i className="ri-user-line text-amber-500 w-3.5 text-center shrink-0"></i>
              <span>
                <span className="text-gray-400">Petani Mitra:</span>{' '}
                <strong className="text-gray-800 font-semibold">
                  {item.petani} {item.petaniKode ? `(${item.petaniKode})` : ''}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <i className="ri-calendar-line text-purple-500 w-3.5 text-center shrink-0"></i>
              <span>
                <span className="text-gray-400">Tanggal Sortasi:</span>{' '}
                <strong className="text-gray-800 font-semibold">{item.tanggalSortasi}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <i className="ri-user-settings-line text-gray-500 w-3.5 text-center shrink-0"></i>
              <span>
                <span className="text-gray-400">Operator:</span>{' '}
                <strong className="text-gray-800 font-semibold">{item.operator || 'Siti Nurhayati'}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <i className="ri-map-pin-line text-rose-500 w-3.5 text-center shrink-0"></i>
              <span>
                <span className="text-gray-400">Lokasi Sortasi:</span>{' '}
                <strong className="text-gray-800 font-semibold">{item.lokasi || 'Ruang Sortasi Unit 1'}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Thumbnail Preview */}
        <div className="shrink-0">
          <img
            src={dokumentasi[0]}
            alt="Sortasi Preview"
            className="w-20 h-16 rounded-lg object-cover border border-gray-200 shadow-2xs hover:opacity-90 transition-opacity cursor-pointer"
            onClick={onOpenDocModal}
          />
        </div>
      </div>

      {/* Hasil Sortasi with Donut Chart */}
      <div className="pt-2 border-t border-gray-100">
        <h4 className="text-[11px] font-bold text-gray-800 mb-2 flex items-center gap-1.5">
          <i className="ri-pie-chart-line text-emerald-600"></i> Hasil Sortasi
        </h4>

        <div className="flex items-center justify-between gap-4 bg-slate-50/70 rounded-xl p-3 border border-gray-100">
          {/* SVG Donut Chart */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-gray-200"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Reject segment (Red) */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-rose-500"
                strokeWidth="10"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset="0"
                fill="transparent"
              />
              {/* Lolos segment (Green) */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-emerald-600 transition-all duration-700"
                strokeWidth="10"
                strokeDasharray={`${lolosStroke} ${circumference}`}
                strokeDashoffset="0"
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-gray-900 leading-tight">
                {recovery.toFixed(1).replace('.', ',')}%
              </span>
              <span className="text-[9px] text-gray-500 leading-tight">Lolos</span>
            </div>
          </div>

          {/* Legend and Numbers */}
          <div className="flex-1 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                <span className="text-gray-600 text-[11px]">Lolos</span>
              </div>
              <span className="font-semibold text-gray-900 text-[11px]">
                {bLolos.toLocaleString('id-ID')} kg{' '}
                <span className="text-gray-400 font-normal">
                  ({recovery.toFixed(1).replace('.', ',')}%)
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                <span className="text-gray-600 text-[11px]">Reject</span>
              </div>
              <span className="font-semibold text-gray-900 text-[11px]">
                {bReject.toLocaleString('id-ID')} kg{' '}
                <span className="text-gray-400 font-normal">
                  ({rejectPercent.toFixed(1).replace('.', ',')}%)
                </span>
              </span>
            </div>

            <div className="pt-1.5 border-t border-gray-200 flex items-center justify-between font-bold text-xs text-gray-900">
              <span className="text-[11px]">Total</span>
              <span className="text-[11px]">{bMasuk.toLocaleString('id-ID')} kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rincian Reject */}
      <div className="pt-2 border-t border-gray-100">
        <h4 className="text-[11px] font-bold text-gray-800 mb-2">Rincian Reject</h4>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-50 text-gray-500 text-[10px] font-semibold border-b border-gray-200">
              <tr>
                <th className="py-1.5 px-2.5">Jenis Reject</th>
                <th className="py-1.5 px-2.5 text-center">Berat (kg)</th>
                <th className="py-1.5 px-2.5 text-right">Persentase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {rincianReject.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-1.5 px-2.5 text-gray-800 font-medium">{row.jenis}</td>
                  <td className="py-1.5 px-2.5 text-center text-gray-700">{row.berat}</td>
                  <td className="py-1.5 px-2.5 text-right font-medium text-gray-800">
                    {row.persentase ? `${row.persentase.toFixed(1).replace('.', ',')}%` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dokumentasi */}
      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[11px] font-bold text-gray-800">Dokumentasi</h4>
          <button
            type="button"
            onClick={onOpenDocModal}
            className="text-[10px] font-semibold text-emerald-700 hover:underline"
          >
            Lihat Semua &gt;
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {dokumentasi.slice(0, 3).map((imgUrl, i) => (
            <div
              key={i}
              onClick={onOpenDocModal}
              className="relative aspect-4/3 rounded-lg overflow-hidden border border-gray-200 group cursor-pointer shadow-2xs"
            >
              <img
                src={imgUrl}
                alt={`Dokumentasi ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action: Cetak Laporan Sortasi */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            if (onPrint) onPrint();
            else window.print();
          }}
          className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold transition-colors shadow-2xs"
        >
          <i className="ri-printer-line text-sm"></i>
          <span>Cetak Laporan Sortasi</span>
        </button>
      </div>
    </div>
  );
}
