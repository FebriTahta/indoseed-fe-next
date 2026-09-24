"use client";

import React, { useState, useEffect } from 'react';
import { VarietyCharacteristicItem } from '@/app/types/variety';

interface ModalEditNilaiKarakteristikProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: VarietyCharacteristicItem) => void;
  item: VarietyCharacteristicItem | null;
}

export default function ModalEditNilaiKarakteristik({
  isOpen,
  onClose,
  onSave,
  item,
}: ModalEditNilaiKarakteristikProps) {
  const [nilai, setNilai] = useState('');
  const [satuan, setSatuan] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [rangeMin, setRangeMin] = useState('');
  const [rangeMax, setRangeMax] = useState('');

  useEffect(() => {
    if (item && isOpen) {
      setSatuan(item.satuan || '');
      setKeterangan(item.keterangan || '');

      if (item.tipeNilai === 'RANGE') {
        const val = item.nilai || '';
        if (val.includes('-')) {
          const parts = val.split('-').map((s) => s.trim());
          setRangeMin(parts[0] || '');
          setRangeMax(parts[1] || '');
        } else {
          setRangeMin(val);
          setRangeMax('');
        }
      } else {
        setNilai(item.nilai || '');
      }
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalNilai = nilai.trim();
    if (item.tipeNilai === 'RANGE') {
      if (rangeMin && rangeMax) {
        finalNilai = `${rangeMin} - ${rangeMax}`;
      } else if (rangeMin) {
        finalNilai = rangeMin;
      } else {
        finalNilai = rangeMax || '-';
      }
    }

    onSave({
      ...item,
      nilai: finalNilai,
      satuan: satuan.trim() || '-',
      keterangan: keterangan.trim() || '-',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-700 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-lg">
              <i className="ri-edit-line"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold">Edit Nilai Standart Karakteristik</h3>
              <p className="text-[11px] text-emerald-100">
                {item.parameter} {item.kode ? `(${item.kode})` : ''}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Parameter Info pill */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-600 font-semibold block uppercase tracking-wide">
                Parameter
              </span>
              <span className="font-bold text-gray-900 text-xs">{item.parameter}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-700 border border-emerald-200 shadow-2xs">
              {item.tipeNilai || 'TEXT'}
            </span>
          </div>

          {/* Dynamic input for Nilai Standart */}
          {item.tipeNilai === 'NUMBER' && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Nilai Standart (Angka) <span className="text-rose-500">*</span>
              </label>
              <div className="flex rounded-xl shadow-2xs overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
                <input
                  type="text"
                  required
                  value={nilai}
                  onChange={(e) => setNilai(e.target.value)}
                  placeholder="Contoh: 70"
                  className="w-full px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none"
                />
                {satuan && (
                  <span className="bg-gray-50 text-gray-500 px-3 py-2.5 text-xs border-l border-gray-200 flex items-center">
                    {satuan}
                  </span>
                )}
              </div>
            </div>
          )}

          {item.tipeNilai === 'RANGE' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">Nilai Minimal</label>
                <input
                  type="text"
                  value={rangeMin}
                  onChange={(e) => setRangeMin(e.target.value)}
                  placeholder="Min (Contoh: 15)"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">Nilai Maksimal</label>
                <input
                  type="text"
                  value={rangeMax}
                  onChange={(e) => setRangeMax(e.target.value)}
                  placeholder="Max (Contoh: 18)"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          )}

          {item.tipeNilai === 'OPTION' && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Nilai Standart (Pilihan Opsi) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={nilai}
                  onChange={(e) => setNilai(e.target.value)}
                  className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">-- Pilih Nilai Opsi --</option>
                  {item.options && item.options.length > 0 ? (
                    item.options.map((opt) => (
                      <option key={opt.id || opt.kode} value={opt.nama}>
                        {opt.nama}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value={nilai}>{nilai || 'Pilih...'}</option>
                    </>
                  )}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                  <i className="ri-arrow-down-s-line"></i>
                </div>
              </div>
            </div>
          )}

          {item.tipeNilai === 'BOOLEAN' && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Nilai Standart <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={nilai}
                  onChange={(e) => setNilai(e.target.value)}
                  className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Ya">Ya / Sesuai</option>
                  <option value="Tidak">Tidak / Tidak Sesuai</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                  <i className="ri-arrow-down-s-line"></i>
                </div>
              </div>
            </div>
          )}

          {(!item.tipeNilai || item.tipeNilai === 'TEXT') && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Nilai Standart <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nilai}
                onChange={(e) => setNilai(e.target.value)}
                placeholder="Masukkan nilai standart..."
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          )}

          {/* Satuan */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">Satuan</label>
            <input
              type="text"
              value={satuan}
              onChange={(e) => setSatuan(e.target.value)}
              placeholder="Contoh: HST, Ton/Ha, kg, cm, -"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Keterangan */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">Keterangan</label>
            <textarea
              rows={2}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Catatan tambahan mengenai nilai standart ini..."
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <i className="ri-close-line text-sm"></i>
              <span>Batal</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5"
            >
              <i className="ri-check-line text-sm"></i>
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
