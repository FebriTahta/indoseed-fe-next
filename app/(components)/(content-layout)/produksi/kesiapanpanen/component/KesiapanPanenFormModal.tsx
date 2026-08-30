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

export const calculateStatusKesiapan = (dateVal: any): string => {
  if (!dateVal) return 'Belum Siap';
  let d: Date | null = null;
  if (typeof dateVal === 'string') {
    if (dateVal.includes('/')) {
      const parts = dateVal.split('/');
      if (parts.length === 3) {
        d = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      }
    } else if (dateVal.includes('-')) {
      const parts = dateVal.split('T')[0].split('-');
      if (parts.length === 3) {
        d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      }
    } else {
      d = new Date(dateVal);
    }
  } else if (dateVal instanceof Date) {
    d = dateVal;
  }

  if (!d || isNaN(d.getTime())) return 'Belum Siap';

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const diffMs = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 2) {
    return 'Siap Panen';
  } else if (diffDays >= 3 && diffDays <= 7) {
    return 'Akan Siap (3-7 Hari)';
  } else if (diffDays >= 8 && diffDays <= 14) {
    return 'Akan Siap (8-14 Hari)';
  } else {
    return 'Belum Siap';
  }
};

export const generateKodeKP = (seqNo: number = 1): string => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const seqStr = String(seqNo).padStart(4, '0');
  return `KP-${yy}${mm}-${seqStr}`;
};

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
  existingCount?: number;
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
  jadwalTanamOptions = [],
  existingCount = 0,
}: KesiapanPanenFormModalProps) {
  const [selectedJadwalId, setSelectedJadwalId] = useState<string>('');

  const [formData, setFormData] = useState<Partial<KesiapanPanenItem>>({
    kodeLahan: generateKodeKP(existingCount + 1),
    lokasi: '',
    komoditas: '',
    varietas: '',
    tanggalTanam: formatDateToStr(new Date()),
    umurHst: 0,
    prediksiPanen: formatDateToStr(new Date()),
    statusKesiapan: calculateStatusKesiapan(new Date()),
    yieldEst: 0,
    kadarAir: 0,
    kuningDaun: 0,
    kekerasanBiji: '',
    catatan: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData && mode === 'edit') {
      const autoStatus = calculateStatusKesiapan(initialData.prediksiPanen);
      setFormData({
        ...initialData,
        statusKesiapan: autoStatus,
      });

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
      const firstJadwal = (jadwalTanamOptions || [])[0];
      const todayStr = formatDateToStr(new Date());
      const nextNo = (existingCount || 0) + 1;

      if (firstJadwal) {
        const val = firstJadwal.id || firstJadwal.kodeJadwalTanam || firstJadwal.informasiUmum?.kodeJadwalTanam || '';
        setSelectedJadwalId(val);
        const lahan = firstJadwal.greenhouse?.namaLahan || firstJadwal.lahanKomoditas?.namaLahan || firstJadwal.lahanKomoditas?.idLahan || firstJadwal.lokasi || '';
        const kom = firstJadwal.commodity?.namaKomoditas || firstJadwal.lahanKomoditas?.namaKomoditas || firstJadwal.lahanKomoditas?.komoditas || '';
        const varName = firstJadwal.variety?.namaVarietas || firstJadwal.lahanKomoditas?.namaVarietas || firstJadwal.lahanKomoditas?.varietas || '';
        const tglTanamRaw = firstJadwal.tanggalTanam || firstJadwal.rencanaTanam?.tanggalTanam || todayStr;
        const predPanenRaw = firstJadwal.perkiraanPanen || firstJadwal.rencanaTanam?.perkiraanPanen || todayStr;

        const tglTanamFormatted = formatDateToDisplay(tglTanamRaw);
        const predPanenFormatted = formatDateToDisplay(predPanenRaw);
        const calculatedHst = calculateHstFromDate(tglTanamRaw);
        const autoStatus = calculateStatusKesiapan(predPanenRaw);

        setFormData({
          kodeLahan: generateKodeKP(nextNo),
          lokasi: lahan,
          komoditas: kom,
          varietas: varName,
          greenhouseId: firstJadwal.greenhouseId || firstJadwal.greenhouse?.id || firstJadwal.lahanKomoditas?.idLahan,
          commodityId: firstJadwal.commodityId || firstJadwal.commodity?.id,
          varietyId: firstJadwal.varietyId || firstJadwal.variety?.id,
          jadwalTanamId: firstJadwal.id,
          tanggalTanam: tglTanamFormatted,
          prediksiPanen: predPanenFormatted,
          umurHst: calculatedHst,
          statusKesiapan: autoStatus,
          yieldEst: 0,
          kadarAir: 0,
          kuningDaun: 0,
          kekerasanBiji: '',
          catatan: '',
        });
      } else {
        setSelectedJadwalId('');
        setFormData({
          kodeLahan: generateKodeKP(nextNo),
          lokasi: '',
          komoditas: '',
          varietas: '',
          tanggalTanam: todayStr,
          umurHst: 0,
          prediksiPanen: todayStr,
          statusKesiapan: calculateStatusKesiapan(todayStr),
          yieldEst: 0,
          kadarAir: 0,
          kuningDaun: 0,
          kekerasanBiji: '',
          catatan: '',
        });
      }
    }
  }, [initialData, mode, isOpen, jadwalTanamOptions, existingCount]);

  if (!isOpen) return null;

  const handleSelectJadwalTanam = (jadwalId: string) => {
    setSelectedJadwalId(jadwalId);
    if (!jadwalId) {
      const todayStr = formatDateToStr(new Date());
      const nextNo = (existingCount || 0) + 1;
      setFormData((prev) => ({
        ...prev,
        kodeLahan: generateKodeKP(nextNo),
        lokasi: '',
        komoditas: '',
        varietas: '',
        tanggalTanam: todayStr,
        umurHst: 0,
        prediksiPanen: todayStr,
        statusKesiapan: calculateStatusKesiapan(todayStr),
        yieldEst: 0,
        greenhouseId: undefined,
        commodityId: undefined,
        varietyId: undefined,
        jadwalTanamId: undefined,
      }));
      return;
    }

    const jt = (jadwalTanamOptions || []).find(
      (item: any) =>
        item.id === jadwalId ||
        item.kodeJadwalTanam === jadwalId ||
        item.informasiUmum?.kodeJadwalTanam === jadwalId
    );

    if (jt) {
      const kode = jt.kodeJadwalTanam || jt.informasiUmum?.kodeJadwalTanam || formData.kodeLahan;
      const lahan = jt.greenhouse?.namaLahan || jt.lahanKomoditas?.namaLahan || jt.lahanKomoditas?.idLahan || jt.lokasi || '';
      const kom = jt.commodity?.namaKomoditas || jt.lahanKomoditas?.namaKomoditas || jt.lahanKomoditas?.komoditas || '';
      const varName = jt.variety?.namaVarietas || jt.lahanKomoditas?.namaVarietas || jt.lahanKomoditas?.varietas || '';
      const tglTanamRaw = jt.tanggalTanam || jt.rencanaTanam?.tanggalTanam || formatDateToStr(new Date());
      const predPanenRaw = jt.perkiraanPanen || jt.rencanaTanam?.perkiraanPanen || formatDateToStr(new Date());

      const greenhouseId = jt.greenhouseId || jt.greenhouse?.id || jt.lahanKomoditas?.idLahan;
      const commodityId = jt.commodityId || jt.commodity?.id;
      const varietyId = jt.varietyId || jt.variety?.id;
      const jadwalTanamId = jt.id;

      const tglTanamFormatted = formatDateToDisplay(tglTanamRaw);
      const predPanenFormatted = formatDateToDisplay(predPanenRaw);
      const calculatedHst = calculateHstFromDate(tglTanamRaw);
      const autoStatus = calculateStatusKesiapan(predPanenRaw);

      setFormData((prev) => ({
        ...prev,
        kodeLahan: (prev.kodeLahan && prev.kodeLahan.startsWith('KP-')) ? prev.kodeLahan : generateKodeKP(),
        lokasi: lahan,
        komoditas: kom,
        varietas: varName,
        greenhouseId: greenhouseId || prev.greenhouseId,
        commodityId: commodityId || prev.commodityId,
        varietyId: varietyId || prev.varietyId,
        jadwalTanamId: jadwalTanamId || prev.jadwalTanamId,
        tanggalTanam: tglTanamFormatted,
        prediksiPanen: predPanenFormatted,
        umurHst: calculatedHst,
        statusKesiapan: autoStatus,
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
    const autoStatus = calculateStatusKesiapan(dateObj);
    setFormData((prev) => ({
      ...prev,
      prediksiPanen: formatted,
      statusKesiapan: autoStatus,
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
          {/* Referensi Jadwal Tanam Dropdown */}
          <div>
            <label className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
              <span>Referensi Jadwal Tanam</span>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <i className="ri-links-line"></i> Auto-fill Komoditas & Varietas
              </span>
            </label>
            <select
              value={selectedJadwalId}
              onChange={(e) => handleSelectJadwalTanam(e.target.value)}
              className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white font-medium focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">-- Pilih Referensi Jadwal Tanam --</option>
              {(jadwalTanamOptions || []).map((jt: any, idx: number) => {
                const kode = jt.kodeJadwalTanam || jt.informasiUmum?.kodeJadwalTanam || `JT-${idx + 1}`;
                const lahan = jt.greenhouse?.namaLahan || jt.lahanKomoditas?.namaLahan || jt.lahanKomoditas?.idLahan || jt.lokasi || 'Lahan';
                const kom = jt.commodity?.namaKomoditas || jt.lahanKomoditas?.namaKomoditas || jt.lahanKomoditas?.komoditas || '';
                const varName = jt.variety?.namaVarietas || jt.lahanKomoditas?.namaVarietas || jt.lahanKomoditas?.varietas || '';
                const val = jt.id || kode;
                return (
                  <option key={val || idx} value={val}>
                    {kode} | {kom || 'Komoditas'} - {varName || 'Varietas'} ({lahan || 'Lahan'})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                <span>Kode Kesiapan Panen</span>
              </label>
              <input
                type="text"
                disabled
                readOnly
                value={formData.kodeLahan || ''}
                className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-700 cursor-not-allowed rounded-lg focus:outline-none font-semibold text-xs"
                placeholder="KP-XXXX-XXXX"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Lokasi / Petak / Lahan</label>
              <input
                type="text"
                disabled
                readOnly
                value={formData.lokasi || ''}
                className="form-control text-xs border border-gray-200 bg-gray-100 text-gray-600 rounded px-3 py-2 w-full cursor-not-allowed font-medium select-none"
                placeholder="Terisi otomatis dari Jadwal Tanam"
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
                readOnly
                value={formData.komoditas || ''}
                className="form-control text-xs border border-gray-200 bg-gray-100 text-gray-600 rounded px-3 py-2 w-full cursor-not-allowed font-medium select-none"
                placeholder="Terisi otomatis dari Jadwal Tanam"
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
                readOnly
                value={formData.varietas || ''}
                className="form-control text-xs border border-gray-200 bg-gray-100 text-gray-600 rounded px-3 py-2 w-full cursor-not-allowed font-medium select-none"
                placeholder="Terisi otomatis dari Jadwal Tanam"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Tanggal Tanam</label>
              <div className="relative">
                <SpkDatepickr
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full pr-8"
                  placeholderText={formatDateToStr(new Date())}
                  selected={parseDateStr(formData.tanggalTanam) || new Date()}
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
                value={formData.umurHst !== undefined && formData.umurHst !== 0 ? formData.umurHst : ''}
                onChange={(e) => setFormData({ ...formData, umurHst: parseInt(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full font-bold text-emerald-800"
                placeholder="0"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Prediksi Panen</label>
              <div className="relative">
                <SpkDatepickr
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full pr-8"
                  placeholderText={formatDateToStr(new Date())}
                  selected={parseDateStr(formData.prediksiPanen) || new Date()}
                  onChange={(date: any) => handlePrediksiPanenChange(date)}
                  dateFormat="dd/MM/yyyy"
                />
                <i className="ri-calendar-line absolute right-2.5 top-2 text-gray-400 pointer-events-none text-sm"></i>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                <span>Status Kesiapan</span>
                <span className="text-[10px] text-emerald-600 font-normal italic">* Otomatis dari Prediksi Panen</span>
              </label>
              <input
                type="text"
                disabled
                readOnly
                value={formData.statusKesiapan || calculateStatusKesiapan(formData.prediksiPanen)}
                className="w-full px-3 py-2 border border-gray-200 bg-gray-100 font-semibold text-gray-700 cursor-not-allowed rounded-lg focus:outline-none"
                placeholder="Otomatis dari Prediksi Panen"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Estimasi Hasil (Kg/Ha)</label>
              <input
                type="number"
                value={formData.yieldEst !== undefined && formData.yieldEst !== 0 ? formData.yieldEst : ''}
                onChange={(e) => setFormData({ ...formData, yieldEst: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="0"
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
