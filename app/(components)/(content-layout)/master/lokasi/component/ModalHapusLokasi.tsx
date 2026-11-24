"use client";

import React from 'react';
import { Lokasi } from '@/app/types/lokasi';

interface ModalHapusLokasiProps {
  isOpen: boolean;
  onClose: () => void;
  item: Lokasi | null;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function ModalHapusLokasi({
  isOpen,
  onClose,
  item,
  onConfirm,
  isLoading,
}: ModalHapusLokasiProps) {
  if (!isOpen || !item) return null;

  const countPersonnel = item._count?.penanggungJawabs || item.penanggungJawabs?.length || 0;
  const isBlocked = countPersonnel > 0;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div
            className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-4 ${
              isBlocked ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
            }`}
          >
            <i className={isBlocked ? 'ri-error-warning-line' : 'ri-delete-bin-line'}></i>
          </div>

          <h3 className="text-base font-bold text-gray-900 mb-1">
            {isBlocked ? 'Lokasi Tidak Dapat Dihapus' : 'Hapus Master Lokasi'}
          </h3>

          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            {isBlocked ? (
              <span>
                Lokasi <strong className="text-gray-800">{item.namaLokasi}</strong> ({item.kodeLokasi}) saat ini masih ditugaskan kepada{' '}
                <strong className="text-amber-700">{countPersonnel} personel penanggung jawab</strong>. Silakan ubah lokasi personel terkait terlebih dahulu.
              </span>
            ) : (
              <span>
                Apakah Anda yakin ingin menghapus lokasi <strong className="text-gray-800">{item.namaLokasi}</strong> ({item.kodeLokasi})? Tindakan ini tidak dapat dibatalkan.
              </span>
            )}
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
            >
              {isBlocked ? 'Tutup' : 'Batal'}
            </button>
            {!isBlocked && (
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all"
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-sm"></i>
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-delete-bin-line text-sm"></i>
                    <span>Ya, Hapus Lokasi</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
