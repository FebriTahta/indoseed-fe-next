"use client";

import React, { useEffect, useState } from 'react';
import { SortasiBatchItem } from '@/app/types/sortasi';

interface SortasiFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<SortasiBatchItem>) => Promise<void>;
  initialData?: SortasiBatchItem | null;
  mode: 'add' | 'edit';
  komoditasOptions: { value: string; label: string }[];
  varietasOptions: { value: string; label: string }[];
  alatOptions: { value: string; label: string }[];
  lokasiOptions: { value: string; label: string }[];
}

export default function SortasiFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  komoditasOptions,
  varietasOptions,
  alatOptions,
  lokasiOptions,
}: SortasiFormModalProps) {
  const [formData, setFormData] = useState<Partial<SortasiBatchItem>>({
    kodeBatch: '',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    alatSortasi: 'Air Screen Cleaner 01',
    beratMasuk: 9650,
    hasilLulus: 9120,
    hasilTolak: 530,
    tanggalSortasi: '11/06/2026',
    status: 'Selesai',
    lokasi: 'Gudang Sortasi 1',
    catatan: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({ ...initialData });
    } else if (mode === 'add') {
      setFormData({
        kodeBatch: `SR-2606-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        komoditas: 'Padi',
        varietas: 'Inpari 32',
        alatSortasi: 'Air Screen Cleaner 01',
        beratMasuk: 9650,
        hasilLulus: 9120,
        hasilTolak: 530,
        tanggalSortasi: '11/06/2026',
        status: 'Selesai',
        lokasi: 'Gudang Sortasi 1',
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
              {mode === 'add' ? 'Mulai Sortasi Baru' : `Edit Batch Sortasi - ${formData.kodeBatch}`}
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
              <label className="font-semibold text-gray-700 mb-1 block">Kode Batch Sortasi</label>
              <input
                type="text"
                required
                value={formData.kodeBatch || ''}
                onChange={(e) => setFormData({ ...formData, kodeBatch: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="SR-2606-0001"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Alat Sortasi</label>
              <select
                value={formData.alatSortasi || 'Air Screen Cleaner 01'}
                onChange={(e) => setFormData({ ...formData, alatSortasi: e.target.value })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white"
              >
                <option value="Air Screen Cleaner 01">Air Screen Cleaner 01</option>
                <option value="Gravity Separator 02">Gravity Separator 02</option>
                <option value="Color Sorter 01">Color Sorter 01</option>
                <option value="Indent Cylinder 01">Indent Cylinder 01</option>
                <option value="Air Screen Cleaner 02">Air Screen Cleaner 02</option>
              </select>
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
                {varietasOptions
                  .filter(
                    (opt) =>
                      opt.value &&
                      !['Inpari 32', 'Pioneer 21', 'Anjasmoro', 'Inpari 42', 'Bisi 18'].includes(opt.value)
                  )
                  .map((opt, idx) => (
                    <option key={idx} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Berat Masuk (Kg)</label>
              <input
                type="number"
                required
                value={formData.beratMasuk || ''}
                onChange={(e) => setFormData({ ...formData, beratMasuk: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="9650"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Hasil Lulus (Kg)</label>
              <input
                type="number"
                required
                value={formData.hasilLulus || ''}
                onChange={(e) => setFormData({ ...formData, hasilLulus: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="9120"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Hasil Tolak (Kg)</label>
              <input
                type="number"
                required
                value={formData.hasilTolak || ''}
                onChange={(e) => setFormData({ ...formData, hasilTolak: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="530"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Tanggal Sortasi</label>
              <input
                type="text"
                value={formData.tanggalSortasi || ''}
                onChange={(e) => setFormData({ ...formData, tanggalSortasi: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="11/06/2026"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Status</label>
              <select
                value={formData.status || 'Selesai'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white"
              >
                <option value="Selesai">Selesai</option>
                <option value="Proses">Proses</option>
                <option value="Pending">Pending</option>
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
              placeholder="Catatan kebersihan kotoran fisik, kadar air pasca sortasi, atau catatan mesin..."
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
