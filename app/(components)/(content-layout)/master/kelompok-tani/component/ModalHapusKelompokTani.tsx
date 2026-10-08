"use client";

import React from 'react';
import { KelompokTani } from '@/app/types/kelompokTani';

interface ModalHapusKelompokTaniProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: KelompokTani | null;
  isLoading: boolean;
}

export default function ModalHapusKelompokTani({
  isOpen,
  onClose,
  onConfirm,
  item,
  isLoading,
}: ModalHapusKelompokTaniProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden p-6 text-center transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto mb-4">
          <i className="ri-delete-bin-line"></i>
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-2">
          Hapus Kelompok Tani?
        </h3>

        <p className="text-xs text-gray-500 leading-relaxed mb-6">
          Apakah Anda yakin ingin menghapus kelompok tani{' '}
          <strong className="text-gray-800">{item.namaKelompok}</strong> (
          <span className="font-mono text-gray-700">{item.kodeKelompok}</span>)? Tindakan
          ini tidak dapat dibatalkan.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-2xs transition"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-2"
          >
            {isLoading ? (
              <i className="ri-loader-4-line animate-spin text-sm"></i>
            ) : (
              <i className="ri-delete-bin-line text-sm"></i>
            )}
            <span>Ya, Hapus Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
