"use client";

import React, { useState, useEffect } from 'react';
import {
  TreatmentBatchItem,
  ReferensiGudangBahanItem,
} from '@/app/types/treatment';

interface ModalTambahTreatmentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TreatmentBatchItem>) => Promise<void>;
  editingItem?: TreatmentBatchItem | null;
  referensiGudangBahan: ReferensiGudangBahanItem[];
  isSaving?: boolean;
}

const METODE_OPTIONS = [
  'Fungisida',
  'Insektisida',
  'ZPT',
  'Biofungisida',
  'Bakterisida',
];

const BAHAN_SUGGESTIONS = [
  'Carbendazim',
  'Imidakloprid',
  'Mancozeb',
  'Asam Humat',
  'Thiamethoxam',
  'Propikonazol',
  'Emamektin',
  'Trichoderma',
  'Rootone-F',
  'Abamektin',
];

export default function ModalTambahTreatment({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  referensiGudangBahan,
  isSaving = false,
}: ModalTambahTreatmentProps) {
  const [selectedGudangId, setSelectedGudangId] = useState<string>('');

  const [formData, setFormData] = useState({
    kodeBatch: '',
    tanggalProses: '02 Jun 2026',
    komoditas: '',
    varietas: '',
    petani: '',
    petaniKode: '',
    lahan: '',
    noLot: '',
    gudangBahanId: '',
    metodeTreatment: 'Fungisida',
    bahan: 'Carbendazim',
    dosis: '2.5 ml/kg',
    jumlahBenih: 200,
    operator: 'Admin Produksi',
    lokasi: 'Ruang Treatment 1',
    status: 'Selesai',
    catatan: '',
  });

  // Filter gudang bahan: prioritize items that have status 'Sudah Sortasi'
  const sudahSortasiItems = referensiGudangBahan.filter(
    (g) => g.status === 'Sudah Sortasi'
  );
  // If none are strictly 'Sudah Sortasi', fallback to all available
  const availableGudangItems =
    sudahSortasiItems.length > 0 ? sudahSortasiItems : referensiGudangBahan;

  useEffect(() => {
    if (editingItem) {
      setSelectedGudangId(editingItem.gudangBahanId || editingItem.noLot || '');
      setFormData({
        kodeBatch: editingItem.kodeBatch,
        tanggalProses: editingItem.tanggalProses || editingItem.tanggalSelesai || '02 Jun 2026',
        komoditas: editingItem.komoditas || '',
        varietas: editingItem.varietas || '',
        petani: editingItem.petani || '',
        petaniKode: editingItem.petaniKode || '',
        lahan: editingItem.lahan || '',
        noLot: editingItem.noLot || '',
        gudangBahanId: editingItem.gudangBahanId || '',
        metodeTreatment: editingItem.metodeTreatment || editingItem.treatment?.split(' ')[0] || 'Fungisida',
        bahan: editingItem.bahan || 'Carbendazim',
        dosis: editingItem.dosis || '2.5 ml/kg',
        jumlahBenih: editingItem.jumlahBenih || editingItem.beratAwal || 200,
        operator: editingItem.operator || 'Admin Produksi',
        lokasi: editingItem.lokasi || 'Ruang Treatment 1',
        status: editingItem.status || 'Selesai',
        catatan: editingItem.catatan || '',
      });
    } else {
      setSelectedGudangId('');
      const randNum = String(Math.floor(Math.random() * 900) + 13).padStart(3, '0');
      setFormData({
        kodeBatch: `TR-2026-06-${randNum}`,
        tanggalProses: '02 Jun 2026',
        komoditas: '',
        varietas: '',
        petani: '',
        petaniKode: '',
        lahan: '',
        noLot: '',
        gudangBahanId: '',
        metodeTreatment: 'Fungisida',
        bahan: 'Carbendazim',
        dosis: '2.5 ml/kg',
        jumlahBenih: 200,
        operator: 'Admin Produksi',
        lokasi: 'Ruang Treatment 1',
        status: 'Selesai',
        catatan: 'Benih terlihat sehat dan siap untuk proses perlakuan.',
      });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  // Handle Lot selection from Gudang Bahan Belum Diproses (Sudah Sortasi)
  const handleSelectGudang = (idOrLot: string) => {
    setSelectedGudangId(idOrLot);
    const item = referensiGudangBahan.find(
      (g) => g.id === idOrLot || g.noLot === idOrLot
    );

    if (item) {
      setFormData((prev) => ({
        ...prev,
        gudangBahanId: item.id,
        noLot: item.noLot,
        komoditas: item.komoditas || prev.komoditas,
        varietas: item.varietas || prev.varietas,
        petani: item.petani || prev.petani,
        petaniKode: item.petaniKode || prev.petaniKode,
        lahan: item.lahan || prev.lahan,
        jumlahBenih: item.beratMasuk || prev.jumlahBenih,
      }));
    }
  };

  const selectedGudangItem = referensiGudangBahan.find(
    (g) => g.id === selectedGudangId || g.noLot === selectedGudangId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<TreatmentBatchItem> = {
      kodeBatch: formData.kodeBatch,
      tanggalProses: formData.tanggalProses,
      tanggalSelesai: formData.tanggalProses,
      komoditas: formData.komoditas || 'Melon',
      varietas: formData.varietas || 'Melon Tere F1',
      petani: formData.petani || 'Budi Santoso',
      petaniKode: formData.petaniKode || 'BTN-001',
      lahan: formData.lahan || 'LHN-001 / Blok 01',
      noLot: formData.noLot,
      gudangBahanId: formData.gudangBahanId,
      metodeTreatment: formData.metodeTreatment,
      bahan: formData.bahan,
      dosis: formData.dosis,
      jumlahBenih: parseFloat(String(formData.jumlahBenih)) || 200,
      beratAwal: parseFloat(String(formData.jumlahBenih)) || 200,
      operator: formData.operator,
      lokasi: formData.lokasi,
      status: formData.status,
      catatan: formData.catatan,
      treatment: `${formData.metodeTreatment} (${formData.bahan})`,
    };

    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-100 flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0 shadow-2xs">
              <i className="ri-flask-line"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                {editingItem ? 'Edit Data Treatment' : 'Tambah Proses Treatment'}
              </h3>
              <p className="text-[11px] text-gray-500">
                Ambil referensi dari Gudang Bahan Belum Diproses (Status: Sudah Sortasi)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Section 1: Referensi Gudang Bahan (Sudah Sortasi) */}
          <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-emerald-950 flex items-center gap-1.5">
                <i className="ri-archive-line text-emerald-600"></i>
                <span>Pilih Referensi Gudang Bahan Belum Diproses</span>
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                Status: Sudah Sortasi
              </span>
            </div>

            <div className="relative">
              <select
                value={selectedGudangId}
                onChange={(e) => handleSelectGudang(e.target.value)}
                required={!editingItem}
                className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-emerald-200 rounded-lg text-gray-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium cursor-pointer"
              >
                <option value="">-- Pilih Lot Gudang Bahan (Sudah Sortasi) --</option>
                {availableGudangItems.map((g) => (
                  <option key={g.id || g.noLot} value={g.id || g.noLot}>
                    {g.noLot} — {g.komoditas} ({g.varietas}) | Petani: {g.petani || '-'} | {g.beratMasuk} kg | Status: {g.status}
                  </option>
                ))}
              </select>
              <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>

            {/* Selected lot info card */}
            {selectedGudangItem && (
              <div className="bg-white/90 rounded-lg p-3 border border-emerald-200 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px] shadow-2xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">No. Lot</span>
                  <span className="font-bold text-emerald-800">{selectedGudangItem.noLot}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Komoditas / Varietas</span>
                  <span className="font-semibold text-gray-800">
                    {selectedGudangItem.komoditas} / {selectedGudangItem.varietas}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Petani Mitra</span>
                  <span className="font-semibold text-gray-800">
                    {selectedGudangItem.petani || '-'} {selectedGudangItem.petaniKode ? `(${selectedGudangItem.petaniKode})` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Status Bahan</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                    <i className="ri-checkbox-circle-fill text-emerald-600"></i>
                    {selectedGudangItem.status}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Detail Data Treatment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* No. Batch */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                No. Batch Treatment <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.kodeBatch}
                onChange={(e) => setFormData({ ...formData, kodeBatch: e.target.value })}
                placeholder="TR-2026-06-001"
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Tanggal Proses */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Tanggal Proses <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.tanggalProses}
                onChange={(e) => setFormData({ ...formData, tanggalProses: e.target.value })}
                placeholder="02 Jun 2026"
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Komoditas */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Komoditas <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.komoditas}
                onChange={(e) => setFormData({ ...formData, komoditas: e.target.value })}
                placeholder="Melon"
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Varietas */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Varietas <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.varietas}
                onChange={(e) => setFormData({ ...formData, varietas: e.target.value })}
                placeholder="Melon Tere F1"
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Petani Mitra */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Petani Mitra</label>
              <input
                type="text"
                value={formData.petani}
                onChange={(e) => setFormData({ ...formData, petani: e.target.value })}
                placeholder="Budi Santoso"
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Lahan / Blok */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Lahan / Blok</label>
              <input
                type="text"
                value={formData.lahan}
                onChange={(e) => setFormData({ ...formData, lahan: e.target.value })}
                placeholder="LHN-001 / Blok 01"
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Metode Treatment */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Metode Treatment <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.metodeTreatment}
                onChange={(e) => setFormData({ ...formData, metodeTreatment: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                {METODE_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Bahan Treatment */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Bahan Treatment <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  list="bahan-list"
                  value={formData.bahan}
                  onChange={(e) => setFormData({ ...formData, bahan: e.target.value })}
                  placeholder="Carbendazim"
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
                />
                <datalist id="bahan-list">
                  {BAHAN_SUGGESTIONS.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Dosis */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Dosis / Konsentrasi</label>
              <input
                type="text"
                value={formData.dosis}
                onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
                placeholder="2.5 ml/kg"
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Jumlah Benih (kg) */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Jumlah Benih (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={formData.jumlahBenih}
                onChange={(e) =>
                  setFormData({ ...formData, jumlahBenih: parseFloat(e.target.value) || 0 })
                }
                placeholder="200"
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Status Treatment */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Status Treatment <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                <option value="Selesai">Selesai</option>
                <option value="Dalam Proses">Dalam Proses</option>
                <option value="Menunggu">Menunggu</option>
              </select>
            </div>

            {/* Operator */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Operator / Petugas</label>
              <input
                type="text"
                value={formData.operator}
                onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                placeholder="Admin Produksi"
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Lokasi Ruang Treatment</label>
            <input
              type="text"
              value={formData.lokasi}
              onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
              placeholder="Ruang Treatment 1"
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Catatan Proses</label>
            <textarea
              rows={2}
              value={formData.catatan}
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
              placeholder="Tambahkan catatan khusus terkait kualitas benih atau instruksi pengeringan..."
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
            ></textarea>
          </div>

          {/* Info Box Sinkronisasi */}
          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 text-[11px] text-blue-900 flex items-start gap-2">
            <i className="ri-information-line text-blue-600 text-sm mt-0.5 shrink-0"></i>
            <div>
              <p className="font-semibold">Sinkronisasi Otomatis Status Gudang</p>
              <p className="text-blue-700 text-[10.5px] mt-0.5">
                Data referensi diambil dari Gudang Bahan Belum Diproses dengan status <strong>&quot;Sudah Sortasi&quot;</strong>. 
                Setelah treatment disimpan dengan status <strong>&quot;Selesai&quot;</strong>, status gudang bahan akan otomatis menjadi <strong>&quot;Sudah Treatment&quot;</strong>.
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-sm"></i>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <i className="ri-save-line text-sm"></i>
                  <span>Simpan Proses Treatment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
