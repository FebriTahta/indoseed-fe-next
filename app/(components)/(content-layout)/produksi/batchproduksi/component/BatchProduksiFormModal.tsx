"use client";

import React, { useEffect, useState } from 'react';
import { BatchProduksiItem, ReferensiGudangBahanItem } from '@/app/types/batchProduksi';

interface BatchProduksiFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<BatchProduksiItem>) => Promise<void>;
  initialData?: BatchProduksiItem | null;
  mode: 'add' | 'edit';
  komoditasOptions?: { value: string; label: string }[];
  varietasOptions?: { value: string; label: string }[];
  referensiGudangBahanList?: ReferensiGudangBahanItem[];
  lokasiOptions?: { value: string; label: string }[];
}

export default function BatchProduksiFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  komoditasOptions = [],
  varietasOptions = [],
  referensiGudangBahanList = [],
  lokasiOptions = [],
}: BatchProduksiFormModalProps) {
  const [formData, setFormData] = useState<Partial<BatchProduksiItem>>({
    kodeBatch: '',
    gudangBahanId: '',
    noLot: '',
    komoditas: 'Melon',
    varietas: 'Melon Tere F1',
    lokasi: 'GH-001',
    sumberBahan: 'LOT-2026-00021',
    tanggalMulai: '18 Jun 2026',
    tanggalSelesai: '-',
    targetKg: 500,
    hasilKg: 0,
    status: 'Dalam Proses',
    catatan: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      const matchingGudang = referensiGudangBahanList.find(
        (g) => g.noLot === (initialData.noLot || initialData.sumberBahan)
      );
      setFormData({
        ...initialData,
        gudangBahanId: matchingGudang ? matchingGudang.id : '',
        noLot: initialData.noLot || initialData.sumberBahan || '',
      });
    } else if (mode === 'add') {
      const firstGudang = referensiGudangBahanList && referensiGudangBahanList.length > 0
        ? referensiGudangBahanList[0]
        : null;

      const randomSuffix = String(Math.floor(Math.random() * 900) + 100);
      const defaultKode = `BP-2026-06-${randomSuffix}`;

      if (firstGudang) {
        setFormData({
          kodeBatch: defaultKode,
          gudangBahanId: firstGudang.id,
          noLot: firstGudang.noLot,
          sumberBahan: firstGudang.noLot,
          komoditas: firstGudang.komoditas,
          varietas: firstGudang.varietas,
          lokasi: firstGudang.lahan || 'GH-001',
          tanggalMulai: '18 Jun 2026',
          tanggalSelesai: '-',
          targetKg: firstGudang.beratMasuk || 500,
          hasilKg: 0,
          status: 'Dalam Proses',
          catatan: '',
        });
      } else {
        setFormData({
          kodeBatch: defaultKode,
          gudangBahanId: '',
          noLot: 'LOT-2026-00021',
          sumberBahan: 'LOT-2026-00021',
          komoditas: 'Melon',
          varietas: 'Melon Tere F1',
          lokasi: 'GH-001',
          tanggalMulai: '18 Jun 2026',
          tanggalSelesai: '-',
          targetKg: 500,
          hasilKg: 0,
          status: 'Dalam Proses',
          catatan: '',
        });
      }
    }
  }, [initialData, mode, isOpen, referensiGudangBahanList]);

  const selectedLotId =
    formData.gudangBahanId ||
    referensiGudangBahanList.find((g) => g.noLot === (formData.noLot || formData.sumberBahan))?.id ||
    '';

  if (!isOpen) return null;

  const handleGudangBahanChange = (gudangIdOrLot: string) => {
    if (!gudangIdOrLot) {
      setFormData((prev) => ({
        ...prev,
        gudangBahanId: '',
        noLot: '',
        sumberBahan: '',
      }));
      return;
    }

    const selected = referensiGudangBahanList.find(
      (g) => g.id === gudangIdOrLot || g.noLot === gudangIdOrLot
    );

    if (selected) {
      setFormData((prev) => ({
        ...prev,
        gudangBahanId: selected.id,
        noLot: selected.noLot,
        sumberBahan: selected.noLot,
        komoditas: selected.komoditas,
        varietas: selected.varietas,
        lokasi: selected.lahan || prev.lokasi || 'GH-001',
        targetKg: selected.beratMasuk || prev.targetKg || 500,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        gudangBahanId: '',
        noLot: gudangIdOrLot,
        sumberBahan: gudangIdOrLot,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error('Error submitting batch produksi form:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <i className={mode === 'add' ? 'ri-add-line text-lg' : 'ri-pencil-line text-lg'}></i>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-800">
                {mode === 'add' ? 'Tambah Batch Produksi Baru' : `Edit Batch Produksi - ${formData.kodeBatch}`}
              </h4>
              <p className="text-[10px] text-gray-500">
                Ambil referensi dari Gudang Bahan Belum Diproses yang telah selesai di-treatment
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Referensi Gudang Bahan Belum Diproses (Sudah Treatment) */}
          <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200/80 space-y-1.5">
            <label className="font-bold text-emerald-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <i className="ri-database-2-line text-emerald-700"></i>
                Referensi Gudang Bahan Belum Diproses (Sudah di Treatment)
              </span>
              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-semibold">
                Status: Sudah Treatment
              </span>
            </label>
            <select
              value={selectedLotId}
              onChange={(e) => handleGudangBahanChange(e.target.value)}
              className="form-select text-xs border border-emerald-300 rounded px-3 py-2 w-full bg-white font-medium focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">-- Pilih Lot Gudang Bahan (Sudah Treatment) --</option>
              {referensiGudangBahanList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.noLot} | {item.komoditas} - {item.varietas} | Status: {item.status} ({item.beratMasuk} Kg) - {item.lahan || 'Greenhouse'}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-emerald-700">
              * Memilih lot akan otomatis mengisi Komoditas, Varietas, Lahan/Greenhouse, dan Target Produksi.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Nomor Batch Produksi</label>
              <input
                type="text"
                required
                value={formData.kodeBatch || ''}
                onChange={(e) => setFormData({ ...formData, kodeBatch: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full font-semibold"
                placeholder="BP-2026-06-001"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Lahan / Greenhouse</label>
              <input
                type="text"
                required
                value={formData.lokasi || ''}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="GH-001 atau LH-002"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                <span>Komoditas</span>
                <span className="text-[10px] text-emerald-600 font-medium">Auto-fill Lot</span>
              </label>
              <input
                type="text"
                readOnly
                value={formData.komoditas || ''}
                className="form-control text-xs border border-gray-200 bg-gray-50 text-gray-800 rounded px-3 py-2 w-full font-semibold"
                placeholder="Komoditas"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                <span>Varietas</span>
                <span className="text-[10px] text-emerald-600 font-medium">Auto-fill Lot</span>
              </label>
              <input
                type="text"
                readOnly
                value={formData.varietas || ''}
                className="form-control text-xs border border-gray-200 bg-gray-50 text-gray-800 rounded px-3 py-2 w-full font-semibold"
                placeholder="Varietas"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Tanggal Mulai</label>
              <input
                type="text"
                value={formData.tanggalMulai || ''}
                onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="01 Jun 2026"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Tanggal Selesai</label>
              <input
                type="text"
                value={formData.tanggalSelesai || ''}
                onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="18 Jun 2026 atau -"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Target Produksi (Kg)</label>
              <input
                type="number"
                required
                value={formData.targetKg || ''}
                onChange={(e) => setFormData({ ...formData, targetKg: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full font-semibold"
                placeholder="500"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Realisasi (Kg)</label>
              <input
                type="number"
                value={formData.hasilKg || 0}
                onChange={(e) => setFormData({ ...formData, hasilKg: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="480"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Status Batch</label>
              <select
                value={formData.status || 'Dalam Proses'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white font-medium"
              >
                <option value="Dalam Proses">Dalam Proses</option>
                <option value="Selesai">Selesai</option>
                <option value="Tertunda">Tertunda</option>
                <option value="Persiapan">Persiapan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Catatan Tambahan</label>
            <textarea
              rows={2}
              value={formData.catatan || ''}
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
              className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Catatan penanganan batch produksi, standar mutu, lokasi, dsb..."
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md font-semibold text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-[#078836] hover:bg-[#06732d] text-white rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i> Menyimpan...
                </>
              ) : (
                <>
                  <i className="ri-save-line"></i> Simpan Batch Produksi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
