"use client";

import React, { useState, useEffect } from 'react';
import { VarietyPackagingItem } from '@/app/types/variety';

interface ModalTambahKemasanProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: VarietyPackagingItem) => void;
  editingItem?: VarietyPackagingItem | null;
}

export default function ModalTambahKemasan({
  isOpen,
  onClose,
  onSave,
  editingItem = null,
}: ModalTambahKemasanProps) {
  const [kemasan, setKemasan] = useState('Sachet');
  const [isi, setIsi] = useState('10');
  const [satuan, setSatuan] = useState('Gram');
  const [status, setStatus] = useState<'Aktif' | 'Tidak Aktif'>('Aktif');

  useEffect(() => {
    if (editingItem) {
      setKemasan(editingItem.kemasan || 'Sachet');
      setIsi(editingItem.isi || '10');
      setSatuan(editingItem.satuan || 'Gram');
      setStatus(editingItem.status || 'Aktif');
    } else {
      setKemasan('Sachet');
      setIsi('10');
      setSatuan('Gram');
      setStatus('Aktif');
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kemasan.trim() || !isi.trim()) return;

    onSave({
      id: editingItem ? editingItem.id : String(Date.now()),
      kemasan: kemasan.trim(),
      isi: isi.trim(),
      satuan: satuan.trim() || 'Gram',
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base border border-emerald-100">
              <i className="ri-archive-line"></i>
            </div>
            <h3 className="text-sm font-bold text-gray-900">
              {editingItem ? 'Edit Jenis Kemasan' : 'Tambah Jenis Kemasan'}
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
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Nama Kemasan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={kemasan}
                onChange={(e) => setKemasan(e.target.value)}
                placeholder="Contoh: Sachet, Pack, Kaleng, Box"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  Isi Kemasan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  placeholder="Contoh: 10, 100, 1"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  Satuan <span className="text-rose-500">*</span>
                </label>
                <select
                  value={satuan}
                  onChange={(e) => setSatuan(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Gram">Gram</option>
                  <option value="Kg">Kg</option>
                  <option value="Biji">Biji</option>
                  <option value="Butir">Butir</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Status
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
              disabled={!kemasan.trim() || !isi.trim()}
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
