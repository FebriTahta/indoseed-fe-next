"use client";

import React from 'react';
import { RingkasanKomoditasItem } from '@/app/types/panen';

interface RingkasanKomoditasCardProps {
  data: RingkasanKomoditasItem[];
}

export default function RingkasanKomoditasCard({ data }: RingkasanKomoditasCardProps) {
  // Compute totals
  const totalJadwal = data.reduce((sum, item) => sum + item.jumlahJadwal, 0);
  const totalSelesai = data.reduce((sum, item) => sum + item.selesai, 0);
  const totalDalamProses = data.reduce((sum, item) => sum + item.dalamProses, 0);
  const totalTertunda = data.reduce((sum, item) => sum + item.tertunda, 0);
  const grandTotalHasil = data.reduce((sum, item) => sum + item.totalHasilKg, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 space-y-4">
      {/* Card Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
          <i className="ri-leaf-line text-base"></i>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Ringkasan Panen per Komoditas</h3>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 font-semibold text-[11px]">
              <th className="py-2.5 px-3 w-10">No.</th>
              <th className="py-2.5 px-3">Komoditas</th>
              <th className="py-2.5 px-3">Varietas</th>
              <th className="py-2.5 px-3 text-center">Jumlah Jadwal</th>
              <th className="py-2.5 px-3 text-center">Selesai</th>
              <th className="py-2.5 px-3 text-center">Dalam Proses</th>
              <th className="py-2.5 px-3 text-center">Tertunda</th>
              <th className="py-2.5 px-3 text-right">Total Hasil (kg)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-700">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                <td className="py-2.5 px-3 text-gray-400 font-medium">{row.no || idx + 1}</td>
                <td className="py-2.5 px-3 font-semibold text-gray-900">{row.komoditas}</td>
                <td className="py-2.5 px-3 text-gray-600">{row.varietas}</td>
                <td className="py-2.5 px-3 text-center font-medium">{row.jumlahJadwal}</td>
                <td className="py-2.5 px-3 text-center font-medium text-emerald-700">{row.selesai}</td>
                <td className="py-2.5 px-3 text-center font-medium text-amber-700">{row.dalamProses}</td>
                <td className="py-2.5 px-3 text-center font-medium text-rose-700">{row.tertunda}</td>
                <td className="py-2.5 px-3 text-right font-bold text-gray-900">
                  {row.totalHasilKg > 0 ? row.totalHasilKg.toLocaleString('id-ID') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-100 bg-gray-50/50 font-bold text-gray-900 text-xs">
              <td colSpan={3} className="py-2.5 px-3">Total</td>
              <td className="py-2.5 px-3 text-center">{totalJadwal}</td>
              <td className="py-2.5 px-3 text-center text-emerald-700">{totalSelesai}</td>
              <td className="py-2.5 px-3 text-center text-amber-700">{totalDalamProses}</td>
              <td className="py-2.5 px-3 text-center text-rose-700">{totalTertunda}</td>
              <td className="py-2.5 px-3 text-right text-emerald-800">
                {grandTotalHasil.toLocaleString('id-ID')}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
