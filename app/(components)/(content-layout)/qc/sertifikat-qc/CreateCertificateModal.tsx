import React, { useState, useCallback } from 'react';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
// Removed react-dropzone usage to avoid missing dependencies error. I will use a simple file input for mock UI.

export default function CreateCertificateModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h4 className="text-lg font-bold">Buat Sertifikat QC Baru</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* Section 1: Informasi Batch Baru */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
               <i className="ri-lock-unlock-line text-success bg-success/10 p-1 rounded"></i>
               <h5 className="font-semibold text-[15px] text-success">1. Informasi Batch Baru</h5>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">No. Sertifikat (Auto)</label>
                  <input type="text" className="form-control text-sm bg-gray-50" value="QC-2026-0001" readOnly />
                  <span className="text-[10px] text-gray-400 mt-1 block">Nomor akan dibuat otomatis saat disimpan</span>
               </div>
               <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Kode Batch <span className="text-danger">*</span></label>
                  <select className="form-select text-sm"><option>Pilih kode batch</option></select>
               </div>
               <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Komoditas <span className="text-danger">*</span></label>
                  <select className="form-select text-sm"><option>Pilih komoditas</option></select>
               </div>
               <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Varietas <span className="text-danger">*</span></label>
                  <select className="form-select text-sm"><option>Pilih varietas</option></select>
               </div>
               <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Lot / No. Benih <span className="text-danger">*</span></label>
                  <input type="text" className="form-control text-sm" placeholder="Masukkan lot / no. benih" />
               </div>
               <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Tanggal Panen <span className="text-danger">*</span></label>
                  <div className="relative">
                    <input type="date" className="form-control text-sm" />
                  </div>
               </div>
               <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Tanggal Pengujian <span className="text-danger">*</span></label>
                  <div className="relative">
                    <input type="date" className="form-control text-sm" />
                  </div>
               </div>
               <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Tanggal Terbit <span className="text-danger">*</span></label>
                  <div className="relative">
                    <input type="date" className="form-control text-sm" />
                  </div>
               </div>
               <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Tanggal Kedaluwarsa <span className="text-danger">*</span></label>
                  <div className="relative">
                    <input type="date" className="form-control text-sm" />
                  </div>
               </div>
            </div>
          </div>

          {/* Section 2: Informasi Hasil Uji */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
               <i className="ri-flask-line text-success bg-success/10 p-1 rounded"></i>
               <h5 className="font-semibold text-[15px] text-success">2. Informasi Hasil Uji</h5>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
               <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Laboratorium <span className="text-danger">*</span></label>
                  <select className="form-select text-sm"><option>Pilih laboratorium</option></select>
               </div>
               <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Metode Uji <span className="text-danger">*</span></label>
                  <select className="form-select text-sm"><option>Pilih metode uji</option></select>
               </div>
               <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Standar Acuan <span className="text-danger">*</span></label>
                  <select className="form-select text-sm"><option>Pilih standar acuan</option></select>
               </div>
            </div>
            
            <div className="border border-gray-100 rounded-lg overflow-hidden">
               <table className="table whitespace-nowrap min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Parameter Uji</th>
                      <th className="text-center text-xs font-semibold text-gray-500 py-3 px-4">Satuan</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Hasil Uji</th>
                      <th className="text-center text-xs font-semibold text-gray-500 py-3 px-4">Batas Standar</th>
                      <th className="text-center text-xs font-semibold text-gray-500 py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-50">
                      <td className="text-sm py-2 px-4 font-medium">Daya Tumbuh</td>
                      <td className="text-sm py-2 px-4 text-center">%</td>
                      <td className="py-2 px-4"><input type="text" className="form-control form-control-sm" placeholder="Masukkan hasil" /></td>
                      <td className="text-sm py-2 px-4 text-center">≥ 80 %</td>
                      <td className="text-sm py-2 px-4 text-center">-</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="text-sm py-2 px-4 font-medium">Kadar Air</td>
                      <td className="text-sm py-2 px-4 text-center">%</td>
                      <td className="py-2 px-4"><input type="text" className="form-control form-control-sm" placeholder="Masukkan hasil" /></td>
                      <td className="text-sm py-2 px-4 text-center">≤ 12 %</td>
                      <td className="text-sm py-2 px-4 text-center">-</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="text-sm py-2 px-4 font-medium">Kemurnian</td>
                      <td className="text-sm py-2 px-4 text-center">%</td>
                      <td className="py-2 px-4"><input type="text" className="form-control form-control-sm" placeholder="Masukkan hasil" /></td>
                      <td className="text-sm py-2 px-4 text-center">≥ 98 %</td>
                      <td className="text-sm py-2 px-4 text-center">-</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="text-sm py-2 px-4 font-medium">Benih Mati</td>
                      <td className="text-sm py-2 px-4 text-center">%</td>
                      <td className="py-2 px-4"><input type="text" className="form-control form-control-sm" placeholder="Masukkan hasil" /></td>
                      <td className="text-sm py-2 px-4 text-center">≤ 2 %</td>
                      <td className="text-sm py-2 px-4 text-center">-</td>
                    </tr>
                    <tr>
                      <td className="text-sm py-2 px-4 font-medium">Benih Lain (Other Seed)</td>
                      <td className="text-sm py-2 px-4 text-center">%</td>
                      <td className="py-2 px-4"><input type="text" className="form-control form-control-sm" placeholder="Masukkan hasil" /></td>
                      <td className="text-sm py-2 px-4 text-center">≤ 0,5 %</td>
                      <td className="text-sm py-2 px-4 text-center">-</td>
                    </tr>
                  </tbody>
               </table>
            </div>
            <div className="mt-3">
               <button className="text-success text-sm font-semibold flex items-center gap-1 hover:text-success/80 transition-colors">
                  <i className="ri-add-line"></i> Tambah Parameter Uji
               </button>
            </div>
          </div>

          {/* Section 3: Catatan & Lampiran */}
          <div>
            <div className="flex items-center gap-2 mb-4">
               <i className="ri-attachment-line text-success bg-success/10 p-1 rounded"></i>
               <h5 className="font-semibold text-[15px] text-success">3. Catatan & Lampiran</h5>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Catatan (opsional)</label>
                  <div className="relative">
                     <textarea className="form-control text-sm h-32" placeholder="Tambahkan catatan jika diperlukan..."></textarea>
                     <span className="absolute bottom-2 right-2 text-[10px] text-gray-400">0/300</span>
                  </div>
               </div>
               <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Lampiran (opsional)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg h-32 flex flex-col items-center justify-center text-center p-4 hover:bg-gray-50 transition-colors cursor-pointer relative">
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" multiple />
                      <i className="ri-upload-cloud-2-line text-2xl text-gray-400 mb-2"></i>
                      <p className="text-sm font-semibold mb-0">Klik atau drag & drop file di sini</p>
                      <span className="text-[10px] text-gray-400">PDF, JPG, PNG (Maks. 10 MB)</span>
                  </div>
               </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-xl">
           <SpkButton variant="light" onClick={onClose} customClass="px-6">Batal</SpkButton>
           <SpkButton variant="primary" customClass="bg-[#1B4E3B] px-6"><i className="ri-save-3-line mr-1"></i> Simpan & Terbitkan</SpkButton>
        </div>
      </div>
    </div>
  );
}
