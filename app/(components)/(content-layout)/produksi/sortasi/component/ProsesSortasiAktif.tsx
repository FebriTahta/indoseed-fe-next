import React from 'react';
import { ProsesSortasiAktifItem } from '@/app/types/sortasi';

interface Props {
  items: ProsesSortasiAktifItem[];
}

export default function ProsesSortasiAktif({ items }: Props) {
  const renderStepIcon = (state: 'check' | 'process' | 'pending') => {
    if (state === 'check') {
      return (
        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold border border-emerald-300">
          <i className="ri-check-line"></i>
        </div>
      );
    }
    if (state === 'process') {
      return (
        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold border border-blue-300 animate-spin">
          <i className="ri-loader-4-line"></i>
        </div>
      );
    }
    return (
      <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold border border-gray-300">
        <i className="ri-checkbox-blank-circle-line"></i>
      </div>
    );
  };

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Proses Sortasi Aktif</h3>
        <a href="#" className="text-xs text-emerald-700 font-semibold hover:underline">Lihat Semua</a>
      </div>

      <div className="table-responsive p-2">
        <table className="table whitespace-nowrap min-w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-slate-50 text-gray-600 font-semibold">
              <th className="p-2.5 text-start">Batch / Komoditas</th>
              <th className="p-2.5 text-start">Alat Sortasi</th>
              <th className="p-2.5 text-start">Operator</th>
              <th className="p-2.5 text-start">Berat Masuk</th>
              <th className="p-2.5 text-center">
                <div className="flex flex-col items-center">
                  <span className="mb-1 font-bold text-gray-700">Tahapan Sortasi</span>
                  <div className="flex items-center gap-6 text-[9px] text-gray-400 font-normal">
                    <span>Pembersihan Awal</span>
                    <span>Sortasi Ukuran</span>
                    <span>Sortasi Warna</span>
                    <span>Sortasi Akhir</span>
                  </div>
                </div>
              </th>
              <th className="p-2.5 text-start">Progress</th>
              <th className="p-2.5 text-start">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {items.map((item) => (
              <tr key={item.kodeBatch} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-2.5">
                  <span className="font-bold text-emerald-700 block">{item.kodeBatch}</span>
                  <span className="text-[11px] text-gray-600 font-medium">{item.komoditas}: {item.varietas}</span>
                  <span className="text-[9px] text-gray-400 block">{item.lokasi}</span>
                </td>
                <td className="p-2.5 font-medium text-gray-700">{item.alatSortasi}</td>
                <td className="p-2.5 text-gray-600">{item.operator}</td>
                <td className="p-2.5 font-bold text-gray-800">{item.beratMasuk.toLocaleString('id-ID')} Kg</td>
                <td className="p-2.5">
                  <div className="flex items-center justify-center gap-7">
                    {renderStepIcon(item.step1)}
                    {renderStepIcon(item.step2)}
                    {renderStepIcon(item.step3)}
                    {renderStepIcon(item.step4)}
                  </div>
                </td>
                <td className="p-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-[10px] text-gray-700">{item.progress}%</span>
                  </div>
                </td>
                <td className="p-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
