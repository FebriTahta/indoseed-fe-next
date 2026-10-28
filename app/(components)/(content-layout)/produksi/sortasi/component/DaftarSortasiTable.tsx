"use client";

import React from 'react';
import { SortasiBatchItem } from '@/app/types/sortasi';

interface DaftarSortasiTableProps {
  items: SortasiBatchItem[];
  isLoading: boolean;
  selectedItem: SortasiBatchItem | null;
  onSelectBatch: (item: SortasiBatchItem) => void;
  selectedIds: string[];
  onToggleSelectId: (id: string) => void;
  onSelectAll: () => void;
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (item: SortasiBatchItem) => void;
  onDelete: (item: SortasiBatchItem) => void;
}

export default function DaftarSortasiTable({
  items,
  isLoading,
  selectedItem,
  onSelectBatch,
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
}: DaftarSortasiTableProps) {
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200/80 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
            <i className="ri-database-2-line"></i>
          </div>
          <h2 className="text-xs font-bold text-gray-800 tracking-tight">Data Proses Sortasi</h2>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 text-gray-500 font-semibold border-b border-gray-200/80 text-[11px]">
              <th className="py-2.5 px-3 w-8 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </th>
              <th className="py-2.5 px-3">No. Batch</th>
              <th className="py-2.5 px-3">Tanggal Sortasi</th>
              <th className="py-2.5 px-3">Komoditas / Varietas</th>
              <th className="py-2.5 px-3">Petani Mitra</th>
              <th className="py-2.5 px-3 text-center">
                Berat Masuk <br />
                <span className="text-[10px] text-gray-400 font-normal">(kg)</span>
              </th>
              <th className="py-2.5 px-3 text-center">
                Berat Lolos <br />
                <span className="text-[10px] text-gray-400 font-normal">(kg)</span>
              </th>
              <th className="py-2.5 px-3 text-center">
                Berat Reject <br />
                <span className="text-[10px] text-gray-400 font-normal">(kg)</span>
              </th>
              <th className="py-2.5 px-3 text-center">% Lolos</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-gray-400">
                  <div className="inline-flex items-center gap-2">
                    <i className="ri-loader-4-line animate-spin text-emerald-600 text-base"></i>
                    <span>Memuat data sortasi...</span>
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-10 text-center text-gray-400">
                  Tidak ada data proses sortasi yang cocok.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isSelected = selectedItem?.kodeBatch === item.kodeBatch;
                const isChecked = selectedIds.includes(item.id || item.kodeBatch);

                return (
                  <tr
                    key={item.kodeBatch}
                    onClick={() => onSelectBatch(item)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-emerald-50/60 font-medium'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Checkbox */}
                    <td
                      className="py-2.5 px-3 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelectId(item.id || item.kodeBatch);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>

                    {/* No. Batch */}
                    <td className="py-2.5 px-3 font-semibold text-emerald-700 whitespace-nowrap">
                      {item.kodeBatch}
                    </td>

                    {/* Tanggal Sortasi */}
                    <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">
                      {item.tanggalSortasi}
                    </td>

                    {/* Komoditas / Varietas */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="text-gray-800 font-medium leading-tight">{item.komoditas}</div>
                      <div className="text-[10.5px] text-gray-400 leading-tight">/ {item.varietas}</div>
                    </td>

                    {/* Petani Mitra */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="text-gray-800 leading-tight">{item.petani || '-'}</div>
                      {item.petaniKode && (
                        <div className="text-[10px] text-gray-400 font-mono leading-tight">
                          {item.petaniKode}
                        </div>
                      )}
                    </td>

                    {/* Berat Masuk */}
                    <td className="py-2.5 px-3 text-center text-gray-800 font-medium">
                      {item.beratMasuk.toLocaleString('id-ID')}
                    </td>

                    {/* Berat Lolos */}
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                      {item.hasilLulus.toLocaleString('id-ID')}
                    </td>

                    {/* Berat Reject */}
                    <td className="py-2.5 px-3 text-center font-bold text-rose-600">
                      {item.hasilTolak.toLocaleString('id-ID')}
                    </td>

                    {/* % Lolos */}
                    <td className="py-2.5 px-3 text-center text-gray-800 font-semibold">
                      {item.recovery ? `${item.recovery.toFixed(1).replace('.', ',')}%` : '-'}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 text-center">
                      {item.status === 'Selesai' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <i className="ri-check-line text-[10px]"></i> Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <i className="ri-loader-4-line animate-spin text-[10px]"></i> Proses
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectBatch(item)}
                          className={`p-1 rounded-md text-xs transition-colors ${
                            isSelected
                              ? 'text-emerald-700 bg-emerald-100/70'
                              : 'text-gray-400 hover:text-emerald-600 hover:bg-slate-100'
                          }`}
                          title="Lihat Detail"
                        >
                          <i className="ri-eye-line text-sm"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="p-1 rounded-md text-gray-400 hover:text-blue-600 hover:bg-slate-100 transition-colors text-xs"
                          title="Edit Sortasi"
                        >
                          <i className="ri-edit-line text-sm"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          className="p-1 rounded-md text-gray-400 hover:text-rose-600 hover:bg-slate-100 transition-colors text-xs"
                          title="Hapus Sortasi"
                        >
                          <i className="ri-delete-bin-line text-sm"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      <div className="px-4 py-2.5 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 bg-white">
        <div>
          Menampilkan{' '}
          <span className="font-semibold text-gray-800">
            {items.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
          </span>{' '}
          -{' '}
          <span className="font-semibold text-gray-800">
            {Math.min(currentPage * pageSize, totalRecords)}
          </span>{' '}
          dari <span className="font-semibold text-gray-800">{totalRecords}</span> data
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors text-xs"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-semibold transition-colors ${
                currentPage === p
                  ? 'bg-emerald-600 text-white'
                  : 'border border-gray-200 text-gray-700 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors text-xs"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
