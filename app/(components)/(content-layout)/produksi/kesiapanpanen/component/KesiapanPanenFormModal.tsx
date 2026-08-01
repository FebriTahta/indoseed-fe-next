"use client";

import React, { useEffect, useState } from 'react';
import { KesiapanPanenItem } from '@/app/types/kesiapanPanen';
import { toast } from 'react-toastify';
// @ts-ignore
import SpkDatepickr from '@/shared/@spk-reusable-components/spk-packages/datepicker-component';

interface KesiapanPanenFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<KesiapanPanenItem>) => Promise<void>;
  initialData?: KesiapanPanenItem | null;
  mode: 'add' | 'edit';
  komoditasOptions: { value: string; label: string }[];
  varietasOptions: { value: string; label: string }[];
  lokasiOptions: { value: string; label: string }[];
  jadwalTanamOptions?: any[];
}

const parseDateStr = (dateStr?: string): Date | null => {
  if (!dateStr) return null;
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) return d;
    }
  } else if (dateStr.includes('-')) {
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      if (!isNaN(d.getTime())) return d;
    }
  }
  const d = new Date(dateStr);
  return !isNaN(d.getTime()) ? d : null;
};

const formatDateToStr = (dateObj: Date | null): string => {
  if (!dateObj || isNaN(dateObj.getTime())) return '';
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateToDisplay = (dateVal: any): string => {
  if (!dateVal) return '';
  if (typeof dateVal === 'string') {
    if (dateVal.includes('/')) return dateVal;
    if (dateVal.includes('-')) {
      const parts = dateVal.split('T')[0].split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
  } else if (dateVal instanceof Date && !isNaN(dateVal.getTime())) {
    return formatDateToStr(dateVal);
  }
  return String(dateVal);
};

const calculateHstFromDate = (dateVal: any): number => {
  if (!dateVal) return 0;
  let d: Date | null = null;
  if (typeof dateVal === 'string') {
    if (dateVal.includes('/')) {
      const parts = dateVal.split('/');
      if (parts.length === 3) {
        d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    } else {
      d = new Date(dateVal);
    }
  } else if (dateVal instanceof Date) {
    d = dateVal;
  }

  if (!d || isNaN(d.getTime())) return 0;
  const today = new Date();
  const diffTime = Math.max(0, today.getTime() - d.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export default function KesiapanPanenFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  komoditasOptions,
  varietasOptions,
  lokasiOptions,
  jadwalTanamOptions = [],
}: KesiapanPanenFormModalProps) {
  const [selectedJadwalId, setSelectedJadwalId] = useState<string>('');

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
    if (!isOpen) return;

    if (initialData && mode === 'edit') {
      setFormData({ ...initialData });

      const matchingJadwal = (jadwalTanamOptions || []).find((item: any) => {
        const itemVal = item.id || item.kodeJadwalTanam || item.informasiUmum?.kodeJadwalTanam;
        const itemKode = item.kodeJadwalTanam || item.informasiUmum?.kodeJadwalTanam;
        const targetId = initialData.jadwalTanamId;
        const targetKode = initialData.kodeLahan;

        return (
          (targetId && (item.id === targetId || itemVal === targetId || itemKode === targetId)) ||
          (targetKode && (item.id === targetKode || itemVal === targetKode || itemKode === targetKode))
        );
      });

      if (matchingJadwal) {
        const val = matchingJadwal.id || matchingJadwal.kodeJadwalTanam || matchingJadwal.informasiUmum?.kodeJadwalTanam;
        setSelectedJadwalId(val || '');
      } else {
        setSelectedJadwalId('');
      }
    } else if (mode === 'add') {
      setSelectedJadwalId('');
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
  }, [initialData, mode, isOpen, jadwalTanamOptions]);

  if (!isOpen) return null;

  const handleSelectJadwalTanam = (jadwalId: string) => {
    setSelectedJadwalId(jadwalId);
    if (!jadwalId) return;

    const jt = (jadwalTanamOptions || []).find(
      (item: any) =>
        item.id === jadwalId ||
        item.kodeJadwalTanam === jadwalId ||
        item.informasiUmum?.kodeJadwalTanam === jadwalId
    );

    if (jt) {
      const kode = jt.kodeJadwalTanam || jt.informasiUmum?.kodeJadwalTanam || formData.kodeLahan;
      const lahan = jt.greenhouse?.namaLahan || jt.lahanKomoditas?.namaLahan || jt.lahanKomoditas?.idLahan || jt.lokasi || formData.lokasi;
      const kom = jt.commodity?.namaKomoditas || jt.lahanKomoditas?.namaKomoditas || jt.lahanKomoditas?.komoditas || formData.komoditas;
      const varName = jt.variety?.namaVarietas || jt.lahanKomoditas?.namaVarietas || jt.lahanKomoditas?.varietas || formData.varietas;
      const tglTanamRaw = jt.tanggalTanam || jt.rencanaTanam?.tanggalTanam || formData.tanggalTanam;
      const predPanenRaw = jt.perkiraanPanen || jt.rencanaTanam?.perkiraanPanen || formData.prediksiPanen;

      const greenhouseId = jt.greenhouseId || jt.greenhouse?.id || jt.lahanKomoditas?.idLahan;
      const commodityId = jt.commodityId || jt.commodity?.id;
      const varietyId = jt.varietyId || jt.variety?.id;
      const jadwalTanamId = jt.id;

      const tglTanamFormatted = formatDateToDisplay(tglTanamRaw);
      const predPanenFormatted = formatDateToDisplay(predPanenRaw);
      const calculatedHst = calculateHstFromDate(tglTanamRaw);

      setFormData((prev) => ({
        ...prev,
        kodeLahan: kode,
        lokasi: lahan,
        komoditas: kom,
        varietas: varName,
        greenhouseId: greenhouseId || prev.greenhouseId,
        commodityId: commodityId || prev.commodityId,
        varietyId: varietyId || prev.varietyId,
        jadwalTanamId: jadwalTanamId || prev.jadwalTanamId,
        tanggalTanam: tglTanamFormatted,
        prediksiPanen: predPanenFormatted,
        umurHst: calculatedHst > 0 ? calculatedHst : (prev.umurHst || 105),
      }));

      toast.info(`Otomatis mengadopsi data dari Jadwal Tanam: ${kode}`);
    }
  };

  const handleTanggalTanamChange = (dateObj: Date | null) => {
    const formatted = formatDateToStr(dateObj);
    const hst = calculateHstFromDate(dateObj);
    setFormData((prev) => ({
      ...prev,
      tanggalTanam: formatted,
      umurHst: hst > 0 ? hst : (prev.umurHst || 0),
    }));
  };

  const handlePrediksiPanenChange = (dateObj: Date | null) => {
    const formatted = formatDateToStr(dateObj);
    setFormData((prev) => ({
      ...prev,
      prediksiPanen: formatted,
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
          {/* Option: Pick Jadwal Tanam Reference */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3 space-y-1.5 shadow-2xs">
            <label className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
              <i className="ri-[#078836] ri-seedling-line text-emerald-700"></i> Ambil dari Jadwal Tanam (Isi Otomatis)
            </label>
            <select
              value={selectedJadwalId}
              onChange={(e) => handleSelectJadwalTanam(e.target.value)}
              className="form-select text-xs border border-emerald-300 rounded px-3 py-2 w-full bg-white font-semibold text-gray-800"
            >
              <option value="">-- Pilih Jadwal Tanam / Lahan --</option>
              {(jadwalTanamOptions || []).map((jt: any, idx: number) => {
                const kode = jt.kodeJadwalTanam || jt.informasiUmum?.kodeJadwalTanam || `JT-${idx + 1}`;
                const lahan = jt.greenhouse?.namaLahan || jt.lahanKomoditas?.namaLahan || jt.lahanKomoditas?.idLahan || jt.lokasi || 'Lahan';
                const kom = jt.commodity?.namaKomoditas || jt.lahanKomoditas?.namaKomoditas || jt.lahanKomoditas?.komoditas || '';
                const varName = jt.variety?.namaVarietas || jt.lahanKomoditas?.namaVarietas || jt.lahanKomoditas?.varietas || '';
                const label = `${kode} - ${lahan} (${kom} ${varName})`.trim();
                const val = jt.id || kode;
                return (
                  <option key={val || idx} value={val}>
                    {label}
                  </option>
                );
              })}
            </select>
            <span className="text-[10px] text-emerald-700 italic block">
              * Memilih jadwal tanam akan otomatis mengisi Lokasi/Lahan, Komoditas, Varietas, Tanggal Tanam, Umur (HST), dan Prediksi Panen.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Kode Lahan / Jadwal</label>
              <input
                type="text"
                disabled
                readOnly
                value={formData.kodeLahan || ''}
                className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed rounded-lg focus:outline-none"
                placeholder="Otomatis dari Jadwal Tanam"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Lokasi / Petak / Lahan</label>
              <input
                type="text"
                disabled
                readOnly
                value={formData.lokasi || ''}
                className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed rounded-lg focus:outline-none"
                placeholder="Otomatis dari Jadwal Tanam"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Komoditas</label>
              <input
                type="text"
                disabled
                readOnly
                value={formData.komoditas || ''}
                className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed rounded-lg focus:outline-none"
                placeholder="Otomatis dari Jadwal Tanam"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Varietas</label>
              <input
                type="text"
                disabled
                readOnly
                value={formData.varietas || ''}
                className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed rounded-lg focus:outline-none"
                placeholder="Otomatis dari Jadwal Tanam"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Tanggal Tanam</label>
              <div className="relative">
                <SpkDatepickr
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full pr-8"
                  placeholderText="01/03/2026"
                  selected={parseDateStr(formData.tanggalTanam)}
                  onChange={(date: any) => handleTanggalTanamChange(date)}
                  dateFormat="dd/MM/yyyy"
                />
                <i className="ri-calendar-line absolute right-2.5 top-2 text-gray-400 pointer-events-none text-sm"></i>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Umur (HST)</label>
              <input
                type="number"
                required
                value={formData.umurHst || ''}
                onChange={(e) => setFormData({ ...formData, umurHst: parseInt(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full font-bold text-emerald-800"
                placeholder="105"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Prediksi Panen</label>
              <div className="relative">
                <SpkDatepickr
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full pr-8"
                  placeholderText="15/06/2026"
                  selected={parseDateStr(formData.prediksiPanen)}
                  onChange={(date: any) => handlePrediksiPanenChange(date)}
                  dateFormat="dd/MM/yyyy"
                />
                <i className="ri-calendar-line absolute right-2.5 top-2 text-gray-400 pointer-events-none text-sm"></i>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Status Kesiapan</label>
              <select
                value={formData.statusKesiapan || 'Siap Panen'}
                onChange={(e) => setFormData({ ...formData, statusKesiapan: e.target.value as any })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white font-semibold"
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
