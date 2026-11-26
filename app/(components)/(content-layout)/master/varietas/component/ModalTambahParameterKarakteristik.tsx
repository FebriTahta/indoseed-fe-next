"use client";

import React, { useState, useEffect } from 'react';
import { VarietyCharacteristicItem } from '@/app/types/variety';

interface ModalTambahParameterKarakteristikProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: VarietyCharacteristicItem) => void;
  editingItem?: VarietyCharacteristicItem | null;
}

export default function ModalTambahParameterKarakteristik({
  isOpen,
  onClose,
  onSave,
  editingItem = null,
}: ModalTambahParameterKarakteristikProps) {
  const [parameter, setParameter] = useState('');
  const [nilai, setNilai] = useState('');
  const [satuan, setSatuan] = useState('');
  const [keterangan, setKeterangan] = useState('');

  useEffect(() => {
    if (editingItem) {
      setParameter(editingItem.parameter || '');
      setNilai(editingItem.nilai || '');
      setSatuan(editingItem.satuan || '');
      setKeterangan(editingItem.keterangan || '');
    } else {
      setParameter('');
      setNilai('');
      setSatuan('-');
      setKeterangan('');
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parameter.trim() || !nilai.trim()) return;

    onSave({
      id: editingItem ? editingItem.id : String(Date.now()),
      parameter: parameter.trim(),
      nilai: nilai.trim(),
      satuan: satuan.trim() || '-',
      keterangan: keterangan.trim() || '-',
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
              <i className="ri-list-check-2"></i>
            </div>
            <h3 className="text-sm font-bold text-gray-900">
              {editingItem ? 'Edit Parameter Karakteristik' : 'Tambah Parameter Karakteristik'}
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
                Nama Parameter <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={parameter}
                onChange={(e) => setParameter(e.target.value)}
                placeholder="Contoh: Ketebalan Daging, Kadar Gula, dll."
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  Nilai <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nilai}
                  onChange={(e) => setNilai(e.target.value)}
                  placeholder="Contoh: 15 - 20"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  Satuan
                </label>
                <input
                  type="text"
                  value={satuan}
                  onChange={(e) => setSatuan(e.target.value)}
                  placeholder="Contoh: cm, %, HST, -"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Keterangan
              </label>
              <textarea
                rows={2}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Catatan tambahan mengenai parameter ini..."
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
              disabled={!parameter.trim() || !nilai.trim()}
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
