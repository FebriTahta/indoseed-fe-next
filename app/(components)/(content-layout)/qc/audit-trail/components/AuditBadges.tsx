import React from 'react';
import { AuditAksi } from '@/app/types/auditTrail';
import { AKSI_STYLE, formatAuditValue, isNegativeValue } from '../auditFormat';

export function AuditActionBadge({ aksi }: { aksi: AuditAksi }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-semibold tracking-wide ${AKSI_STYLE[aksi] ?? AKSI_STYLE.LOGOUT}`}>
      {aksi}
    </span>
  );
}

/** Chip nilai sebelum/sesudah perubahan. */
export function AuditValueChip({ value, variant }: { value?: string | null; variant: 'sebelum' | 'sesudah' }) {
  const tone = isNegativeValue(value)
    ? 'bg-rose-50 text-rose-700'
    : variant === 'sesudah'
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-amber-50 text-amber-700';
  return <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${tone}`}>{formatAuditValue(value)}</span>;
}
