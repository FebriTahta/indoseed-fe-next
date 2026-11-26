'use client';

import React, { useState } from 'react';
import { PersetujuanProduksi } from '@/app/types/persetujuanProduksi';

interface ModalDetailPersetujuanProps {
  isOpen: boolean;
  onClose: () => void;
  item: PersetujuanProduksi | null;
  onApprove: (id: string, catatan?: string) => Promise<boolean>;
  onReject: (id: string, alasan: string) => Promise<boolean>;
}

export default function ModalDetailPersetujuan({
  isOpen,
  onClose,
  item,
  onApprove,
  onReject,
}: ModalDetailPersetujuanProps) {
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [alasanPenolakan, setAlasanPenolakan] = useState<string>('');
  const [submittingAction, setSubmittingAction] = useState<boolean>(false);

  if (!isOpen || !item) return null;

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

  const formatDateTimeDisplay = (dateVal: any) => {
    if (!dateVal) return '-';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      const dateStr = d.toLocaleDateString('id-ID', {
        day: '2-digit',
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

  const handleApproveClick = async () => {
    setSubmittingAction(true);
    const success = await onApprove(item.id, 'Disetujui oleh Manager Produksi');
    setSubmittingAction(false);
    if (success) {
      onClose();
    }
  };

  const handleConfirmReject = async () => {
    if (!alasanPenolakan.trim()) {
      alert('Mohon masukkan alasan penolakan.');
      return;
    }
    setSubmittingAction(true);
    const success = await onReject(item.id, alasanPenolakan.trim());
    setSubmittingAction(false);
    if (success) {
      setIsRejecting(false);
      setAlasanPenolakan('');
      onClose();
    }
  };

  const prevData = item.dataSebelumnya || {
    tanggalTanam: item.jadwalTanam?.tanggalTanam || '2026-10-10',
    estimasiPanen: item.jadwalTanam?.perkiraanPanen || '2026-11-20',
    luasTanam: item.jadwalTanam?.luasTanam || 1.0,
    petani: item.jadwalTanam?.namaPetani || 'Budi Santoso',
    lahan: item.jadwalTanam?.detailLahan?.[0]?.namaLahan || 'Lahan A',
  };

  const reqData = item.dataPengajuan || {
    tanggalTanam: item.jadwalTanam?.tanggalTanam || '2026-10-14',
    estimasiPanen: item.jadwalTanam?.perkiraanPanen || '2026-11-24',
    luasTanam: item.jadwalTanam?.luasTanam || 1.0,
    petani: item.jadwalTanam?.namaPetani || 'Budi Santoso',
    lahan: item.jadwalTanam?.detailLahan?.[0]?.namaLahan || 'Lahan A',
  };

  const statusLower = (item.status || '').toLowerCase();
  const isPending = statusLower === 'proses' || statusLower === 'menunggu';
  const isApproved = statusLower === 'disetujui';
  const isRejected = statusLower === 'ditolak';

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-5 text-center">
        <div
          className="relative w-full max-w-3xl rounded-2xl bg-white text-left shadow-2xl overflow-hidden border border-gray-100 my-6 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Top Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">📋</span>
              <h2 className="text-sm sm:text-base font-bold text-gray-800 m-0">
                Detail Pengajuan Persetujuan
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors"
            >
              <span>←</span>
              <span>Kembali</span>
            </button>
          </div>

          {/* Modal Content Scrollable Area */}
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto bg-[#fafbfc]">
            {/* Header Identity Card */}
            <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Green Leaf Circle Icon */}
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-gray-900 tracking-tight">
                      {item.noPengajuan}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      {item.jenis}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5 font-medium">{item.judul}</div>
                </div>
              </div>

              {/* Status Badge & Submitted Date */}
              <div className="text-left sm:text-right space-y-1">
                <div>
                  {isPending && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Menunggu Persetujuan
                    </span>
                  )}
                  {isApproved && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Disetujui
                    </span>
                  )}
                  {isRejected && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      Ditolak
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-400">
                  Diajukan pada {formatDateTimeDisplay(item.tanggalPengajuan)}
                </div>
              </div>
            </div>

            {/* Section 1: Comparison Cards (Data Sebelumnya vs Data Revisi) */}
            <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-bold text-gray-900">Perubahan Jadwal Tanam</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                  Revisi #1
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Left Card: Data Sebelumnya (Jadwal Aktif) */}
                <div className="p-3.5 rounded-xl bg-gray-50/90 border border-gray-200/70 space-y-2.5">
                  <div className="text-xs font-semibold text-gray-600 mb-2">
                    Data Sebelumnya <span className="text-gray-400 font-normal">(Jadwal Aktif)</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <span>📅</span> Tanggal Tanam
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatDateDisplay(prevData.tanggalTanam)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <span>📅</span> Estimasi Panen
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatDateDisplay(prevData.estimasiPanen)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <span>📏</span> Luas Tanam
                    </span>
                    <span className="font-semibold text-gray-800">
                      {Number(prevData.luasTanam || 1).toLocaleString('id-ID', { minimumFractionDigits: 2 })} Ha
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <span>👤</span> Petani
                    </span>
                    <span className="font-semibold text-gray-800 truncate max-w-[140px]" title={prevData.petani}>
                      {prevData.petani}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <span>📍</span> Lahan
                    </span>
                    <span className="font-semibold text-gray-800 truncate max-w-[140px]" title={prevData.lahan}>
                      {prevData.lahan}
                    </span>
                  </div>
                </div>

                {/* Right Card: Data Revisi */}
                <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/70 space-y-2.5">
                  <div className="text-xs font-semibold text-emerald-800 mb-2">
                    Data Revisi
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 flex items-center gap-1.5">
                      <span>📅</span> Tanggal Tanam
                    </span>
                    <span className="font-bold text-gray-900">
                      {formatDateDisplay(reqData.tanggalTanam)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 flex items-center gap-1.5">
                      <span>📅</span> Estimasi Panen
                    </span>
                    <span className="font-bold text-gray-900">
                      {formatDateDisplay(reqData.estimasiPanen)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 flex items-center gap-1.5">
                      <span>📏</span> Luas Tanam
                    </span>
                    <span className="font-bold text-gray-900">
                      {Number(reqData.luasTanam || 1).toLocaleString('id-ID', { minimumFractionDigits: 2 })} Ha
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 flex items-center gap-1.5">
                      <span>👤</span> Petani
                    </span>
                    <span className="font-bold text-gray-900 truncate max-w-[140px]" title={reqData.petani}>
                      {reqData.petani}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 flex items-center gap-1.5">
                      <span>📍</span> Lahan
                    </span>
                    <span className="font-bold text-gray-900 truncate max-w-[140px]" title={reqData.lahan}>
                      {reqData.lahan}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Alasan Revisi */}
            <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-[#b45309] text-xs font-bold">
                <span className="text-sm">📋</span>
                <span>Alasan Revisi</span>
              </div>
              <p className="text-xs text-[#92400e] leading-relaxed pl-5 font-medium m-0">
                {item.alasanRevisi || 'Kondisi lahan belum siap untuk ditanami.'}
              </p>
            </div>

            {/* Section 3: Lampiran / Bukti */}
            <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span className="text-xs font-bold text-gray-900">Lampiran / Bukti</span>
              </div>

              <div className="border border-gray-200 bg-gray-50/50 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-gray-800 truncate" title={item.lampiranFile || 'foto_lahan_belum_siap.jpg'}>
                      {item.lampiranFile || 'foto_lahan_belum_siap.jpg'}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      {item.lampiranSize || '2.4 MB'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Mengunduh ${item.lampiranFile || 'foto_lahan_belum_siap.jpg'}`)}
                  className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-colors shadow-2xs"
                  title="Unduh Lampiran"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Section 4: Riwayat Pengajuan (Workflow Timeline) */}
            <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-xs font-bold text-gray-900">Riwayat Pengajuan</span>
              </div>

              <div className="relative border-l-2 border-gray-200 ml-3 pl-5 space-y-4 pt-1">
                {/* Step 1: Pengajuan Revisi */}
                <div className="relative">
                  <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">Pengajuan Revisi</span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {formatDateTimeDisplay(item.tanggalPengajuan)}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      👤 {item.pengaju || 'Petugas Produksi'}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Mengajukan revisi jadwal tanam.
                    </div>
                  </div>
                </div>

                {/* Step 2: Verifikasi */}
                <div className="relative">
                  <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">Verifikasi</span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {formatDateTimeDisplay(item.updatedAt)}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      👤 Supervisor Produksi
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Data telah diverifikasi, menunggu persetujuan.
                    </div>
                  </div>
                </div>

                {/* Step 3: Persetujuan */}
                <div className="relative">
                  <div
                    className={`absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full ring-4 ring-white ${
                      isApproved
                        ? 'bg-emerald-600'
                        : isRejected
                        ? 'bg-rose-600'
                        : 'bg-amber-500'
                    }`}
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">Persetujuan</span>
                      {isPending && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Menunggu
                        </span>
                      )}
                      {isApproved && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Disetujui
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Ditolak
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      👤 {item.disetujuiOleh || 'Manager Produksi'}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {item.catatanReview ||
                        (isApproved
                          ? 'Pengajuan telah disetujui.'
                          : isRejected
                          ? 'Pengajuan ditolak.'
                          : 'Menunggu keputusan persetujuan.')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rejection Prompt Box if toggled */}
            {isRejecting && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                <label className="block text-xs font-bold text-rose-900">
                  Alasan Penolakan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={alasanPenolakan}
                  onChange={(e) => setAlasanPenolakan(e.target.value)}
                  placeholder="Contoh: Dokumen atau lahan belum memenuhi standar mutu..."
                  className="w-full p-2 text-xs rounded-lg border border-rose-300 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsRejecting(false)}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={submittingAction}
                    onClick={handleConfirmReject}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-50"
                  >
                    {submittingAction ? 'Memproses...' : 'Konfirmasi Tolak'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions Bar */}
          <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-end gap-3">
            {isPending && !isRejecting && (
              <>
                <button
                  type="button"
                  onClick={() => setIsRejecting(true)}
                  disabled={submittingAction}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-rose-300 bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors shadow-2xs"
                >
                  <span>✕</span>
                  <span>Tolak Pengajuan</span>
                </button>

                <button
                  type="button"
                  onClick={handleApproveClick}
                  disabled={submittingAction}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#078836] hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <span>✓</span>
                  <span>{submittingAction ? 'Memproses...' : 'Setujui Revisi'}</span>
                </button>
              </>
            )}

            {!isPending && (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold"
              >
                Tutup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
