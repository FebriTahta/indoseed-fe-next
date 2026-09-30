import React from "react";

const DokumentasiTab = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <i className="ri-folder-image-line text-blue-600"></i> Dokumentasi Pengujian
        </h3>
        <button className="text-xs flex items-center gap-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-medium transition-colors border border-emerald-200">
          <i className="ri-upload-cloud-2-line"></i> Unggah Dokumen
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Document 1 */}
        <div className="border border-gray-200 rounded-lg p-3 hover:border-emerald-300 transition-colors group cursor-pointer">
          <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center mb-3 relative overflow-hidden">
            <i className="ri-image-line text-4xl text-gray-300"></i>
            {/* Dummy image overlay */}
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-500">Preview Foto Uji</span>
            </div>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <i className="ri-eye-line text-white text-2xl"></i>
            </div>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 line-clamp-1">Hasil_Uji_Germinasi_01.jpg</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Diupload oleh Ahmad Faisal</p>
              <p className="text-[10px] text-gray-400">18 Jun 2026, 14:30 WIB</p>
            </div>
            <button className="text-gray-400 hover:text-red-500 ml-2">
              <i className="ri-delete-bin-line"></i>
            </button>
          </div>
        </div>

        {/* Document 2 */}
        <div className="border border-gray-200 rounded-lg p-3 hover:border-emerald-300 transition-colors group cursor-pointer">
          <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center mb-3 relative overflow-hidden">
            <i className="ri-file-pdf-line text-4xl text-red-400"></i>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <i className="ri-download-2-line text-white text-2xl"></i>
            </div>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 line-clamp-1">Laporan_Sertifikasi_Lab.pdf</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Diupload oleh Sistem</p>
              <p className="text-[10px] text-gray-400">18 Jun 2026, 10:00 WIB</p>
            </div>
            <button className="text-gray-400 hover:text-red-500 ml-2">
              <i className="ri-delete-bin-line"></i>
            </button>
          </div>
        </div>

        {/* Upload Placeholder */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center h-full min-h-[200px] hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors cursor-pointer">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
            <i className="ri-add-line text-xl"></i>
          </div>
          <p className="text-sm font-medium text-gray-700">Tambah Dokumentasi</p>
          <p className="text-xs text-gray-400 mt-1 text-center">Tarik file ke sini atau klik untuk browse</p>
        </div>
      </div>
    </div>
  );
};

export default DokumentasiTab;
