import React from 'react';
import Link from 'next/link';
import QcCard from '@/app/(components)/(content-layout)/qc/shared/QcCard';
import { DashboardQc } from '@/app/types/dashboardQc';
import { formatNumber } from '@/app/lib/format';

/** Tahapan alur QC beserta jumlah data di tiap tahap; setiap tahap menautkan ke halaman kerjanya. */
export default function AlurQcCard({ data }: { data: DashboardQc }) {
  const steps = [
    { label: 'Permintaan Pengujian', desc: 'Permintaan masuk pada periode ini', value: data.alur.permintaan, href: '/qc/permintaan-pengujian', tone: 'emerald' },
    { label: 'Pengujian', desc: 'Sampling & analisa di laboratorium', value: data.alur.pengujian, href: '/qc/pemeriksaan-pengujian', tone: 'sky' },
    { label: 'Review Hasil', desc: 'Pemeriksaan oleh supervisor', value: data.alur.review, href: '/qc/hasil-pengujian', tone: 'amber' },
    { label: 'Lulus', desc: 'Memenuhi standar mutu', value: data.alur.lulus, href: '/qc/hasil-pengujian', tone: 'emerald' },
    { label: 'Tidak Lulus', desc: 'Perlu tindak lanjut', value: data.alur.tidakLulus, href: '/qc/hasil-pengujian', tone: 'rose' },
  ] as const;

  const TONE = {
    emerald: { dot: 'border-emerald-500 text-emerald-600', badge: 'bg-emerald-50 text-emerald-700' },
    sky: { dot: 'border-sky-500 text-sky-600', badge: 'bg-sky-50 text-sky-700' },
    amber: { dot: 'border-amber-500 text-amber-600', badge: 'bg-amber-50 text-amber-700' },
    rose: { dot: 'border-rose-500 text-rose-600', badge: 'bg-rose-50 text-rose-700' },
  };

  return (
    <QcCard title="Alur QC" icon="ri-flow-chart" className="h-full">
      <ol className="relative space-y-1 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-px before:bg-gray-200">
        {steps.map((s, i) => (
          <li key={s.label}>
            <Link href={s.href} className="relative flex items-center gap-3 rounded-lg px-1 py-2 hover:bg-gray-50 transition-colors">
              <span className={`relative z-10 w-6 h-6 shrink-0 rounded-full bg-white border-2 flex items-center justify-center text-[10px] font-bold ${TONE[s.tone].dot}`}>
                {i + 1}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-xs font-semibold text-gray-800">{s.label}</span>
                <span className="block text-[10px] text-gray-500 truncate">{s.desc}</span>
              </span>
              <span className={`min-w-9 px-2 py-1 rounded-md text-xs font-bold text-center tabular-nums ${TONE[s.tone].badge}`}>{formatNumber(s.value)}</span>
            </Link>
          </li>
        ))}
      </ol>
    </QcCard>
  );
}
