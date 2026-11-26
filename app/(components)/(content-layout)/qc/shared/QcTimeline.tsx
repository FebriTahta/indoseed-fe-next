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
  /** vertical = riwayat lengkap (default), horizontal = alur proses ringkas. */
  orientation?: 'vertical' | 'horizontal';
}

const DoneDot = ({ className = '' }: { className?: string }) => (
  <span className={`w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white ${className}`}>
    <i className="ri-check-line text-white text-[9px]"></i>
  </span>
);

const PendingDot = ({ className = '' }: { className?: string }) => (
  <span className={`w-5 h-5 bg-gray-200 rounded-full border-4 border-white ${className}`}></span>
);

/** Alur proses horizontal: satu kolom per langkah, garis penghubung di antaranya. */
function HorizontalTimeline({ items, pendingSteps }: { items: QcTimelineItem[]; pendingSteps: string[] }) {
  return (
    <ol className="flex overflow-x-auto pb-1">
      {items.map((item) => (
        <li key={item.id} className="relative flex-1 min-w-[150px] pr-4">
          <div className="flex items-center mb-2">
            <DoneDot className="shrink-0" />
            <span className="flex-1 h-[2px] bg-emerald-200 ml-1"></span>
          </div>
          <p className="text-xs font-semibold text-gray-800">{item.aksi}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">{formatDateTime(item.createdAt)}</p>
          {item.oleh && <p className="text-[10px] text-gray-400">{item.oleh}</p>}
        </li>
      ))}
      {pendingSteps.map((step, i) => (
        <li key={step} className="relative flex-1 min-w-[150px] pr-4">
          <div className="flex items-center mb-2">
            <PendingDot className="shrink-0" />
            {i < pendingSteps.length - 1 && <span className="flex-1 h-[2px] bg-gray-100 ml-1"></span>}
          </div>
          <p className="text-xs font-medium text-gray-400">{step}</p>
          <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
            <i className="ri-time-line"></i> Menunggu
          </p>
        </li>
      ))}
    </ol>
  );
}

/** Timeline riwayat aktivitas (dari tabel riwayat) + langkah yang masih menunggu. */
export default function QcTimeline({
  items,
  emptyMessage = 'Belum ada riwayat.',
  pendingSteps = [],
  orientation = 'vertical',
}: QcTimelineProps) {
  if (!items.length && !pendingSteps.length) {
    return <p className="text-xs text-gray-400 italic">{emptyMessage}</p>;
  }

  if (orientation === 'horizontal') return <HorizontalTimeline items={items} pendingSteps={pendingSteps} />;

  return (
    <ol className="relative pl-6 space-y-4 before:absolute before:top-1 before:bottom-1 before:left-[11px] before:w-[2px] before:bg-gray-100">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <DoneDot className="absolute -left-[25px] top-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800">{item.aksi}</p>
            <p className="text-[10px] text-gray-400">
              {formatDateTime(item.createdAt)} {item.oleh ? `• ${item.oleh}` : ''}
            </p>
            {item.keterangan && <p className="text-[11px] text-gray-600 mt-0.5 break-words">{item.keterangan}</p>}
            {/* Badge di bawah teks agar tidak melar / terdesak di kolom sempit. */}
            {item.statusKe && (
              <div className="mt-1.5">
                <QcStatusBadge status={item.statusKe} />
              </div>
            )}
          </div>
        </li>
      ))}
      {pendingSteps.map((step) => (
        <li key={step} className="relative">
          <PendingDot className="absolute -left-[25px] top-0.5" />
          <p className="text-sm font-medium text-gray-400">{step}</p>
          <p className="text-[10px] text-gray-400 flex items-center gap-1">
            <i className="ri-time-line"></i> Menunggu
          </p>
        </li>
      ))}
    </ol>
  );
}
