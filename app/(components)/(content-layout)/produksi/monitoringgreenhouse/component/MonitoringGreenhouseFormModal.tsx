"use client";

import React, { useEffect, useState } from 'react';
import { MonitoringGreenhouseItem } from '@/app/types/monitoringGreenhouse';

interface MonitoringGreenhouseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<MonitoringGreenhouseItem>) => Promise<void>;
  initialData?: MonitoringGreenhouseItem | null;
  mode: 'add' | 'edit';
  lokasiOptions: { value: string; label: string }[];
  komoditasOptions: { value: string; label: string }[];
  varietasOptions: { value: string; label: string }[];
}

export default function MonitoringGreenhouseFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  lokasiOptions,
  komoditasOptions,
  varietasOptions,
}: MonitoringGreenhouseFormModalProps) {
  const [formData, setFormData] = useState<Partial<MonitoringGreenhouseItem>>({
    kodeGreenhouse: '',
    lokasi: 'Blok A - Greenhouse 1',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    luas: 500,
    status: 'Aktif',
    kondisi: 'Baik',
    aktivitasTerakhir: 'Pemeriksaan Rutin',
    catatan: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({ ...initialData });
    } else if (mode === 'add') {
      setFormData({
        kodeGreenhouse: `GH-${String(Math.floor(Math.random() * 90) + 10)}`,
        lokasi: 'Blok A - Greenhouse 1',
        komoditas: 'Padi',
        varietas: 'Inpari 32',
        luas: 500,
        status: 'Aktif',
        kondisi: 'Baik',
        aktivitasTerakhir: 'Penyiraman & Nutrisi',
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
              {mode === 'add' ? 'Tambah Greenhouse Baru' : `Edit Monitoring Greenhouse - ${formData.kodeGreenhouse}`}
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
              <label className="font-semibold text-gray-700 mb-1 block">Kode Greenhouse</label>
              <input
                type="text"
                required
                value={formData.kodeGreenhouse || ''}
                onChange={(e) => setFormData({ ...formData, kodeGreenhouse: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="GH-01"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Lokasi</label>
              <input
                type="text"
                required
                value={formData.lokasi || ''}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="Blok A - Greenhouse 1"
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
                <option value="Tomat">Tomat</option>
                <option value="Cabai">Cabai</option>
                <option value="Mentimun">Mentimun</option>
                <option value="Melon">Melon</option>
                {komoditasOptions
                  .filter((opt) => opt.value && !['Padi', 'Jagung', 'Kedelai', 'Tomat', 'Cabai', 'Mentimun', 'Melon'].includes(opt.value))
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
                <option value="Servo">Servo</option>
                <option value="Laris">Laris</option>
                <option value="Mistar">Mistar</option>
                <option value="Anjasmoro">Anjasmoro</option>
                <option value="Golden">Golden</option>
                {varietasOptions
                  .filter(
                    (opt) =>
                      opt.value &&
                      ![
                        'Inpari 32',
                        'Pioneer 21',
                        'Servo',
                        'Laris',
                        'Mistar',
                        'Anjasmoro',
                        'Golden',
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
              <label className="font-semibold text-gray-700 mb-1 block">Luas (m²)</label>
              <input
                type="number"
                required
                value={formData.luas || ''}
                onChange={(e) => setFormData({ ...formData, luas: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="500"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Kondisi</label>
              <select
                value={formData.kondisi || 'Baik'}
                onChange={(e) => setFormData({ ...formData, kondisi: e.target.value as any })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white"
              >
                <option value="Baik">Baik</option>
                <option value="Perlu Perhatian">Perlu Perhatian</option>
                <option value="Buruk">Buruk</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Status</label>
              <select
                value={formData.status || 'Aktif'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white"
              >
                <option value="Aktif">Aktif</option>
                <option value="Rencana">Rencana</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Aktivitas Terakhir</label>
            <input
              type="text"
              value={formData.aktivitasTerakhir || ''}
              onChange={(e) => setFormData({ ...formData, aktivitasTerakhir: e.target.value })}
              className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Contoh: Penyiraman Otomatis & Nutrisi NPK"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Catatan Tambahan</label>
            <textarea
              rows={2}
              value={formData.catatan || ''}
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
              className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Catatan kondisi lingkungan, kontrol suhu, atau pemeliharaan..."
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
