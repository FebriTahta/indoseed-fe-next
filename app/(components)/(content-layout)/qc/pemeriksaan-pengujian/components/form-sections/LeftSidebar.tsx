import React from "react";

const LeftSidebar = () => {
  return (
    <div className="space-y-4">
      {/* Sample Info */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <i className="ri-information-line text-blue-500"></i> Informasi Sampel
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Kategori Sampel</p>
            <p className="text-sm font-medium text-gray-800">Benih Dasar (BD)</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Berat Sampel</p>
            <p className="text-sm font-medium text-gray-800">500 Gram</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Tgl. Diterima Laboratorium</p>
            <p className="text-sm font-medium text-gray-800">18 Jun 2026, 09:30 WIB</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Kemasan</p>
            <p className="text-sm font-medium text-gray-800">Aluminium Foil (Tersegel)</p>
          </div>
        </div>
      </div>

      {/* Location / Area Info */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <i className="ri-map-pin-2-line text-orange-500"></i> Detail Lokasi
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Wilayah / Zona</p>
            <p className="text-sm font-medium text-gray-800">Zona Jawa Timur 1</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Alamat Lahan</p>
            <p className="text-sm font-medium text-gray-800">Desa Sukamaju, Kec. Bantur, Kab. Malang</p>
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
