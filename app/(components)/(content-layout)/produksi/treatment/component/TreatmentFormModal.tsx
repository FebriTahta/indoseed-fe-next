"use client";

import React, { useEffect, useState } from 'react';
import { TreatmentBatchItem } from '@/app/types/treatment';
import { SortasiBatchItem } from '@/app/types/sortasi';

const DEFAULT_SORTASI_LIST: SortasiBatchItem[] = [
  { id: 'sr-1', kodeBatch: 'SR-2606-0001', komoditas: 'Padi', varietas: 'Inpari 32', alatSortasi: 'Air Screen Cleaner 01', beratMasuk: 9650, hasilLulus: 9120, hasilTolak: 530, recovery: 94.51, tanggalSortasi: '11/06/2026', status: 'Selesai' },
  { id: 'sr-2', kodeBatch: 'SR-2606-0002', komoditas: 'Jagung', varietas: 'Pioneer 21', alatSortasi: 'Gravity Separator 02', beratMasuk: 7720, hasilLulus: 7250, hasilTolak: 470, recovery: 93.91, tanggalSortasi: '11/06/2026', status: 'Selesai' },
  { id: 'sr-3', kodeBatch: 'SR-2606-0003', komoditas: 'Kedelai', varietas: 'Anjasmoro', alatSortasi: 'Color Sorter 01', beratMasuk: 5050, hasilLulus: 4720, hasilTolak: 330, recovery: 93.47, tanggalSortasi: '10/06/2026', status: 'Selesai' },
  { id: 'sr-4', kodeBatch: 'SR-2606-0004', komoditas: 'Padi', varietas: 'Inpari 42', alatSortasi: 'Air Screen Cleaner 02', beratMasuk: 7960, hasilLulus: 7550, hasilTolak: 410, recovery: 94.85, tanggalSortasi: '10/06/2026', status: 'Selesai' },
  { id: 'sr-5', kodeBatch: 'SR-2606-0005', komoditas: 'Jagung', varietas: 'Bisi 18', alatSortasi: 'Indent Cylinder 01', beratMasuk: 6180, hasilLulus: 5820, hasilTolak: 360, recovery: 94.17, tanggalSortasi: '09/06/2026', status: 'Selesai' },
];

interface TreatmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TreatmentBatchItem>) => Promise<void>;
  initialData?: TreatmentBatchItem | null;
  mode: 'add' | 'edit';
  komoditasOptions: { value: string; label: string }[];
  varietasOptions: { value: string; label: string }[];
  jenisTreatmentOptions: { value: string; label: string }[];
  lokasiOptions: { value: string; label: string }[];
  sortasiOptions?: SortasiBatchItem[];
}

