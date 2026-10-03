import React from "react";
import Image from "next/image";

const LeftSidebar = () => {
  return (
    <div className="space-y-4">
      {/* Informasi Sampel */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h6 className="font-medium text-emerald-800 mb-4 flex items-center gap-2">
          <i className="ri-file-list-3-line text-emerald-600"></i> Informasi Sampel
        </h6>

        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <p className="text-[11px] text-gray-500 w-1/2">No. Sampel</p>
            <div className="w-1/2 flex items-center justify-between">
              <p className="text-xs font-medium text-gray-800">SMP-2026-00125</p>
              <i className="ri-file-copy-line text-gray-400 cursor-pointer hover:text-emerald-600"></i>
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <p className="text-[11px] text-gray-500 w-1/2">Jumlah Sampel</p>
            <div className="w-1/2">
              <p className="text-xs font-medium text-gray-800">500 gram</p>
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <p className="text-[11px] text-gray-500 w-1/2">Pengambil Sampel</p>
            <div className="w-1/2">
              <p className="text-xs font-medium text-gray-800">Andi Pratama (QC)</p>
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <p className="text-[11px] text-gray-500 w-1/2">Tanggal Pengambilan</p>
            <div className="w-1/2 flex items-center gap-1 text-gray-800">
              <i className="ri-calendar-line text-emerald-600"></i>
              <p className="text-xs font-medium">16 Jun 2026 08:15</p>
            </div>
          </div>

          <div className="flex justify-between items-center pb-2">
            <p className="text-[11px] text-gray-500 w-1/2">Kondisi Sampel</p>
            <div className="w-1/2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-medium">
                <i className="ri-check-line"></i> Baik
              </span>
            </div>
          </div>
        </div>

        <button className="w-full mt-2 flex items-center justify-center gap-2 py-2 border border-emerald-600 text-emerald-600 rounded-lg text-xs font-medium hover:bg-emerald-50 transition-colors">
          <i className="ri-image-line"></i> Lihat Dokumentasi
        </button>
      </div>

      {/* Lokasi Asal Sampel */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h5 className="font-medium text-emerald-800 mb-4 flex items-center gap-2">
          <i className="ri-map-pin-line text-emerald-600"></i> Lokasi Asal Sampel
        </h5>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <p className="text-[11px] text-gray-500 w-1/3">Lahan / Blok</p>
            <p className="text-xs font-medium text-gray-800 w-2/3 text-right">Lahan 01 / Blok A</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-[11px] text-gray-500 w-1/3">Koordinat</p>
            <div className="w-2/3 flex items-center justify-end gap-1 text-gray-800">
              <i className="ri-map-pin-2-line text-blue-500"></i>
              <p className="text-xs font-medium">-7.635200, 110.841200</p>
            </div>
          </div>
        </div>

        <button className="w-full mb-4 flex items-center justify-center gap-2 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
          <i className="ri-map-2-line"></i> Lihat di Maps
        </button>

        {/* Map Placeholder */}
        <div className="w-full h-32 rounded-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-green-200/50 z-0">
            {/* Map image abstraction */}
            <div className="w-full h-full bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-7.635200,110.841200&zoom=15&size=400x200&maptype=satellite&key=')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <i className="ri-map-pin-fill text-blue-500 text-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-md z-10"></i>
          <button className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded flex items-center justify-center text-gray-700 hover:bg-white z-10 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <i className="ri-fullscreen-line text-xs"></i>
          </button>
        </div>
      </div>

      {/* Dokumen Terkait */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h5 className="font-medium text-emerald-800 mb-4 flex items-center gap-2">
          <i className="ri-folder-open-line text-emerald-600"></i> Dokumen Terkait
        </h5>
        <div className="space-y-3">
          <a href="#" className="flex items-start justify-between group">
            <div className="flex items-start gap-2">
              <i className="ri-file-pdf-2-line text-emerald-500 text-lg mt-0.5"></i>
              <div>
                <span className="text-xs font-medium text-emerald-700 group-hover:text-emerald-800 line-clamp-1">Surat Permintaan Pengujian (RQ)</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">RQ-QC-2026-00125.pdf</span>
                <span className="text-[10px] text-gray-400">1.2 MB</span>
              </div>
            </div>
            <i className="ri-download-2-line text-emerald-600 group-hover:text-emerald-700 mt-1"></i>
          </a>
          <hr className="border-gray-50" />
          <a href="#" className="flex items-start justify-between group">
            <div className="flex items-start gap-2">
              <i className="ri-file-pdf-2-line text-emerald-500 text-lg mt-0.5"></i>
              <div>
                <span className="text-xs font-medium text-emerald-700 group-hover:text-emerald-800 line-clamp-1">Formulir Pengambilan Sampel</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">F-Sampling-001.pdf</span>
                <span className="text-[10px] text-gray-400">856 KB</span>
              </div>
            </div>
            <i className="ri-download-2-line text-emerald-600 group-hover:text-emerald-700 mt-1"></i>
          </a>
          <hr className="border-gray-50" />
          <a href="#" className="flex items-start justify-between group">
            <div className="flex items-start gap-2">
              <i className="ri-file-pdf-2-line text-emerald-500 text-lg mt-0.5"></i>
              <div>
                <span className="text-xs font-medium text-emerald-700 group-hover:text-emerald-800 line-clamp-1">Standar Mutu Komoditas</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">SM-Melon-2024.pdf</span>
                <span className="text-[10px] text-gray-400">320 KB</span>
              </div>
            </div>
            <i className="ri-download-2-line text-emerald-600 group-hover:text-emerald-700 mt-1"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
