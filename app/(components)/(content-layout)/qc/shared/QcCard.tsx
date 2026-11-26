import React from 'react';

interface QcCardProps {
  title?: React.ReactNode;
  icon?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** Kartu section standar halaman QC (judul + ikon + aksi opsional). */
export default function QcCard({ title, icon, action, children, className = '', bodyClassName = '' }: QcCardProps) {
  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-2 mb-3">
          {title && (
            <h6 className="font-semibold text-emerald-800 flex items-center gap-2 text-sm mb-0">
              {icon && <i className={`${icon} text-emerald-600`}></i>} {title}
            </h6>
          )}
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

interface QcInfoListProps {
  items: { label: string; value?: React.ReactNode }[];
  columns?: 1 | 2;
}

/** Daftar label–nilai (nilai kosong ditampilkan sebagai "-"). */
export function QcInfoList({ items, columns = 1 }: QcInfoListProps) {
  return (
    <dl className={`grid gap-x-4 gap-y-2.5 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {items.map((item) => (
        <div
          key={item.label}
          className={columns === 1 ? 'flex justify-between gap-3 border-b border-gray-50 pb-2 last:border-0' : ''}
        >
          <dt className="text-[11px] text-gray-500">{item.label}</dt>
          <dd className={`text-xs font-medium text-gray-800 ${columns === 1 ? 'text-right' : 'mt-0.5'}`}>
            {item.value === null || item.value === undefined || item.value === '' ? '-' : item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
