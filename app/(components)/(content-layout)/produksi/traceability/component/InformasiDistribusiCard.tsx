import React from 'react';
import { DistributionInfo } from '@/app/types/traceability';

interface Props {
  info: DistributionInfo;
}

export default function InformasiDistribusiCard({ info }: Props) {
  const items = [
    { label: 'Customer', value: info.customer, isBold: true },
    { label: 'Alamat', value: info.alamat },
    { label: 'No. DO', value: info.noDo, isBold: true, color: 'text-emerald-700' },
    { label: 'Tanggal Kirim', value: info.tanggalKirim },
    { label: 'Tanggal Terima', value: info.tanggalTerima },
    { label: 'Transporter', value: info.transporter },
    { label: 'No. Resi / AWB', value: info.noResi, isBold: true },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6 p-5">
      <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
        Informasi Distribusi
      </h3>

      <div className="space-y-2 text-xs">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start text-[11px] gap-2">
            <span className="text-gray-500 font-medium shrink-0 w-28">{item.label}</span>
            <span className={`text-right ${item.isBold ? 'font-bold' : 'font-medium'} ${item.color || 'text-gray-800'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
