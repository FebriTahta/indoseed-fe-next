import React from 'react';
import { PerencanaanProduksi } from '@/app/types/perencanaanProduksi';

interface ModalCetakRencanaProps {
  isOpen: boolean;
  onClose: () => void;
  item: PerencanaanProduksi | null;
}

export default function ModalCetakRencana({ isOpen, onClose, item }: ModalCetakRencanaProps) {
  if (!isOpen || !item) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden print:p-0 print:border-none print:shadow-none animate-in fade-in zoom-in duration-200">
        {/* Modal Top Bar (hidden during print) */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 print:hidden">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <h3 className="text-sm font-bold text-gray-800">Pratinjau Cetak Dokumen Rencana Produksi</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#078836] hover:bg-[#06732e] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Cetak Sekarang</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div className="p-8 text-gray-900 bg-white" id="printable-area">
          {/* Document Header */}
          <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-[#078836] font-extrabold text-xl tracking-tight">
                <span>🌱 SI BENIH</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">Sistem Informasi Perusahaan Benih - ISO 9001:2015</p>
              <p className="text-[10px] text-gray-400">Departemen Produksi & Pembenihan</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                STATUS: {item.status.toUpperCase()}
              </span>
              <p className="text-xs font-bold text-gray-700 mt-2">{item.noPerencanaan}</p>
              <p className="text-[11px] text-gray-500">Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
            </div>
          </div>

          <h2 className="text-base font-bold text-center uppercase tracking-wide mb-6">
            Lembar Perencanaan & Target Produksi Benih
          </h2>

          {/* Details Table */}
          <table className="w-full text-xs border border-gray-300 mb-6">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="w-1/3 p-2.5 bg-gray-50 font-semibold text-gray-700">Nama Produk Benih</td>
                <td className="p-2.5 font-bold text-gray-900">{item.produk}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2.5 bg-gray-50 font-semibold text-gray-700">Komoditas & Varietas</td>
                <td className="p-2.5 text-gray-800">{item.komoditas} - {item.varietas}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2.5 bg-gray-50 font-semibold text-gray-700">Target Produksi</td>
                <td className="p-2.5 font-bold text-gray-900">{item.targetProduksi.toLocaleString('id-ID')} kg</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2.5 bg-gray-50 font-semibold text-gray-700">Aktual Produksi / Terpenuhi</td>
                <td className="p-2.5 font-bold text-emerald-700">
                  {(item.aktualProduksi || 0).toLocaleString('id-ID')} kg ({item.produksiTerpenuhi || 0}%)
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2.5 bg-gray-50 font-semibold text-gray-700">Kebutuhan Benih Induk/Dasar</td>
                <td className="p-2.5 text-gray-800">{(item.kebutuhanBenih || 0).toLocaleString('id-ID')} kg</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2.5 bg-gray-50 font-semibold text-gray-700">Target Luas Lahan</td>
                <td className="p-2.5 text-gray-800">{item.targetLuasLahan} Ha</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2.5 bg-gray-50 font-semibold text-gray-700">Periode Musim Tanam</td>
                <td className="p-2.5 text-gray-800">{item.periode}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2.5 bg-gray-50 font-semibold text-gray-700">Metode Penanaman</td>
                <td className="p-2.5 text-gray-800">{item.metodeTanam}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2.5 bg-gray-50 font-semibold text-gray-700">Estimasi Hasil per Hektar</td>
                <td className="p-2.5 text-gray-800">{item.estimasiHasilPerHa} kg/Ha</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2.5 bg-gray-50 font-semibold text-gray-700">Petani Mitra Penanggung Jawab</td>
                <td className="p-2.5 text-gray-800">{item.namaPetani || '-'}</td>
              </tr>
              <tr>
                <td className="p-2.5 bg-gray-50 font-semibold text-gray-700">Catatan Khusus</td>
                <td className="p-2.5 text-gray-700 italic">{item.catatan || '-'}</td>
              </tr>
            </tbody>
          </table>

          {/* Signature Block */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs mt-10 pt-4">
            <div>
              <p className="text-gray-500 mb-14">Dibuat Oleh,</p>
              <p className="font-bold text-gray-800">Staff Perencanaan</p>
              <p className="text-[10px] text-gray-400">Staff Agronomi</p>
            </div>
            <div>
              <p className="text-gray-500 mb-14">Diperiksa Oleh,</p>
              <p className="font-bold text-gray-800">Koordinator Lahan</p>
              <p className="text-[10px] text-gray-400">Agronomist Lapangan</p>
            </div>
            <div>
              <p className="text-gray-500 mb-14">Disetujui Oleh,</p>
              <p className="font-bold text-gray-800">Manager Produksi</p>
              <p className="text-[10px] text-gray-400">Head of Production</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
