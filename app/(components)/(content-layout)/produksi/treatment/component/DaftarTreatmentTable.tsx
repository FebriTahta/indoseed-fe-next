"use client";

import React from 'react';
import { TreatmentBatchItem } from '@/app/types/treatment';

interface DaftarTreatmentTableProps {
  items: TreatmentBatchItem[];
  isLoading?: boolean;
  selectedItem: TreatmentBatchItem | null;
  onSelectBatch: (item: TreatmentBatchItem) => void;
  selectedIds: string[];
  onToggleSelectId: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit?: (item: TreatmentBatchItem) => void;
  onDelete?: (item: TreatmentBatchItem) => void;
}

export default function DaftarTreatmentTable({
  items,
  isLoading = false,
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
}: DaftarTreatmentTableProps) {
  const isAllSelected =
    items.length > 0 && items.every((i) => selectedIds.includes(i.id || i.kodeBatch));

  // Commodity icon helper
  const renderKomoditasIcon = (komoditas?: string) => {
    const k = komoditas?.toLowerCase() || '';
    if (k.includes('cabai')) {
      return <span className="text-red-500 mr-1.5 font-bold">🌶</span>;
    }
    if (k.includes('padi')) {
      return <span className="text-amber-500 mr-1.5 font-bold">🌾</span>;
    }
    if (k.includes('melon')) {
      return <span className="text-emerald-500 mr-1.5 font-bold">🍈</span>;
    }
    if (k.includes('tomat')) {
      return <span className="text-red-600 mr-1.5 font-bold">🍅</span>;
    }
    return <span className="text-emerald-600 mr-1.5 font-bold">🌱</span>;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden flex flex-col">
      {/* Table Title Bar */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
            <i className="ri-file-list-3-line"></i>
          </div>
          <h2 className="text-xs font-bold text-gray-800">Data Proses Treatment</h2>
        </div>
        <span className="text-[11px] text-gray-400">
          Total: <strong className="text-gray-700">{totalRecords}</strong> batch
        </span>
      </div>

      {/* Table Responsive Container */}
      <div className="overflow-x-auto min-h-[350px]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[11px] font-semibold text-gray-600">
              <th className="py-2.5 px-3 w-8 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                />
              </th>
              <th className="py-2.5 px-3 whitespace-nowrap">No. Batch</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Tanggal Proses</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Petani Mitra</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Lahan / Blok</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Komoditas / Varietas</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Metode Treatment</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Bahan</th>
              <th className="py-2.5 px-3 whitespace-nowrap text-right">Jumlah (kg)</th>
              <th className="py-2.5 px-3 whitespace-nowrap text-center">Status</th>
              <th className="py-2.5 px-3 whitespace-nowrap text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-gray-400">
                  <div className="inline-flex items-center gap-2 text-xs">
                    <i className="ri-loader-4-line animate-spin text-base text-emerald-600"></i>
                    <span>Memuat data proses treatment...</span>
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-gray-400 text-xs">
                  Tidak ada data treatment yang sesuai kriteria filter.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isSelected =
                  (selectedItem?.id && selectedItem.id === item.id) ||
                  selectedItem?.kodeBatch === item.kodeBatch;
                const isChecked = selectedIds.includes(item.id || item.kodeBatch);

                return (
                  <tr
                    key={item.id || item.kodeBatch}
                    onClick={() => onSelectBatch(item)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-emerald-50/50 hover:bg-emerald-50/70 border-l-4 border-l-emerald-600 font-medium'
                        : 'hover:bg-gray-50/80'
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
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>

                    {/* No. Batch */}
                    <td className="py-2.5 px-3 font-semibold text-emerald-700 whitespace-nowrap">
                      {item.kodeBatch}
                    </td>

                    {/* Tanggal Proses */}
                    <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">
                      {item.tanggalProses || item.tanggalSelesai || '02 Jun 2026'}
                    </td>

                    {/* Petani Mitra */}
                    <td className="py-2.5 px-3 text-gray-800 whitespace-nowrap">
                      <div className="leading-tight">
                        <span className="font-semibold block">{item.petani || 'Budi Santoso'}</span>
                        <span className="text-[10px] text-gray-400">{item.petaniKode || 'BTN-001'}</span>
                      </div>
                    </td>

                    {/* Lahan / Blok */}
                    <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">
                      {item.lahan || 'LHN-001 / Blok 01'}
                    </td>

                    {/* Komoditas / Varietas */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderKomoditasIcon(item.komoditas)}
                        <div className="leading-tight">
                          <span className="font-semibold text-gray-900 block">{item.komoditas}</span>
                          <span className="text-[10px] text-gray-500">{item.varietas}</span>
                        </div>
                      </div>
                    </td>

                    {/* Metode Treatment */}
                    <td className="py-2.5 px-3 text-gray-700 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-medium border border-gray-200/60">
                        {item.metodeTreatment || item.treatment?.split(' ')[0] || 'Fungisida'}
                      </span>
                    </td>

                    {/* Bahan */}
                    <td className="py-2.5 px-3 text-gray-700 whitespace-nowrap font-medium">
                      {item.bahan || 'Carbendazim'}
                    </td>

                    {/* Jumlah (kg) */}
                    <td className="py-2.5 px-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                      {item.jumlahBenih ?? item.beratAwal ?? 200}
                    </td>

                    {/* Status Badge */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {item.status === 'Selesai' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <i className="ri-check-line text-[10px]"></i> Selesai
                        </span>
                      ) : item.status === 'Dalam Proses' || item.status === 'Proses' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <i className="ri-loader-4-line animate-spin text-[10px]"></i> Dalam Proses
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <i className="ri-time-line text-[10px]"></i> Menunggu
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onSelectBatch(item)}
                          title="Lihat Detail"
                          className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 border border-gray-200/80 transition-colors cursor-pointer"
                        >
                          <i className="ri-eye-line text-xs"></i>
                        </button>
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            title="Edit"
                            className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent transition-colors cursor-pointer"
                          >
                            <i className="ri-pencil-line text-xs"></i>
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(item)}
                            title="Hapus"
                            className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent transition-colors cursor-pointer"
                          >
                            <i className="ri-delete-bin-line text-xs"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-gray-500 bg-white">
        <div>
          Menampilkan{' '}
          <strong className="text-gray-700">
            {items.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </strong>{' '}
          -{' '}
          <strong className="text-gray-700">
            {Math.min(currentPage * pageSize, totalRecords)}
          </strong>{' '}
          dari <strong className="text-gray-700">{totalRecords}</strong> data
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <i className="ri-arrow-left-s-line text-sm"></i>
          </button>

          {Array.from({ length: Math.min(totalPages || 1, 5) }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <i className="ri-arrow-right-s-line text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
