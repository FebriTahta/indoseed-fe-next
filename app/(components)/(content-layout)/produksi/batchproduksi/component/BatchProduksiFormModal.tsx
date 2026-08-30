"use client";

import React, { useEffect, useState } from 'react';
import { BatchProduksiItem } from '@/app/types/batchProduksi';
import { TreatmentBatchItem } from '@/app/types/treatment';

const DEFAULT_TREATMENT_LIST: TreatmentBatchItem[] = [
  { id: 'tr-1', kodeBatch: 'TR-2606-0001', komoditas: 'Padi', varietas: 'Inpari 32', treatment: 'Fungisida + Insektisida', dosis: '2.5 ml/kg', operator: 'Slamet Riyadi', beratAwal: 9120, beratAkhir: 9050, loss: 0.77, tanggalSelesai: '11/06/2026', status: 'Selesai' },
  { id: 'tr-2', kodeBatch: 'TR-2606-0002', komoditas: 'Jagung', varietas: 'Pioneer 21', treatment: 'Fungisida Systemic', dosis: '3.0 ml/kg', operator: 'Rina Agustina', beratAwal: 7250, beratAkhir: 7190, loss: 0.83, tanggalSelesai: '11/06/2026', status: 'Selesai' },
  { id: 'tr-3', kodeBatch: 'TR-2606-0003', komoditas: 'Kedelai', varietas: 'Anjasmoro', treatment: 'Inokulan Rhizobium', dosis: '5.0 gram/kg', operator: 'Budi Santoso', beratAwal: 4720, beratAkhir: 4680, loss: 0.85, tanggalSelesai: '10/06/2026', status: 'Selesai' },
  { id: 'tr-4', kodeBatch: 'TR-2606-0004', komoditas: 'Padi', varietas: 'Inpari 42', treatment: 'Fungisida + ZPT', dosis: '2.0 ml/kg', operator: 'Slamet Riyadi', beratAwal: 7550, beratAkhir: 7490, loss: 0.79, tanggalSelesai: '10/06/2026', status: 'Selesai' },
  { id: 'tr-5', kodeBatch: 'TR-2606-0005', komoditas: 'Jagung', varietas: 'Bisi 18', treatment: 'Insektisida Kontak', dosis: '3.5 ml/kg', operator: 'Ahmad Dahlan', beratAwal: 5820, beratAkhir: 5770, loss: 0.86, tanggalSelesai: '09/06/2026', status: 'Selesai' },
];

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
  treatmentOptions?: TreatmentBatchItem[];
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
  treatmentOptions,
}: BatchProduksiFormModalProps) {
  const availableTreatmentList = treatmentOptions && treatmentOptions.length > 0 ? treatmentOptions : DEFAULT_TREATMENT_LIST;

  const [formData, setFormData] = useState<Partial<BatchProduksiItem>>({
    kodeBatch: '',
    treatmentId: '',
    referensiTreatment: '',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    sumberBahan: 'TR-2606-0001',
    tanggalMulai: '01/06/2026',
    tanggalSelesai: '07/06/2026',
    targetKg: 9050,
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
      const firstTreatment = availableTreatmentList[0];
      const defaultTargetKg = firstTreatment?.beratAkhir || firstTreatment?.beratAwal || 9050;
      setFormData({
        treatmentId: firstTreatment?.id,
        referensiTreatment: firstTreatment?.kodeBatch,
        kodeBatch: `BP-2606-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        komoditas: firstTreatment?.komoditas || 'Padi',
        varietas: firstTreatment?.varietas || 'Inpari 32',
        sumberBahan: firstTreatment?.kodeBatch || 'TR-2606-0001',
        tanggalMulai: '01/06/2026',
        tanggalSelesai: '07/06/2026',
        targetKg: defaultTargetKg,
        hasilKg: 0,
        status: 'Proses',
        lokasi: 'Blok A',
        catatan: '',
      });
    }
  }, [initialData, mode, isOpen, treatmentOptions]);

  if (!isOpen) return null;

  const handleTreatmentChange = (treatmentIdOrKode: string) => {
    const treatment = availableTreatmentList.find((t) => t.id === treatmentIdOrKode || t.kodeBatch === treatmentIdOrKode);
    if (treatment) {
      const tKg = treatment.beratAkhir || treatment.beratAwal || 9050;
      setFormData((prev) => ({
        ...prev,
        treatmentId: treatment.id,
        referensiTreatment: treatment.kodeBatch,
        sumberBahan: treatment.kodeBatch,
        komoditas: treatment.komoditas,
        varietas: treatment.varietas,
        targetKg: tKg,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        treatmentId: '',
        referensiTreatment: '',
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
          {/* Referensi Treatment Dropdown */}
          <div>
            <label className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
              <span>Referensi Treatment</span>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <i className="ri-links-line"></i> Auto-fill Komoditas & Varietas
              </span>
            </label>
            <select
              value={formData.treatmentId || formData.referensiTreatment || ''}
              onChange={(e) => handleTreatmentChange(e.target.value)}
              className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white font-medium focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">-- Pilih Referensi Treatment --</option>
              {availableTreatmentList.map((item) => (
                <option key={item.id || item.kodeBatch} value={item.id || item.kodeBatch}>
                  {item.kodeBatch} | {item.komoditas} - {item.varietas} ({item.treatment || 'Treatment'}) [{(item.beratAkhir || item.beratAwal || 0).toLocaleString('id-ID')} Kg]
                </option>
              ))}
            </select>
          </div>

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
              <label className="font-semibold text-gray-700 mb-1 block">Sumber Bahan / Lot Treatment</label>
              <input
                type="text"
                required
                value={formData.sumberBahan || ''}
                onChange={(e) => setFormData({ ...formData, sumberBahan: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full font-medium"
                placeholder="TR-2606-0001"
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
                placeholder="Terisi otomatis dari Treatment"
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
                placeholder="Terisi otomatis dari Treatment"
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
                placeholder="9050"
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
