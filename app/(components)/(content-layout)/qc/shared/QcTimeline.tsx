import React from 'react';
import { formatDateTime } from '@/app/lib/format';
import QcStatusBadge from './QcStatusBadge';

export interface QcTimelineItem {
  id: string;
  aksi: string;
  statusKe?: string | null;
  keterangan?: string | null;
  oleh?: string | null;
  createdAt: string;
}

interface QcTimelineProps {
  items: QcTimelineItem[];
  emptyMessage?: string;
  /** Langkah berikutnya yang belum terjadi (ditampilkan abu-abu). */
  pendingSteps?: string[];
}

/** Timeline riwayat aktivitas (dari tabel riwayat) + langkah yang masih menunggu. */
export default function QcTimeline({ items, emptyMessage = 'Belum ada riwayat.', pendingSteps = [] }: QcTimelineProps) {
  if (!items.length && !pendingSteps.length) {
    return <p className="text-xs text-gray-400 italic">{emptyMessage}</p>;
  }

  return (
    <ol className="relative pl-6 space-y-4 before:absolute before:top-1 before:bottom-1 before:left-[11px] before:w-[2px] before:bg-gray-100">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span className="absolute -left-[25px] top-0.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white">
            <i className="ri-check-line text-white text-[9px]"></i>
          </span>
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-gray-800">{item.aksi}</p>
              <p className="text-[10px] text-gray-400">
                {formatDateTime(item.createdAt)} {item.oleh ? `• ${item.oleh}` : ''}
              </p>
              {item.keterangan && <p className="text-[11px] text-gray-600 mt-0.5">{item.keterangan}</p>}
            </div>
            {item.statusKe && <QcStatusBadge status={item.statusKe} />}
          </div>
        </li>
      ))}
      {pendingSteps.map((step) => (
        <li key={step} className="relative">
          <span className="absolute -left-[25px] top-0.5 w-5 h-5 bg-gray-200 rounded-full border-4 border-white"></span>
          <p className="text-sm font-medium text-gray-400">{step}</p>
          <p className="text-[10px] text-gray-400 flex items-center gap-1">
            <i className="ri-time-line"></i> Menunggu
          </p>
        </li>
      ))}
    </ol>
  );
}
