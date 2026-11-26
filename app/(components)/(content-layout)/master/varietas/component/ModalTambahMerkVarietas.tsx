"use client";

import React, { useState, useEffect } from 'react';
import { VarietyBrand } from '@/app/types/variety';

interface ModalTambahMerkVarietasProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (brand: VarietyBrand) => void;
  editingBrand?: VarietyBrand | null;
}

export default function ModalTambahMerkVarietas({
  isOpen,
  onClose,
  onSave,
  editingBrand = null,
}: ModalTambahMerkVarietasProps) {
  const [namaMerk, setNamaMerk] = useState('');
  const [tipe, setTipe] = useState('Merk');
  const [status, setStatus] = useState<'Aktif' | 'Tidak Aktif'>('Aktif');
  const [keterangan, setKeterangan] = useState('');

  useEffect(() => {
    if (editingBrand) {
      setNamaMerk(editingBrand.namaMerk || '');
      setTipe(editingBrand.tipe || 'Merk');
      setStatus(editingBrand.status || 'Aktif');
      setKeterangan(editingBrand.keterangan || '');
    } else {
      setNamaMerk('');
      setTipe('Merk');
      setStatus('Aktif');
      setKeterangan('');
    }
  }, [editingBrand, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaMerk.trim()) return;

    onSave({
      id: editingBrand ? editingBrand.id : String(Date.now()),
      namaMerk: namaMerk.trim(),
      tipe,
      status,
      keterangan: keterangan.trim() || '-',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base border border-emerald-100">
              <i className="ri-price-tag-3-line"></i>
            </div>
            <h3 className="text-sm font-bold text-gray-900">
              {editingBrand ? 'Edit Nama / Merk Varietas' : 'Tambah Nama / Merk Varietas'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 text-xs">
            {/* Field: Nama / Merk */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Nama / Merk <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={namaMerk}
                onChange={(e) => setNamaMerk(e.target.value)}
                placeholder="Masukkan nama/merk varietas"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Field: Tipe */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Tipe <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={tipe}
                  onChange={(e) => setTipe(e.target.value)}
                  className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Merk">Merk</option>
                  <option value="Varietas Utama">Varietas Utama</option>
                  <option value="Nama Dagang">Nama Dagang</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                  <i className="ri-arrow-down-s-line"></i>
                </div>
              </div>
            </div>

            {/* Field: Status Toggle Buttons */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Status <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('Aktif')}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    status === 'Aktif'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/20'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-checkbox-circle-fill text-emerald-600 text-sm"></i>
                  <span>Aktif</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('Tidak Aktif')}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    status === 'Tidak Aktif'
                      ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-500/20'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-close-circle-fill text-rose-600 text-sm"></i>
                  <span>Tidak Aktif</span>
                </button>
              </div>
            </div>

            {/* Field: Keterangan (Opsional) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-gray-700">
                  Keterangan <span className="text-gray-400 font-normal">(Opsional)</span>
                </label>
                <span className="text-[11px] text-gray-400">{keterangan.length}/500</span>
              </div>
              <textarea
                rows={3}
                maxLength={500}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Masukkan keterangan tambahan..."
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-end gap-2.5">
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
              disabled={!namaMerk.trim()}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5"
            >
              <i className="ri-save-line text-sm"></i>
              <span>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
