"use client";

import React, { useState } from 'react';
import { GudangBahanItem } from '@/app/types/gudangBahanBelumDiproses';

interface DaftarGudangTableProps {
  items: GudangBahanItem[];
  isLoading: boolean;
  selectedItem: GudangBahanItem | null;
  onSelectLot: (item: GudangBahanItem) => void;
  selectedIds: string[];
  onToggleSelectId: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (item: GudangBahanItem) => void;
  onDelete: (id: string) => void;
  onTransferPengeringan: (item: GudangBahanItem) => void;
}

export default function DaftarGudangTable({
  items,
  isLoading,
  selectedItem,
  onSelectLot,
  selectedIds,
  onToggleSelectId,
  onSelectAll,
  currentPage,
  pageSize,
  totalRecords,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onTransferPengeringan,
}: DaftarGudangTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const formatDecimal = (num: number) => {
    return num.toFixed(1).replace('.', ',');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Dalam Pengeringan':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Dalam Pengeringan
          </span>
        );
      case 'Menunggu Sortasi':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Menunggu Sortasi
          </span>
        );
      case 'Bahan Belum Diproses':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FBF2EA] text-[#8A4A28] border border-[#F2D7C2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A8582B]"></span>
            Bahan Belum Diproses
          </span>
        );
    }
  };

  const isAllSelected = items.length > 0 && items.every((it) => selectedIds.includes(it.id));

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col">
      {/* Table Header / Title */}
      <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-gray-900 tracking-tight">
            Daftar Gudang Bahan Belum Diproses
          </h2>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3 w-8 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </th>
              <th className="py-3 px-2 w-10 text-center font-semibold">No.</th>
              <th className="py-3 px-3 font-semibold">No. Lot</th>
              <th className="py-3 px-3 font-semibold">Sumber Panen</th>
              <th className="py-3 px-3 font-semibold">Komoditas / Varietas</th>
              <th className="py-3 px-3 font-semibold">Tanggal Masuk</th>
              <th className="py-3 px-3 font-semibold">Berat Masuk (kg)</th>
              <th className="py-3 px-3 font-semibold">Kadar Air (%)</th>
              <th className="py-3 px-3 font-semibold">Lokasi</th>
              <th className="py-3 px-3 font-semibold text-center">Status</th>
              <th className="py-3 px-3 font-semibold text-center w-12">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-gray-400">
                  <div className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Memuat data gudang bahan...</span>
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-gray-400">
                  Tidak ada data yang cocok dengan kriteria filter.
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                const isSelected = selectedItem?.id === item.id || selectedItem?.noLot === item.noLot;
                const isChecked = selectedIds.includes(item.id);

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectLot(item)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/50 hover:bg-emerald-50/80 font-medium'
                        : 'hover:bg-gray-50/70'
                    }`}
                  >
                    {/* Checkbox */}
                    <td
                      className="py-3 px-3 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelectId(item.id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleSelectId(item.id)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>

                    {/* No */}
                    <td className="py-3 px-2 text-center text-gray-500 text-[11px]">
                      {startRecord + index}
                    </td>

                    {/* No. Lot */}
                    <td className="py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">
                      <span className="hover:text-emerald-700 transition-colors">
                        {item.noLot}
                      </span>
                    </td>

                    {/* Sumber Panen */}
                    <td className="py-3 px-3 whitespace-nowrap text-gray-600">
                      <span className="font-mono text-[11px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                        {item.sumberPanen}
                      </span>
                    </td>

                    {/* Komoditas / Varietas */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-gray-900">{item.komoditas}</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="text-gray-600">{item.varietas}</span>
                    </td>

                    {/* Tanggal Masuk */}
                    <td className="py-3 px-3 whitespace-nowrap text-gray-600">
                      {formatDate(item.tanggalMasuk)}
                    </td>

                    {/* Berat Masuk */}
                    <td className="py-3 px-3 whitespace-nowrap font-medium text-gray-900">
                      {formatNumber(item.beratMasuk)}
                    </td>

                    {/* Kadar Air */}
                    <td className="py-3 px-3 whitespace-nowrap text-gray-800">
                      {formatDecimal(item.kadarAir)}
                    </td>

                    {/* Lokasi */}
                    <td className="py-3 px-3 whitespace-nowrap text-gray-700">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {item.lokasi}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 whitespace-nowrap text-center">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Aksi */}
                    <td
                      className="py-3 px-3 text-center relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId(openMenuId === item.id ? null : item.id)
                        }
                        className="w-7 h-7 rounded-md hover:bg-gray-100 text-gray-500 flex items-center justify-center mx-auto transition-colors"
                      >
                        <span className="font-bold text-base leading-none">•••</span>
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === item.id && (
                        <>
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-3 top-10 z-30 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 text-left text-xs animate-fadeIn">
                            <button
                              type="button"
                              onClick={() => {
                                onSelectLot(item);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>Lihat Detail</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onEdit(item);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Ubah Data</span>
                            </button>

                            {item.status !== 'Dalam Pengeringan' && (
                              <button
                                type="button"
                                onClick={() => {
                                  onTransferPengeringan(item);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-blue-50 text-blue-700 flex items-center gap-2"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span>Kirim ke Pengeringan</span>
                              </button>
                            )}

                            <div className="border-t border-gray-100 my-1" />

                            <button
                              type="button"
                              onClick={() => {
                                onDelete(item.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Hapus Lot</span>
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div>
          Menampilkan {totalRecords === 0 ? 0 : startRecord} - {endRecord} dari {totalRecords} data
        </div>

        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-7 h-7 rounded font-medium text-xs transition-colors ${
                p === currentPage
                  ? 'bg-emerald-800 text-white'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
