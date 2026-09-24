"use client";

import React, { useState, useEffect, use, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Seo from '@/shared/layouts-components/seo/seo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { jadwalTanamService } from '@/app/services/jadwalTanamService';
import { JadwalTanam } from '@/app/types/jadwalTanam';

import ModalRevisiJadwal from '../../component/ModalRevisiJadwal';

interface ViewPageProps {
  params: Promise<{ id: string }>;
}

export default function ViewJadwalTanamPage({ params }: ViewPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const id = resolvedParams?.id;

  const [item, setItem] = useState<JadwalTanam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lahan' | 'riwayat' | 'dokumen'>('lahan');
  const [isRevisiModalOpen, setIsRevisiModalOpen] = useState(false);

  const fetchDetail = async () => {
    setIsLoading(true);
    try {
      const res = await jadwalTanamService.getJadwalTanamById(id);
      setItem(res.data);
    } catch (err: any) {
      console.error('Error loading detail:', err);
      toast.error('Gagal memuat detail jadwal tanam');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!item) return;
    try {
      await jadwalTanamService.updateStatusJadwalTanam(item.id, newStatus);
      toast.success(`Status jadwal tanam berhasil diubah menjadi ${newStatus}`);
      fetchDetail();
    } catch (err: any) {
      console.error('Error changing status:', err);
      toast.error(err.response?.data?.message || 'Gagal mengubah status');
    }
  };

  const formatDateDisplay = (dateVal: any) => {
    if (!dateVal) return '-';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return String(dateVal);
    }
  };

  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('setuju') || s === 'disetujui') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          Disetujui
        </span>
      );
    }
    if (s.includes('proses') || s === 'dalam proses') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
          <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7v5l3 3" />
          </svg>
          Dalam Proses
        </span>
      );
    }
    if (s.includes('revisi') || s.includes('ubah')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Revisi
        </span>
      );
    }
    if (s.includes('tolak') || s === 'ditolak') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9l-6 6m0-6l6 6" />
          </svg>
          Ditolak
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-gray-500 font-medium">Memuat rincian jadwal tanam...</span>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-12 text-center">
        <div className="text-sm font-semibold text-rose-600">Jadwal Tanam tidak ditemukan.</div>
        <Link
          href="/produksi/jadwaltanam"
          className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
        >
          Kembali ke Daftar Jadwal
        </Link>
      </div>
    );
  }

  const detailLahanList = item.detailLahan || [];
  const farmerName = item.namaPetani || item.partner?.namaPetani || 'Petani Mandiri';
  const farmerCode = item.kodePetani || item.partner?.kodePetani || 'BTN-001';
  const commodityName = item.komoditas || item.commodity?.namaKomoditas || '-';
  const varietyName = item.varietas || item.variety?.namaVarietas || '-';
  const totalLahanCount = detailLahanList.length > 0 ? detailLahanList.length : 1;
  const totalTargetKg = detailLahanList.reduce((acc, dl) => acc + (Number(dl.targetProduksi) || 0), 0) || item.targetProduksi || 0;

  return (
    <Fragment>
      <Seo title={`Detail Jadwal: ${item.kodeJadwalTanam}`} />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Breadcrumb & Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200/80 pb-4">
          <div>
            <nav className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 mb-1">
              <Link href="/produksi/jadwaltanam" className="hover:underline">
                Produksi
              </Link>
              <span className="text-gray-400">›</span>
              <Link href="/produksi/jadwaltanam" className="hover:underline">
                Jadwal Tanam
              </Link>
              <span className="text-gray-400">›</span>
              <span className="text-gray-800 font-semibold">{item.kodeJadwalTanam}</span>
            </nav>
            <div className="flex items-center gap-3 mt-1">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
                  <span>Detail Jadwal Tanam</span>
                  <span className="font-mono text-emerald-700 font-bold">{item.kodeJadwalTanam}</span>
                </h1>
                <p className="text-xs text-gray-500">
                  Rincian jadwal tanam, alokasi lahan, dokumen, dan riwayat verifikasi.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/produksi/jadwaltanam"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors shadow-2xs"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Kembali</span>
            </Link>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors shadow-2xs"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Cetak</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRevisiModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-xs font-semibold text-amber-900 transition-colors shadow-2xs"
            >
              <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Ajukan Revisi</span>
            </button>

            <Link
              href={`/produksi/jadwaltanam/edit/${item.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#078836] hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Edit Jadwal</span>
            </Link>
          </div>
        </div>

        {/* Top Summary Banner Cards (Directly matching the bottom card in reference image) */}
        <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">No. Jadwal:</span>
              <span className="text-base font-black text-gray-900 font-mono">{item.kodeJadwalTanam}</span>
              <button
                type="button"
                onClick={() => setIsRevisiModalOpen(true)}
                className="cursor-pointer"
                title="Klik untuk membuka Revisi / Info Jadwal"
              >
                {renderStatusBadge(item.statusJadwal)}
              </button>
            </div>

            <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2 sm:gap-3">
              <div>
                Penanggung Jawab:{' '}
                <span className="font-semibold text-emerald-700">
                  {item.penanggungJawab || item.partner?.kelompokTani || '-'}
                </span>
              </div>
              <span className="hidden sm:inline text-gray-300">|</span>
              <div>
                Tanggal Dibuat:{' '}
                <span className="font-semibold text-gray-700">
                  {formatDateDisplay(item.createdAt || new Date('2026-06-08'))} oleh {item.dibuatOleh || 'Admin'}
                </span>
              </div>
            </div>
          </div>

          {/* 4 Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Petani Mitra & PJ */}
            <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-gray-500 block">Petani Mitra</span>
                <div className="text-xs font-bold text-gray-900">{farmerName} ({farmerCode})</div>
                <div className="text-[11px] text-gray-600 font-medium">
                  PJ: <span className="text-emerald-700 font-semibold">{item.penanggungJawab || item.partner?.kelompokTani || '-'}</span>
                </div>
                <div className="text-[10px] text-gray-400">{totalLahanCount} Lahan Terdaftar</div>
              </div>
            </div>

            {/* Periode Tanam */}
            <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-sky-700 flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-gray-500 block">Periode Tanam</span>
                <div className="text-xs font-bold text-gray-900">
                  {formatDateDisplay(item.tanggalTanam || item.periodeTanamMulai)} -{' '}
                  {formatDateDisplay(item.perkiraanPanen || item.periodeTanamSelesai)}
                </div>
                <div className="text-[11px] text-gray-500 font-medium">Siklus: {item.siklusTanamHari || 90} Hari (HST)</div>
              </div>
            </div>

            {/* Komoditas Utama */}
            <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-gray-500 block">Komoditas Utama</span>
                <div className="text-xs font-bold text-gray-900">{commodityName} / {varietyName}</div>
                <div className="text-[11px] text-gray-500 font-medium">{item.metodeTanam || 'Pindah Tanam'}</div>
              </div>
            </div>

            {/* Ringkasan */}
            <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-gray-500 block">Ringkasan Alokasi</span>
                <div className="text-xs font-bold text-gray-900">{totalLahanCount} Lahan / Blok</div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  Target: {totalTargetKg.toLocaleString('id-ID')} kg
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden">
          <div className="flex border-b border-gray-200 px-4 bg-gray-50/60">
            <button
              type="button"
              onClick={() => setActiveTab('lahan')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'lahan'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>Detail Lahan</span>
              <span className="bg-gray-200 text-gray-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {detailLahanList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('riwayat')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'riwayat'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>Riwayat Status</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dokumen')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'dokumen'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>Dokumen</span>
            </button>
          </div>

          {/* Tab 1: Detail Lahan Table (Directly matching the reference bottom table) */}
          {activeTab === 'lahan' && (
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="p-3 w-10 text-center">No.</th>
                    <th className="p-3">Lahan / Blok</th>
                    <th className="p-3">Komoditas / Varietas</th>
                    <th className="p-3">Rencana Tanam</th>
                    <th className="p-3">Estimasi Panen</th>
                    <th className="p-3 text-right">Luas Lahan</th>
                    <th className="p-3 text-right">Target Produksi</th>
                    <th className="p-3">Status Lahan</th>
                    <th className="p-3">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {detailLahanList.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-6 text-center text-gray-500">
                        Tidak ada alokasi detail lahan pada jadwal ini.
                      </td>
                    </tr>
                  ) : (
                    detailLahanList.map((dl, index) => {
                      const isSiap = (dl.statusLahan || '').toLowerCase().includes('siap tanam');
                      return (
                        <tr key={index} className="hover:bg-slate-50/60">
                          <td className="p-3 text-center text-gray-500 font-medium">{index + 1}</td>
                          <td className="p-3 font-semibold text-gray-900">
                            {dl.kodeLahan ? `${dl.kodeLahan} / ` : ''}
                            {dl.namaLahan}
                          </td>
                          <td className="p-3 font-medium text-gray-800">
                            {dl.komoditasVarietas || `${commodityName} / ${varietyName}`}
                          </td>
                          <td className="p-3 text-gray-600">
                            {formatDateDisplay(dl.rencanaTanam || item.tanggalTanam)}
                          </td>
                          <td className="p-3 text-gray-600">
                            {formatDateDisplay(dl.estimasiPanen || item.perkiraanPanen)}
                          </td>
                          <td className="p-3 text-right font-medium text-gray-900">
                            {(Number(dl.luas) || 0).toLocaleString('id-ID')} m²
                          </td>
                          <td className="p-3 text-right font-bold text-emerald-700">
                            {(Number(dl.targetProduksi) || 0).toLocaleString('id-ID')} kg
                          </td>
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                isSiap
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isSiap ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                              ></span>
                              {dl.statusLahan || 'Siap Tanam'}
                            </span>
                          </td>
                          <td className="p-3 text-gray-500 max-w-xs">{dl.keterangan || '-'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Riwayat Status & Log */}
          {activeTab === 'riwayat' && (
            <div className="p-6 space-y-4">
              <div className="relative pl-6 border-l-2 border-emerald-500 space-y-6">
                <div>
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-emerald-600"></div>
                  <div className="text-xs font-bold text-gray-900">Status Saat Ini: {item.statusJadwal}</div>
                  <div className="text-[11px] text-gray-500">
                    Diperbarui oleh {item.diubahOleh || 'Admin'} pada{' '}
                    {formatDateDisplay(item.updatedAt || item.createdAt)}
                  </div>
                  {item.keterangan && item.keterangan !== '-' && (
                    <div className="mt-1 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      Catatan: {item.keterangan}
                    </div>
                  )}
                </div>

                <div>
                  <div className="absolute -left-1.5 top-16 w-3 h-3 rounded-full bg-gray-400"></div>
                  <div className="text-xs font-bold text-gray-700">Dibuat Pertama Kali</div>
                  <div className="text-[11px] text-gray-500">
                    Dibuat oleh {item.dibuatOleh || 'Admin'} pada {formatDateDisplay(item.createdAt)}
                  </div>
                </div>
              </div>

              {/* Quick status actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-600">Ubah Status Cepat:</span>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Disetujui')}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold border border-emerald-200 transition-colors"
                >
                  Setujui Jadwal
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Dalam Proses')}
                  className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-semibold border border-sky-200 transition-colors"
                >
                  Kembalikan ke Proses
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Revisi')}
                  className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-semibold border border-amber-200 transition-colors"
                >
                  Minta Revisi
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Ditolak')}
                  className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold border border-rose-200 transition-colors"
                >
                  Tolak Jadwal
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Dokumen */}
          {activeTab === 'dokumen' && (
            <div className="p-6">
              {item.dokumen && item.dokumen.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {item.dokumen.map((doc, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-gray-200 bg-gray-50/60 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <div className="text-xs font-semibold text-gray-800">{doc.nama}</div>
                          <div className="text-[10px] text-gray-400">{doc.fileType || 'PDF Document'}</div>
                        </div>
                      </div>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-emerald-700 hover:underline"
                      >
                        Buka
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 text-xs">
                  Tidak ada dokumen terlampir pada jadwal tanam ini.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Revisi Jadwal Tanam */}
      <ModalRevisiJadwal
        isOpen={isRevisiModalOpen}
        onClose={() => setIsRevisiModalOpen(false)}
        item={item}
        onSuccess={() => {
          if (id) {
            jadwalTanamService.getJadwalTanamById(id).then((res) => {
              if (res.data) setItem(res.data);
            });
          }
        }}
      />
    </Fragment>
  );
}

