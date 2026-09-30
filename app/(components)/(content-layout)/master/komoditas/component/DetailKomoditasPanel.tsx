"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Commodity } from '@/app/types/commodity';

interface DetailKomoditasPanelProps {
  commodity: Commodity;
  onClose: () => void;
  onEdit: (commodity: Commodity) => void;
  isLoading?: boolean;
}

export default function DetailKomoditasPanel({
  commodity,
  onClose,
  onEdit,
  isLoading = false,
}: DetailKomoditasPanelProps) {
  const [showAllVarieties, setShowAllVarieties] = useState(false);

  const varieties = commodity.varieties || [];
  const displayVarieties = showAllVarieties ? varieties : varieties.slice(0, 5);

  const isAktif = commodity.status === 'Aktif';

  return (
    <div className="bg-white border border-defaultborder rounded-xl shadow-sm flex flex-col h-full overflow-hidden transition-all duration-300">
      {/* Top Header */}
      <div className="p-4 px-5 border-b border-defaultborder flex items-center justify-between flex-shrink-0 bg-white">
        <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
          Detail Komoditas
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Tutup panel"
        >
          <i className="ri-close-line text-lg leading-none"></i>
        </button>
      </div>

      {/* Scrollable Content (height setara dengan table list) */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-gray-700">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin"></div>
            <span className="text-xs text-gray-500 font-medium">Memuat detail...</span>
          </div>
        ) : (
          <>
            {/* 1. Header Box (TANPA GAMBAR) */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/70 to-teal-50/50 border border-emerald-100/80 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-gray-900 tracking-tight">
                  {commodity.namaKomoditas}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[11px] font-semibold text-emerald-800 bg-white/90 border border-emerald-200/80 px-2 py-0.5 rounded shadow-2xs">
                    {commodity.kodeKomoditas}
                  </span>
                </div>
              </div>
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-2xs ${
                    isAktif
                      ? 'bg-emerald-500 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  {isAktif ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
            </div>

            {/* 2. Informasi Komoditas */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-100 font-bold text-gray-800 text-xs">
                <i className="ri-file-list-3-line text-emerald-600 text-sm"></i>
                <span>Informasi Komoditas</span>
              </div>

              <div className="grid grid-cols-12 gap-y-2.5 text-xs text-gray-600 pt-1">
                <div className="col-span-5 text-gray-500 font-medium flex items-center">Nama Komoditas</div>
                <div className="col-span-7 font-semibold text-gray-900 flex items-center">
                  <span className="mr-2 text-gray-400">:</span>
                  <span>{commodity.namaKomoditas}</span>
                </div>

                <div className="col-span-5 text-gray-500 font-medium flex items-center">Kode Komoditas</div>
                <div className="col-span-7 font-mono font-semibold text-gray-900 flex items-center">
                  <span className="mr-2 text-gray-400">:</span>
                  <span>{commodity.kodeKomoditas}</span>
                </div>

                <div className="col-span-5 text-gray-500 font-medium flex items-center">Kelompok Tanaman</div>
                <div className="col-span-7 font-medium text-gray-900 flex items-center">
                  <span className="mr-2 text-gray-400">:</span>
                  <span>{commodity.kategori || '-'}</span>
                </div>

                <div className="col-span-5 text-gray-500 font-medium flex items-center">Satuan Hasil</div>
                <div className="col-span-7 font-medium text-gray-900 flex items-center">
                  <span className="mr-2 text-gray-400">:</span>
                  <span>{commodity.satuanHasil || 'Kg'}</span>
                </div>

                <div className="col-span-5 text-gray-500 font-medium flex items-center">Status</div>
                <div className="col-span-7 flex items-center">
                  <span className="mr-2 text-gray-400">:</span>
                  <span className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                    isAktif ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isAktif ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    {isAktif ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>

                <div className="col-span-5 text-gray-500 font-medium flex items-start pt-0.5">Deskripsi</div>
                <div className="col-span-7 text-gray-700 leading-relaxed flex items-start pt-0.5">
                  <span className="mr-2 text-gray-400">:</span>
                  <span className="flex-1 whitespace-pre-line">{commodity.deskripsi || '-'}</span>
                </div>
              </div>
            </div>

            {/* 3. Varietas Terdaftar (Dari Master Varietas) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                <div className="flex items-center gap-2 font-bold text-gray-800 text-xs">
                  <i className="ri-seedling-line text-emerald-600 text-sm"></i>
                  <span>Varietas Terdaftar</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                    {varieties.length} Varietas
                  </span>
                </div>
                <Link
                  href="/master/varietas"
                  className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-0.5 transition-colors"
                >
                  <span>+ Lihat Semua</span>
                </Link>
              </div>

              {varieties.length === 0 ? (
                <div className="py-6 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <i className="ri-seedling-line text-2xl text-gray-300 mb-1 block"></i>
                  <p className="text-gray-500 text-[11px]">Belum ada varietas terdaftar untuk komoditas ini</p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="py-2 px-2.5 w-10 text-center">No.</th>
                        <th className="py-2 px-2.5">Kode Varietas</th>
                        <th className="py-2 px-2.5">Nama Varietas</th>
                        <th className="py-2 px-2.5 text-right">Umur Panen Standar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {displayVarieties.map((v, idx) => (
                        <tr key={v.id || idx} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-2 px-2.5 text-center text-gray-400 font-medium">{idx + 1}</td>
                          <td className="py-2 px-2.5 font-mono text-gray-600 font-medium">{v.kodeVarietas}</td>
                          <td className="py-2 px-2.5 font-semibold text-gray-800">{v.namaVarietas}</td>
                          <td className="py-2 px-2.5 text-right text-gray-600 font-medium">
                            {v.umurTanam ? (v.umurTanam.toLowerCase().includes('hst') || v.umurTanam.toLowerCase().includes('hari') ? v.umurTanam : `${v.umurTanam} HST`) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {varieties.length > 5 && (
                    <button
                      type="button"
                      onClick={() => setShowAllVarieties(!showAllVarieties)}
                      className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-[11px] font-semibold text-gray-600 hover:text-gray-900 border-t border-gray-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <span>
                        {showAllVarieties
                          ? 'Sembunyikan'
                          : `Lihat semua varietas (${varieties.length})`}
                      </span>
                      <i className={`ri-arrow-${showAllVarieties ? 'up' : 'down'}-s-line`}></i>
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 px-5 border-t border-defaultborder bg-gray-50/50 flex items-center justify-end gap-2.5 flex-shrink-0">
        <button
          type="button"
          onClick={() => onEdit(commodity)}
          className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-white border border-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <i className="ri-edit-line text-sm"></i>
          <span>Edit Komoditas</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors shadow-2xs"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
