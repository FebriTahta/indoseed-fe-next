import React from "react";

const RightSidebar = () => {
  return (
    <div className="space-y-4">
      {/* Current Status */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <i className="ri-checkbox-circle-line text-emerald-500"></i> Status Pemeriksaan
        </h3>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="font-semibold text-blue-700">Dalam Pengujian</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-xs text-gray-500 text-right">3 dari 4 parameter selesai</p>
        </div>

        <hr className="border-gray-100 my-4" />

        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Analis QC (Pelaksana)</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                A
              </div>
              <p className="text-sm font-medium text-gray-800">Ahmad Faisal</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Supervisor QC (Reviewer)</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                B
              </div>
              <p className="text-sm font-medium text-gray-800">Budi Santoso</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kesimpulan Sementara */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <i className="ri-file-text-line text-gray-500"></i> Catatan & Kesimpulan
        </h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 mb-3">
          <p className="font-medium mb-1"><i className="ri-error-warning-line"></i> Catatan Analis:</p>
          <p>Kadar air sedikit tinggi namun masih dalam batas toleransi standar maksimal 8.0%.</p>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Update Catatan</label>
          <textarea 
            className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
            rows={3} 
            placeholder="Ketik catatan pengujian disini..."
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
