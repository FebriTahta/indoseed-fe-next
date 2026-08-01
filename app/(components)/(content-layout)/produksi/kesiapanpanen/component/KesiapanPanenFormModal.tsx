"use client";

import React, { useEffect, useState } from 'react';
import { KesiapanPanenItem } from '@/app/types/kesiapanPanen';

interface KesiapanPanenFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<KesiapanPanenItem>) => Promise<void>;
  initialData?: KesiapanPanenItem | null;
  mode: 'add' | 'edit';
  komoditasOptions: { value: string; label: string }[];
  varietasOptions: { value: string; label: string }[];
  lokasiOptions: { value: string; label: string }[];
}

export default function KesiapanPanenFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  komoditasOptions,
  varietasOptions,
  lokasiOptions,
}: KesiapanPanenFormModalProps) {
  const [formData, setFormData] = useState<Partial<KesiapanPanenItem>>({
    kodeLahan: '',
    lokasi: 'Blok A - Petak 1',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    tanggalTanam: '01/03/2026',
    umurHst: 105,
    prediksiPanen: '15/06/2026',
    statusKesiapan: 'Siap Panen',
    yieldEst: 6800,
    kadarAir: 14.0,
    kuningDaun: 85,
    kekerasanBiji: 'Keras',
    catatan: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({ ...initialData });
    } else if (mode === 'add') {
      setFormData({
        kodeLahan: `LA-2605-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        lokasi: 'Blok A - Petak 1',
        komoditas: 'Padi',
        varietas: 'Inpari 32',
        tanggalTanam: '01/03/2026',
        umurHst: 105,
        prediksiPanen: '15/06/2026',
        statusKesiapan: 'Siap Panen',
        yieldEst: 6800,
        kadarAir: 14.0,
        kuningDaun: 85,
        kekerasanBiji: 'Keras',
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
              {mode === 'add' ? 'Tambah Data Kesiapan Panen' : `Edit Kesiapan Panen - ${formData.kodeLahan}`}
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
              <label className="font-semibold text-gray-700 mb-1 block">Kode Lahan</label>
              <input
                type="text"
                required
                value={formData.kodeLahan || ''}
                onChange={(e) => setFormData({ ...formData, kodeLahan: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="LA-2605-0001"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Lokasi / Petak</label>
              <input
                type="text"
                value={formData.lokasi || ''}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="Blok A - Petak 1"
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
                <option value="Ciherang">Ciherang</option>
                <option value="Dega 1">Dega 1</option>
                <option value="Mekongga">Mekongga</option>
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
                        'Ciherang',
                        'Dega 1',
                        'Mekongga',
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Tanggal Tanam</label>
              <input
                type="text"
                value={formData.tanggalTanam || ''}
                onChange={(e) => setFormData({ ...formData, tanggalTanam: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="01/03/2026"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Umur (HST)</label>
              <input
                type="number"
                required
                value={formData.umurHst || ''}
                onChange={(e) => setFormData({ ...formData, umurHst: parseInt(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="105"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Prediksi Panen</label>
              <input
                type="text"
                value={formData.prediksiPanen || ''}
                onChange={(e) => setFormData({ ...formData, prediksiPanen: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="15/06/2026"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Status Kesiapan</label>
              <select
                value={formData.statusKesiapan || 'Siap Panen'}
                onChange={(e) => setFormData({ ...formData, statusKesiapan: e.target.value as any })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white"
              >
                <option value="Siap Panen">Siap Panen</option>
                <option value="Akan Siap (3-7 Hari)">Akan Siap (3-7 Hari)</option>
                <option value="Akan Siap (8-14 Hari)">Akan Siap (8-14 Hari)</option>
                <option value="Belum Siap">Belum Siap</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Estimasi Hasil (Kg/Ha)</label>
              <input
                type="number"
                required
                value={formData.yieldEst || ''}
                onChange={(e) => setFormData({ ...formData, yieldEst: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="6800"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Catatan Tambahan</label>
            <textarea
              rows={2}
              value={formData.catatan || ''}
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
              className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Catatan kondisi kematangan bulir/daun atau kesiapan alat panen..."
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
