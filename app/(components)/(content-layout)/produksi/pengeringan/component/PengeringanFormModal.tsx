"use client";

import React, { useEffect, useState } from 'react';
import { PengeringanBatchItem } from '@/app/types/pengeringan';
import { PanenItem } from '@/app/services/panenService';

const DEFAULT_PANEN_LIST: PanenItem[] = [
  { id: 'pn-1', kodePanen: 'PN-2606-0001', komoditas: 'Padi', varietas: 'Inpari 32', lahan: 'Lahan A1 (Greenhouse 1)', produksiKg: 10000, kadarAir: 19.8, tanggalPanen: '2026-06-01', luasHa: 2, hasilKgHa: 5000, status: 'Selesai' },
  { id: 'pn-2', kodePanen: 'PN-2606-0002', komoditas: 'Jagung', varietas: 'Pioneer 21', lahan: 'Lahan B2 (Block B)', produksiKg: 8000, kadarAir: 18.5, tanggalPanen: '2026-06-03', luasHa: 1.5, hasilKgHa: 5333, status: 'Selesai' },
  { id: 'pn-3', kodePanen: 'PN-2606-0003', komoditas: 'Padi', varietas: 'Ciliwung', lahan: 'Lahan A2 (Greenhouse 2)', produksiKg: 10500, kadarAir: 21.2, tanggalPanen: '2026-06-05', luasHa: 2.1, hasilKgHa: 5000, status: 'Selesai' },
  { id: 'pn-4', kodePanen: 'PN-2606-0004', komoditas: 'Kedelai', varietas: 'Anjasmoro', lahan: 'Lahan C1 (Plot C)', produksiKg: 6000, kadarAir: 17.6, tanggalPanen: '2026-06-07', luasHa: 1.2, hasilKgHa: 5000, status: 'Selesai' },
  { id: 'pn-5', kodePanen: 'PN-2606-0005', komoditas: 'Padi', varietas: 'Inpari 42', lahan: 'Lahan A3 (Greenhouse 3)', produksiKg: 9000, kadarAir: 20.1, tanggalPanen: '2026-06-09', luasHa: 1.8, hasilKgHa: 5000, status: 'Selesai' },
];

interface PengeringanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<PengeringanBatchItem>) => Promise<void>;
  initialData?: PengeringanBatchItem | null;
  mode: 'add' | 'edit';
  komoditasOptions: { value: string; label: string }[];
  varietasOptions: { value: string; label: string }[];
  alatOptions: { value: string; label: string }[];
  lokasiOptions: { value: string; label: string }[];
  panenOptions?: PanenItem[];
}

