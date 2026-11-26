"use client";

import React from 'react';
import { PenanggungJawab } from '@/app/types/penanggungJawab';

interface ModalHapusPersonelProps {
  isOpen: boolean;
  onClose: () => void;
  item: PenanggungJawab | null;
  isLoading: boolean;
  onConfirm: () => void;
}

export default function ModalHapusPersonel({
  isOpen,
  onClose,
  item,
  isLoading,
  onConfirm,
}: ModalHapusPersonelProps) {
  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-2xl mx-auto shadow-2xs">
            <i className="ri-delete-bin-line"></i>
          </div>

          <div>
            <h4 className="text-base font-bold text-gray-900">
              Hapus Personel & Tanggung Jawab?
            </h4>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Apakah Anda yakin ingin menghapus personel{' '}
              <strong className="text-gray-800">{item.nama}</strong> ({item.kodePersonel || 'PJ-XXX'})? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-left text-xs space-y-1">
            <div className="flex justify-between text-gray-600">
              <span>Peran:</span>
              <span className="font-semibold text-gray-800">{item.peran || '-'}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Area / Modul:</span>
              <span className="font-semibold text-gray-800">{item.areaModul || '-'}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Lokasi:</span>
              <span className="font-semibold text-gray-800">{item.lokasi || '-'}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <i className="ri-loader-4-line animate-spin text-sm"></i>
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <i className="ri-delete-bin-line text-sm"></i>
                <span>Hapus Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
