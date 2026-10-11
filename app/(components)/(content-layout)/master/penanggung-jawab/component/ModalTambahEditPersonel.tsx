"use client";

import React from 'react';
import { FormValuesState } from '@/app/hooks/usePenanggungJawab';

interface ModalTambahEditPersonelProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode: 'create' | 'edit';
  formValues: FormValuesState;
  setFormValues: React.Dispatch<React.SetStateAction<FormValuesState>>;
  formErrors: { [key: string]: string };
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onRefreshKode: () => void;
}

const PERAN_OPTIONS = [
  'Kepala Produksi',
  'Penanggung Jawab',
  'Koordinator Lapangan',
  'Staff QC',
];

const AREA_MODUL_OPTIONS = [
  'Produksi',
  'QC & Laboratorium',
  'Gudang',
  'Pengeringan',
  'Inventory',
  'Lainnya',
];

const LOKASI_OPTIONS = [
  'Semua Lokasi',
  'Ngantang',
  'Wajak',
  'Lahan Terbuka Subang',
  'Greenhouse Lamongan',
  'Gudang Utama Kediri',
];

export default function ModalTambahEditPersonel({
  isOpen,
  onClose,
  modalMode,
  formValues,
  setFormValues,
  formErrors,
  isSubmitting,
  onSubmit,
  onRefreshKode,
}: ModalTambahEditPersonelProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white text-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-bold shadow-2xs">
              <i className={modalMode === 'create' ? 'ri-user-add-line' : 'ri-user-settings-line'}></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {modalMode === 'create'
                  ? 'Tambah Personel & Tanggung Jawab'
                  : 'Edit Personel & Tanggung Jawab'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Tambahkan data personel dan atur tanggung jawabnya pada area / modul yang sesuai.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
            title="Tutup Modal"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column 1: Informasi Personel */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-gray-800 font-bold text-xs">
                <i className="ri-user-3-line text-[#055127] text-base"></i>
                <span>Informasi Personel</span>
              </div>

              {/* Kode Personel */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Kode Personel <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={formValues.kodePersonel}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, kodePersonel: e.target.value }))
                    }
                    placeholder="Contoh: PJ-001"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-mono font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={onRefreshKode}
                    className="absolute right-2 p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Generate kode otomatis berikutnya"
                  >
                    <i className="ri-refresh-line text-sm"></i>
                  </button>
                </div>
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formValues.nama}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, nama: e.target.value }))
                  }
                  placeholder="Masukkan nama lengkap"
                  className={`w-full px-3.5 py-2.5 bg-white border ${
                    formErrors.nama ? 'border-rose-400 focus:border-rose-500' : 'border-gray-200 focus:border-emerald-500'
                  } rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                />
                {formErrors.nama && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.nama}</p>
                )}
              </div>

              {/* No. HP */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  No. HP
                </label>
                <input
                  type="text"
                  value={formValues.noHp}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, noHp: e.target.value }))
                  }
                  placeholder="Contoh: 08xxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={formValues.email}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="contoh@email.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Status <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                    <input
                      type="radio"
                      name="status"
                      checked={formValues.status === 'Aktif'}
                      onChange={() =>
                        setFormValues((prev) => ({ ...prev, status: 'Aktif' }))
                      }
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                    />
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Aktif
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                    <input
                      type="radio"
                      name="status"
                      checked={formValues.status === 'Nonaktif'}
                      onChange={() =>
                        setFormValues((prev) => ({ ...prev, status: 'Nonaktif' }))
                      }
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                    />
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      Nonaktif
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Column 2: Tanggung Jawab */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-gray-800 font-bold text-xs">
                <i className="ri-shield-check-line text-[#055127] text-base"></i>
                <span>Tanggung Jawab</span>
              </div>

              {/* Peran & Area / Modul Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Peran <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formValues.peran}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, peran: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      {PERAN_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                  {formErrors.peran && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.peran}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Area / Modul <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formValues.areaModul}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, areaModul: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      {AREA_MODUL_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                  {formErrors.areaModul && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.areaModul}</p>
                  )}
                </div>
              </div>

              {/* Lokasi Tanggung Jawab */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Lokasi Tanggung Jawab <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formValues.lokasi}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, lokasi: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                  >
                    {LOKASI_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
                {formErrors.lokasi && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.lokasi}</p>
                )}
              </div>

              {/* Tanggal Mulai & Tanggal Selesai */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Tanggal Mulai Tugas
                  </label>
                  <input
                    type="date"
                    value={formValues.tanggalMulai}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, tanggalMulai: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Tanggal Selesai (opsional)
                  </label>
                  <input
                    type="date"
                    value={formValues.tanggalSelesai}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, tanggalSelesai: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Catatan */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Catatan
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {formValues.catatan.length}/500
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={formValues.catatan}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, catatan: e.target.value }))
                  }
                  placeholder="Masukkan keterangan tambahan..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <i className="ri-close-line text-sm"></i>
              <span>Batal</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#055127] hover:bg-[#043e1e] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-sm"></i>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <i className="ri-check-line text-sm font-bold"></i>
                  <span>Simpan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