export default function TreatmentFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  komoditasOptions,
  varietasOptions,
  jenisTreatmentOptions,
  lokasiOptions,
  sortasiOptions,
}: TreatmentFormModalProps) {
  const availableSortasiList = sortasiOptions && sortasiOptions.length > 0 ? sortasiOptions : DEFAULT_SORTASI_LIST;

  const [formData, setFormData] = useState<Partial<TreatmentBatchItem>>({
    kodeBatch: '',
    sortasiId: '',
    referensiSortasi: '',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    treatment: 'Fungisida + Insektisida',
    dosis: '2.5 ml/kg',
    operator: 'Slamet Riyadi',
    beratAwal: 9120,
    beratAkhir: 9050,
    tanggalSelesai: '11/06/2026',
    status: 'Proses',
    lokasi: 'Ruang Treatment 1',
    catatan: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({ ...initialData });
    } else if (mode === 'add') {
      const firstSortasi = availableSortasiList[0];
      const defaultBeratAwal = firstSortasi?.hasilLulus || firstSortasi?.beratMasuk || 9120;
      setFormData({
        sortasiId: firstSortasi?.id,
        referensiSortasi: firstSortasi?.kodeBatch,
        kodeBatch: `TR-2606-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        komoditas: firstSortasi?.komoditas || 'Padi',
        varietas: firstSortasi?.varietas || 'Inpari 32',
        treatment: 'Fungisida + Insektisida',
        dosis: '2.5 ml/kg',
        operator: 'Slamet Riyadi',
        beratAwal: defaultBeratAwal,
        beratAkhir: Math.max(0, defaultBeratAwal - 70),
        tanggalSelesai: '11/06/2026',
        status: 'Proses',
        lokasi: 'Ruang Treatment 1',
        catatan: '',
      });
    }
  }, [initialData, mode, isOpen, sortasiOptions]);

  if (!isOpen) return null;

  const handleSortasiChange = (sortasiIdOrKode: string) => {
    const sortasi = availableSortasiList.find((s) => s.id === sortasiIdOrKode || s.kodeBatch === sortasiIdOrKode);
    if (sortasi) {
      const bAwal = sortasi.hasilLulus || sortasi.beratMasuk || 9120;
      setFormData((prev) => ({
        ...prev,
        sortasiId: sortasi.id,
        referensiSortasi: sortasi.kodeBatch,
        komoditas: sortasi.komoditas,
        varietas: sortasi.varietas,
        beratAwal: bAwal,
        beratAkhir: Math.max(0, bAwal - 70),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        sortasiId: '',
        referensiSortasi: '',
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
              {mode === 'add' ? 'Mulai Treatment Baru' : `Edit Batch Treatment - ${formData.kodeBatch}`}
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
          {/* Referensi Sortasi Dropdown */}
          <div>
            <label className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
              <span>Referensi Sortasi</span>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <i className="ri-links-line"></i> Auto-fill Komoditas & Varietas
              </span>
            </label>
            <select
              value={formData.sortasiId || formData.referensiSortasi || ''}
              onChange={(e) => handleSortasiChange(e.target.value)}
              className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white font-medium focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">-- Pilih Referensi Sortasi --</option>
              {availableSortasiList.map((item) => (
                <option key={item.id || item.kodeBatch} value={item.id || item.kodeBatch}>
                  {item.kodeBatch} | {item.komoditas} - {item.varietas} ({item.alatSortasi || 'Sortasi'}) [{(item.hasilLulus || item.beratMasuk || 0).toLocaleString('id-ID')} Kg]
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Kode Batch Treatment</label>
              <input
                type="text"
                required
                value={formData.kodeBatch || ''}
                onChange={(e) => setFormData({ ...formData, kodeBatch: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="TR-2606-0001"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Operator</label>
              <input
                type="text"
                required
                value={formData.operator || ''}
                onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="Slamet Riyadi"
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
                placeholder="Terisi otomatis dari Sortasi"
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
                placeholder="Terisi otomatis dari Sortasi"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Jenis Treatment</label>
              <select
                value={formData.treatment || 'Fungisida + Insektisida'}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white"
              >
                <option value="Fungisida + Insektisida">Fungisida + Insektisida</option>
                <option value="Fungisida Systemic">Fungisida Systemic</option>
                <option value="Inokulan Rhizobium">Inokulan Rhizobium</option>
                <option value="Fungisida + ZPT">Fungisida + ZPT</option>
                <option value="Insektisida Kontak">Insektisida Kontak</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Dosis Penggunaan</label>
              <input
                type="text"
                required
                value={formData.dosis || ''}
                onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="2.5 ml/kg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Berat Awal (Kg)</label>
              <input
                type="number"
                required
                value={formData.beratAwal || ''}
                onChange={(e) => setFormData({ ...formData, beratAwal: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="9120"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Berat Akhir (Kg)</label>
              <input
                type="number"
                required
                value={formData.beratAkhir || ''}
                onChange={(e) => setFormData({ ...formData, beratAkhir: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="9050"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Tanggal Selesai</label>
              <input
                type="text"
                value={formData.tanggalSelesai || ''}
                onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
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
              placeholder="Catatan homogeneitas pelapisan (seed coating), kadar air pasca treatment, atau nomor sertifikat..."
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
