import React from 'react';
import { buttonClass, iconButtonClass } from '@/app/(components)/(content-layout)/shared/buttonStyles';
import { AuditLog } from '@/app/types/auditTrail';
import { AuditActionBadge, AuditValueChip } from './AuditBadges';
import Link from 'next/link';
import { roleLabel } from '@/app/lib/roles';
import { auditEntityHref, formatAuditTime, formatAuditValue } from '../auditFormat';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="py-4 border-b border-gray-100 last:border-0">
    <h6 className="text-sm font-semibold text-gray-800 mb-3">{title}</h6>
    {children}
  </section>
);

const InfoRows = ({ rows }: { rows: { label: string; value?: React.ReactNode }[] }) => (
  <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-2.5 text-xs">
    {rows.map((r) => (
      <React.Fragment key={r.label}>
        <dt className="text-gray-500">{r.label}</dt>
        <dd className="text-gray-800 break-words">{r.value || '-'}</dd>
      </React.Fragment>
    ))}
  </dl>
);

interface AuditDetailPanelProps {
  log: AuditLog;
  onClose: () => void;
}

/** Panel samping detail satu aktivitas audit. */
export default function AuditDetailPanel({ log, onClose }: AuditDetailPanelProps) {
  const changes = log.perubahan || [];
  const entityHref = auditEntityHref(log);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h5 className="text-base font-semibold text-gray-800 mb-0">Detail Aktivitas</h5>
        <button type="button" onClick={onClose} className={iconButtonClass('gray')} aria-label="Tutup detail">
          <i className="ri-close-line"></i>
        </button>
      </div>

      <div className="px-5 flex-1 overflow-y-auto">
        <Section title="Informasi Umum">
          <InfoRows
            rows={[
              { label: 'Waktu', value: formatAuditTime(log.createdAt) },
              { label: 'Pengguna', value: log.role ? `${log.username} (${roleLabel(log.role)})` : log.username },
              ...(log.impersonatedBy ? [{ label: 'Dilakukan oleh', value: `${log.impersonatedBy} (login sebagai)` }] : []),
              { label: 'Modul', value: log.modul },
              { label: 'Aksi', value: <AuditActionBadge aksi={log.aksi} /> },
              { label: 'IP Address', value: log.ipAddress },
              { label: 'Perangkat', value: log.perangkat },
            ]}
          />
        </Section>

        <Section title="Entitas">
          <InfoRows
            rows={[
              { label: 'Nama Entitas', value: log.entitas },
              {
                label: 'Kode / ID',
                value: entityHref ? (
                  <Link href={entityHref} className="text-emerald-700 font-medium hover:underline inline-flex items-center gap-1">
                    {log.entitasKode || log.entitasId} <i className="ri-external-link-line"></i>
                  </Link>
                ) : (
                  log.entitasKode || log.entitasId
                ),
              },
              { label: 'Keterangan', value: log.keterangan },
            ]}
          />
        </Section>

        <Section title="Perubahan Data">
          {changes.length ? (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="text-left font-semibold py-2 px-2">Field</th>
                    <th className="text-left font-semibold py-2 px-2">Sebelum</th>
                    <th className="text-left font-semibold py-2 px-2">Sesudah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {changes.map((c) => (
                    <tr key={c.field}>
                      <td className="py-2 px-2 text-gray-700">{c.label}</td>
                      <td className="py-2 px-2 text-gray-600 break-words">{formatAuditValue(c.sebelum)}</td>
                      <td className="py-2 px-2 break-words">
                        <AuditValueChip value={c.sesudah} variant="sesudah" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">Tidak ada rincian perubahan field untuk aktivitas ini.</p>
          )}
        </Section>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button type="button" onClick={onClose} className={buttonClass('secondary', 'md', 'w-full')}>
          Tutup
        </button>
      </div>
    </div>
  );
}
