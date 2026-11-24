"use client";

import React from 'react';
import { MonitoringGudangItem, MonitoringGudangStats } from '@/app/types/monitoringGudang';

interface LaporanMonitoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MonitoringGudangItem[];
  stats: MonitoringGudangStats;
}

export default function LaporanMonitoringModal({
  isOpen,
  onClose,
  items,
  stats,
}: LaporanMonitoringModalProps) {
  if (!isOpen) return null;

  const handleExportCsv = () => {
    const headers = [
      'Gudang',
      'Zona',
      'Sensor',
      'Suhu Terakhir (°C)',
      'RH Terakhir (%)',
      'Batas Suhu',
      'Batas RH',
      'Waktu Pengukuran',
      'Sumber Data',
      'Status',
      'Petugas',
    ];

    const rows = items.map((i) => [
      `"${i.namaGudang}"`,
      `"${i.zona}"`,
      `"${i.sensor || '-'}"`,
      i.suhu !== null ? i.suhu : '-',
      i.rh !== null ? i.rh : '-',
      `"${i.suhuMin}–${i.suhuMax}°C"`,
      `"${i.rhMin}–${i.rhMax}%"`,
      `"${new Date(i.waktuPengukuran).toLocaleString('id-ID')}"`,
      `"${i.sumberData}"`,
      `"${i.status}"`,
      `"${i.petugas || '-'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Monitoring_Gudang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Laporan Monitoring Kondisi Gudang
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Periode: 14 Nov 2026 – 20 Nov 2026 (Audit ISO &amp; Pengendalian Mutu)
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
        <div className="p-6 space-y-5 text-xs text-gray-700 max-h-[75vh] overflow-y-auto">
          {/* Summary KPI Mini */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
              <span className="text-[11px] text-gray-500">Total Zona</span>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{stats.totalZona} Zona</p>
            </div>
            <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50">
              <span className="text-[11px] text-emerald-700">Normal</span>
              <p className="text-lg font-bold text-emerald-800 mt-0.5">{stats.normal} Zona</p>
            </div>
            <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50">
              <span className="text-[11px] text-amber-700">Perlu Perhatian</span>
              <p className="text-lg font-bold text-amber-800 mt-0.5">{stats.perluPerhatian} Zona</p>
            </div>
            <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/50">
              <span className="text-[11px] text-rose-700">Anomali / Offline</span>
              <p className="text-lg font-bold text-rose-800 mt-0.5">{stats.offlineOrTidakSesuai} Zona</p>
            </div>
          </div>

          {/* Table Preview */}
          <div className="border border-gray-200 rounded-lg overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100/80 text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-2.5">Gudang / Zona</th>
                  <th className="p-2.5">Sensor</th>
                  <th className="p-2.5">Suhu (°C)</th>
                  <th className="p-2.5">RH (%)</th>
                  <th className="p-2.5">Standar Suhu</th>
                  <th className="p-2.5">Standar RH</th>
                  <th className="p-2.5">Sumber Data</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="p-2.5 font-medium text-gray-900">
                      {row.namaGudang} – {row.zona}
                    </td>
                    <td className="p-2.5 font-mono text-gray-600">{row.sensor || '-'}</td>
                    <td className="p-2.5 font-semibold text-gray-800">
                      {row.suhu !== null ? `${String(row.suhu).replace('.', ',')}°C` : '-'}
                    </td>
                    <td className="p-2.5 font-semibold text-gray-800">
                      {row.rh !== null ? `${row.rh}%` : '-'}
                    </td>
                    <td className="p-2.5 text-gray-600">{row.suhuMin}–{row.suhuMax}°C</td>
                    <td className="p-2.5 text-gray-600">{row.rhMin}–{row.rhMax}%</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px]">
                        {row.sumberData}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        row.status === 'Normal' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        row.status === 'Perlu Perhatian' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        row.status === 'Tidak Sesuai' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 shadow-2xs"
            >
              <i className="ri-printer-line text-sm"></i>
              Cetak
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 flex items-center gap-1.5 shadow-2xs"
            >
              <i className="ri-file-excel-line text-sm"></i>
              Unduh CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
