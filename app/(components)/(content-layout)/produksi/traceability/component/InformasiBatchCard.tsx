import React from 'react';
import { BatchInfoData } from '@/app/types/traceability';

interface Props {
  data: BatchInfoData;
}

export default function InformasiBatchCard({ data }: Props) {
  const items = [
    { label: 'Kode Batch', value: data.kodeBatch, isBold: true, color: 'text-emerald-700 font-bold' },
    { label: 'Lot / Nomor Lot', value: data.lotNo },
    { label: 'Komoditas', value: data.komoditas },
    { label: 'Varietas', value: data.varietas },
    { label: 'Kelas Benih', value: data.kelasBenih },
    { label: 'Total Produksi', value: data.totalProduksi, isBold: true },
    { label: 'Tanggal Produksi', value: data.tanggalProduksi },
    { label: 'Tanggal Expired', value: data.tanggalExpired },
    { label: 'Status Batch', value: data.statusBatch, isBadge: true },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden p-5 h-full">
      <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
        Informasi Batch
      </h3>

      <div className="space-y-2.5 text-xs">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-[11px]">
            <span className="text-gray-500 font-medium">{item.label}</span>
            {item.isBadge ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {item.value}
              </span>
            ) : (
              <span className={`font-semibold text-gray-800 ${item.color || ''}`}>{item.value}</span>
            )}
          </div>
        ))}

        <div className="pt-3 border-t border-gray-100">
          <span className="text-[10px] text-gray-400 font-medium block mb-1">Deskripsi</span>
          <p className="text-[11px] text-gray-600 leading-relaxed mb-0">{data.deskripsi}</p>
        </div>
      </div>
    </div>
  );
}
