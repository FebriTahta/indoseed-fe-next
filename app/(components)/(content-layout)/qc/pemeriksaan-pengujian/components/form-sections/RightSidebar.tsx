import React from "react";
import Image from "next/image";

const RightSidebar = () => {
  return (
    <div className="space-y-4">
      {/* Dokumentasi Pengujian */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h6 className="font-medium text-emerald-800 flex items-center gap-2">
            <i className="ri-image-line text-emerald-600"></i> Dokumentasi Pengujian
          </h6>
          <button className="flex items-center gap-1 text-[10px] px-2 py-1 bg-emerald-50 text-emerald-600 rounded border border-emerald-200 hover:bg-emerald-100">
            <i className="ri-add-line"></i> Tambah
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="relative group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {/* placeholder for image */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                <i className="ri-image-fill text-2xl"></i>
              </div>
            </div>
            <button className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow text-gray-500 hover:text-red-500 text-xs">
              <i className="ri-close-line"></i>
            </button>
            <p className="text-[10px] text-gray-600 mt-1 truncate">Foto Sampel</p>
            <p className="text-[9px] text-gray-400">16 Jun 2026 08:20</p>
          </div>
          <div className="relative group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {/* placeholder for image */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                <i className="ri-image-fill text-2xl"></i>
              </div>
            </div>
            <button className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow text-gray-500 hover:text-red-500 text-xs">
              <i className="ri-close-line"></i>
            </button>
            <p className="text-[10px] text-gray-600 mt-1 truncate">Proses Pengujian</p>
            <p className="text-[9px] text-gray-400">16 Jun 2026 11:30</p>
          </div>
          <div className="relative group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {/* placeholder for image */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                <i className="ri-image-fill text-2xl"></i>
              </div>
            </div>
            <button className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow text-gray-500 hover:text-red-500 text-xs">
              <i className="ri-close-line"></i>
            </button>
            <p className="text-[10px] text-gray-600 mt-1 truncate">Hasil Germinasi</p>
            <p className="text-[9px] text-gray-400">17 Jun 2026 08:20</p>
          </div>
        </div>
      </div>

      {/* Kesimpulan Pengujian */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h6 className="font-medium text-emerald-800 mb-3 flex items-center gap-2">
          <i className="ri-file-list-3-line text-emerald-600"></i> Kesimpulan Pengujian
        </h6>

        <div className="bg-rose-50 rounded-lg p-3 border border-rose-100 mb-3 flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5">
            <i className="ri-close-line"></i>
          </div>
          <div>
            <h4 className="text-rose-700 font-bold text-sm mb-1">TIDAK LULUS</h4>
            <p className="text-xs text-rose-600/80 mb-2">Ditemukan 1 parameter tidak memenuhi standar mutu:</p>
            <ul className="text-xs text-rose-700 list-disc list-inside space-y-1">
              <li>Daya Berkecambah: 82% (Standar ≥ 85%)</li>
            </ul>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Rekomendasi:</p>
          <p className="text-sm font-medium text-gray-800 mb-3">Pengujian Ulang</p>

          <button className="text-emerald-600 font-medium text-xs flex items-center gap-1 hover:text-emerald-700">
            <i className="ri-add-circle-line text-sm"></i> Buat Temuan QC
          </button>
        </div>
      </div>

      {/* Status & Approval */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h6 className="font-medium text-emerald-800 mb-4 flex items-center gap-2">
          <i className="ri-git-commit-line text-emerald-600"></i> Status & Approval
        </h6>

        <div className="relative pl-6 space-y-5 before:absolute before:inset-0 before:ml-[11px] before:w-[2px] before:bg-gray-100">
          <div className="relative">
            <div className="absolute -left-[27px] w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white">
              <i className="ri-check-line text-white text-[10px]"></i>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-800">Sampel Diterima</p>
                <p className="text-[10px] text-gray-400">16 Jun 2026 08:15</p>
                <p className="text-[10px] text-gray-500">Andi Pratama (QC)</p>
              </div>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <i className="ri-check-double-line"></i> Selesai
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[27px] w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white">
              <i className="ri-check-line text-white text-[10px]"></i>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-800">Pengujian</p>
                <p className="text-[10px] text-gray-400">16 Jun 2026 09:00</p>
                <p className="text-[10px] text-gray-500">Analisa Lab</p>
              </div>
              <span className="text-[10px] text-blue-600 font-medium flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded">
                <i className="ri-loader-4-line animate-spin"></i> Dalam Proses
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[27px] w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white">
              <i className="ri-check-line text-white text-[10px]"></i>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-800">Input Hasil</p>
                <p className="text-[10px] text-gray-400">17 Jun 2026 11:30</p>
                <p className="text-[10px] text-gray-500">Andi Pratama (QC)</p>
              </div>
              <span className="text-[10px] text-blue-600 font-medium flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded">
                <i className="ri-loader-4-line animate-spin"></i> Dalam Proses
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[27px] w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white">
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-400">Review</p>
                <p className="text-[10px] text-gray-400">-</p>
              </div>
              <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                <i className="ri-time-line"></i> Menunggu
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Catatan */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h6 className="font-medium text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="ri-information-line text-emerald-600"></i> Catatan
          </div>
          <i className="ri-edit-line text-emerald-600 cursor-pointer"></i>
        </h6>
        <p className="text-xs text-gray-400 mt-2 italic">Tambahkan catatan terkait pengujian ini...</p>
      </div>

    </div>
  );
};

export default RightSidebar;
