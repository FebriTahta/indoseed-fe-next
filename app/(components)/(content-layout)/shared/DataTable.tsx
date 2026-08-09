import React from 'react';

interface DataTableProps<T> {
  headers: string[];
  items: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  emptyMessage?: string;
  isLoading?: boolean;
}

export default function DataTable({
  headers,
  items,
  renderRow,
  currentPage,
  pageSize,
  totalPages,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  emptyMessage = 'Tidak ada data tersedia',
  isLoading = false
}: DataTableProps<any>) {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-md overflow-hidden">
      <div className="table-responsive">
        <table className="table whitespace-nowrap table-bordered min-w-full">
          <thead>
            <tr className="border-b border-defaultborder bg-gray-50 text-gray-700 text-xs font-semibold uppercase">
              {headers.map((header, i) => (
                <th key={i} scope="col" className="text-start p-4">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-defaultborder text-sm text-gray-600">
            {isLoading ? (
              <tr>
                <td colSpan={headers.length} className="p-8 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                    <span className="text-xs text-gray-400">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : items.length > 0 ? (
              items.map((item, index) => renderRow(item, index))
            ) : (
              <tr>
                <td colSpan={headers.length} className="p-8 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && totalRecords > 0 && (
        <div className="box-footer p-4 border-t border-defaultborder flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <span className="text-xs text-textmuted">
            Menampilkan {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalRecords)} dari {totalRecords} data
          </span>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              className="w-8 h-8 flex items-center justify-center rounded border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-600 font-bold"
            >
              <i className="ri-arrow-left-s-line"></i>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => onPageChange(num)}
                className={`w-8 h-8 flex items-center justify-center rounded border font-medium text-sm transition-colors ${currentPage === num
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {num}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              className="w-8 h-8 flex items-center justify-center rounded border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-600 font-bold"
            >
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-textmuted">Tampilkan:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="form-select border border-defaultborder rounded p-1 text-xs bg-white text-gray-700 font-medium cursor-pointer"
            >
              <option value={5}>5 / halaman</option>
              <option value={10}>10 / halaman</option>
              <option value={20}>20 / halaman</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
