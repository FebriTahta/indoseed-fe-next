"use client";

import React, { useEffect, useState } from 'react';
import { StokBenihItem } from '@/app/types/stokBenih';

interface StokBenihFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<StokBenihItem>) => Promise<void>;
  initialData?: StokBenihItem | null;
  mode: 'add' | 'edit';
  gudangOptions: { value: string; label: string }[];
  produkOptions: { value: string; label: string }[];
  kategoriOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
}

export default function StokBenihFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  gudangOptions,
  produkOptions,
  kategoriOptions,
  statusOptions,
}: StokBenihFormModalProps) {
  const [formData, setFormData] = useState<Partial<StokBenihItem>>({
    produkBenih: 'Padi Inpari 32',
    kategoriBenih: 'Benih Utama',
    batchLot: '',
    tanggalProduksi: '25/05/2026',
    expired: '25/05/2027',
    gudang: 'Gudang A',
    stokKg: 500,
    reservedKg: 150,
    dayaTumbuh: 92,
    status: 'Aman',
    keterangan: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const firstProduk = produkOptions.find((p) => p.value !== '')?.value || '';
    const firstGudang = gudangOptions.find((g) => g.value !== '')?.value || 'Gudang A';
    if (initialData && mode === 'edit') {
      setFormData({ ...initialData });
    } else if (mode === 'add') {
      setFormData({
        produkBenih: firstProduk,
        kategoriBenih: 'Benih Utama',
        batchLot: `LOT-2606-${String(Math.floor(Math.random() * 900) + 100)}`,
        tanggalProduksi: '25/05/2026',
        expired: '25/05/2027',
        gudang: firstGudang,
        stokKg: 500,
        reservedKg: 150,
        dayaTumbuh: 92,
        status: 'Aman',
        keterangan: '',
      });
    }
  }, [initialData, mode, isOpen, produkOptions, gudangOptions]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error('Error submitting form:', err);
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
            <h4 className="font-bold text-sm text-gray-800">
              {mode === 'add' ? 'Tambah Stok Benih Baru' : `Edit Stok Benih - ${formData.batchLot}`}
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Produk Benih</label>
              <select
                value={formData.produkBenih || (produkOptions.find(p => p.value !== '')?.value || '')}
                onChange={(e) => setFormData({ ...formData, produkBenih: e.target.value })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white"
              >
                {produkOptions.filter(p => p.value !== '').map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Kode Batch / Lot</label>
              <input
                type="text"
                required
                value={formData.batchLot || ''}
                onChange={(e) => setFormData({ ...formData, batchLot: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="LOT-2602-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Lokasi Gudang</label>
              <select
                value={formData.gudang || (gudangOptions.find(g => g.value !== '')?.value || '')}
                onChange={(e) => setFormData({ ...formData, gudang: e.target.value })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white"
              >
                {gudangOptions.filter(g => g.value !== '').map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Status Stok</label>
              <select
                value={formData.status || 'Aman'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white"
              >
                <option value="Aman">Aman</option>
                <option value="Exp < 30 Hari">Exp &lt; 30 Hari</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Tanggal Produksi</label>
              <input
                type="text"
                value={formData.tanggalProduksi || ''}
                onChange={(e) => setFormData({ ...formData, tanggalProduksi: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="25/05/2026"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Tanggal Expired</label>
              <input
                type="text"
                value={formData.expired || ''}
                onChange={(e) => setFormData({ ...formData, expired: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="25/05/2027"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Stok Total (Kg)</label>
              <input
                type="number"
                required
                value={formData.stokKg || ''}
                onChange={(e) => setFormData({ ...formData, stokKg: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="500"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Reserved (Kg)</label>
              <input
                type="number"
                value={formData.reservedKg || ''}
                onChange={(e) => setFormData({ ...formData, reservedKg: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="150"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Daya Tumbuh (%)</label>
              <input
                type="number"
                value={formData.dayaTumbuh || ''}
                onChange={(e) => setFormData({ ...formData, dayaTumbuh: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="92"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Keterangan Tambahan</label>
            <textarea
              rows={2}
              value={formData.keterangan || ''}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Keterangan penataan di gudang, palet, atau status sertifikat..."
            />
          </div>

          {/* Footer Buttons */}
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
                  <i className="ri-save-line"></i> Simpan Data
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
