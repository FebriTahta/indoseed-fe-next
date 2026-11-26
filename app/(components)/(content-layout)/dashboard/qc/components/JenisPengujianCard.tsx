import React from 'react';
import QcCard from '@/app/(components)/(content-layout)/qc/shared/QcCard';
import EmptyState from './EmptyState';
import { MAGNITUDE_COLOR } from './chartColors';
import { DashboardQc } from '@/app/types/dashboardQc';
import { formatNumber } from '@/app/lib/format';

/** Parameter uji yang paling sering diminta dalam periode (bar horizontal satu seri). */
export default function JenisPengujianCard({ data }: { data: DashboardQc }) {
  const rows = data.jenisPengujian;
  const max = Math.max(1, ...rows.map((r) => r.total));

  return (
    <QcCard
      title={
        <>
          Jenis Pengujian <span className="font-normal text-gray-400">(total parameter)</span>
        </>
      }
      icon="ri-bar-chart-horizontal-line"
      className="h-full"
    >
      {!rows.length ? (
        <EmptyState icon="ri-bar-chart-horizontal-line" title="Belum ada parameter uji pada periode ini" />
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.nama} className="grid grid-cols-[minmax(0,7.5rem)_2rem_1fr] items-center gap-3 text-xs" title={`${r.nama}: ${r.total} pengujian`}>
              <span className="text-gray-700 truncate">{r.nama}</span>
              <span className="text-right font-semibold text-gray-800 tabular-nums">{formatNumber(r.total)}</span>
              <span className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <span
                  className="block h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${(r.total / max) * 100}%`, backgroundColor: MAGNITUDE_COLOR, opacity: r.nama === 'Lainnya' ? 0.45 : 1 }}
                ></span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </QcCard>
  );
}
