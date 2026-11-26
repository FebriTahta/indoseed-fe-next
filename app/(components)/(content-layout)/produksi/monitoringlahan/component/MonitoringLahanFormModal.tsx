"use client";

import React, { useEffect, useState } from 'react';
import { MonitoringLahanItem } from '@/app/types/monitoringLahan';

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
      const firstJadwal = (jadwalTanamOptions || [])[0];
      if (firstJadwal) {
        const firstId = firstJadwal.id || firstJadwal.kodeJadwalTanam || firstJadwal.informasiUmum?.kodeJadwalTanam || '';
        setSelectedJadwalId(firstId);
        const kode = firstJadwal.kodeJadwalTanam || firstJadwal.informasiUmum?.kodeJadwalTanam || `LA-2605-${String(Math.floor(Math.random() * 9000) + 1000)}`;
        const lahan = firstJadwal.greenhouse?.namaLahan || firstJadwal.lahanKomoditas?.namaLahan || firstJadwal.lokasi || 'Blok A - Petak 1';
        const kom = firstJadwal.commodity?.namaKomoditas || firstJadwal.lahanKomoditas?.namaKomoditas || firstJadwal.komoditas || 'Padi';
        const varName = firstJadwal.variety?.namaVarietas || firstJadwal.lahanKomoditas?.namaVarietas || firstJadwal.varietas || 'Inpari 32';
        const luas = firstJadwal.lahanKomoditas?.luasTanam || firstJadwal.luasTanam || 10.0;
        const tglTanamRaw = firstJadwal.tanggalTanam || firstJadwal.rencanaTanam?.tanggalTanam || '01/06/2026';
        const hstVal = calculateHstFromDate(tglTanamRaw);

        setFormData({
          kodeLahan: kode,
          lokasi: lahan,
          komoditas: kom,
          varietas: varName,
          luas: Number(luas) || 10.0,
          tanggalTanam: formatDateToDisplay(tglTanamRaw) || '01/06/2026',
          umurHst: hstVal > 0 ? `${hstVal} HST` : '30 HST',
          kondisi: 'Baik',
          status: 'Aktif',
          catatan: '',
        });
      } else {
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
      const kom = jt.commodity?.namaKomoditas || jt.lahanKomoditas?.namaKomoditas || jt.lahanKomoditas?.komoditas || jt.komoditas || formData.komoditas;
      const varName = jt.variety?.namaVarietas || jt.lahanKomoditas?.namaVarietas || jt.lahanKomoditas?.varietas || jt.varietas || formData.varietas;
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
              {jadwalTanamOptions.map((jt: any) => {
                const id = jt.id || jt.kodeJadwalTanam || jt.informasiUmum?.kodeJadwalTanam;
                const kode = jt.kodeJadwalTanam || jt.informasiUmum?.kodeJadwalTanam || id;
                const lahan = jt.greenhouse?.namaLahan || jt.lahanKomoditas?.namaLahan || jt.lokasi || '';
                const kom = jt.commodity?.namaKomoditas || jt.lahanKomoditas?.namaKomoditas || jt.lahanKomoditas?.komoditas || jt.komoditas || '';
                const varName = jt.variety?.namaVarietas || jt.lahanKomoditas?.namaVarietas || jt.lahanKomoditas?.varietas || jt.varietas || '';
                return (
                  <option key={id} value={id}>
                    {kode} | {kom || 'Komoditas'} - {varName || 'Varietas'} {lahan ? `(${lahan})` : ''}
                  </option>
                );
              })}
            </select>
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
              <label className="font-semibold text-gray-700 mb-1 block">Lokasi Lahan</label>
              <input
                type="text"
                required
                value={formData.lokasi || ''}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 w-full font-medium"
                placeholder="Blok A - Petak 1"
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
                value={formData.varietas || ''}
                className="form-control text-xs border border-gray-200 bg-gray-100 text-gray-600 rounded px-3 py-2 w-full cursor-not-allowed font-medium select-none"
                placeholder="Terisi otomatis dari Jadwal Tanam"
              />
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
