"use client";
import React from 'react';

interface ModalKomoditasProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  mode: 'add' | 'edit';
  isLoading: boolean;
  formValues: {
    id: string;
    kodeKomoditas: string;
    namaKomoditas: string;
    kategori: string;
    satuanHasil: string;
    deskripsi: string;
    status: 'Aktif' | 'Nonaktif' | 'Tidak Aktif';
  };
  setFormValues: React.Dispatch<React.SetStateAction<{
    id: string;
    kodeKomoditas: string;
    namaKomoditas: string;
    kategori: string;
    satuanHasil: string;
    deskripsi: string;
    status: 'Aktif' | 'Nonaktif' | 'Tidak Aktif';
  }>>;
  kelompokTanamanOptions: { value: string; label: string }[];
  satuanHasilOptions: { value: string; label: string }[];
  onRegenerateCode: () => void;
}

export default function ModalKomoditas({
  isOpen,
  onClose,
  onSubmit,
  mode,
  isLoading,
  formValues,
  setFormValues,
  kelompokTanamanOptions,
  satuanHasilOptions,
  onRegenerateCode,
}: ModalKomoditasProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl border border-emerald-100 shadow-sm flex-shrink-0">
              <i className="ri-leaf-line"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-snug">
                {mode === 'add' ? 'Tambah Komoditas' : 'Ubah Data Komoditas'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Tambahkan data komoditas baru untuk melengkapi master data.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
          >
            <i className="ri-close-line text-xl leading-none"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-4 text-xs">
            {/* Row 1: Kode & Nama */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Kode Komoditas <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={formValues.kodeKomoditas}
                    onChange={(e) => setFormValues(prev => ({ ...prev, kodeKomoditas: e.target.value }))}
                    placeholder="KMD-001"
                    disabled={isLoading}
                    className="w-full pl-3 pr-16 py-2.5 bg-gray-50/70 border border-gray-200 rounded-lg text-xs font-mono font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={onRegenerateCode}
                    title="Generate kode otomatis"
                    className="absolute right-2 px-2 py-1 bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 rounded text-[11px] font-semibold transition-colors shadow-2xs"
                  >
                    Auto
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Nama Komoditas <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formValues.namaKomoditas}
                  onChange={(e) => setFormValues(prev => ({ ...prev, namaKomoditas: e.target.value }))}
                  placeholder="Masukkan nama komoditas"
                  disabled={isLoading}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Row 2: Kelompok Tanaman & Satuan Hasil */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Kelompok Tanaman <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={formValues.kategori}
                    onChange={(e) => setFormValues(prev => ({ ...prev, kategori: e.target.value }))}
                    disabled={isLoading}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 appearance-none pr-9 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer transition-all"
                  >
                    <option value="" disabled>Pilih kelompok tanaman</option>
                    {kelompokTanamanOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                    <i className="ri-arrow-down-s-line"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Satuan Hasil <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={formValues.satuanHasil}
                    onChange={(e) => setFormValues(prev => ({ ...prev, satuanHasil: e.target.value }))}
                    disabled={isLoading}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 appearance-none pr-9 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer transition-all"
                  >
                    <option value="" disabled>Pilih satuan hasil</option>
                    {satuanHasilOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                    <i className="ri-arrow-down-s-line"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Deskripsi */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Deskripsi
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  maxLength={500}
                  value={formValues.deskripsi}
                  onChange={(e) => setFormValues(prev => ({ ...prev, deskripsi: e.target.value }))}
                  placeholder="Masukkan deskripsi komoditas..."
                  disabled={isLoading}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                />
                <span className="absolute right-2.5 bottom-2 text-[10px] text-gray-400">
                  {formValues.deskripsi?.length || 0}/500
                </span>
              </div>
            </div>

            {/* Row 4: Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Status <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="status"
                    value="Aktif"
                    checked={formValues.status === 'Aktif'}
                    onChange={() => setFormValues(prev => ({ ...prev, status: 'Aktif' }))}
                    disabled={isLoading}
                    className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    Aktif
                  </span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="status"
                    value="Nonaktif"
                    checked={formValues.status === 'Nonaktif' || formValues.status === 'Tidak Aktif'}
                    onChange={() => setFormValues(prev => ({ ...prev, status: 'Nonaktif' }))}
                    disabled={isLoading}
                    className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                    Nonaktif
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 px-6 border-t border-gray-100 bg-gray-50/60 flex items-center justify-end gap-3 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors shadow-2xs"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <i className="ri-check-line text-sm"></i>
                  <span>Simpan Komoditas</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
