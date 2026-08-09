"use client";

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MonitoringLahanItem } from '@/app/types/monitoringLahan';

const SpkSelect = dynamic(() => import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'), { ssr: false });

interface MonitoringLahanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<MonitoringLahanItem>) => Promise<void>;
  initialData?: MonitoringLahanItem | null;
  mode: 'add' | 'edit';
  komoditasOptions: { value: string; label: string }[];
  varietasOptions: { value: string; label: string }[];
  lokasiOptions: { value: string; label: string }[];
  jadwalTanamOptions?: any[];
}

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
    const day = String(dateVal.getDate()).padStart(2, '0');
    const month = String(dateVal.getMonth() + 1).padStart(2, '0');
    const year = dateVal.getFullYear();
    return `${day}/${month}/${year}`;
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

export default function MonitoringLahanFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  komoditasOptions,
  varietasOptions,
  lokasiOptions,
  jadwalTanamOptions = [],
}: MonitoringLahanFormModalProps) {
  const [selectedJadwalId, setSelectedJadwalId] = useState<string>('');

  const [formData, setFormData] = useState<Partial<MonitoringLahanItem>>({
    kodeLahan: '',
    lokasi: 'Blok A - Petak 1',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    luas: 10.0,
    tanggalTanam: '01/06/2026',
    umurHst: '30 HST',
    kondisi: 'Baik',
    status: 'Aktif',
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
        const targetKode = initialData.kodeLahan;

        return (
          targetKode && (item.id === targetKode || itemVal === targetKode || itemKode === targetKode)
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
        luas: 10.0,
        tanggalTanam: '01/06/2026',
        umurHst: '30 HST',
        kondisi: 'Baik',
        status: 'Aktif',
        catatan: '',
      });
    }
  }, [initialData, mode, isOpen, jadwalTanamOptions]);

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
      const luas = jt.lahanKomoditas?.luasTanam || jt.luasTanam || formData.luas;
      const tglTanamRaw = jt.tanggalTanam || jt.rencanaTanam?.tanggalTanam || formData.tanggalTanam;

      let calculatedHst = formData.umurHst;
      if (tglTanamRaw) {
        const hstVal = calculateHstFromDate(tglTanamRaw);
        if (hstVal > 0) {
          calculatedHst = `${hstVal} HST`;
        }
      }

      setFormData((prev) => ({
        ...prev,
        kodeLahan: kode,
        lokasi: lahan,
        komoditas: kom,
        varietas: varName,
        luas: Number(luas) || prev.luas,
        tanggalTanam: formatDateToDisplay(tglTanamRaw) || prev.tanggalTanam,
        umurHst: calculatedHst || prev.umurHst,
      }));
    }
  };

  const allLokasiOptions = useMemo(() => {
    const list = [...(lokasiOptions || [])];
    if (formData.lokasi && !list.some((o) => o.value === formData.lokasi || o.label === formData.lokasi)) {
      list.unshift({ value: formData.lokasi, label: formData.lokasi });
    }
    if (list.length === 0) {
      list.push({ value: formData.lokasi || 'Lahan 1', label: formData.lokasi || 'Lahan 1' });
    }
    return list;
  }, [lokasiOptions, formData.lokasi]);

  const selectedLokasiValue = useMemo(() => {
    return allLokasiOptions.find(
      (opt) => opt.value === formData.lokasi || opt.label === formData.lokasi
    ) || (formData.lokasi ? { value: formData.lokasi, label: formData.lokasi } : null);
  }, [allLokasiOptions, formData.lokasi]);

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
              {mode === 'add' ? 'Tambah Monitoring Lahan Baru' : `Edit Monitoring Lahan - ${formData.kodeLahan}`}
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
          {/* Referensi Jadwal Tanam Selector */}
          <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200/80">
            <label className="font-semibold text-emerald-800 mb-1 flex items-center gap-1.5">
              <i className="ri-calendar-event-line text-emerald-600 text-sm"></i>
              Referensi Jadwal Tanam (Opsional)
            </label>
            <select
              value={selectedJadwalId}
              onChange={(e) => handleSelectJadwalTanam(e.target.value)}
              className="form-select text-xs border border-emerald-300 rounded px-3 py-2 w-full bg-white text-gray-800 font-medium cursor-pointer"
            >
              <option value="">-- Pilih Jadwal Tanam untuk Auto-Fill --</option>
              {jadwalTanamOptions.map((jt: any) => {
                const id = jt.id || jt.kodeJadwalTanam || jt.informasiUmum?.kodeJadwalTanam;
                const kode = jt.kodeJadwalTanam || jt.informasiUmum?.kodeJadwalTanam || id;
                const lahan = jt.greenhouse?.namaLahan || jt.lahanKomoditas?.namaLahan || jt.lahanKomoditas?.komoditas || '';
                const kom = jt.commodity?.namaKomoditas || jt.lahanKomoditas?.namaKomoditas || jt.lahanKomoditas?.komoditas || '';
                const varName = jt.variety?.namaVarietas || jt.lahanKomoditas?.namaVarietas || jt.lahanKomoditas?.varietas || '';
                return (
                  <option key={id} value={id}>
                    {kode} {lahan ? `- ${lahan}` : ''} {kom ? `(${kom} ${varName})` : ''}
                  </option>
                );
              })}
            </select>
            <p className="text-[11px] text-emerald-700/80 mt-1">
              Pilih Jadwal Tanam untuk otomatis mengisi Kode Lahan, Lokasi, Komoditas, Varietas, Luas, dan Tanggal Tanam.
            </p>
          </div>
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
              <label className="font-semibold text-gray-700 mb-1 block">Lokasi</label>
              <SpkSelect
                name="lokasi"
                option={allLokasiOptions}
                getValue={selectedLokasiValue}
                onfunchange={(selected: any) =>
                  setFormData({ ...formData, lokasi: selected ? selected.value : '' })
                }
                disabled={true}
                classNameprefix="Select2"
                mainClass="basic-multi-select text-xs cursor-not-allowed opacity-75"
                placeholder="Pilih Lokasi"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Komoditas</label>
              <select
                disabled
                value={formData.komoditas || ''}
                onChange={(e) => setFormData({ ...formData, komoditas: e.target.value })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-gray-100 text-gray-500 cursor-not-allowed"
              >
                {formData.komoditas && !['Padi', 'Jagung', 'Kedelai'].includes(formData.komoditas) && (
                  <option value={formData.komoditas}>{formData.komoditas}</option>
                )}
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
                disabled
                value={formData.varietas || ''}
                onChange={(e) => setFormData({ ...formData, varietas: e.target.value })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-gray-100 text-gray-500 cursor-not-allowed"
              >
                {formData.varietas && ![
                  'Inpari 32',
                  'Pioneer 21',
                  'Anjasmoro',
                  'Inpari 42',
                  'Bisi 18',
                  'Ciherang',
                  'Dega 1',
                  'Mekongga',
                ].includes(formData.varietas) && (
                  <option value={formData.varietas}>{formData.varietas}</option>
                )}
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
              <label className="font-semibold text-gray-700 mb-1 block">Luas (Ha)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.luas || ''}
                onChange={(e) => setFormData({ ...formData, luas: parseFloat(e.target.value) || 0 })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="10.0"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Tanggal Tanam</label>
              <input
                type="text"
                value={formData.tanggalTanam || ''}
                onChange={(e) => setFormData({ ...formData, tanggalTanam: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="01/06/2026"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Umur (HST)</label>
              <input
                type="text"
                value={formData.umurHst || ''}
                onChange={(e) => setFormData({ ...formData, umurHst: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="30 HST"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Kondisi Lahan</label>
              <select
                value={formData.kondisi || 'Baik'}
                onChange={(e) => setFormData({ ...formData, kondisi: e.target.value as any })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white"
              >
                <option value="Baik">Baik</option>
                <option value="Perlu Perhatian">Perlu Perhatian</option>
                <option value="Buruk">Buruk</option>
                <option value="Belum Tanam">Belum Tanam</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Status Lahan</label>
              <select
                value={formData.status || 'Aktif'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 w-full bg-white"
              >
                <option value="Aktif">Aktif</option>
                <option value="Rencana">Rencana</option>
                <option value="Pemeliharaan">Pemeliharaan</option>
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
              placeholder="Catatan kondisi tanah, irigasi, atau perlakuan pupuk..."
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
                  <i className="ri-[#078836] ri-save-line"></i> Simpan Data
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
