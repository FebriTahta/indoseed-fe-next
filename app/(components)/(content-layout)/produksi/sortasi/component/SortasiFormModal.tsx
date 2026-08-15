"use client";

import React, { useEffect, useState } from 'react';
import { SortasiBatchItem } from '@/app/types/sortasi';
import { PengeringanBatchItem } from '@/app/types/pengeringan';

const DEFAULT_PENGERINGAN_LIST: PengeringanBatchItem[] = [
  { id: 'png-1', kodeBatch: 'PN-2606-0001', komoditas: 'Padi', varietas: 'Inpari 32', alatPengering: 'DR-01', beratMasuk: 10000, kadarAirMasuk: 19.8, kadarAirTarget: 12.0, kadarAirSaatIni: 12.3, beratKeluar: 9650, status: 'Selesai', selesai: '09/06/2026 15:30' },
  { id: 'png-2', kodeBatch: 'PN-2606-0002', komoditas: 'Jagung', varietas: 'Pioneer 21', alatPengering: 'DR-02', beratMasuk: 8000, kadarAirMasuk: 18.5, kadarAirTarget: 13.0, kadarAirSaatIni: 13.1, beratKeluar: 7720, status: 'Selesai', selesai: '09/06/2026 17:45' },
  { id: 'png-3', kodeBatch: 'PN-2606-0003', komoditas: 'Padi', varietas: 'Ciliwung', alatPengering: 'DR-01', beratMasuk: 10500, kadarAirMasuk: 21.2, kadarAirTarget: 12.0, kadarAirSaatIni: 13.8, beratKeluar: 9800, status: 'Selesai', selesai: '10/06/2026 11:20' },
  { id: 'png-4', kodeBatch: 'PN-2606-0004', komoditas: 'Kedelai', varietas: 'Anjasmoro', alatPengering: 'DR-03', beratMasuk: 6000, kadarAirMasuk: 17.6, kadarAirTarget: 11.5, kadarAirSaatIni: 11.5, beratKeluar: 5050, status: 'Selesai', selesai: '10/06/2026 14:00' },
  { id: 'png-5', kodeBatch: 'PN-2606-0005', komoditas: 'Padi', varietas: 'Inpari 42', alatPengering: 'DR-02', beratMasuk: 9000, kadarAirMasuk: 20.1, kadarAirTarget: 12.0, kadarAirSaatIni: 12.0, beratKeluar: 7960, status: 'Selesai', selesai: '10/06/2026 16:30' },
];

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
  pengeringanOptions?: PengeringanBatchItem[];
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
  pengeringanOptions,
}: SortasiFormModalProps) {
  const availablePengeringanList = pengeringanOptions && pengeringanOptions.length > 0 ? pengeringanOptions : DEFAULT_PENGERINGAN_LIST;
  const [selectedPengeringanId, setSelectedPengeringanId] = useState<string>('');

  const [formData, setFormData] = useState<Partial<SortasiBatchItem>>({
    kodeBatch: '',
    pengeringanId: '',
    referensiPengeringan: '',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    alatSortasi: 'Air Screen Cleaner 01',
    beratMasuk: 9650,
    hasilLulus: 9120,
    hasilTolak: 530,
    recovery: 94.51,
    tanggalSortasi: '11/06/2026',
    status: 'Selesai',
    lokasi: 'Gudang Sortasi 1',
    catatan: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setSelectedPengeringanId(initialData.pengeringanId || initialData.referensiPengeringan || '');
      setFormData({ ...initialData });
    } else if (mode === 'add') {
      setSelectedPengeringanId('');
      setFormData({
        kodeBatch: `SR-2606-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        pengeringanId: '',
        referensiPengeringan: '',
        komoditas: '',
        varietas: '',
        alatSortasi: 'Air Screen Cleaner 01',
        beratMasuk: 0,
        hasilLulus: 0,
        hasilTolak: 0,
        recovery: 0,
        tanggalSortasi: new Date().toISOString().split('T')[0].split('-').reverse().join('/'),
        status: 'Selesai',
        lokasi: 'Gudang Sortasi 1',
        catatan: '',
      });
    }
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handlePengeringanSelect = (idOrKode: string) => {
    setSelectedPengeringanId(idOrKode);
    if (!idOrKode) return;

    const item = availablePengeringanList.find(
      (p) => (p.id && p.id === idOrKode) || p.kodeBatch === idOrKode
    );

    if (item) {
      const bMasuk = item.beratKeluar && item.beratKeluar > 0 ? item.beratKeluar : (item.beratMasuk || 9650);
      const hLulus = Math.round(bMasuk * 0.945);
      const hTolak = bMasuk - hLulus;
      const rec = bMasuk > 0 ? parseFloat(((hLulus / bMasuk) * 100).toFixed(2)) : 0;

      setFormData((prev) => ({
        ...prev,
        pengeringanId: item.id,
        referensiPengeringan: item.kodeBatch,
        komoditas: item.komoditas || prev.komoditas,
        varietas: item.varietas || prev.varietas,
        beratMasuk: bMasuk,
        hasilLulus: hLulus,
        hasilTolak: hTolak,
        recovery: rec,
      }));
    }
  };

  const handleBeratMasukChange = (val: number) => {
    const bMasuk = val || 0;
    const hLulus = formData.hasilLulus || 0;
    const hTolak = Math.max(0, bMasuk - hLulus);
    const rec = bMasuk > 0 ? parseFloat(((hLulus / bMasuk) * 100).toFixed(2)) : 0;
    setFormData((prev) => ({
      ...prev,
      beratMasuk: bMasuk,
      hasilTolak: hTolak,
      recovery: rec,
    }));
  };

  const handleHasilLulusChange = (val: number) => {
    const hLulus = val || 0;
    const bMasuk = formData.beratMasuk || 0;
    const hTolak = Math.max(0, bMasuk - hLulus);
    const rec = bMasuk > 0 ? parseFloat(((hLulus / bMasuk) * 100).toFixed(2)) : 0;
    setFormData((prev) => ({
      ...prev,
      hasilLulus: hLulus,
      hasilTolak: hTolak,
      recovery: rec,
    }));
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
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50 shrink-0">
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

        {/* Form wrapping body and footer */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 text-xs">
          {/* Scrollable Content Body */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            {mode === 'add' && (
              <div className="bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-xl space-y-1.5">
                <label className="block text-emerald-900 font-bold mb-1 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <i className="ri-fire-line text-emerald-600 text-sm"></i>
                    Referensi Pengeringan (Status: Selesai / Proses)
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                    {availablePengeringanList.length} Batch Pengeringan
                  </span>
                </label>
                <select
                  value={selectedPengeringanId}
                  onChange={(e) => handlePengeringanSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-emerald-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-gray-800 text-xs font-medium shadow-xs"
                >
                  <option value="">-- Pilih Referensi Pengeringan --</option>
                  {availablePengeringanList.map((item) => (
                    <option key={item.id || item.kodeBatch} value={item.id || item.kodeBatch}>
                      {item.kodeBatch} - {item.komoditas} ({item.varietas} | Berat Keluar: {item.beratKeluar || item.beratMasuk} Kg)
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-emerald-700/80 italic flex items-center gap-1">
                  <i className="ri-information-line text-xs"></i>
                  <span>Memilih referensi akan mengisi otomatis Komoditas, Varietas, dan Berat Masuk dari Pengeringan.</span>
                </p>
              </div>
            )}

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
                  className={`form-select text-xs border rounded px-3 py-2 w-full ${
                    selectedPengeringanId ? 'bg-gray-100 border-gray-200 text-gray-600' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="">-- Pilih Komoditas --</option>
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
                  className={`form-select text-xs border rounded px-3 py-2 w-full ${
                    selectedPengeringanId ? 'bg-gray-100 border-gray-200 text-gray-600' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="">-- Pilih Varietas --</option>
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
                  onChange={(e) => handleBeratMasukChange(parseFloat(e.target.value) || 0)}
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
                  onChange={(e) => handleHasilLulusChange(parseFloat(e.target.value) || 0)}
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="9120"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 mb-1 block">
                  Hasil Tolak (Kg) <span className="text-[10px] text-gray-400 font-normal">(Otomatis)</span>
                </label>
                <input
                  type="number"
                  readOnly
                  disabled
                  value={formData.hasilTolak || 0}
                  className="form-control text-xs border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed rounded px-3 py-2 w-full"
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
          </div>

          {/* Fixed Footer Buttons */}
          <div className="px-5 py-3 border-t border-gray-100 flex justify-end gap-2 shrink-0 bg-white">
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
