"use client";

import React from 'react';
import { FormKelompokTaniValues } from '@/app/hooks/useKelompokTani';
import { PenanggungJawab } from '@/app/types/penanggungJawab';
import { Commodity } from '@/app/types/commodity';

interface ModalTambahEditKelompokTaniProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  mode: 'create' | 'edit';
  formValues: FormKelompokTaniValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormKelompokTaniValues>>;
  formErrors: { [key: string]: string };
  isSubmitLoading: boolean;
  penanggungJawabList: PenanggungJawab[];
  commodities: Commodity[];
  onRegenerateCode: () => void;
}

export default function ModalTambahEditKelompokTani({
  isOpen,
  onClose,
  onSubmit,
  mode,
  formValues,
  setFormValues,
  formErrors,
  isSubmitLoading,
  penanggungJawabList,
  commodities,
  onRegenerateCode,
}: ModalTambahEditKelompokTaniProps) {
  if (!isOpen) return null;

  const standardLokasiOptions = [
    'Sumberrejo',
    'Karangrejo',
    'Ngantang',
    'Wajak',
    'Poncokusumo',
    'Tumpang',
    'Pakis',
    'Dau',
    'Singosari',
    'Kepanjen',
    'Bululawang',
    'Gondanglegi',
  ];

  const standardKomoditasOptions = [
    'Melon',
    'Cabai',
    'Semangka',
    'Tomat',
    'Jagung Manis',
    'Terong',
    'Mentimun',
  ];

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setFormValues((prev) => ({ ...prev, deskripsi: text }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center text-xl shadow-2xs">
              <i className="ri-team-line"></i>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">
                {mode === 'create' ? 'Tambah Kelompok Tani' : 'Edit Kelompok Tani'}
              </h2>
              <p className="text-xs text-gray-500">
                {mode === 'create'
                  ? 'Lengkapi informasi kelompok tani yang akan ditambahkan.'
                  : 'Perbarui data informasi kelompok tani mitra.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Modal Body: Two Columns */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT COLUMN: Informasi Kelompok */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-emerald-800 font-semibold text-xs tracking-wide">
                <i className="ri-information-line text-sm"></i>
                <span>Informasi Kelompok</span>
              </div>

              {/* Kode Kelompok */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Kode Kelompok <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={formValues.kodeKelompok}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, kodeKelompok: e.target.value }))
                    }
                    placeholder="KT-001"
                    className="form-control w-full border border-gray-300 p-2.5 pr-10 rounded-lg text-xs font-mono font-semibold bg-gray-50 text-gray-800 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                  <button
                    type="button"
                    onClick={onRegenerateCode}
                    title="Generate Ulang Kode"
                    className="absolute right-2.5 text-gray-400 hover:text-emerald-600 transition"
                  >
                    <i className="ri-refresh-line text-sm"></i>
                  </button>
                </div>
              </div>

              {/* Nama Kelompok */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Nama Kelompok <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formValues.namaKelompok}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, namaKelompok: e.target.value }))
                  }
                  placeholder="Masukkan nama kelompok"
                  className={`form-control w-full border p-2.5 rounded-lg text-xs text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition ${
                    formErrors.namaKelompok ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.namaKelompok && (
                  <span className="text-[11px] text-red-500 mt-1 block">
                    {formErrors.namaKelompok}
                  </span>
                )}
              </div>

              {/* Ketua Kelompok */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Ketua Kelompok <span className="text-red-500">*</span>
                </label>
                <div className="space-y-1.5">
                  <select
                    value={
                      [
                        'Suryadi',
                        'Budi Santoso',
                        'Agus Salim',
                        'Wahyu',
                        'Sutrisno',
                        'Supriyanto',
                        'Handoko',
                        'Bambang Irawan',
                        'Rudi Hartono',
                        'Kuswanto',
                        'Darmawan',
                      ].includes(formValues.ketua)
                        ? formValues.ketua
                        : formValues.ketua
                        ? '__custom__'
                        : ''
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '__custom__') {
                        setFormValues((prev) => ({ ...prev, ketua: '' }));
                      } else {
                        setFormValues((prev) => ({ ...prev, ketua: val }));
                      }
                    }}
                    className={`form-select w-full border p-2.5 rounded-lg text-xs bg-white text-gray-800 cursor-pointer focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition ${
                      formErrors.ketua ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Pilih ketua kelompok</option>
                    <option value="Suryadi">Suryadi</option>
                    <option value="Budi Santoso">Budi Santoso</option>
                    <option value="Agus Salim">Agus Salim</option>
                    <option value="Wahyu">Wahyu</option>
                    <option value="Sutrisno">Sutrisno</option>
                    <option value="Supriyanto">Supriyanto</option>
                    <option value="Handoko">Handoko</option>
                    <option value="Bambang Irawan">Bambang Irawan</option>
                    <option value="Rudi Hartono">Rudi Hartono</option>
                    <option value="Kuswanto">Kuswanto</option>
                    <option value="Darmawan">Darmawan</option>
                    <option value="__custom__">+ Input Nama Manual / Lainnya</option>
                  </select>

                  {/* Manual input if ketua is custom or not in list */}
                  {(formValues.ketua &&
                    ![
                      'Suryadi',
                      'Budi Santoso',
                      'Agus Salim',
                      'Wahyu',
                      'Sutrisno',
                      'Supriyanto',
                      'Handoko',
                      'Bambang Irawan',
                      'Rudi Hartono',
                      'Kuswanto',
                      'Darmawan',
                    ].includes(formValues.ketua)) ||
                  formValues.ketua === '' ? (
                    <input
                      type="text"
                      value={formValues.ketua}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, ketua: e.target.value }))
                      }
                      placeholder="Masukkan nama ketua kelompok"
                      className="form-control w-full border border-gray-300 p-2 rounded-lg text-xs text-gray-800 focus:border-emerald-500 mt-1"
                    />
                  ) : null}
                </div>
                {formErrors.ketua && (
                  <span className="text-[11px] text-red-500 mt-1 block">
                    {formErrors.ketua}
                  </span>
                )}
              </div>

              {/* No. HP Ketua */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  No. HP Ketua
                </label>
                <input
                  type="text"
                  value={formValues.noHpKetua}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, noHpKetua: e.target.value }))
                  }
                  placeholder="08xxxxxxxxxx"
                  className="form-control w-full border border-gray-300 p-2.5 rounded-lg text-xs font-mono text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Tahun Berdiri */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Tahun Berdiri
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={formValues.tahunBerdiri}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, tahunBerdiri: e.target.value }))
                    }
                    placeholder="dd/mm/yyyy"
                    className="form-control w-full border border-gray-300 p-2.5 pr-9 rounded-lg text-xs text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                  <i className="ri-calendar-line absolute right-3 text-gray-400 text-sm pointer-events-none"></i>
                </div>
              </div>

              {/* Penanggung Jawab (Referensi dari Penanggung Jawab) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Penanggung Jawab (Personel Binaan)
                </label>
                <select
                  value={formValues.penanggungJawabId}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, penanggungJawabId: e.target.value }))
                  }
                  className="form-select w-full border border-gray-300 p-2.5 rounded-lg text-xs bg-white text-gray-800 cursor-pointer focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                >
                  <option value="">Pilih Penanggung Jawab Lapangan</option>
                  {penanggungJawabList.map((pj) => (
                    <option key={pj.id} value={pj.id}>
                      {pj.kodePersonel ? `[${pj.kodePersonel}] ` : ''}
                      {pj.nama} ({pj.peran || 'Penanggung Jawab'})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 mt-1">
                  Personel yang ditugaskan sebagai pendamping kelompok tani ini.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: Lokasi & Komoditas */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-emerald-800 font-semibold text-xs tracking-wide">
                <i className="ri-map-pin-line text-sm"></i>
                <span>Lokasi & Komoditas</span>
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Lokasi <span className="text-red-500">*</span>
                </label>
                <select
                  value={formValues.lokasi}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, lokasi: e.target.value }))
                  }
                  className={`form-select w-full border p-2.5 rounded-lg text-xs bg-white text-gray-800 cursor-pointer focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition ${
                    formErrors.lokasi ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih lokasi</option>
                  {standardLokasiOptions.map((lok) => (
                    <option key={lok} value={lok}>
                      {lok}
                    </option>
                  ))}
                </select>
                {formErrors.lokasi && (
                  <span className="text-[11px] text-red-500 mt-1 block">
                    {formErrors.lokasi}
                  </span>
                )}
              </div>

              {/* Komoditas Utama */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Komoditas Utama <span className="text-red-500">*</span>
                </label>
                <select
                  value={formValues.komoditasUtama}
                  onChange={(e) => {
                    const val = e.target.value;
                    const matched = commodities.find(
                      (c) => c.namaKomoditas.toLowerCase() === val.toLowerCase()
                    );
                    setFormValues((prev) => ({
                      ...prev,
                      komoditasUtama: val,
                      commodityId: matched ? matched.id : prev.commodityId,
                    }));
                  }}
                  className={`form-select w-full border p-2.5 rounded-lg text-xs bg-white text-gray-800 cursor-pointer focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition ${
                    formErrors.komoditasUtama ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih komoditas utama</option>
                  {standardKomoditasOptions.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                  {commodities
                    .filter((c) => !standardKomoditasOptions.includes(c.namaKomoditas))
                    .map((c) => (
                      <option key={c.id} value={c.namaKomoditas}>
                        {c.namaKomoditas}
                      </option>
                    ))}
                </select>
                {formErrors.komoditasUtama && (
                  <span className="text-[11px] text-red-500 mt-1 block">
                    {formErrors.komoditasUtama}
                  </span>
                )}
              </div>

              {/* Deskripsi / Catatan */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    Deskripsi / Catatan
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {formValues.deskripsi.length}/500
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={formValues.deskripsi}
                  onChange={handleDescChange}
                  placeholder="Masukkan keterangan tambahan..."
                  className="form-control w-full border border-gray-300 p-2.5 rounded-lg text-xs text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                    <input
                      type="radio"
                      name="status"
                      value="Aktif"
                      checked={formValues.status === 'Aktif'}
                      onChange={() =>
                        setFormValues((prev) => ({ ...prev, status: 'Aktif' }))
                      }
                      className="text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>Aktif</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                    <input
                      type="radio"
                      name="status"
                      value="Nonaktif"
                      checked={formValues.status === 'Nonaktif'}
                      onChange={() =>
                        setFormValues((prev) => ({ ...prev, status: 'Nonaktif' }))
                      }
                      className="text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>Nonaktif</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitLoading}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold shadow-2xs transition flex items-center gap-1.5"
          >
            <i className="ri-close-line text-sm"></i>
            <span>Batal</span>
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitLoading}
            className="px-5 py-2 rounded-lg bg-[#005b38] hover:bg-[#00472c] text-white text-xs font-semibold shadow-xs transition flex items-center gap-2"
          >
            {isSubmitLoading ? (
              <i className="ri-loader-4-line animate-spin text-sm"></i>
            ) : (
              <i className="ri-save-line text-sm"></i>
            )}
            <span>Simpan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
