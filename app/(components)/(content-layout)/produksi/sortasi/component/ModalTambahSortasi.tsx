"use client";

import React, { useState, useEffect } from 'react';
import {
  SortasiBatchItem,
  ReferensiGudangBahanItem,
  CreateSortasiPayload,
} from '@/app/types/sortasi';

interface ModalTambahSortasiProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSortasiPayload) => Promise<void>;
  referensiGudangBahan: ReferensiGudangBahanItem[];
  editingItem?: SortasiBatchItem | null;
  isSaving?: boolean;
}

export default function ModalTambahSortasi({
  isOpen,
  onClose,
  onSubmit,
  referensiGudangBahan,
  editingItem,
  isSaving = false,
}: ModalTambahSortasiProps) {
  const [selectedGudangId, setSelectedGudangId] = useState<string>('');

  const [formData, setFormData] = useState<CreateSortasiPayload>({
    kodeBatch: '',
    tanggalSortasi: '28 Jun 2026',
    komoditas: '',
    varietas: '',
    petani: '',
    petaniKode: '',
    noLot: '',
    gudangBahanId: '',
    alatSortasi: 'Screen Separator M-01',
    beratMasuk: 500,
    hasilLulus: 460,
    hasilTolak: 40,
    status: 'Proses',
    lokasi: 'Ruang Sortasi Unit 1',
    operator: 'Siti Nurhayati',
    catatan: '',
    rincianReject: [
      { jenis: 'Benih hampa', berat: 18, persentase: 3.6 },
      { jenis: 'Ukuran < standar', berat: 12, persentase: 2.4 },
      { jenis: 'Kerusakan fisik', berat: 7, persentase: 1.4 },
      { jenis: 'Lainnya', berat: 3, persentase: 0.6 },
    ],
  });

  useEffect(() => {
    if (editingItem) {
      setSelectedGudangId(editingItem.gudangBahanId || editingItem.noLot || '');
      setFormData({
        kodeBatch: editingItem.kodeBatch,
        tanggalSortasi: editingItem.tanggalSortasi || '28 Jun 2026',
        komoditas: editingItem.komoditas,
        varietas: editingItem.varietas,
        petani: editingItem.petani || '',
        petaniKode: editingItem.petaniKode || '',
        noLot: editingItem.noLot || '',
        gudangBahanId: editingItem.gudangBahanId || '',
        alatSortasi: editingItem.alatSortasi || 'Screen Separator M-01',
        beratMasuk: editingItem.beratMasuk || 500,
        hasilLulus: editingItem.hasilLulus || 460,
        hasilTolak: editingItem.hasilTolak || 40,
        status: editingItem.status === 'Selesai' ? 'Selesai' : 'Proses',
        lokasi: editingItem.lokasi || 'Ruang Sortasi Unit 1',
        operator: editingItem.operator || 'Siti Nurhayati',
        catatan: editingItem.catatan || '',
        rincianReject: editingItem.rincianReject || [
          { jenis: 'Benih hampa', berat: 18, persentase: 3.6 },
          { jenis: 'Ukuran < standar', berat: 12, persentase: 2.4 },
          { jenis: 'Kerusakan fisik', berat: 7, persentase: 1.4 },
          { jenis: 'Lainnya', berat: 3, persentase: 0.6 },
        ],
      });
    } else {
      setSelectedGudangId('');
      const randomCode = `SO-2026-06-${String(Math.floor(Math.random() * 900) + 13).padStart(3, '0')}`;
      setFormData({
        kodeBatch: randomCode,
        tanggalSortasi: '28 Jun 2026',
        komoditas: '',
        varietas: '',
        petani: '',
        petaniKode: '',
        noLot: '',
        gudangBahanId: '',
        alatSortasi: 'Screen Separator M-01',
        beratMasuk: 500,
        hasilLulus: 460,
        hasilTolak: 40,
        status: 'Proses',
        lokasi: 'Ruang Sortasi Unit 1',
        operator: 'Siti Nurhayati',
        catatan: '',
        rincianReject: [
          { jenis: 'Benih hampa', berat: 18, persentase: 3.6 },
          { jenis: 'Ukuran < standar', berat: 12, persentase: 2.4 },
          { jenis: 'Kerusakan fisik', berat: 7, persentase: 1.4 },
          { jenis: 'Lainnya', berat: 3, persentase: 0.6 },
        ],
      });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  // Handle selecting a Lot from Gudang Bahan Mentah
  const handleSelectGudang = (idOrLot: string) => {
    setSelectedGudangId(idOrLot);
    const item = referensiGudangBahan.find(
      (g) => g.id === idOrLot || g.noLot === idOrLot
    );

    if (item) {
      const bMasuk = item.beratMasuk || 500;
      const hLulus = Math.round(bMasuk * 0.92);
      const hTolak = bMasuk - hLulus;

      setFormData((prev) => ({
        ...prev,
        gudangBahanId: item.id,
        noLot: item.noLot,
        komoditas: item.komoditas,
        varietas: item.varietas,
        petani: item.petani || prev.petani,
        petaniKode: item.petaniKode || prev.petaniKode,
        beratMasuk: bMasuk,
        hasilLulus: hLulus,
        hasilTolak: hTolak,
        rincianReject: [
          { jenis: 'Benih hampa', berat: parseFloat((hTolak * 0.45).toFixed(1)), persentase: 3.6 },
          { jenis: 'Ukuran < standar', berat: parseFloat((hTolak * 0.30).toFixed(1)), persentase: 2.4 },
          { jenis: 'Kerusakan fisik', berat: parseFloat((hTolak * 0.175).toFixed(1)), persentase: 1.4 },
          { jenis: 'Lainnya', berat: parseFloat((hTolak * 0.075).toFixed(1)), persentase: 0.6 },
        ],
      }));
    }
  };

  // Live weight calculation
  const handleBeratMasukChange = (val: number) => {
    const bMasuk = val || 0;
    const hLulus = formData.hasilLulus || 0;
    const hTolak = Math.max(0, bMasuk - hLulus);
    setFormData((prev) => ({
      ...prev,
      beratMasuk: bMasuk,
      hasilTolak: hTolak,
    }));
  };

  const handleHasilLulusChange = (val: number) => {
    const hLulus = val || 0;
    const bMasuk = formData.beratMasuk || 0;
    const hTolak = Math.max(0, bMasuk - hLulus);
    setFormData((prev) => ({
      ...prev,
      hasilLulus: hLulus,
      hasilTolak: hTolak,
    }));
  };

  const recovery =
    formData.beratMasuk > 0
      ? ((formData.hasilLulus / formData.beratMasuk) * 100).toFixed(1)
      : '0.0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const selectedGudangItem = referensiGudangBahan.find(
    (g) => g.id === selectedGudangId || g.noLot === selectedGudangId
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fadeIn my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <i className="ri-filter-3-line text-lg"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                {editingItem ? 'Edit Data Sortasi' : 'Tambah Proses Sortasi'}
              </h3>
              <p className="text-[11px] text-gray-500">
                Referensi otomatis diambil dari Gudang Bahan Mentah
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Section 1: Referensi Gudang Bahan Mentah */}
          <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-emerald-950 flex items-center gap-1.5">
                <i className="ri-archive-line text-emerald-600"></i>
                <span>Pilih Referensi Gudang Bahan Mentah</span>
              </label>
              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-100 px-2 py-0.5 rounded-full">
                Wajib Dipilih
              </span>
            </div>

            <div className="relative">
              <select
                value={selectedGudangId}
                onChange={(e) => handleSelectGudang(e.target.value)}
                required
                className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-emerald-200 rounded-lg text-gray-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
              >
                <option value="">-- Pilih Lot Gudang Bahan Mentah --</option>
                {referensiGudangBahan.map((g) => (
                  <option key={g.id || g.noLot} value={g.id || g.noLot}>
                    {g.noLot} — {g.komoditas} ({g.varietas}) | Petani: {g.petani || '-'} | {g.beratMasuk} kg | Status: {g.status}
                  </option>
                ))}
              </select>
              <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>

            {/* Selected lot info card */}
            {selectedGudangItem && (
              <div className="bg-white/80 rounded-lg p-2.5 border border-emerald-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div>
                  <span className="text-gray-400 block text-[10px]">No. Lot</span>
                  <span className="font-bold text-emerald-800">{selectedGudangItem.noLot}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Komoditas/Varietas</span>
                  <span className="font-semibold text-gray-800">
                    {selectedGudangItem.komoditas} / {selectedGudangItem.varietas}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Petani Mitra</span>
                  <span className="font-semibold text-gray-800">{selectedGudangItem.petani || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Status Gudang Saat Ini</span>
                  <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[10px]">
                    {selectedGudangItem.status}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Informasi Sortasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Kode Batch Sortasi</label>
              <input
                type="text"
                value={formData.kodeBatch}
                onChange={(e) => setFormData({ ...formData, kodeBatch: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Tanggal Sortasi</label>
              <input
                type="text"
                value={formData.tanggalSortasi}
                onChange={(e) => setFormData({ ...formData, tanggalSortasi: e.target.value })}
                required
                placeholder="Contoh: 28 Jun 2026"
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Alat Sortasi</label>
              <select
                value={formData.alatSortasi}
                onChange={(e) => setFormData({ ...formData, alatSortasi: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="Screen Separator M-01">Screen Separator M-01</option>
                <option value="Air Screen Cleaner 01">Air Screen Cleaner 01</option>
                <option value="Air Screen Cleaner 02">Air Screen Cleaner 02</option>
                <option value="Gravity Separator 01">Gravity Separator 01</option>
                <option value="Color Sorter 01">Color Sorter 01</option>
                <option value="Screen Separator M-02">Screen Separator M-02</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Operator Sortasi</label>
              <input
                type="text"
                value={formData.operator}
                onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                placeholder="Contoh: Siti Nurhayati"
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-700 font-semibold mb-1">Lokasi Sortasi</label>
              <select
                value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="Ruang Sortasi Unit 1">Ruang Sortasi Unit 1</option>
                <option value="Ruang Sortasi Unit 2">Ruang Sortasi Unit 2</option>
                <option value="Ruang Sortasi Unit 3">Ruang Sortasi Unit 3</option>
              </select>
            </div>
          </div>

          {/* Section 3: Hasil Berat & Recovery */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-gray-200 space-y-3">
            <h4 className="font-bold text-gray-800 flex items-center justify-between">
              <span>Hasil Timbangan & Pemisahan Mutu</span>
              <span className="text-emerald-700 font-extrabold text-xs">
                Tingkat Lolos: {recovery}%
              </span>
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-600 text-[11px] font-medium mb-1">
                  Berat Masuk (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.beratMasuk}
                  onChange={(e) => handleBeratMasukChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg font-bold text-gray-900 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-emerald-700 text-[11px] font-medium mb-1">
                  Berat Lolos (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.hasilLulus}
                  onChange={(e) => handleHasilLulusChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg font-bold text-emerald-700 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-rose-600 text-[11px] font-medium mb-1">
                  Berat Reject (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.hasilTolak}
                  onChange={(e) =>
                    setFormData({ ...formData, hasilTolak: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-rose-300 rounded-lg font-bold text-rose-600 focus:border-rose-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Status & Sinkronisasi Gudang Bahan Mentah */}
          <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200/80 space-y-2">
            <label className="font-bold text-gray-900 block">
              Status Proses & Sinkronisasi ke Gudang Bahan Mentah
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-lg border flex flex-col gap-1 cursor-pointer transition-colors ${
                  formData.status === 'Proses'
                    ? 'bg-amber-50/80 border-amber-300 text-amber-900'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <input
                      type="radio"
                      name="sortasiStatus"
                      value="Proses"
                      checked={formData.status === 'Proses'}
                      onChange={() => setFormData({ ...formData, status: 'Proses' })}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>Sedang Proses</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-amber-100 text-amber-800">
                    Proses
                  </span>
                </div>
                <p className="text-[10.5px] text-gray-500 leading-tight mt-0.5">
                  Status di Gudang Bahan Mentah otomatis menjadi <strong>&quot;Proses Sortasi&quot;</strong>.
                </p>
              </label>

              <label
                className={`p-3 rounded-lg border flex flex-col gap-1 cursor-pointer transition-colors ${
                  formData.status === 'Selesai'
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <input
                      type="radio"
                      name="sortasiStatus"
                      value="Selesai"
                      checked={formData.status === 'Selesai'}
                      onChange={() => setFormData({ ...formData, status: 'Selesai' })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Sortasi Selesai</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800">
                    Selesai
                  </span>
                </div>
                <p className="text-[10.5px] text-gray-500 leading-tight mt-0.5">
                  Status di Gudang Bahan Mentah otomatis menjadi <strong>&quot;Sudah Sortasi&quot;</strong>.
                </p>
              </label>
            </div>
          </div>

          {/* Section 5: Catatan */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Catatan Tambahan (Opsional)</label>
            <textarea
              rows={2}
              value={formData.catatan}
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
              placeholder="Catatan kondisi mesin, kotoran, atau anomali benih..."
              className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-slate-50 font-semibold transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving || !formData.komoditas}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#078836] hover:bg-[#06732d] text-white font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-sm"></i>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <i className="ri-save-line text-sm"></i>
                  <span>{editingItem ? 'Simpan Perubahan' : 'Simpan Proses Sortasi'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
