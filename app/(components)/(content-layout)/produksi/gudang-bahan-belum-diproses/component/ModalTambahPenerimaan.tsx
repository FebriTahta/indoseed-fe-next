"use client";

import React, { useState, useEffect } from 'react';
import {
  GudangBahanItem,
  ReferensiPanenItem,
  CreateGudangBahanPayload,
} from '@/app/types/gudangBahanBelumDiproses';

interface ModalTambahPenerimaanProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateGudangBahanPayload) => void;
  isSaving: boolean;
  referensiPanen: ReferensiPanenItem[];
  editingItem: GudangBahanItem | null;
}

export default function ModalTambahPenerimaan({
  isOpen,
  onClose,
  onSave,
  isSaving,
  referensiPanen,
  editingItem,
}: ModalTambahPenerimaanProps) {
  const [selectedPanenId, setSelectedPanenId] = useState<string>('');
  const [noLot, setNoLot] = useState<string>('');
  const [sumberPanen, setSumberPanen] = useState<string>('');
  const [komoditas, setKomoditas] = useState<string>('');
  const [varietas, setVarietas] = useState<string>('');
  const [petani, setPetani] = useState<string>('');
  const [petaniKode, setPetaniKode] = useState<string>('');
  const [lahan, setLahan] = useState<string>('');
  const [tanggalPanen, setTanggalPanen] = useState<string>('');
  const [tanggalMasuk, setTanggalMasuk] = useState<string>('');
  const [beratMasuk, setBeratMasuk] = useState<number | string>('');
  const [kadarAir, setKadarAir] = useState<number | string>('');
  const [lokasi, setLokasi] = useState<string>('Zona A');
  const [status, setStatus] = useState<string>('Bahan Belum Diproses');
  const [kondisiFisik, setKondisiFisik] = useState<string>('Baik');
  const [petugasPenerima, setPetugasPenerima] = useState<string>('Admin Gudang');
  const [catatan, setCatatan] = useState<string>('');

  useEffect(() => {
    if (editingItem) {
      setSelectedPanenId(editingItem.panenId || '');
      setNoLot(editingItem.noLot);
      setSumberPanen(editingItem.sumberPanen);
      setKomoditas(editingItem.komoditas);
      setVarietas(editingItem.varietas);
      setPetani(editingItem.petani || '');
      setPetaniKode(editingItem.petaniKode || '');
      setLahan(editingItem.lahan || '');
      setTanggalPanen(
        editingItem.tanggalPanen
          ? new Date(editingItem.tanggalPanen).toISOString().split('T')[0]
          : ''
      );
      setTanggalMasuk(
        editingItem.tanggalMasuk
          ? new Date(editingItem.tanggalMasuk).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setBeratMasuk(editingItem.beratMasuk);
      setKadarAir(editingItem.kadarAir);
      setLokasi(editingItem.lokasi || 'Zona A');
      setStatus(editingItem.status || 'Bahan Belum Diproses');
      setKondisiFisik(editingItem.kondisiFisik || 'Baik');
      setPetugasPenerima(editingItem.petugasPenerima || 'Admin Gudang');
      setCatatan(editingItem.catatan || '');
    } else {
      // Default new entry
      setSelectedPanenId('');
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      setNoLot(`LOT-2026-${randomSuffix}`);
      setSumberPanen('');
      setKomoditas('');
      setVarietas('');
      setPetani('');
      setPetaniKode('');
      setLahan('');
      setTanggalPanen('');
      setTanggalMasuk(new Date().toISOString().split('T')[0]);
      setBeratMasuk('');
      setKadarAir('28.5');
      setLokasi('Zona A');
      setStatus('Bahan Belum Diproses');
      setKondisiFisik('Baik');
      setPetugasPenerima('Admin Gudang');
      setCatatan('');
    }
  }, [editingItem, isOpen]);

  // When user selects a Panen reference, auto populate fields
  const handleSelectPanen = (panenId: string) => {
    setSelectedPanenId(panenId);
    const found = referensiPanen.find((p) => p.id === panenId);
    if (found) {
      setSumberPanen(found.kodePanen);
      setKomoditas(found.komoditas);
      setVarietas(found.varietas);
      setPetani(found.petani || 'Budi Santoso');
      setPetaniKode(found.petaniKode || 'BTN-001');
      setLahan(found.lahan || found.blokLahan || 'LHN-001 / Blok 01');
      if (found.tanggalPanen) {
        setTanggalPanen(new Date(found.tanggalPanen).toISOString().split('T')[0]);
      }
      setBeratMasuk(found.produksiKg || found.beratNetto || 850);
      setKadarAir(found.kadarAir && found.kadarAir > 0 ? found.kadarAir : 28.5);
      if (found.kondisiHasil) {
        setKondisiFisik(found.kondisiHasil);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sumberPanen || !komoditas || !varietas || !beratMasuk) {
      alert('Mohon lengkapi sumber panen, komoditas, varietas, dan berat masuk');
      return;
    }

    onSave({
      noLot,
      panenId: selectedPanenId || undefined,
      sumberPanen,
      komoditas,
      varietas,
      petani,
      petaniKode,
      lahan,
      tanggalPanen: tanggalPanen || undefined,
      tanggalMasuk: tanggalMasuk || new Date().toISOString().split('T')[0],
      beratMasuk: parseFloat(String(beratMasuk)) || 0,
      kadarAir: parseFloat(String(kadarAir)) || 0,
      lokasi,
      lokasiDetail: `Gudang Produksi / ${lokasi}`,
      status,
      kondisiFisik,
      petugasPenerima,
      catatan,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {editingItem ? 'Ubah Data Lot Gudang Bahan' : 'Tambah Penerimaan Bahan Belum Diproses'}
              </h2>
              <p className="text-xs text-gray-500">
                Referensi data diambil langsung dari modul hasil panen
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* 1. Referensi Data Panen */}
          <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
            <label className="block text-xs font-bold text-emerald-950">
              Pilih Referensi Hasil Panen <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedPanenId}
              onChange={(e) => handleSelectPanen(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-emerald-200 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">-- Pilih dari Hasil Panen Selesai --</option>
              {referensiPanen.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.kodePanen} - {p.komoditas} / {p.varietas} - {p.petani || 'Petani'} ({p.produksiKg || p.beratNetto || 0} kg)
                </option>
              ))}
            </select>
            <p className="text-[11px] text-emerald-800/80">
              Memilih hasil panen otomatis mengisi komoditas, varietas, petani, lahan, berat hasil, dan kadar air awal.
            </p>
          </div>

          {/* 2. Grid Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Nomor Lot */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Nomor Lot <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={noLot}
                onChange={(e) => setNoLot(e.target.value)}
                placeholder="LOT-2026-00021"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Sumber Panen */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Sumber Panen (Kode Panen) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={sumberPanen}
                onChange={(e) => setSumberPanen(e.target.value)}
                placeholder="PN-2026-0007"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Komoditas */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Komoditas <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={komoditas}
                onChange={(e) => setKomoditas(e.target.value)}
                placeholder="Melon / Cabai / Tomat"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Varietas */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Varietas <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={varietas}
                onChange={(e) => setVarietas(e.target.value)}
                placeholder="Melon Tere F1"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Petani */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Nama Petani</label>
              <input
                type="text"
                value={petani}
                onChange={(e) => setPetani(e.target.value)}
                placeholder="Budi Santoso"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Lahan */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Lahan / Blok</label>
              <input
                type="text"
                value={lahan}
                onChange={(e) => setLahan(e.target.value)}
                placeholder="LHN-001 / Blok 01"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Tanggal Panen */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Tanggal Panen</label>
              <input
                type="date"
                value={tanggalPanen}
                onChange={(e) => setTanggalPanen(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Tanggal Masuk Gudang */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Tanggal Masuk Gudang <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={tanggalMasuk}
                onChange={(e) => setTanggalMasuk(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Berat Masuk (kg) */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Berat Masuk (kg) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={beratMasuk}
                onChange={(e) => setBeratMasuk(e.target.value)}
                placeholder="850"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Kadar Air (%) */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Kadar Air (%) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={kadarAir}
                onChange={(e) => setKadarAir(e.target.value)}
                placeholder="28.5"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Lokasi */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Lokasi Penyimpanan <span className="text-rose-500">*</span>
              </label>
              <select
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Zona A">Zona A (Gudang Produksi)</option>
                <option value="Zona B">Zona B (Gudang Produksi)</option>
                <option value="Zona C">Zona C (Gudang Produksi)</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Bahan Belum Diproses">Bahan Belum Diproses</option>
                <option value="Dalam Pengeringan">Dalam Pengeringan</option>
                <option value="Menunggu Sortasi">Menunggu Sortasi</option>
              </select>
            </div>

            {/* Kondisi Fisik */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Kondisi Fisik Bahan</label>
              <select
                value={kondisiFisik}
                onChange={(e) => setKondisiFisik(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Sangat Baik">Sangat Baik</option>
                <option value="Baik">Baik</option>
                <option value="Cukup">Cukup</option>
                <option value="Lembab">Lembab / Perlu Segera Dikeringkan</option>
              </select>
            </div>

            {/* Petugas Penerima */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Petugas Penerima</label>
              <input
                type="text"
                value={petugasPenerima}
                onChange={(e) => setPetugasPenerima(e.target.value)}
                placeholder="Admin Gudang"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Catatan Penerimaan</label>
            <textarea
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Kondisi kemasan karung, pengamatan visual, dll..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>{editingItem ? 'Simpan Perubahan' : 'Simpan Penerimaan'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
