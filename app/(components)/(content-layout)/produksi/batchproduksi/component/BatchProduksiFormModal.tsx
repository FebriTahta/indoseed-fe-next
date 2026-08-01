"use client";

import React, { useEffect, useState } from 'react';
import { BatchProduksiItem } from '@/app/types/batchProduksi';

interface BatchProduksiFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<BatchProduksiItem>) => Promise<void>;
  initialData?: BatchProduksiItem | null;
  mode: 'add' | 'edit';
  komoditasOptions: { value: string; label: string }[];
  varietasOptions: { value: string; label: string }[];
  sumberBahanOptions: { value: string; label: string }[];
  lokasiOptions: { value: string; label: string }[];
}

export default function BatchProduksiFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  komoditasOptions,
  varietasOptions,
  sumberBahanOptions,
  lokasiOptions,
}: BatchProduksiFormModalProps) {
  const [formData, setFormData] = useState<Partial<BatchProduksiItem>>({
    kodeBatch: '',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    sumberBahan: 'PN-2605-0150',
    tanggalMulai: '01/06/2026',
    tanggalSelesai: '07/06/2026',
    targetKg: 10000,
    hasilKg: 8750,
    status: 'Proses',
    lokasi: 'Blok A',
    catatan: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({ ...initialData });
    } else if (mode === 'add') {
      setFormData({
        kodeBatch: `BP-2606-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        komoditas: 'Padi',
        varietas: 'Inpari 32',
        sumberBahan: 'PN-2605-0150',
        tanggalMulai: '01/06/2026',
        tanggalSelesai: '07/06/2026',
        targetKg: 10000,
        hasilKg: 0,
        status: 'Proses',
        lokasi: 'Blok A',
        catatan: '',
      });
    }
  }, [initialData, mode, isOpen]);

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
              {mode === 'add' ? 'Buat Batch Produksi Baru' : `Edit Batch Produksi - ${formData.kodeBatch}`}
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
              <label className="font-semibold text-gray-700 mb-1 block">Kode Batch Produksi</label>
              <input
                type="text"
                required
                value={formData.kodeBatch || ''}
                onChange={(e) => setFormData({ ...formData, kodeBatch: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="BP-2606-0001"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Sumber Bahan / Lot Panen</label>
              <input
                type="text"
                required
                value={formData.sumberBahan || ''}
                onChange={(e) => setFormData({ ...formData, sumberBahan: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="PN-2605-0150"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Komoditas</label>
              <select
                value={formData.komoditas || ''}
                onChange={(e) => setFormData({ ...formData, komoditas: e.target.value })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white"
              >
                <option value="Padi">Padi</option>
                <option value="Jagung">Jagung</option>
                <option value="Kedelai">Kedelai</option>
                {komoditasOptions
                  .filter((opt) => opt.value && !['Padi', 'Jagung', 'Kedelai'].includes(opt.value))
                  .map((opt, idx) => (
                    <option key={idx} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Varietas</label>
              <select
                value={formData.varietas || ''}
                onChange={(e) => setFormData({ ...formData, varietas: e.target.value })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white"
              >
                <option value="Inpari 32">Inpari 32</option>
                <option value="Pioneer 21">Pioneer 21</option>
                <option value="Anjasmoro">Anjasmoro</option>
                <option value="Inpari 42">Inpari 42</option>
                <option value="Bisi 18">Bisi 18</option>
                <option value="Dega 1">Dega 1</option>
                <option value="Ciherang">Ciherang</option>
                {varietasOptions
                  .filter(
                    (opt) =>
                      opt.value &&
                      ![
                        'Inpari 32',
                        'Pioneer 21',
                        'Anjasmoro',
                        'Inpari 42',
                        'Bisi 18',
                        'Dega 1',
                        'Ciherang',
                      ].includes(opt.value)
                  )
                  .map((opt, idx) => (
                    <option key={idx} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
              </select>
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
                placeholder="01/06/2026"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Tanggal Selesai</label>
              <input
                type="text"
                value={formData.tanggalSelesai || ''}
                onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="07/06/2026"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Target (Kg)</label>
              <input
                type="number"
                required
                value={formData.targetKg || ''}
                onChange={(e) => setFormData({ ...formData, targetKg: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="10000"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Hasil Realisasi (Kg)</label>
              <input
                type="number"
                value={formData.hasilKg || ''}
                onChange={(e) => setFormData({ ...formData, hasilKg: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="8750"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Status Batch</label>
              <select
                value={formData.status || 'Proses'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white"
              >
                <option value="Proses">Proses</option>
                <option value="Selesai">Selesai</option>
                <option value="Reject">Reject / Gagal</option>
                <option value="Belum Mulai">Belum Mulai</option>
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
              placeholder="Catatan penanganan batch, QC awal, atau sertifikasi benih..."
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
                  <i className="ri-save-line"></i> Simpan Batch
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
