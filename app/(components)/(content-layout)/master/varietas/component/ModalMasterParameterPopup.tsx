"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import parameterService from '@/app/services/parameterService';
import { MasterParameter, MasterParameterOption, PARAMETER_MODUL_OPTIONS } from '@/app/types/parameter';

interface ModalMasterParameterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newParam: MasterParameter) => void;
  defaultNamaModul?: string;
  lockNamaModul?: boolean;
  defaultTipeNilai?: 'NUMBER' | 'TEXT' | 'OPTION' | 'RANGE' | 'BOOLEAN';
  lockTipeNilai?: boolean;
  title?: string;
  zIndex?: string; // Optional z-index class, default 'z-50'
}

export default function ModalMasterParameterPopup({
  isOpen,
  onClose,
  onSuccess,
  defaultNamaModul = 'VARIETAS',
  lockNamaModul = true,
  defaultTipeNilai = 'NUMBER',
  lockTipeNilai = false,
  title,
  zIndex = 'z-50',
}: ModalMasterParameterPopupProps) {
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [namaModul, setNamaModul] = useState(defaultNamaModul);
  const [tipeNilai, setTipeNilai] = useState<'NUMBER' | 'TEXT' | 'OPTION' | 'RANGE' | 'BOOLEAN'>(defaultTipeNilai);
  const [satuan, setSatuan] = useState('');
  const [batasLulus, setBatasLulus] = useState<string>('');
  const [deskripsi, setDeskripsi] = useState('');
  const [status, setStatus] = useState<'Aktif' | 'Non-Aktif'>('Aktif');
  const [options, setOptions] = useState<Array<{ kode: string; nama: string; bobot: number; urutan: number; status: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKode('');
      setNama('');
      setNamaModul(defaultNamaModul);
      setTipeNilai(defaultTipeNilai);
      setSatuan('');
      setBatasLulus('');
      setDeskripsi('');
      setStatus('Aktif');
      setOptions([]);
      setIsSubmitting(false);
    }
  }, [isOpen, defaultNamaModul, defaultTipeNilai]);

  if (!isOpen) return null;

  const handleAddOption = () => {
    const nextUrutan = options.length + 1;
    setOptions((prev) => [
      ...prev,
      {
        kode: `OPT_${nextUrutan}`,
        nama: '',
        bobot: 0,
        urutan: nextUrutan,
        status: 'Aktif',
      },
    ]);
  };

  const handleRemoveOption = (idx: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleOptionChange = (idx: number, field: string, value: any) => {
    setOptions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kode.trim() || !nama.trim()) {
      toast.error('Kode dan Nama Parameter wajib diisi');
      return;
    }

    if (tipeNilai === 'OPTION' && options.length === 0) {
      toast.error('Parameter dengan tipe OPTION harus memiliki minimal 1 opsi');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        kode: kode.trim().toUpperCase(),
        nama: nama.trim(),
        namaModul: namaModul.trim().toUpperCase(),
        tipeNilai,
        satuan: satuan.trim() || undefined,
        batasLulus: batasLulus ? parseFloat(batasLulus) : null,
        deskripsi: deskripsi.trim() || undefined,
        status,
        options: tipeNilai === 'OPTION' ? options : undefined,
      };

      const res = await parameterService.createParameter(payload);

      if (res.status === 'success' && res.data) {
        toast.success(`Parameter '${res.data.nama}' berhasil ditambahkan ke Master Parameter!`);
        onSuccess(res.data);
        onClose();
      } else {
        toast.error((res as any).message || 'Gagal menambahkan parameter');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || 'Terjadi kesalahan saat menambahkan parameter');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200`}>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-700 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-lg">
              <i className="ri-list-settings-line"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {title ||
                  (defaultNamaModul === 'QC'
                    ? 'Tambah Master Parameter QC'
                    : defaultNamaModul === 'MONITORING_LAHAN'
                    ? 'Tambah Master Parameter Monitoring Lahan'
                    : defaultNamaModul === 'OFF_TYPE'
                    ? 'Tambah Master Parameter Off-Type'
                    : 'Tambah Master Parameter Varietas')}
              </h3>
              <p className="text-[11px] text-emerald-100">
                Data akan otomatis disimpan ke referensi Master Parameter ({defaultNamaModul})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kode Parameter */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Kode Parameter <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={kode}
                onChange={(e) => setKode(e.target.value.toUpperCase())}
                placeholder={
                  defaultNamaModul === 'QC'
                    ? 'Contoh: PRM-QC-DAYA-SIMPAN'
                    : defaultNamaModul === 'MONITORING_LAHAN'
                    ? 'Contoh: PRM-ML-TINGGI-TANAMAN'
                    : defaultNamaModul === 'OFF_TYPE'
                    ? 'Contoh: PRM-OT-BENTUK-DAUN'
                    : 'Contoh: PRM-KETEBALAN-DAGING'
                }
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400 font-mono"
              />
            </div>

            {/* Nama Parameter */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Nama Parameter <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder={
                  defaultNamaModul === 'QC'
                    ? 'Contoh: Daya Simpan'
                    : defaultNamaModul === 'MONITORING_LAHAN'
                    ? 'Contoh: Tinggi Tanaman (cm)'
                    : defaultNamaModul === 'OFF_TYPE'
                    ? 'Contoh: Warna Daun Menyimpang'
                    : 'Contoh: Ketebalan Daging'
                }
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Nama Modul */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Nama Modul <span className="text-rose-500">*</span>
              </label>
              {lockNamaModul ? (
                <input
                  type="text"
                  required
                  readOnly
                  value={PARAMETER_MODUL_OPTIONS.find((opt) => opt.value === namaModul)?.label || namaModul}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs text-gray-600 bg-gray-100/70 font-semibold cursor-not-allowed"
                />
              ) : (
                <select
                  required
                  value={namaModul}
                  onChange={(e) => setNamaModul(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                >
                  {PARAMETER_MODUL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                  {namaModul &&
                    !PARAMETER_MODUL_OPTIONS.some((opt) => opt.value === namaModul) && (
                      <option value={namaModul}>{namaModul}</option>
                    )}
                </select>
              )}
              <p className="text-[10px] text-gray-400 mt-1">
                {lockNamaModul ? 'Terkunci otomatis sesuai konteks modul' : 'Pilihan modul: Off_Type, QC, VARIETAS, MONITORING_LAHAN'}
              </p>
            </div>

            {/* Tipe Nilai */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Tipe Nilai <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  disabled={lockTipeNilai}
                  value={tipeNilai}
                  onChange={(e) => setTipeNilai(e.target.value as any)}
                  className={`w-full pl-3.5 pr-8 py-2.5 border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none ${
                    lockTipeNilai
                      ? 'bg-gray-100/70 text-gray-600 cursor-not-allowed'
                      : 'bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer'
                  }`}
                >
                  <option value="NUMBER">NUMBER (Angka tunggal)</option>
                  <option value="RANGE">RANGE (Rentang Min - Max)</option>
                  <option value="OPTION">OPTION (Pilihan Dropdown)</option>
                  <option value="TEXT">TEXT (Teks Bebas)</option>
                  <option value="BOOLEAN">BOOLEAN (Ya / Tidak)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                  <i className="ri-arrow-down-s-line"></i>
                </div>
              </div>
              {lockTipeNilai && (
                <p className="text-[10px] text-emerald-600 mt-1">Parameter QC terstandarisasi dengan tipe RANGE (Min - Max)</p>
              )}
            </div>

            {/* Satuan */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">Satuan</label>
              <input
                type="text"
                value={satuan}
                onChange={(e) => setSatuan(e.target.value)}
                placeholder="Contoh: %, cm, HST, kg"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Batas Lulus */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">Batas Lulus (Opsional)</label>
              <input
                type="number"
                step="any"
                value={batasLulus}
                onChange={(e) => setBatasLulus(e.target.value)}
                placeholder="Contoh: 85"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">Status</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Non-Aktif">Non-Aktif</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                  <i className="ri-arrow-down-s-line"></i>
                </div>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1.5">Deskripsi / Catatan Parameter</label>
              <textarea
                rows={2}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Deskripsi singkat mengenai standar parameter ini..."
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Option Builder section if Tipe Nilai is OPTION */}
          {tipeNilai === 'OPTION' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Daftar Pilihan / Opsi</h4>
                  <p className="text-[11px] text-gray-500">Tentukan opsi pilihan untuk parameter ini</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                >
                  <i className="ri-add-line font-bold"></i> Tambah Opsi
                </button>
              </div>

              {options.length === 0 ? (
                <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">
                  Belum ada opsi. Klik tombol &quot;Tambah Opsi&quot; di atas.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {options.map((opt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 text-xs"
                    >
                      <span className="w-5 text-center font-bold text-gray-400">{idx + 1}</span>
                      <input
                        type="text"
                        className="w-24 px-2 py-1.5 bg-white border border-gray-200 rounded-lg uppercase font-mono text-xs"
                        placeholder="Kode"
                        value={opt.kode}
                        onChange={(e) => handleOptionChange(idx, 'kode', e.target.value)}
                      />
                      <input
                        type="text"
                        required
                        className="flex-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                        placeholder="Nama Opsi (Contoh: Lonjong, Bulat)"
                        value={opt.nama}
                        onChange={(e) => handleOptionChange(idx, 'nama', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="w-7 h-7 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors"
                        title="Hapus Opsi"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <i className="ri-close-line text-sm"></i>
              <span>Batal</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !kode.trim() || !nama.trim()}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  <span>Menyimpan ke Master...</span>
                </>
              ) : (
                <>
                  <i className="ri-check-line text-sm"></i>
                  <span>Simpan ke Master Parameter</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
