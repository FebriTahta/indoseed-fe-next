"use client";

import React from 'react';
import { MonitoringLahanItem } from '@/app/types/monitoringLahan';

interface MonitoringLahanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MonitoringLahanItem | null;
}

export default function MonitoringLahanDetailModal({
  isOpen,
  onClose,
  item,
}: MonitoringLahanDetailModalProps) {
  if (!isOpen || !item) return null;

  const renderKondisiBadge = (k: string) => {
    switch (k) {
      case 'Baik':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <i className="ri-checkbox-circle-fill mr-1"></i> Baik
          </span>
        );
      case 'Perlu Perhatian':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <i className="ri-error-warning-fill mr-1"></i> Perlu Perhatian
          </span>
        );
      case 'Buruk':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <i className="ri-close-circle-fill mr-1"></i> Buruk
          </span>
        );
      case 'Belum Tanam':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300">
            Belum Tanam
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <i className="ri-eye-line text-lg"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-800">Detail Monitoring Lahan</h4>
              <span className="text-xs text-emerald-700 font-semibold">{item.kodeLahan}</span>
            </div>
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
        <div className="p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="text-gray-500 text-[11px] block">Status Kondisi Lahan</span>
              <div className="mt-1">{renderKondisiBadge(item.kondisi)}</div>
            </div>
            <div className="text-right">
              <span className="text-gray-500 text-[11px] block">Status Operasional</span>
              <span className="inline-block mt-1 font-bold text-gray-800 bg-white px-2.5 py-1 rounded border border-gray-200">
                {item.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Lokasi</span>
              <span className="font-bold text-gray-800">{item.lokasi}</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Luas Lahan</span>
              <span className="font-bold text-gray-800">{item.luas ? item.luas.toFixed(2).replace('.', ',') : '-'} Ha</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Komoditas</span>
              <span className="font-bold text-gray-800">{item.komoditas}</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Varietas</span>
              <span className="font-bold text-gray-800">{item.varietas}</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Tanggal Tanam</span>
              <span className="font-bold text-gray-800">{item.tanggalTanam || '—'}</span>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-lg border border-gray-100">
              <span className="text-gray-500 block mb-0.5">Umur Tanaman</span>
              <span className="font-bold text-gray-800">{item.umurHst || '—'}</span>
            </div>
          </div>

          {item.catatan && (
            <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-lg text-amber-900">
              <span className="font-semibold block mb-0.5 text-amber-950">Catatan Khusus:</span>
              <p className="mb-0 text-gray-700 leading-relaxed">{item.catatan}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 flex justify-end bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md font-semibold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
