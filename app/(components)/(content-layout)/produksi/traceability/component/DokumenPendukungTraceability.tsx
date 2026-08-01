import React from 'react';
import { SupportDocument } from '@/app/types/traceability';

interface Props {
  documents: SupportDocument[];
}

export default function DokumenPendukungTraceability({ documents }: Props) {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6 p-5">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">Dokumen Pendukung</h3>
        <a href="#" className="text-xs text-emerald-700 font-semibold hover:underline">Lihat Semua</a>
      </div>

      <div className="space-y-2">
        {documents.map((doc, idx) => (
          <div key={idx} className="border border-gray-200 rounded p-2 flex items-center justify-between bg-white text-xs hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 overflow-hidden">
              <i className="ri-file-pdf-fill text-rose-600 text-lg shrink-0"></i>
              <div className="truncate">
                <p className="font-semibold text-gray-800 truncate mb-0 text-[11px]">{doc.name}</p>
                <span className="text-[9px] text-gray-400">{doc.size}</span>
              </div>
            </div>
            <button className="p-1 text-gray-400 hover:text-emerald-700 shrink-0" title="Download">
              <i className="ri-download-line text-sm"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
