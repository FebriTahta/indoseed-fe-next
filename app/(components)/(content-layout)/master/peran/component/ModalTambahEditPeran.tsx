"use client";

import React from 'react';
import { PeranFormValues } from '@/app/types/peran';

interface ModalTambahEditPeranProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode: 'create' | 'edit';
  formValues: PeranFormValues;
  setFormValues: React.Dispatch<React.SetStateAction<PeranFormValues>>;
  formErrors: { [key: string]: string };
  isSubmitLoading: boolean;
  onSave: (e?: React.FormEvent) => void;
  onFetchNextKode: () => void;
}

const KATEGORI_OPTIONS = [
  'Manajerial',
  'Operasional',
  'Quality Control',
  'Logistik',
  'Administrasi',
  'Lainnya',
];

export default function ModalTambahEditPeran({
  isOpen,
  onClose,
  modalMode,
  formValues,
  setFormValues,
  formErrors,
  isSubmitLoading,
  onSave,
  onFetchNextKode,
}: ModalTambahEditPeranProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white text-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-bold shadow-2xs">
              <i className={modalMode === 'create' ? 'ri-id-card-line' : 'ri-edit-line'}></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {modalMode === 'create' ? 'Tambah Peran Baru' : 'Edit Data Peran'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {modalMode === 'create'
                  ? 'Definisikan peran jabatan baru untuk personel penanggung jawab.'
                  : 'Perbarui nama, kategori, deskripsi, atau status peran.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSave} className="p-6 space-y-4">
          {/* Kode & Kategori Peran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kode Peran */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Kode Peran
                </label>
                {modalMode === 'create' && (
                  <button
                    type="button"
                    onClick={onFetchNextKode}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                  >
                    <i className="ri-refresh-line"></i> Auto
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Contoh: PRN-001"
                value={formValues.kodePeran}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, kodePeran: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Kategori Peran */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Kategori / Divisi <span className="text-rose-500">*</span>
              </label>
              <select
                value={formValues.kategori}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, kategori: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                {KATEGORI_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nama Peran */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nama Peran / Jabatan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Kepala Produksi, Staff QC, Koordinator Lapangan"
              value={formValues.namaPeran}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, namaPeran: e.target.value }))
              }
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                formErrors.namaPeran ? 'border-rose-300 bg-rose-50/30' : 'border-gray-200'
              }`}
            />
            {formErrors.namaPeran && (
              <p className="text-[11px] text-rose-500 mt-1">{formErrors.namaPeran}</p>
            )}
          </div>

          {/* Deskripsi Tanggung Jawab */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Deskripsi Tanggung Jawab
            </label>
            <textarea
              rows={3}
              placeholder="Jelaskan ruang lingkup, wewenang, dan tanggung jawab peran ini..."
              value={formValues.deskripsi}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, deskripsi: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            ></textarea>
          </div>

          {/* Status Peran */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Status Peran
            </label>
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Aktif"
                  checked={formValues.status === 'Aktif'}
                  onChange={() =>
                    setFormValues((prev) => ({ ...prev, status: 'Aktif' }))
                  }
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Aktif
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Nonaktif"
                  checked={formValues.status === 'Nonaktif'}
                  onChange={() =>
                    setFormValues((prev) => ({ ...prev, status: 'Nonaktif' }))
                  }
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="inline-flex items-center gap-1.5 font-medium text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                  Nonaktif
                </span>
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitLoading}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitLoading}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all"
            >
              {isSubmitLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-sm"></i>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <i className="ri-save-line text-sm"></i>
                  <span>{modalMode === 'create' ? 'Tambah Peran' : 'Simpan Perubahan'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
