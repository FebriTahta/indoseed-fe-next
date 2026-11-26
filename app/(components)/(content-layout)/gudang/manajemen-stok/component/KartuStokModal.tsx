"use client";

import React from 'react';
import { KartuStokItem } from '@/app/types/manajemenStok';

interface KartuStokModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: string;
  history: KartuStokItem[];
  loading?: boolean;
}

export default function KartuStokModal({
  isOpen,
  onClose,
  lot,
  history,
  loading,
}: KartuStokModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <i className="ri-file-list-3-line text-xl"></i>
            </div>
            <div>
              <h4 className="font-bold text-base text-gray-900">Kartu Stok Mutasi Benih</h4>
              <p className="text-xs text-gray-500 font-medium">
                Riwayat pergerakan saldo untuk Lot: <span className="font-bold text-emerald-700">{lot}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Body Table */}
        <div className="p-6 overflow-x-auto max-h-[65vh]">
          {loading ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              <i className="ri-loader-4-line animate-spin text-2xl text-emerald-600 mb-2 block"></i>
              Memuat kartu stok...
            </div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              Belum ada data mutasi untuk lot ini.
            </div>
          ) : (
            <table className="w-full text-left text-xs text-gray-600 border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-gray-700 text-[11px] font-bold uppercase">
                <tr>
                  <th className="px-3.5 py-2.5">Tanggal</th>
                  <th className="px-3.5 py-2.5">No. Transaksi</th>
                  <th className="px-3.5 py-2.5">Jenis Transaksi</th>
                  <th className="px-3.5 py-2.5 text-right text-emerald-700">Masuk (kg)</th>
                  <th className="px-3.5 py-2.5 text-right text-rose-700">Keluar (kg)</th>
                  <th className="px-3.5 py-2.5 text-right font-extrabold text-gray-900">Sisa (kg)</th>
                  <th className="px-3.5 py-2.5">Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {history.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3.5 py-2.5 whitespace-nowrap font-medium text-gray-800">{row.tanggal}</td>
                    <td className="px-3.5 py-2.5 font-mono text-emerald-700">{row.noTransaksi}</td>
                    <td className="px-3.5 py-2.5 font-semibold text-gray-700">{row.jenisTransaksi}</td>
                    <td className="px-3.5 py-2.5 text-right font-bold text-emerald-700">
                      {row.masukKg > 0 ? `+${row.masukKg.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-bold text-rose-600">
                      {row.keluarKg > 0 ? `-${row.keluarKg.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-extrabold text-gray-900">
                      {row.sisaKg.toLocaleString('id-ID')}
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-500">{row.petugas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <i className="ri-printer-line"></i>
            Cetak Kartu Stok
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-semibold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

