"use client";

import React from 'react';
import { MonitoringGudangItem } from '@/app/types/monitoringGudang';

interface DetailMonitoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MonitoringGudangItem | null;
  onEdit: (item: MonitoringGudangItem) => void;
}

export default function DetailMonitoringModal({
  isOpen,
  onClose,
  item,
  onEdit,
}: DetailMonitoringModalProps) {
  if (!isOpen || !item) return null;

  const renderStatusPill = (status: string) => {
    switch (status) {
      case 'Normal':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Normal
          </span>
        );
      case 'Perlu Perhatian':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Perlu Perhatian
          </span>
        );
      case 'Tidak Sesuai':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Tidak Sesuai
          </span>
        );
      case 'Sensor Offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Sensor Offline
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    return d.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Detail Kondisi Gudang &amp; Zona
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {item.namaGudang} – {item.zona}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-gray-700">
          {/* Top Status & Timestamp */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <span className="text-[11px] text-gray-400 block mb-1">Status Pengukuran</span>
              {renderStatusPill(item.status)}
            </div>
            <div className="text-right">
              <span className="text-[11px] text-gray-400 block mb-1">Waktu Pengukuran</span>
              <span className="font-semibold text-gray-800">{formatDate(item.waktuPengukuran)}</span>
            </div>
          </div>

          {/* Cards for Suhu & Kelembapan */}
          <div className="grid grid-cols-2 gap-4">
            {/* Suhu */}
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-emerald-900">Suhu Terakhir</span>
                <i className="ri-temp-hot-line text-emerald-600 text-lg"></i>
              </div>
              <div className="text-2xl font-bold text-emerald-800">
                {item.suhu !== null ? `${String(item.suhu).replace('.', ',')}°C` : '-'}
              </div>
              <div className="mt-2 text-[11px] text-emerald-700 font-medium">
                Batas Standar: {item.suhuMin}–{item.suhuMax}°C
              </div>
            </div>

            {/* RH */}
            <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/40">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-amber-900">RH Terakhir</span>
                <i className="ri-drop-line text-amber-600 text-lg"></i>
              </div>
              <div className="text-2xl font-bold text-amber-800">
                {item.rh !== null ? `${item.rh}%` : '-'}
              </div>
              <div className="mt-2 text-[11px] text-amber-700 font-medium">
                Batas Standar: {item.rhMin}–{item.rhMax}%
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="border border-gray-200/80 rounded-xl overflow-hidden divide-y divide-gray-100">
            <div className="grid grid-cols-3 p-2.5 bg-gray-50/70">
              <span className="text-gray-500 font-medium">Gudang</span>
              <span className="col-span-2 font-semibold text-gray-900">{item.namaGudang} ({item.kodeGudang || '-'})</span>
            </div>
            <div className="grid grid-cols-3 p-2.5">
              <span className="text-gray-500 font-medium">Zona</span>
              <span className="col-span-2 font-semibold text-gray-900">{item.zona}</span>
            </div>
            <div className="grid grid-cols-3 p-2.5 bg-gray-50/70">
              <span className="text-gray-500 font-medium">ID Sensor</span>
              <span className="col-span-2 font-mono font-medium text-gray-800">{item.sensor || '-'}</span>
            </div>
            <div className="grid grid-cols-3 p-2.5">
              <span className="text-gray-500 font-medium">Sumber Data</span>
              <span className="col-span-2">
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
                  {item.sumberData}
                </span>
              </span>
            </div>
            <div className="grid grid-cols-3 p-2.5 bg-gray-50/70">
              <span className="text-gray-500 font-medium">Petugas Pencatat</span>
              <span className="col-span-2 text-gray-800">{item.petugas || 'Admin Gudang'}</span>
            </div>
            <div className="grid grid-cols-3 p-2.5">
              <span className="text-gray-500 font-medium">Catatan / Evaluasi</span>
              <span className="col-span-2 text-gray-800 italic">
                {item.catatan || 'Tidak ada catatan khusus.'}
              </span>
            </div>
          </div>

          {/* ISO notice */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2 text-blue-800 text-[11px]">
            <i className="ri-information-line text-sm mt-0.5 flex-shrink-0"></i>
            <span>
              Penyimpangan suhu &gt; 2°C atau RH &gt; 8% dari batas yang ditetapkan wajib dilaporkan ke Departemen Quality Control (QC) untuk evaluasi dampak mutu benih.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-2xs"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(item);
            }}
            className="px-4 py-2 text-xs font-medium text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 flex items-center gap-1.5 shadow-2xs"
          >
            <i className="ri-edit-line text-sm"></i>
            Edit Pengukuran
          </button>
        </div>
      </div>
    </div>
  );
}
