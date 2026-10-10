"use client";

import React, { useMemo } from 'react';
import ClientChart from '@/app/(components)/(content-layout)/shared/ClientChart';
import QcCard from '@/app/(components)/(content-layout)/qc/shared/QcCard';
import EmptyState from './EmptyState';
import { HASIL_COLOR } from './chartColors';
import { DashboardQc } from '@/app/types/dashboardQc';
import { formatNumber } from '@/app/lib/format';

const LEGEND = [
  { label: 'Lulus', color: HASIL_COLOR.lulus, icon: 'ri-checkbox-circle-fill' },
  { label: 'Tidak Lulus', color: HASIL_COLOR.tidakLulus, icon: 'ri-close-circle-fill' },
];

/** Hasil pengujian selesai per komoditas (bar horizontal bertumpuk lulus / tidak lulus). */
export default function KomoditasCard({ data }: { data: DashboardQc }) {
  const rows = data.komoditas;

  const options = useMemo(
    () => ({
      chart: { stacked: true, toolbar: { show: false }, fontFamily: 'inherit' },
      colors: [HASIL_COLOR.lulus, HASIL_COLOR.tidakLulus],
      plotOptions: { bar: { horizontal: true, barHeight: '45%', borderRadius: 4, borderRadiusApplication: 'end' } },
      stroke: { width: 2, colors: ['#ffffff'] }, // jarak 2px antar segmen
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: { borderColor: '#f1f5f9', xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
      xaxis: {
        categories: rows.map((r) => r.komoditas),
        labels: { style: { colors: '#6b7280', fontSize: '11px' }, formatter: (v: string) => formatNumber(Number(v)) },
        tickAmount: Math.min(4, Math.max(1, ...rows.map((r) => r.lulus + r.tidakLulus))),
      },
      yaxis: { labels: { style: { colors: '#374151', fontSize: '11px' } } },
      tooltip: { shared: true, intersect: false, y: { formatter: (v: number | null) => `${formatNumber(v ?? 0)} pengujian` } },
    }),
    [rows]
  );

  const series = useMemo(
    () => [
      // Nilai 0 dikirim sebagai null agar tidak tergambar segmen tipis berwarna.
      { name: 'Lulus', data: rows.map((r) => r.lulus || null) },
      { name: 'Tidak Lulus', data: rows.map((r) => r.tidakLulus || null) },
    ],
    [rows]
  );

  return (
    <QcCard
      title="Pengujian Berdasarkan Komoditas"
      icon="ri-plant-line"
      action={
        <ul className="flex items-center gap-3 text-[11px] text-gray-600" aria-label="Legenda">
          {LEGEND.map((l) => (
            <li key={l.label} className="flex items-center gap-1">
              <i className={l.icon} style={{ color: l.color }} aria-hidden="true"></i>
              {l.label}
            </li>
          ))}
        </ul>
      }
    >
      {!rows.length ? (
        <EmptyState icon="ri-plant-line" title="Belum ada pengujian selesai pada periode ini" />
      ) : (
        <ClientChart type="bar" options={options} series={series} height={Math.max(160, rows.length * 42 + 60)} dataKey={rows.length} />
      )}
    </QcCard>
  );
}
