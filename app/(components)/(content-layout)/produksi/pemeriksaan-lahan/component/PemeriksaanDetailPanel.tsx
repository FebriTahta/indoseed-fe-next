"use client";

import React, { useState } from 'react';
import { PemeriksaanLahanItem } from '@/app/types/pemeriksaanLahan';

interface PemeriksaanDetailPanelProps {
  item: PemeriksaanLahanItem;
  onClose: () => void;
}

export default function PemeriksaanDetailPanel({
  item,
  onClose,
}: PemeriksaanDetailPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'hasil' | 'offtype' | 'roguing' | 'riwayat'>('hasil');

  const formatTanggalDisplay = (dateVal: any) => {
    if (!dateVal) return '-';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      const dateStr = d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const timeStr = d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return `${dateStr} ${timeStr}`;
    } catch {
      return String(dateVal);
    }
  };

  const kemurnianVal = item.persentaseKemurnian ?? 99.2;
  const kemurnianDisplay = String(kemurnianVal).replace('.', ',');

  // SVG Radial Gauge calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = Math.min(Math.max(kemurnianVal, 0), 100);
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const defaultOffTypes = [
    { no: 1, jenisKarakter: 'Bentuk daun', jumlah: 3, keterangan: 'Daun lebih lebar' },
    { no: 2, jenisKarakter: 'Warna batang', jumlah: 2, keterangan: 'Warna lebih pucat' },
    { no: 3, jenisKarakter: 'Tinggi tanaman', jumlah: 2, keterangan: 'Tinggi lebih pendek' },
    { no: 4, jenisKarakter: 'Bentuk buah', jumlah: 1, keterangan: 'Bentuk tidak seragam' },
  ];

  const offTypeList = (item.temuanOffType && item.temuanOffType.length > 0)
    ? item.temuanOffType
    : defaultOffTypes;

  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('memenuhi') && !s.includes('tidak')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Memenuhi
        </span>
      );
    }
    if (s.includes('roguing')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Perlu Roguing
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
        Tidak Memenuhi
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-xs flex flex-col h-full overflow-hidden animate-fadeIn">
      {/* Header with Title & Close Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 text-sm">
            <i className="ri-leaf-line"></i>
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Detail Pemeriksaan</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail pemeriksaan"
          className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <i className="ri-close-line text-lg"></i>
        </button>
      </div>

      {/* Main Plot Inspection Card */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/40">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-700 text-lg flex-shrink-0 mt-0.5">
            <i className="ri-plant-line"></i>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-gray-900 text-sm">
                {item.kodeJadwalTanam}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Pemeriksaan #{item.pemeriksaanKe || 1}
              </span>
              {renderStatusBadge(item.status)}
            </div>
            <p className="text-xs text-gray-500 mb-3">
              {item.komoditas} - {item.varietas}
            </p>

            {/* 4-point Meta Information */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
              <div className="flex items-center gap-2 text-gray-600">
                <i className="ri-user-3-line text-gray-400 text-xs flex-shrink-0"></i>
                <div className="truncate">
                  <span className="text-[10px] text-gray-400 block -mb-0.5">Petani</span>
                  <span className="font-medium text-gray-800">{item.petani}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <i className="ri-calendar-line text-gray-400 text-xs flex-shrink-0"></i>
                <div className="truncate">
                  <span className="text-[10px] text-gray-400 block -mb-0.5">Tanggal Pemeriksaan</span>
                  <span className="font-medium text-gray-800">
                    {formatTanggalDisplay(item.tanggalPemeriksaan)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <i className="ri-map-pin-2-line text-gray-400 text-xs flex-shrink-0"></i>
                <div className="truncate">
                  <span className="text-[10px] text-gray-400 block -mb-0.5">Lahan</span>
                  <span className="font-medium text-gray-800">{item.lahan}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <i className="ri-shield-check-line text-gray-400 text-xs flex-shrink-0"></i>
                <div className="truncate">
                  <span className="text-[10px] text-gray-400 block -mb-0.5">Petugas QC</span>
                  <span className="font-medium text-gray-800">{item.petugasQc}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-gray-100 px-4 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveSubTab('hasil')}
          className={`py-2.5 px-3 -mb-px border-b-2 transition-colors ${
            activeSubTab === 'hasil'
              ? 'border-emerald-600 text-emerald-700 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Hasil Pemeriksaan
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('offtype')}
          className={`py-2.5 px-3 -mb-px border-b-2 transition-colors ${
            activeSubTab === 'offtype'
              ? 'border-emerald-600 text-emerald-700 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Temuan Off Type
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('roguing')}
          className={`py-2.5 px-3 -mb-px border-b-2 transition-colors ${
            activeSubTab === 'roguing'
              ? 'border-emerald-600 text-emerald-700 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Roguing
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('riwayat')}
          className={`py-2.5 px-3 -mb-px border-b-2 transition-colors ${
            activeSubTab === 'riwayat'
              ? 'border-emerald-600 text-emerald-700 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Riwayat
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 flex-1 overflow-y-auto space-y-5 text-xs">
        {activeSubTab === 'hasil' && (
          <>
            {/* Ringkasan Kemurnian */}
            <div>
              <h4 className="font-bold text-gray-800 text-xs mb-3">Ringkasan Kemurnian</h4>
              <div className="bg-gray-50/60 rounded-xl p-3.5 border border-gray-100 flex items-center gap-5">
                {/* SVG Radial Gauge */}
                <div className="relative flex items-center justify-center flex-shrink-0">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      stroke="#059669"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-base font-extrabold text-gray-900 tracking-tight leading-none">
                      {kemurnianDisplay}%
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium mt-0.5">
                      Kemurnian
                    </span>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-1.5 flex-1 text-xs">
                  <div className="flex justify-between py-0.5 border-b border-gray-100">
                    <span className="text-gray-500">Jumlah Tanaman Diamati</span>
                    <span className="font-semibold text-gray-800">
                      {(item.jumlahTanamanDiamati ?? 1000).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-gray-100">
                    <span className="text-gray-500">Tanaman Sesuai Varietas</span>
                    <span className="font-semibold text-gray-800">
                      {(item.tanamanSesuai ?? 992).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-gray-100">
                    <span className="text-gray-500">Tanaman Off Type</span>
                    <span className="font-semibold text-rose-600">
                      {(item.tanamanOffType ?? 8).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-500">Keterangan</span>
                    <span className="font-semibold text-emerald-600">
                      {item.keterangan || 'Memenuhi standar'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Temuan Off Type Table */}
            <div>
              <h4 className="font-bold text-gray-800 text-xs mb-2">Detail Temuan Off Type</h4>
              <div className="border border-gray-200/80 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-gray-50 border-b border-gray-200/80 text-gray-600 font-semibold">
                    <tr>
                      <th className="py-2 px-2.5 w-8">No</th>
                      <th className="py-2 px-2.5">Jenis Karakter</th>
                      <th className="py-2 px-2.5 text-center w-14">Jumlah</th>
                      <th className="py-2 px-2.5">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {offTypeList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-3 text-center text-gray-400">
                          Tidak ditemukan tanaman off-type
                        </td>
                      </tr>
                    ) : (
                      offTypeList.map((ot, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="py-2 px-2.5 text-gray-500">{ot.no || idx + 1}</td>
                          <td className="py-2 px-2.5 font-medium text-gray-800">{ot.jenisKarakter}</td>
                          <td className="py-2 px-2.5 text-center font-semibold text-gray-800">{ot.jumlah}</td>
                          <td className="py-2 px-2.5 text-gray-600">{ot.keterangan}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dokumentasi Pemeriksaan */}
            <div>
              <h4 className="font-bold text-gray-800 text-xs mb-2">Dokumentasi Pemeriksaan</h4>
              <div className="grid grid-cols-4 gap-2">
                <div className="aspect-video rounded-lg overflow-hidden bg-emerald-900/10 border border-gray-200 relative group cursor-pointer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/images/media/media-1.jpg"
                    alt="Dokumentasi 1"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="aspect-video rounded-lg overflow-hidden bg-emerald-900/10 border border-gray-200 relative group cursor-pointer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/images/media/media-2.jpg"
                    alt="Dokumentasi 2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="aspect-video rounded-lg overflow-hidden bg-emerald-900/10 border border-gray-200 relative group cursor-pointer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/images/media/media-3.jpg"
                    alt="Dokumentasi 3"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="aspect-video rounded-lg overflow-hidden bg-emerald-900/10 border border-gray-200 relative group cursor-pointer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/images/media/media-4.jpg"
                    alt="Dokumentasi 4"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xs backdrop-blur-[1px]">
                    +5 Foto
                  </div>
                </div>
              </div>
            </div>

            {/* Catatan Section */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                <i className="ri-information-line"></i>
              </div>
              <div className="text-xs">
                <span className="font-bold text-emerald-900 block">Catatan</span>
                <p className="text-emerald-800 text-[11px] leading-relaxed mt-0.5">
                  {item.catatan || 'Kondisi tanaman sesuai standar varietas. Tidak ditemukan penyimpangan yang signifikan.'}
                </p>
              </div>
            </div>
          </>
        )}

        {activeSubTab === 'offtype' && (
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800 text-xs">Analisis Temuan Tanaman Off-Type</h4>
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900">
              <p className="font-medium">
                Ditemukan {item.tanamanOffType || 8} tanaman off-type dari {item.jumlahTanamanDiamati || 1000} sampel yang diamati.
              </p>
              <p className="text-[11px] text-amber-700 mt-1">
                Toleransi maksimal BPSB untuk varietas ini adalah 2,0% (maksimal 20 tanaman).
              </p>
            </div>
            <div className="space-y-2">
              {offTypeList.map((ot, idx) => (
                <div key={idx} className="p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 text-xs block">{ot.jenisKarakter}</span>
                    <span className="text-[11px] text-gray-500">{ot.keterangan}</span>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200">
                    {ot.jumlah} Tanaman
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'roguing' && (
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800 text-xs">Status Tindakan Roguing</h4>
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status Roguing</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {item.roguingData?.status || 'Selesai / Terkendali'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Rencana Roguing</span>
                <span className="font-medium text-gray-800">
                  {item.roguingData?.tanggalRencana || 'Sesuai SOP Rutin'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Petugas / Pelaksana</span>
                <span className="font-medium text-gray-800">
                  {item.roguingData?.petugas || item.petani}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-600">
                <span className="font-semibold block text-gray-700 mb-0.5">Catatan Instruksi Roguing:</span>
                <p className="text-[11px]">
                  {item.roguingData?.catatan || 'Segera cabut rumpun atau tanaman yang menunjukkan karakter bentuk daun dan habitus menyimpang, lalu musnahkan di luar areal blok.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'riwayat' && (
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800 text-xs">Riwayat Aktivitas Pemeriksaan</h4>
            <div className="relative pl-5 border-l-2 border-emerald-300 space-y-4 text-xs">
              <div className="relative">
                <span className="absolute -left-[25px] top-0.5 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100"></span>
                <span className="text-[10px] text-gray-400 block">12 Okt 2026 08:15</span>
                <span className="font-semibold text-gray-800 block">Pemeriksaan Lapangan Selesai</span>
                <p className="text-[11px] text-gray-500">Dilakukan oleh {item.petugasQc} dengan hasil status {item.status}.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[25px] top-0.5 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-gray-100"></span>
                <span className="text-[10px] text-gray-400 block">11 Okt 2026 14:00</span>
                <span className="font-semibold text-gray-800 block">Jadwal Pemeriksaan Diterbitkan</span>
                <p className="text-[11px] text-gray-500">Ditugaskan pada fase {item.fase}.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Action Buttons */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-2 text-xs">
        <button
          type="button"
          onClick={() => window.print()}
          className="px-3 py-2 bg-white border border-gray-200/80 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <i className="ri-printer-line text-sm"></i>
          Cetak Laporan
        </button>
        <button
          type="button"
          onClick={() => alert(`Edit pemeriksaan ${item.noPemeriksaan}`)}
          className="px-3 py-2 bg-white border border-gray-200/80 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <i className="ri-edit-line text-sm"></i>
          Edit Pemeriksaan
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('roguing')}
          className="px-3.5 py-2 bg-[#055127] hover:bg-[#04401f] text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <i className="ri-eye-line text-sm"></i>
          Lihat Roguing
        </button>
      </div>
    </div>
  );
}
