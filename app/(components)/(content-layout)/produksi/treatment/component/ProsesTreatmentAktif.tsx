import React from 'react';
import { ProsesTreatmentAktifItem } from '@/app/types/treatment';

interface Props {
  items: ProsesTreatmentAktifItem[];
}

export default function ProsesTreatmentAktif({ items }: Props) {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Proses Treatment Aktif</h3>
        <a href="#" className="text-xs text-emerald-700 font-semibold hover:underline">Lihat Semua</a>
      </div>

      <div className="table-responsive p-2">
        <table className="table whitespace-nowrap min-w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-slate-50 text-gray-600 font-semibold">
              <th className="p-2.5 text-start">Batch / Komoditas</th>
              <th className="p-2.5 text-start">Treatment</th>
              <th className="p-2.5 text-start">Dosis</th>
              <th className="p-2.5 text-start">Operator</th>
              <th className="p-2.5 text-start">Berat Awal (Kg)</th>
              <th className="p-2.5 text-start">Berat Akhir (Kg)</th>
              <th className="p-2.5 text-start">Loss (%)</th>
              <th className="p-2.5 text-start">Mulai</th>
              <th className="p-2.5 text-start">Selesai Estimasi</th>
              <th className="p-2.5 text-start">Progress</th>
              <th className="p-2.5 text-start">Status</th>
              <th className="p-2.5 text-start">Aksi</th>
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
                <td className="p-2.5 font-medium text-gray-800">{item.treatment}</td>
                <td className="p-2.5 text-gray-600">{item.dosis}</td>
                <td className="p-2.5 text-gray-600">{item.operator}</td>
                <td className="p-2.5 font-bold text-gray-800">{item.beratAwal.toLocaleString('id-ID')}</td>
                <td className="p-2.5 font-bold text-emerald-700">{item.beratAkhir.toLocaleString('id-ID')}</td>
                <td className="p-2.5 font-semibold text-rose-600">{item.loss.toFixed(2).replace('.', ',')}%</td>
                <td className="p-2.5 text-gray-500 text-[11px]">{item.mulai}</td>
                <td className="p-2.5 text-gray-500 text-[11px]">{item.selesaiEstimasi}</td>
                <td className="p-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
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
                <td className="p-2.5">
                  <button className="p-1 text-gray-500 hover:text-emerald-700" title="Lihat Detail">
                    <i className="ri-eye-line text-sm"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
