"use client";

import React from 'react';
import { LokasiFormValues } from '@/app/types/lokasi';

interface ModalTambahEditLokasiProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode: 'create' | 'edit';
  formValues: LokasiFormValues;
  setFormValues: React.Dispatch<React.SetStateAction<LokasiFormValues>>;
  formErrors: { [key: string]: string };
  isSubmitLoading: boolean;
  onSave: (e?: React.FormEvent) => void;
  onFetchNextKode: () => void;
}

const TIPE_LOKASI_OPTIONS = [
  'Kebun / Lahan',
  'Greenhouse',
  'Gudang & Fasilitas',
  'Laboratorium / QC',
  'Kantor & Operasional',
  'Lainnya',
];

export default function ModalTambahEditLokasi({
  isOpen,
  onClose,
  modalMode,
  formValues,
  setFormValues,
  formErrors,
  isSubmitLoading,
  onSave,
  onFetchNextKode,
}: ModalTambahEditLokasiProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white text-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-bold shadow-2xs">
              <i className={modalMode === 'create' ? 'ri-map-pin-add-line' : 'ri-edit-line'}></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {modalMode === 'create' ? 'Tambah Lokasi Baru' : 'Edit Data Lokasi'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {modalMode === 'create'
                  ? 'Daftarkan unit kebun, greenhouse, gudang, atau kantor fasilitas baru.'
                  : 'Perbarui informasi dan spesifikasi lokasi operasional.'}
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
        <form onSubmit={onSave} className="p-6 space-y-4 overflow-y-auto">
          {/* Kode & Tipe Lokasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kode Lokasi */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Kode Lokasi
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
                placeholder="Contoh: LOK-001"
                value={formValues.kodeLokasi}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, kodeLokasi: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Tipe Lokasi */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Tipe Lokasi <span className="text-rose-500">*</span>
              </label>
              <select
                value={formValues.tipeLokasi}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, tipeLokasi: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                {TIPE_LOKASI_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nama Lokasi */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nama Lokasi / Fasilitas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Ngantang, Wajak, Lahan Terbuka Subang, Greenhouse Lamongan"
              value={formValues.namaLokasi}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, namaLokasi: e.target.value }))
              }
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                formErrors.namaLokasi ? 'border-rose-300 bg-rose-50/30' : 'border-gray-200'
              }`}
            />
            {formErrors.namaLokasi && (
              <p className="text-[11px] text-rose-500 mt-1">{formErrors.namaLokasi}</p>
            )}
          </div>

          {/* Luas Area & Penanggung Jawab Utama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Luas Area (Hektar / Ha)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="Contoh: 25.5"
                value={formValues.luasArea}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, luasArea: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Penanggung Jawab Utama
              </label>
              <input
                type="text"
                placeholder="Nama PIC / Pimpinan Lokasi"
                value={formValues.penanggungJawabUtama}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, penanggungJawabUtama: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Kota & Provinsi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Kota / Kabupaten
              </label>
              <input
                type="text"
                placeholder="Contoh: Malang, Subang, Lamongan"
                value={formValues.kota}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, kota: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Provinsi
              </label>
              <input
                type="text"
                placeholder="Contoh: Jawa Timur, Jawa Barat"
                value={formValues.provinsi}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, provinsi: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Alamat Lengkap */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Alamat Lengkap / Lokasi Fisik
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Desa Kaumrejo, Kec. Ngantang, Kab. Malang"
              value={formValues.alamat}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, alamat: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            ></textarea>
          </div>

          {/* Koordinat & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Koordinat GPS (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: -7.8642, 112.3811"
                value={formValues.koordinat}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, koordinat: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Status Lokasi
              </label>
              <div className="flex items-center gap-4 pt-2">
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
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Catatan / Keterangan Operasional
            </label>
            <textarea
              rows={2}
              placeholder="Catatan perizinan, karakteristik tanah, atau fasilitas pendukung..."
              value={formValues.keterangan}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, keterangan: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            ></textarea>
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
                  <span>{modalMode === 'create' ? 'Tambah Lokasi' : 'Simpan Perubahan'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
