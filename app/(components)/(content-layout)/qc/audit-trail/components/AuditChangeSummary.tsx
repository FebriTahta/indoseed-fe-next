import React from 'react';
import { AuditLog } from '@/app/types/auditTrail';
import { AuditValueChip } from './AuditBadges';

/**
 * Keterangan perubahan. Bila hanya satu field berubah, nilainya ditonjolkan dengan chip:
 * - keterangan bawaan "Mengubah X dari a menjadi b" → "Mengubah x dari [a] menjadi [b]"
 * - keterangan aksi lain (mis. "Hasil disetujui") → "Hasil disetujui · [a] → [b]"
 */
export default function AuditChangeSummary({ log }: { log: Pick<AuditLog, 'keterangan' | 'perubahan'> }) {
  const changes = log.perubahan || [];
  const single = changes.length === 1 ? changes[0] : null;

  if (!single) {
    return (
      <span className="text-gray-700">
        {log.keterangan}
        {changes.length > 1 && <span className="text-gray-400"> · {changes.length} field berubah</span>}
      </span>
    );
  }

  const chips = (
    <>
      <AuditValueChip value={single.sebelum} variant="sebelum" />
      <span className="text-gray-400">→</span>
      <AuditValueChip value={single.sesudah} variant="sesudah" />
    </>
  );

  if (log.keterangan.startsWith('Mengubah ')) {
    return (
      <span className="inline-flex flex-wrap items-center gap-1 text-gray-700">
        Mengubah {single.label.toLowerCase()} dari <AuditValueChip value={single.sebelum} variant="sebelum" /> menjadi{' '}
        <AuditValueChip value={single.sesudah} variant="sesudah" />
      </span>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-1 text-gray-700">
      {log.keterangan} <span className="text-gray-300">·</span> {chips}
    </span>
  );
}
