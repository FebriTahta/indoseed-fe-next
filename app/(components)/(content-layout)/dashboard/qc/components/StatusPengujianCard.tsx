"use client";

import React, { useMemo } from 'react';
import ClientChart from '@/app/(components)/(content-layout)/shared/ClientChart';
import QcCard from '@/app/(components)/(content-layout)/qc/shared/QcCard';
import EmptyState from './EmptyState';
import { STATUS_COLOR, formatPersen } from './chartColors';
import { DashboardQc } from '@/app/types/dashboardQc';
import { formatNumber } from '@/app/lib/format';

/** Komposisi status permintaan pengujian dalam periode (donut + legenda berlabel & angka). */
export default function StatusPengujianCard({ data }: { data: DashboardQc }) {
  const rows = data.statusPengujian;
  const total = data.totalPermintaan;

  const options = useMemo(
    () => ({
      labels: rows.map((r) => r.status),
      colors: rows.map((r) => STATUS_COLOR[r.status] ?? '#94a3b8'),
      legend: { show: false },
      dataLabels: { enabled: false },
      stroke: { width: 2, colors: ['#ffffff'] }, // jarak 2px antar irisan
      plotOptions: {
        pie: {
          donut: {
            size: '72%',
            labels: {
              show: true,
              name: { show: true, fontSize: '11px', color: '#6b7280', offsetY: 18 },
              value: { show: true, fontSize: '22px', fontWeight: 700, color: '#1f2937', offsetY: -14 },
              total: { show: true, showAlways: true, label: 'Total Permintaan', fontSize: '11px', color: '#6b7280', formatter: () => formatNumber(total) },
            },
          },
        },
      },
      tooltip: { y: { formatter: (v: number) => `${formatNumber(v)} (${formatPersen(v, total)})` } },
      states: { hover: { filter: { type: 'darken', value: 0.9 } } },
    }),
    [rows, total]
  );

  return (
    <QcCard title="Status Pengujian" icon="ri-donut-chart-line" className="h-full">
      {total === 0 ? (
        <EmptyState icon="ri-donut-chart-line" title="Belum ada permintaan pada periode ini" />
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-44 shrink-0">
            <ClientChart type="donut" options={options} series={rows.map((r) => r.total)} height={190} dataKey={total} />
          </div>
          <ul className="flex-1 w-full space-y-2 text-xs">
            {rows.map((r) => (
              <li key={r.status} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLOR[r.status] }} aria-hidden="true"></span>
                <span className="flex-1 text-gray-700 truncate">{r.status}</span>
                <span className="font-semibold text-gray-800 tabular-nums">{formatNumber(r.total)}</span>
                <span className="w-12 text-right text-gray-400 tabular-nums">({formatPersen(r.total, total)})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </QcCard>
  );
}
