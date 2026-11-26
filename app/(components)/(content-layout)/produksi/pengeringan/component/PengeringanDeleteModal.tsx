"use client";

import React, { useState } from 'react';
import { PengeringanBatchItem } from '@/app/types/pengeringan';

interface PengeringanDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  item: PengeringanBatchItem | null;
}

export default function PengeringanDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  item,
}: PengeringanDeleteModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !item) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error('Error deleting record:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <i className="ri-delete-bin-line text-lg"></i>
            </div>
            <h4 className="font-bold text-sm text-gray-800">Hapus Batch Pengeringan</h4>
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
        <div className="p-5 space-y-3 text-xs">
          <p className="text-gray-700 leading-relaxed mb-0">
            Apakah Anda yakin ingin menghapus data batch pengeringan dengan kode{' '}
            <strong className="text-rose-600 font-bold">{item.kodeBatch}</strong> ({item.komoditas} - {item.varietas})?
          </p>
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-[11px]">
            <i className="ri-error-warning-line mr-1 text-rose-600"></i>
            Tindakan ini tidak dapat dibatalkan. Data akan terhapus dari sistem.
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md font-semibold text-xs transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
          >
            {deleting ? (
              <>
                <i className="ri-loader-4-line animate-spin"></i> Menghapus...
              </>
            ) : (
              <>
                <i className="ri-delete-bin-line"></i> Ya, Hapus
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
