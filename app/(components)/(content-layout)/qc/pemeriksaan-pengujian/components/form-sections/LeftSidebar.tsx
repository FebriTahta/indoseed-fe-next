import React from "react";

const LeftSidebar = () => {
  return (
    <div className="space-y-4">
      {/* Sample Info */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm">
          <i className="ri-information-line text-blue-500"></i> Informasi Sampel
        </h3>
        <div className="space-y-2">
          <div>
            <p className="text-[11px] text-gray-500 mb-0.5">Kategori Sampel</p>
            <p className="text-xs font-medium text-gray-800">Benih Dasar (BD)</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 mb-0.5">Berat Sampel</p>
            <p className="text-xs font-medium text-gray-800">500 Gram</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 mb-0.5">Tgl. Diterima Laboratorium</p>
            <p className="text-xs font-medium text-gray-800">18 Jun 2026, 09:30 WIB</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 mb-0.5">Kemasan</p>
            <p className="text-xs font-medium text-gray-800">Aluminium Foil (Tersegel)</p>
          </div>
        </div>
      </div>

      {/* Location / Area Info */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm">
          <i className="ri-map-pin-2-line text-orange-500"></i> Detail Lokasi
        </h3>
        
        {/* Map Placeholder */}
        <div className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 mb-3 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-50 opacity-50"></div>
          <i className="ri-map-pin-fill text-red-500 text-2xl z-10 drop-shadow-md pb-2"></i>
          <p className="absolute bottom-1.5 text-[9px] text-gray-400 z-10">Peta Lokasi Lahan</p>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-[11px] text-gray-500 mb-0.5">Petani Mitra</p>
            <p className="text-xs font-medium text-gray-800">Suryadi</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 mb-0.5">Lahan / Blok</p>
            <p className="text-xs font-medium text-gray-800">Lahan 01 / Blok A</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 mb-0.5">Alamat Lengkap</p>
            <p className="text-xs font-medium text-gray-800 leading-snug">Desa Sukamaju, Kec. Bantur, Kab. Malang, Jawa Timur</p>
          </div>
        </div>
      </div>

      {/* Documentation Links */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <i className="ri-folder-open-line text-purple-500"></i> Dokumen Terkait
        </h3>
        <div className="space-y-2">
          <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-colors group">
            <div className="flex items-center gap-2">
              <i className="ri-file-pdf-2-line text-red-500 text-lg"></i>
              <span className="text-sm text-gray-700 group-hover:text-blue-600">Berita_Acara_Sampling.pdf</span>
            </div>
            <i className="ri-download-2-line text-gray-400 group-hover:text-blue-600"></i>
          </a>
          <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-colors group">
            <div className="flex items-center gap-2">
              <i className="ri-image-line text-green-500 text-lg"></i>
              <span className="text-sm text-gray-700 group-hover:text-blue-600">Foto_Kemasan_Sampel.jpg</span>
            </div>
            <i className="ri-download-2-line text-gray-400 group-hover:text-blue-600"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
