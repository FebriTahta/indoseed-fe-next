import React from 'react';

/**
 * Gaya visual per status. Daftar status-nya sendiri berasal dari backend (`/qc/meta`);
 * di sini hanya pemetaan tampilan, status yang tidak dikenal tetap tampil (abu-abu).
 */
const STATUS_STYLE: Record<string, { className: string; icon: string }> = {
  'Menunggu Persetujuan': { className: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'ri-time-line' },
  Sampling: { className: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: 'ri-test-tube-line' },
  'Dalam Pengujian': { className: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'ri-flask-line' },
  'Menunggu Review': { className: 'bg-orange-50 text-orange-700 border-orange-200', icon: 'ri-search-eye-line' },
  Selesai: { className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'ri-checkbox-circle-line' },
  Ditolak: { className: 'bg-rose-50 text-rose-700 border-rose-200', icon: 'ri-close-circle-line' },
  Lulus: { className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'ri-checkbox-circle-fill' },
  'Tidak Lulus': { className: 'bg-rose-50 text-rose-700 border-rose-200', icon: 'ri-close-circle-fill' },
  Aktif: { className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'ri-checkbox-circle-line' },
  Nonaktif: { className: 'bg-rose-50 text-rose-700 border-rose-200', icon: 'ri-close-circle-line' },
};

const DEFAULT_STYLE = { className: 'bg-gray-50 text-gray-600 border-gray-200', icon: 'ri-information-line' };

interface QcStatusBadgeProps {
  status?: string | null;
  size?: 'xs' | 'sm';
  emptyLabel?: string;
}

export default function QcStatusBadge({ status, size = 'xs', emptyLabel = '-' }: QcStatusBadgeProps) {
  if (!status) return <span className="text-gray-400 text-xs">{emptyLabel}</span>;
  const style = STATUS_STYLE[status] || DEFAULT_STYLE;
  const sizeClass = size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium whitespace-nowrap ${sizeClass} ${style.className}`}>
      <i className={style.icon}></i> {status}
    </span>
  );
}
