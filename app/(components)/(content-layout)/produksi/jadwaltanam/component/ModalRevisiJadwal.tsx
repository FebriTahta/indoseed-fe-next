'use client';

import React, { useState, useEffect, useRef } from 'react';
import { JadwalTanam } from '@/app/types/jadwalTanam';
import jadwalTanamService from '@/app/services/jadwalTanamService';
import { toast } from 'react-toastify';

interface ModalRevisiJadwalProps {
  isOpen: boolean;
  onClose: () => void;
  item: JadwalTanam | null;
  onSuccess?: () => void;
  availableItems?: JadwalTanam[];
}

export default function ModalRevisiJadwal({
  isOpen,
  onClose,
  item: initialItem,
  onSuccess,
  availableItems = [],
}: ModalRevisiJadwalProps) {
  const [selectedItem, setSelectedItem] = useState<JadwalTanam | null>(initialItem);

  // Form states
  const [tanggalTanamBaru, setTanggalTanamBaru] = useState<string>('2026-10-14');
  const [estimasiPanenBaru, setEstimasiPanenBaru] = useState<string>('2026-11-24');
  const [hitungOtomatis, setHitungOtomatis] = useState<boolean>(true);
  const [alasanRevisi, setAlasanRevisi] = useState<string>('Kondisi lahan belum siap untuk ditanami.');
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    file?: File;
  } | null>({
    name: 'foto_lahan_belum_siap.jpg',
    size: '2.4 MB',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const plantDateInputRef = useRef<HTMLInputElement>(null);
  const harvestDateInputRef = useRef<HTMLInputElement>(null);

  // Update selectedItem when initialItem changes or when modal opens
  useEffect(() => {
    if (initialItem) {
      setSelectedItem(initialItem);
    } else if (availableItems.length > 0 && !selectedItem) {
      setSelectedItem(availableItems[0]);
    }
  }, [initialItem, availableItems, isOpen]);

  // When selectedItem changes, initialize form fields
  useEffect(() => {
    if (selectedItem) {
      const currentPlant = selectedItem.tanggalTanam || selectedItem.periodeTanamMulai;
      if (currentPlant) {
        const d = new Date(currentPlant);
        if (!isNaN(d.getTime())) {
          setTanggalTanamBaru(d.toISOString().split('T')[0]);
        }
      } else {
        setTanggalTanamBaru('2026-10-14');
      }

      const currentHarvest = selectedItem.perkiraanPanen || selectedItem.periodeTanamSelesai;
      if (currentHarvest) {
        const d = new Date(currentHarvest);
        if (!isNaN(d.getTime())) {
          setEstimasiPanenBaru(d.toISOString().split('T')[0]);
        }
      } else {
        setEstimasiPanenBaru('2026-11-24');
      }

      if (selectedItem.keterangan && selectedItem.keterangan !== '-') {
        setAlasanRevisi(selectedItem.keterangan);
      } else {
        setAlasanRevisi('Kondisi lahan belum siap untuk ditanami.');
      }
    }
  }, [selectedItem]);

  // Helper calculate harvest date based on plant date + days
  const getVarietyDurationDays = (item: JadwalTanam | null): number => {
    if (!item) return 40;
    if (item.siklusTanamHari && item.siklusTanamHari > 0) return item.siklusTanamHari;
    const komoditas = (item.komoditas || '').toLowerCase();
    if (komoditas.includes('kangkung')) return 40;
    if (komoditas.includes('tomat')) return 90;
    if (komoditas.includes('melon')) return 90;
    if (komoditas.includes('cabai') || komoditas.includes('cabe')) return 120;
    if (komoditas.includes('padi')) return 90;
    return 40;
  };

  // Handle Plant Date Change
  const handlePlantDateChange = (newDateStr: string) => {
    setTanggalTanamBaru(newDateStr);
    if (hitungOtomatis && newDateStr) {
      const d = new Date(newDateStr);
      if (!isNaN(d.getTime())) {
        const days = getVarietyDurationDays(selectedItem);
        d.setDate(d.getDate() + days);
        setEstimasiPanenBaru(d.toISOString().split('T')[0]);
      }
    }
  };

  // Helper date formatters
  const formatDateIndo = (dateVal?: string | Date | null) => {
    if (!dateVal) return '-';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '-';
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const formatDateShort = (dateVal?: string | Date | null) => {
    if (!dateVal) return '-';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '-';
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setUploadedFile({
      name: file.name,
      size: `${sizeInMb} MB`,
      file,
    });
  };

  // Submit revision
  const handleSubmitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) {
      toast.error('Silakan pilih jadwal tanam yang akan direvisi');
      return;
    }

    if (!tanggalTanamBaru) {
      toast.error('Tanggal tanam baru wajib diisi');
      return;
    }

    if (!estimasiPanenBaru) {
      toast.error('Estimasi panen baru wajib diisi');
      return;
    }

    if (!alasanRevisi.trim()) {
      toast.error('Alasan revisi wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      await jadwalTanamService.updateJadwalTanams(selectedItem.id, {
        statusJadwal: 'Revisi',
        keterangan: alasanRevisi,
        tanggalTanam: tanggalTanamBaru,
        perkiraanPanen: estimasiPanenBaru,
      });

      toast.success(`Pengajuan revisi jadwal ${selectedItem.kodeJadwalTanam} berhasil dikirim!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error submitting revision:', err);
      toast.error(err.response?.data?.message || 'Gagal mengajukan revisi jadwal tanam');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Values display
  const kodeJadwal = selectedItem?.kodeJadwalTanam || 'JT-2026-011';
  const noPerencanaan = selectedItem?.perencanaanProduksi?.noPerencanaan || 'PP-2026-001';
  const komoditas = selectedItem?.komoditas || selectedItem?.commodity?.namaKomoditas || 'Kangkung';
  const varietas = selectedItem?.varietas || selectedItem?.variety?.namaVarietas || 'Super Sempit';
  const namaPetani = selectedItem?.namaPetani || selectedItem?.partner?.namaPetani || 'Budi Santoso';
  const namaLahan =
    selectedItem?.greenhouse?.namaLahan ||
    selectedItem?.detailLahan?.[0]?.namaLahan ||
    'Lahan A';
  const luasFormatted = `${(Number(selectedItem?.luasTanam) || 1).toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} Ha`;
  const currentStatus = selectedItem?.statusJadwal || 'Disetujui';

  const tglTanamAwal = selectedItem?.tanggalTanam || selectedItem?.periodeTanamMulai || '2026-10-10';
  const tglPanenAwal = selectedItem?.perkiraanPanen || selectedItem?.periodeTanamSelesai || '2026-11-20';

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Center Container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div
          className="relative w-full max-w-5xl rounded-xl bg-white shadow-2xl overflow-hidden border border-gray-100 text-left my-4 transition-all"
          style={{ borderRadius: '16px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg bg-emerald-50 text-[#078836] flex items-center justify-center border border-emerald-100 shrink-0"
                style={{ borderRadius: '10px' }}
              >
                {/* Sprout Leaf SVG Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 20h10" />
                  <path d="M10 20c5.5-2.5.8-6.4 3-10" />
                  <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4.1 5.5.8z" />
                  <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4.1 1-4.9 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-tight m-0">
                  Revisi Jadwal Tanam
                </h2>
                <p className="text-xs text-gray-500 m-0 mt-0.5">
                  Ajukan perubahan jadwal tanam yang sudah disetujui. Data lama tetap tersimpan sebagai riwayat.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors text-lg"
              title="Tutup"
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto bg-[#f8fafc]/60">
            {/* Notice Alert Banner */}
            <div
              className="flex items-center gap-2.5 px-4 py-3 bg-[#f0f7ff] border border-[#cce3fe] text-[#1e40af] rounded-lg text-xs"
              style={{ borderRadius: '10px' }}
            >
              <svg className="w-4 h-4 text-[#2563eb] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-xs">
                Perubahan jadwal akan memerlukan persetujuan dari pihak terkait. Setelah disetujui, jadwal aktif akan diperbarui.
              </span>
            </div>

            {/* 2-Column Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column (Forms & Details) - 8 Cols */}
              <div className="lg:col-span-8 space-y-4">
                {/* Card 1: Informasi Jadwal Tanam */}
                <div
                  className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-sm space-y-3"
                  style={{ borderRadius: '12px' }}
                >
                  <div className="flex items-center gap-2 text-[#078836]">
                    <svg className="w-4 h-4 text-[#078836]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-xs font-bold text-gray-900 m-0">Informasi Jadwal Tanam</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* No. Jadwal Tanam */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">No. Jadwal Tanam</label>
                      {availableItems.length > 1 && !initialItem ? (
                        <select
                          value={selectedItem?.id || ''}
                          onChange={(e) => {
                            const f = availableItems.find((x) => x.id === e.target.value);
                            if (f) setSelectedItem(f);
                          }}
                          className="w-full px-2.5 py-1.5 bg-[#f8fafc] border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 outline-none"
                          style={{ borderRadius: '8px' }}
                        >
                          {availableItems.map((ai) => (
                            <option key={ai.id} value={ai.id}>
                              {ai.kodeJadwalTanam} - {ai.komoditas}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div
                          className="px-2.5 py-1.5 bg-[#f8fafc] border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 font-mono"
                          style={{ borderRadius: '8px' }}
                        >
                          {kodeJadwal}
                        </div>
                      )}
                    </div>

                    {/* No. Perencanaan */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">No. Perencanaan</label>
                      <div
                        className="px-2.5 py-1.5 bg-[#f8fafc] border border-gray-200 rounded-lg text-xs text-gray-800 font-mono"
                        style={{ borderRadius: '8px' }}
                      >
                        {noPerencanaan}
                      </div>
                    </div>

                    {/* Komoditas */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Komoditas</label>
                      <div
                        className="px-2.5 py-1.5 bg-[#f8fafc] border border-gray-200 rounded-lg text-xs text-gray-800"
                        style={{ borderRadius: '8px' }}
                      >
                        {komoditas}
                      </div>
                    </div>

                    {/* Varietas */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Varietas</label>
                      <div
                        className="px-2.5 py-1.5 bg-[#f8fafc] border border-gray-200 rounded-lg text-xs text-gray-800 truncate"
                        style={{ borderRadius: '8px' }}
                      >
                        {varietas}
                      </div>
                    </div>

                    {/* Petani */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Petani</label>
                      <div
                        className="px-2.5 py-1.5 bg-[#f8fafc] border border-gray-200 rounded-lg text-xs text-gray-800 truncate"
                        style={{ borderRadius: '8px' }}
                      >
                        {namaPetani}
                      </div>
                    </div>

                    {/* Lahan */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Lahan</label>
                      <div
                        className="px-2.5 py-1.5 bg-[#f8fafc] border border-gray-200 rounded-lg text-xs text-gray-800"
                        style={{ borderRadius: '8px' }}
                      >
                        {namaLahan}
                      </div>
                    </div>

                    {/* Luas Tanam */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Luas Tanam</label>
                      <div
                        className="px-2.5 py-1.5 bg-[#f8fafc] border border-gray-200 rounded-lg text-xs text-gray-800"
                        style={{ borderRadius: '8px' }}
                      >
                        {luasFormatted}
                      </div>
                    </div>

                    {/* Status Saat Ini */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Status Saat Ini</label>
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-xs font-semibold text-[#15803d] w-full justify-center"
                        style={{ borderRadius: '8px' }}
                      >
                        <span className="text-xs">✓</span>
                        <span>{currentStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Jadwal Tanam (Rencana Awal vs Revisi) */}
                <div
                  className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-sm space-y-3"
                  style={{ borderRadius: '12px' }}
                >
                  <div className="flex items-center gap-2 text-[#078836]">
                    <svg className="w-4 h-4 text-[#078836]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-xs font-bold text-gray-900 m-0">Jadwal Tanam</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Left Sub-Col: Rencana Awal */}
                    <div
                      className="bg-[#f8fafc] rounded-xl p-3.5 border border-gray-200/80 space-y-3"
                      style={{ borderRadius: '10px' }}
                    >
                      <div className="text-xs">
                        <span className="font-bold text-gray-800">Rencana Awal</span>{' '}
                        <span className="text-gray-400 font-normal">(Data yang sudah disetujui)</span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Tanggal Tanam</label>
                        <div
                          className="flex items-center gap-2.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 shadow-xs"
                          style={{ borderRadius: '8px' }}
                        >
                          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">{formatDateIndo(tglTanamAwal)}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Estimasi Panen</label>
                        <div
                          className="flex items-center gap-2.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 shadow-xs"
                          style={{ borderRadius: '8px' }}
                        >
                          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">{formatDateIndo(tglPanenAwal)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Sub-Col: Revisi Baru */}
                    <div
                      className="bg-[#f0fdf4]/50 rounded-xl p-3.5 border border-emerald-200/80 space-y-3"
                      style={{ borderRadius: '10px' }}
                    >
                      <div className="text-xs">
                        <span className="font-bold text-[#078836]">Revisi</span>{' '}
                        <span className="text-gray-400 font-normal">(Data yang akan diajukan)</span>
                      </div>

                      {/* Tanggal Tanam Baru */}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Tanggal Tanam Baru <span className="text-red-500">*</span>
                        </label>
                        <div
                          onClick={() => plantDateInputRef.current?.showPicker?.()}
                          className="relative flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 shadow-xs cursor-pointer hover:border-emerald-500 transition-colors"
                          style={{ borderRadius: '8px' }}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">
                              {tanggalTanamBaru ? formatDateIndo(tanggalTanamBaru) : 'Pilih tanggal tanam'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {tanggalTanamBaru && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTanggalTanamBaru('');
                                }}
                                className="text-gray-400 hover:text-gray-600 p-0.5 text-xs rounded hover:bg-gray-100"
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          {/* Hidden actual date input */}
                          <input
                            ref={plantDateInputRef}
                            type="date"
                            value={tanggalTanamBaru}
                            onChange={(e) => handlePlantDateChange(e.target.value)}
                            className="sr-only"
                          />
                        </div>
                      </div>

                      {/* Estimasi Panen Baru */}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Estimasi Panen Baru <span className="text-red-500">*</span>
                        </label>
                        <div
                          onClick={() => harvestDateInputRef.current?.showPicker?.()}
                          className="relative flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 shadow-xs cursor-pointer hover:border-emerald-500 transition-colors"
                          style={{ borderRadius: '8px' }}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">
                              {estimasiPanenBaru ? formatDateIndo(estimasiPanenBaru) : 'Pilih estimasi panen'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {estimasiPanenBaru && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEstimasiPanenBaru('');
                                }}
                                className="text-gray-400 hover:text-gray-600 p-0.5 text-xs rounded hover:bg-gray-100"
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          {/* Hidden actual date input */}
                          <input
                            ref={harvestDateInputRef}
                            type="date"
                            value={estimasiPanenBaru}
                            onChange={(e) => setEstimasiPanenBaru(e.target.value)}
                            className="sr-only"
                          />
                        </div>
                      </div>

                      {/* Checkbox auto calculate */}
                      <div className="pt-0.5 flex items-center gap-1.5">
                        <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={hitungOtomatis}
                            onChange={(e) => setHitungOtomatis(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                          <span>Hitung otomatis berdasarkan umur varietas</span>
                        </label>
                        <span
                          className="w-4 h-4 rounded-full bg-gray-100 text-gray-500 text-[10px] inline-flex items-center justify-center cursor-pointer font-bold"
                          title={`Umur varietas ${varietas}: ${getVarietyDurationDays(selectedItem)} hari`}
                        >
                          i
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Alasan Revisi */}
                <div
                  className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-sm space-y-3"
                  style={{ borderRadius: '12px' }}
                >
                  <div className="flex items-center gap-2 text-[#078836]">
                    <svg className="w-4 h-4 text-[#078836]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-xs font-bold text-gray-900 m-0">Alasan Revisi</h3>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Alasan Revisi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={alasanRevisi}
                      onChange={(e) => setAlasanRevisi(e.target.value)}
                      placeholder="Kondisi lahan belum siap untuk ditanami."
                      className="w-full p-2.5 text-xs text-gray-800 bg-white border border-gray-300 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none shadow-xs"
                      style={{ borderRadius: '8px' }}
                    />
                    <div className="text-right text-[10px] text-gray-400 mt-0.5 font-mono">
                      {alasanRevisi.length}/500
                    </div>
                  </div>

                  {/* Sub-section: Lampiran / Bukti */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span>Lampiran / Bukti</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      {/* Drag & Drop Upload Dropzone */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-xl p-3.5 text-center cursor-pointer transition-colors bg-[#f8fafc] hover:bg-emerald-50/20 flex flex-col items-center justify-center gap-1"
                        style={{ borderRadius: '10px' }}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                        />
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="text-xs font-semibold text-[#078836]">
                          Klik untuk upload atau tarik file ke sini
                        </div>
                        <div className="text-[10px] text-gray-400">Format: PDF, JPG, PNG (Max 5MB)</div>
                      </div>

                      {/* Uploaded File Preview Card */}
                      {uploadedFile ? (
                        <div
                          className="border border-gray-200 bg-white rounded-xl p-3 flex items-center justify-between shadow-xs"
                          style={{ borderRadius: '10px' }}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div
                              className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100"
                              style={{ borderRadius: '8px' }}
                            >
                              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="overflow-hidden">
                              <div className="text-xs font-semibold text-gray-800 truncate" title={uploadedFile.name}>
                                {uploadedFile.name}
                              </div>
                              <div className="text-[10px] text-gray-400">{uploadedFile.size}</div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setUploadedFile(null)}
                            className="text-gray-400 hover:text-red-500 p-1 transition-colors text-xs"
                            title="Hapus Lampiran"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div
                          className="border border-gray-100 bg-[#f8fafc] rounded-xl p-4 text-center text-gray-400 text-xs flex items-center justify-center"
                          style={{ borderRadius: '10px' }}
                        >
                          Belum ada bukti lampiran yang dipilih.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (Riwayat Jadwal Tanam Timeline) - 4 Cols */}
              <div className="lg:col-span-4">
                <div
                  className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-sm space-y-4 h-full flex flex-col"
                  style={{ borderRadius: '12px' }}
                >
                  <div className="flex items-center gap-2 text-[#078836]">
                    <svg className="w-4 h-4 text-[#078836]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xs font-bold text-gray-900 m-0">Riwayat Jadwal Tanam</h3>
                  </div>

                  {/* Top Green Banner: Jadwal Aktif */}
                  <div
                    className="p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] space-y-1"
                    style={{ borderRadius: '10px' }}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#166534]">
                      <span className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                      <span>Jadwal Aktif</span>
                    </div>
                    <div className="text-[11px] text-[#15803d] font-medium pl-5 leading-relaxed">
                      Tanggal Tanam: <span className="font-semibold">{formatDateShort(tglTanamAwal)}</span> | Est. Panen:{' '}
                      <span className="font-semibold">{formatDateShort(tglPanenAwal)}</span>
                    </div>
                  </div>

                  {/* Vertical Timeline Steps */}
                  <div className="relative border-l-2 border-gray-200 ml-3 pl-5 space-y-4 flex-1 pt-1 pb-1">
                    {/* Step 1: Revisi #1 (Menunggu Persetujuan) */}
                    <div className="relative">
                      {/* Node Icon */}
                      <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-[#3b82f6] ring-4 ring-white" />
                      
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="text-xs font-bold text-gray-900">
                            Revisi #1 <span className="text-[10px] text-gray-400 font-normal">(Menunggu Persetujuan)</span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#92400e] bg-[#fef3c7] px-2 py-0.5 rounded-full">
                            ↓ Menunggu Persetujuan
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400">12 Okt 2026 09:15</div>

                        {/* Details Box */}
                        <div
                          className="p-2.5 bg-[#f8fafc] rounded-lg text-[11px] text-gray-600 space-y-1 border border-gray-100"
                          style={{ borderRadius: '8px' }}
                        >
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tanggal Tanam:</span>
                            <span className="font-semibold text-gray-800">14 Okt 2026</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Estimasi Panen:</span>
                            <span className="font-semibold text-gray-800">24 Nov 2026</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Alasan Revisi:</span>
                            <span className="font-semibold text-gray-800 text-right truncate max-w-[140px]">
                              {selectedItem?.keterangan || 'Kondisi lahan belum siap.'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Diajukan oleh:</span>
                            <span className="font-semibold text-gray-800">{selectedItem?.diubahOleh || 'Petugas Produksi'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Disetujui */}
                    <div className="relative">
                      {/* Node Icon */}
                      <div className="absolute -left-[29px] top-0.5 w-4.5 h-4.5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[10px] ring-4 ring-white">
                        ✓
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900">Disetujui</span>
                          <span className="text-[10px] text-gray-400">10 Okt 2026 13:40</span>
                        </div>

                        {/* Details Box */}
                        <div
                          className="p-2.5 bg-[#f8fafc] rounded-lg text-[11px] text-gray-600 space-y-1 border border-gray-100"
                          style={{ borderRadius: '8px' }}
                        >
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tanggal Tanam:</span>
                            <span className="font-semibold text-gray-800">{formatDateShort(tglTanamAwal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Estimasi Panen:</span>
                            <span className="font-semibold text-gray-800">{formatDateShort(tglPanenAwal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Diajukan oleh:</span>
                            <span className="font-semibold text-gray-800">Supervisor Produksi</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Disetujui oleh:</span>
                            <span className="font-semibold text-gray-800">Manager Produksi</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Dibuat */}
                    <div className="relative">
                      {/* Node Icon */}
                      <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-gray-300 ring-4 ring-white" />

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900">Dibuat</span>
                          <span className="text-[10px] text-gray-400">
                            {selectedItem?.createdAt
                              ? formatDateShort(selectedItem.createdAt)
                              : '01 Okt 2026 08:12'}
                          </span>
                        </div>

                        {/* Details Box */}
                        <div
                          className="p-2.5 bg-[#f8fafc] rounded-lg text-[11px] text-gray-600 space-y-1 border border-gray-100"
                          style={{ borderRadius: '8px' }}
                        >
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tanggal Tanam:</span>
                            <span className="font-semibold text-gray-800">{formatDateShort(tglTanamAwal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Estimasi Panen:</span>
                            <span className="font-semibold text-gray-800">{formatDateShort(tglPanenAwal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Dibuat oleh:</span>
                            <span className="font-semibold text-gray-800">{selectedItem?.dibuatOleh || 'Petugas Produksi'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-gray-100 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors shadow-xs disabled:opacity-50"
              style={{ borderRadius: '8px' }}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmitRevision}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-[#078836] hover:bg-[#06732e] text-white text-xs font-semibold transition-colors shadow-xs disabled:opacity-50"
              style={{ borderRadius: '8px' }}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Ajukan Revisi</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
