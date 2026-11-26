"use client";

import React, { useEffect, useState } from 'react';
import { MonitoringGreenhouseItem } from '@/app/types/monitoringGreenhouse';
import { MonitoringLahanItem } from '@/app/types/monitoringLahan';

const DEFAULT_LAHAN_LIST: MonitoringLahanItem[] = [
  { id: 'la-1', kodeLahan: 'LA-2605-0001', lokasi: 'Blok A - Petak 1', komoditas: 'Padi', varietas: 'Inpari 32', luas: 12.50, tanggalTanam: '01/05/2026', umurHst: '41 HST', kondisi: 'Baik', status: 'Aktif' },
  { id: 'la-2', kodeLahan: 'LA-2605-0002', lokasi: 'Blok A - Petak 2', komoditas: 'Jagung', varietas: 'Pioneer 21', luas: 8.20, tanggalTanam: '05/05/2026', umurHst: '37 HST', kondisi: 'Baik', status: 'Aktif' },
  { id: 'la-3', kodeLahan: 'LA-2605-0003', lokasi: 'Blok B - Petak 1', komoditas: 'Kedelai', varietas: 'Anjasmoro', luas: 10.00, tanggalTanam: '10/05/2026', umurHst: '32 HST', kondisi: 'Perlu Perhatian', status: 'Aktif' },
  { id: 'la-4', kodeLahan: 'LA-2605-0004', lokasi: 'Blok B - Petak 2', komoditas: 'Padi', varietas: 'Inpari 42', luas: 9.75, tanggalTanam: '02/05/2026', umurHst: '40 HST', kondisi: 'Baik', status: 'Aktif' },
];

interface MonitoringGreenhouseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<MonitoringGreenhouseItem>) => Promise<void>;
  initialData?: MonitoringGreenhouseItem | null;
  mode: 'add' | 'edit';
  lokasiOptions: { value: string; label: string }[];
  komoditasOptions: { value: string; label: string }[];
  varietasOptions: { value: string; label: string }[];
  lahanOptions?: MonitoringLahanItem[];
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
  lahanOptions,
}: MonitoringGreenhouseFormModalProps) {
  const availableLahanList = lahanOptions && lahanOptions.length > 0 ? lahanOptions : DEFAULT_LAHAN_LIST;

  const [formData, setFormData] = useState<Partial<MonitoringGreenhouseItem>>({
    kodeGreenhouse: '',
    lahanId: '',
    referensiLahan: '',
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
      const firstLahan = availableLahanList[0];
      setFormData({
        lahanId: firstLahan?.id,
        referensiLahan: firstLahan?.kodeLahan,
        kodeGreenhouse: `GH-${String(Math.floor(Math.random() * 90) + 10)}`,
        lokasi: firstLahan?.lokasi || 'Blok A - Greenhouse 1',
        komoditas: firstLahan?.komoditas || 'Padi',
        varietas: firstLahan?.varietas || 'Inpari 32',
        luas: 500,
        status: 'Aktif',
        kondisi: 'Baik',
        aktivitasTerakhir: 'Penyiraman & Nutrisi',
        catatan: '',
      });
    }
  }, [initialData, mode, isOpen, lahanOptions]);

  if (!isOpen) return null;

  const handleLahanChange = (lahanIdOrKode: string) => {
    const lahan = availableLahanList.find((l) => l.id === lahanIdOrKode || l.kodeLahan === lahanIdOrKode);
    if (lahan) {
      setFormData((prev) => ({
        ...prev,
        lahanId: lahan.id,
        referensiLahan: lahan.kodeLahan,
        lokasi: lahan.lokasi || prev.lokasi,
        komoditas: lahan.komoditas,
        varietas: lahan.varietas,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        lahanId: '',
        referensiLahan: '',
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
          {/* Referensi Monitoring Lahan Dropdown */}
          <div>
            <label className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
              <span>Referensi Monitoring Lahan</span>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <i className="ri-links-line"></i> Auto-fill Komoditas & Varietas
              </span>
            </label>
            <select
              value={formData.lahanId || formData.referensiLahan || ''}
              onChange={(e) => handleLahanChange(e.target.value)}
              className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white font-medium focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">-- Pilih Referensi Monitoring Lahan --</option>
              {availableLahanList.map((item) => (
                <option key={item.id || item.kodeLahan} value={item.id || item.kodeLahan}>
                  {item.kodeLahan} | {item.komoditas} - {item.varietas} ({item.lokasi || 'Lahan'})
                </option>
              ))}
            </select>
          </div>

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
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full font-medium"
                placeholder="Blok A - Greenhouse 1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                <span>Komoditas</span>
                <span className="text-[10px] text-gray-400 font-normal flex items-center gap-1">
                  <i className="ri-lock-2-line"></i> Tidak dapat dipilih
                </span>
              </label>
              <input
                type="text"
                disabled
                value={formData.komoditas || ''}
                className="form-control text-xs border border-gray-200 bg-gray-100 text-gray-600 rounded px-3 py-2 w-full cursor-not-allowed font-medium select-none"
                placeholder="Terisi otomatis dari Monitoring Lahan"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                <span>Varietas</span>
                <span className="text-[10px] text-gray-400 font-normal flex items-center gap-1">
                  <i className="ri-lock-2-line"></i> Tidak dapat dipilih
                </span>
              </label>
              <input
                type="text"
                disabled
                value={formData.varietas || ''}
                className="form-control text-xs border border-gray-200 bg-gray-100 text-gray-600 rounded px-3 py-2 w-full cursor-not-allowed font-medium select-none"
                placeholder="Terisi otomatis dari Monitoring Lahan"
              />
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
