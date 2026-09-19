import React, { useState } from 'react';
import { PerencanaanProduksi } from '@/app/types/perencanaanProduksi';

interface DetailPanelProps {
  item: PerencanaanProduksi | null;
  onEdit: (item: PerencanaanProduksi) => void;
  onCetak: (item: PerencanaanProduksi) => void;
  onViewDetail: (item: PerencanaanProduksi) => void;
  onDelete?: (id: string, no: string) => void;
  onClose?: () => void;
}

export default function DetailPanel({ item, onEdit, onCetak, onViewDetail, onDelete, onClose }: DetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'rincian' | 'petani' | 'jadwal' | 'riwayat'>('info');

  if (!item) {
    return (
      <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm flex flex-col items-center justify-center text-center min-h-[450px]">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-700">Pilih Rencana Produksi</p>
        <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Klik salah satu baris di tabel untuk melihat ringkasan detail perencanaan.</p>
      </div>
    );
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Disetujui':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Disetujui
          </span>
        );
      case 'Proses':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            Proses
          </span>
        );
      case 'Draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Draft
          </span>
        );
    }
  };

  const percentage = Math.min(100, Math.max(0, item.produksiTerpenuhi || 0));
  const circleRadius = 38;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm sticky top-24">
      {/* Header */}
      <div className="flex items-start justify-between pb-3.5 border-b border-gray-100 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Detail Perencanaan Produksi</h3>
            <p className="text-[11px] text-gray-400 font-medium">ID: {item.noPerencanaan}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {renderStatusBadge(item.status)}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors ml-1"
              title="Tutup Detail"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200/70 mb-4 text-xs font-medium">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-2 px-2.5 transition-colors border-b-2 ${
            activeTab === 'info'
              ? 'border-emerald-600 text-emerald-700 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Informasi Utama
        </button>
        <button
          onClick={() => setActiveTab('rincian')}
          className={`pb-2 px-2.5 transition-colors border-b-2 ${
            activeTab === 'rincian'
              ? 'border-emerald-600 text-emerald-700 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Rincian Target
        </button>
        <button
          onClick={() => setActiveTab('petani')}
          className={`pb-2 px-2.5 transition-colors border-b-2 ${
            activeTab === 'petani'
              ? 'border-emerald-600 text-emerald-700 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Petani {item.petaniDistribusi && item.petaniDistribusi.length > 0 ? `(${item.petaniDistribusi.length})` : ''}
        </button>
        <button
          onClick={() => setActiveTab('jadwal')}
          className={`pb-2 px-2.5 transition-colors border-b-2 ${
            activeTab === 'jadwal'
              ? 'border-emerald-600 text-emerald-700 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Jadwal Tanam
        </button>
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`pb-2 px-2.5 transition-colors border-b-2 ${
            activeTab === 'riwayat'
              ? 'border-emerald-600 text-emerald-700 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Riwayat
        </button>
      </div>

      {/* Tab: Informasi Utama */}
      {activeTab === 'info' && (
        <div className="space-y-3.5">
          {/* Product Banner Box */}
          <div className="bg-emerald-50/50 rounded-xl border border-emerald-200/60 p-3.5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-[10px] uppercase font-semibold text-emerald-700 tracking-wider">Komoditas & Varietas</span>
                <h4 className="text-sm font-bold text-gray-900 leading-tight">{item.komoditas} - {item.varietas}</h4>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-emerald-200/40 text-[11px]">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Komoditas</span>
                    <span className="font-semibold text-gray-700">{item.komoditas}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Varietas</span>
                    <span className="font-semibold text-gray-700">{item.varietas}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6 Grid Metrics */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            {/* 1. Target Produksi */}
            <div className="p-2.5 rounded-lg border border-gray-200/70 bg-gray-50/50 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-4a5 5 0 100-10 5 5 0 000 10z" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Target Produksi</span>
                <span className="font-bold text-gray-800 text-xs">{item.targetProduksi.toLocaleString('id-ID')} kg</span>
              </div>
            </div>

            {/* 2. Target Luas Lahan */}
            <div className="p-2.5 rounded-lg border border-gray-200/70 bg-gray-50/50 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Target Luas Lahan</span>
                <span className="font-bold text-gray-800 text-xs">{item.targetLuasLahan} ha</span>
              </div>
            </div>

            {/* 3. Periode Produksi */}
            <div className="p-2.5 rounded-lg border border-gray-200/70 bg-gray-50/50 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Periode Produksi</span>
                <span className="font-bold text-gray-800 text-xs">{item.periode}</span>
              </div>
            </div>

            {/* 4. Metode Tanam */}
            <div className="p-2.5 rounded-lg border border-gray-200/70 bg-gray-50/50 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Metode Tanam</span>
                <span className="font-bold text-gray-800 text-xs">{item.metodeTanam}</span>
              </div>
            </div>

            {/* 5. Kebutuhan Benih */}
            <div className="p-2.5 rounded-lg border border-gray-200/70 bg-gray-50/50 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Kebutuhan Benih</span>
                <span className="font-bold text-gray-800 text-xs">{(item.kebutuhanBenih || 0).toLocaleString('id-ID')} kg</span>
              </div>
            </div>

            {/* 6. Estimasi Hasil per Ha */}
            <div className="p-2.5 rounded-lg border border-gray-200/70 bg-gray-50/50 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Estimasi Hasil per Ha</span>
                <span className="font-bold text-gray-800 text-xs">{item.estimasiHasilPerHa} kg</span>
              </div>
            </div>
          </div>

          {/* Catatan Card */}
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200/70">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Catatan</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              {item.catatan || 'Fokus pada kualitas benih dan pertumbuhan optimal untuk mencapai target produksi.'}
            </p>
          </div>

          {/* Progress Realisasi / Produksi Terpenuhi Box (Core User Requirement) */}
          <div className="p-3.5 rounded-xl border border-gray-200/80 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-xs font-bold text-gray-800">Progress Realisasi & Terpenuhi</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                {percentage}% Terpenuhi
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Radial Meter */}
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r={circleRadius}
                    className="text-gray-100"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r={circleRadius}
                    className={percentage > 0 ? 'text-emerald-500' : 'text-gray-200'}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-base font-extrabold text-gray-800">{percentage}%</span>
                  <span className="text-[9px] text-gray-400">terpenuhi</span>
                </div>
              </div>

              {/* Progress Breakdown */}
              <div className="flex-1 space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Target Produksi:
                  </span>
                  <span className="font-semibold text-gray-800">{item.targetProduksi.toLocaleString('id-ID')} kg</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                    Aktual Produksi:
                  </span>
                  <span className="font-bold text-emerald-700">{(item.aktualProduksi || 0).toLocaleString('id-ID')} kg</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 pt-1 border-t border-gray-100">
                  <span>Lahan Dibutuhkan:</span>
                  <span className="font-medium text-gray-700">{item.targetLuasLahan} ha</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Realisasi Tanam:</span>
                  <span className="font-medium text-gray-700">{item.realisasiTanam || 0} ha</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Estimasi Panen:</span>
                  <span className="font-medium text-gray-700">{item.estimasiPanen || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Rincian Target */}
      {activeTab === 'rincian' && (
        <div className="space-y-3 text-xs py-2">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200/70 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Target Pasar:</span>
              <span className="font-semibold text-gray-800">Distributor Resmi & Petani Komersial</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Standar Kemurnian:</span>
              <span className="font-semibold text-gray-800">Min. 98.0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Standar Daya Tumbuh:</span>
              <span className="font-semibold text-gray-800">Min. 85.0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Maks Kadar Air:</span>
              <span className="font-semibold text-gray-800">12.0%</span>
            </div>
          </div>
          <div className="p-3 bg-sky-50/60 rounded-lg border border-sky-100 text-sky-800 text-[11px]">
            Target produksi {item.targetProduksi} kg diproyeksikan untuk memenuhi kebutuhan tanam kuartal berikutnya.
          </div>
        </div>
      )}

      {/* Tab: Distribusi Petani */}
      {activeTab === 'petani' && (
        <div className="space-y-2 text-xs py-1">
          {item.petaniDistribusi && item.petaniDistribusi.length > 0 ? (
            item.petaniDistribusi.map((p, idx) => (
              <div key={idx} className="p-2.5 bg-gray-50/80 rounded-lg border border-gray-200/70 text-[11px] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">{p.namaPetani}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    {p.targetProduksi} kg
                  </span>
                </div>
                <div className="text-gray-500 text-[10px] flex justify-between">
                  <span>Lahan: {p.namaLahan || '-'}</span>
                  <span>Luas: {p.luasLahan} ha</span>
                </div>
                {p.tanggalTanam && (
                  <div className="text-[10px] text-gray-400">
                    Tanam: {new Date(p.tanggalTanam).toLocaleDateString('id-ID')}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-6 text-xs">Belum ada data distribusi petani.</p>
          )}
        </div>
      )}

      {/* Tab: Jadwal Tanam */}
      {activeTab === 'jadwal' && (
        <div className="space-y-3 text-xs py-2">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/70 space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-500">Petani Penanggung Jawab:</span>
              <span className="font-bold text-gray-800">{item.namaPetani || 'Slamet Riyadi'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Periode Tanam:</span>
              <span className="font-medium text-gray-700">{item.periode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Perkiraan Panen:</span>
              <span className="font-medium text-gray-700">{item.estimasiPanen || 'Desember 2026'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status Jadwal:</span>
              <span className="font-semibold text-emerald-700">Tersinkronisasi</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Riwayat */}
      {activeTab === 'riwayat' && (
        <div className="space-y-2.5 text-xs py-2">
          <div className="border-l-2 border-emerald-500 pl-3 py-1 space-y-1">
            <p className="font-bold text-gray-800 text-[11px]">Rencana Dibuat</p>
            <p className="text-[10px] text-gray-500">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '01/10/2026'} oleh {item.dibuatOleh || 'Admin'}</p>
          </div>
          <div className="border-l-2 border-sky-500 pl-3 py-1 space-y-1">
            <p className="font-bold text-gray-800 text-[11px]">Status Diubah ke {item.status}</p>
            <p className="text-[10px] text-gray-500">{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('id-ID') : '05/10/2026'} oleh Manager Produksi</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={`grid ${onDelete ? 'grid-cols-4' : 'grid-cols-3'} gap-2 mt-5 pt-3 border-t border-gray-100`}>
        <button
          onClick={() => onEdit(item)}
          className="px-2 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1 transition-colors shadow-xs"
        >
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>Edit</span>
        </button>

        <button
          onClick={() => onCetak(item)}
          className="px-2 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1 transition-colors shadow-xs"
        >
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Cetak</span>
        </button>

        <button
          onClick={() => onViewDetail(item)}
          className="px-2 py-2 text-xs font-semibold text-white bg-[#078836] hover:bg-[#06732e] rounded-lg flex items-center justify-center gap-1 transition-colors shadow-xs"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>Detail</span>
        </button>

        {onDelete && (
          <button
            onClick={() => onDelete(item.id, item.noPerencanaan)}
            className="px-2 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-xs"
            title="Hapus Rencana Produksi"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Hapus</span>
          </button>
        )}
      </div>
    </div>
  );
}