export default function PengeringanFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  komoditasOptions,
  varietasOptions,
  alatOptions,
  lokasiOptions,
  panenOptions,
}: PengeringanFormModalProps) {
  const availablePanenList = panenOptions && panenOptions.length > 0 ? panenOptions : DEFAULT_PANEN_LIST;

  const [formData, setFormData] = useState<Partial<PengeringanBatchItem>>({
    kodeBatch: '',
    panenId: '',
    referensiPanen: '',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    alatPengering: 'DR-01',
    beratMasuk: 10000,
    kadarAirMasuk: 19.8,
    kadarAirTarget: 12.0,
    kadarAirSaatIni: 12.3,
    beratKeluar: 9650,
    status: 'Proses',
    selesai: '-',
    lokasi: 'Gudang Pengeringan 1',
    catatan: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({ ...initialData });
    } else if (mode === 'add') {
      const firstPanen = availablePanenList[0];
      setFormData({
        panenId: firstPanen?.id,
        referensiPanen: firstPanen?.kodePanen,
        kodeBatch: `PN-2606-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        komoditas: firstPanen?.komoditas || 'Padi',
        varietas: firstPanen?.varietas || 'Inpari 32',
        alatPengering: 'DR-01',
        beratMasuk: firstPanen?.produksiKg || 10000,
        kadarAirMasuk: firstPanen?.kadarAir || 19.8,
        kadarAirTarget: 12.0,
        kadarAirSaatIni: firstPanen?.kadarAir || 19.8,
        beratKeluar: 0,
        status: 'Proses',
        selesai: '-',
        lokasi: 'Gudang Pengeringan 1',
        catatan: '',
      });
    }
  }, [initialData, mode, isOpen, panenOptions]);

  if (!isOpen) return null;

  const handlePanenChange = (panenIdOrKode: string) => {
    const panen = availablePanenList.find((p) => p.id === panenIdOrKode || p.kodePanen === panenIdOrKode);
    if (panen) {
      setFormData((prev) => ({
        ...prev,
        panenId: panen.id,
        referensiPanen: panen.kodePanen,
        komoditas: panen.komoditas,
        varietas: panen.varietas,
        beratMasuk: panen.produksiKg || prev.beratMasuk || 10000,
        kadarAirMasuk: panen.kadarAir || prev.kadarAirMasuk || 19.8,
        kadarAirSaatIni: panen.kadarAir || prev.kadarAirSaatIni || 19.8,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        panenId: '',
        referensiPanen: '',
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
              {mode === 'add' ? 'Mulai Pengeringan Baru' : `Edit Batch Pengeringan - ${formData.kodeBatch}`}
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
          {/* Referensi Panen Dropdown */}
          <div>
            <label className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
              <span>Referensi Panen</span>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <i className="ri-links-line"></i> Auto-fill Komoditas & Varietas
              </span>
            </label>
            <select
              value={formData.panenId || formData.referensiPanen || ''}
              onChange={(e) => handlePanenChange(e.target.value)}
              className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white font-medium focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">-- Pilih Referensi Panen --</option>
              {availablePanenList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.kodePanen} | {item.komoditas} - {item.varietas} ({item.lahan || 'Lahan'}) {item.produksiKg ? `[${item.produksiKg.toLocaleString('id-ID')} Kg]` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Kode Batch</label>
              <input
                type="text"
                required
                value={formData.kodeBatch || ''}
                onChange={(e) => setFormData({ ...formData, kodeBatch: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="PN-2606-0001"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Alat Pengering</label>
              <select
                value={formData.alatPengering || 'DR-01'}
                onChange={(e) => setFormData({ ...formData, alatPengering: e.target.value })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white"
              >
                <option value="DR-01">DR-01 (Dryer Box 10 Ton)</option>
                <option value="DR-02">DR-02 (Continuous Dryer 5 Ton)</option>
                <option value="DR-03">DR-03 (Dryer Box 10 Ton)</option>
                <option value="DR-04">DR-04 (Continuous Dryer 10 Ton)</option>
              </select>
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
                placeholder="Terisi otomatis dari Panen"
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
                placeholder="Terisi otomatis dari Panen"
              />
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
                placeholder="10000"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Kadar Air Masuk (%)</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.kadarAirMasuk || ''}
                onChange={(e) => setFormData({ ...formData, kadarAirMasuk: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="19.8"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Kadar Air Target (%)</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.kadarAirTarget || ''}
                onChange={(e) => setFormData({ ...formData, kadarAirTarget: parseFloat(e.target.value) || 12.0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="12.0"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Kadar Air Saat Ini (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.kadarAirSaatIni || ''}
                onChange={(e) => setFormData({ ...formData, kadarAirSaatIni: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="12.3"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Berat Keluar (Kg)</label>
              <input
                type="number"
                value={formData.beratKeluar || ''}
                onChange={(e) => setFormData({ ...formData, beratKeluar: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="9650"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Status</label>
              <select
                value={formData.status || 'Proses'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white"
              >
                <option value="Proses">Proses</option>
                <option value="Selesai">Selesai</option>
                <option value="Jeda">Jeda</option>
                <option value="Bermasalah">Bermasalah</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Lokasi Gudang</label>
            <select
              value={formData.lokasi || 'Gudang Pengeringan 1'}
              onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
              className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white"
            >
              <option value="Gudang Pengeringan 1">Gudang Pengeringan 1</option>
              <option value="Gudang Pengeringan 2">Gudang Pengeringan 2</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Catatan Tambahan</label>
            <textarea
              rows={2}
              value={formData.catatan || ''}
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
              className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Catatan kondisi mesin, pengontrol suhu, atau penanganan khusus..."
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
