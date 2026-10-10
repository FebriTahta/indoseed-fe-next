"use client";

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import StatsWidgets, { StatItem } from '@/app/(components)/(content-layout)/shared/StatsWidgets';
import { buttonClass } from '@/app/(components)/(content-layout)/shared/buttonStyles';
import QcPageHeader from '@/app/(components)/(content-layout)/qc/shared/QcPageHeader';
import QcCard from '@/app/(components)/(content-layout)/qc/shared/QcCard';
import PeriodeRangePicker from './PeriodeRangePicker';
import StatusPengujianCard from './StatusPengujianCard';
import JenisPengujianCard from './JenisPengujianCard';
import AlurQcCard from './AlurQcCard';
import PengujianTerbaruCard from './PengujianTerbaruCard';
import KomoditasCard from './KomoditasCard';
import EmptyState from './EmptyState';
import { useDashboardQc } from '@/app/hooks/useDashboardQc';
import { DashboardQc } from '@/app/types/dashboardQc';
import { formatNumber } from '@/app/lib/format';

const NO_COMPARISON = 'Belum ada pembanding';

const buildKpis = (d: DashboardQc | null): StatItem[] => {
  const kpi = (k: keyof DashboardQc['kpi']) => formatNumber(d?.kpi[k] ?? 0);
  const trend = (k: keyof DashboardQc['kpi'], goodWhen: 'up' | 'down') => ({ value: d?.trend[k] ?? null, goodWhen });
  return [
    { title: 'Sampel Masuk', value: kpi('sampelMasuk'), subtitle: NO_COMPARISON, icon: 'ri-flask-line', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', trend: trend('sampelMasuk', 'up') },
    { title: 'Pengujian Berjalan', value: kpi('pengujianBerjalan'), subtitle: NO_COMPARISON, icon: 'ri-settings-3-line', bgColor: 'bg-sky-50', textColor: 'text-sky-600', trend: trend('pengujianBerjalan', 'up') },
    { title: 'Menunggu Review', value: kpi('menungguReview'), subtitle: NO_COMPARISON, icon: 'ri-time-line', bgColor: 'bg-amber-50', textColor: 'text-amber-600', trend: trend('menungguReview', 'down') },
    { title: 'Tidak Lulus', value: kpi('tidakLulus'), subtitle: NO_COMPARISON, icon: 'ri-close-circle-line', bgColor: 'bg-rose-50', textColor: 'text-rose-600', trend: trend('tidakLulus', 'down') },
    { title: 'Lulus', value: kpi('lulus'), subtitle: NO_COMPARISON, icon: 'ri-checkbox-circle-line', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', trend: trend('lulus', 'up') },
  ];
};

/** Dashboard QC & LAB: ringkasan alur pengujian berdasarkan data periode terpilih. */
export default function DashboardQcView() {
  const router = useRouter();
  const { data, loading, periode, setPeriode } = useDashboardQc();
  const kpis = useMemo(() => buildKpis(data), [data]);

  return (
    <>
      <QcPageHeader
        title="Dashboard QC & LAB"
        description="Monitor kualitas benih mulai dari penerimaan sampel hingga hasil pengujian."
        icon="ri-plant-line"
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        actionButtons={
          <>
            <PeriodeRangePicker value={periode} onChange={setPeriode} />
            <button type="button" onClick={() => router.push('/qc/permintaan-pengujian/create')} className={buttonClass('primary')}>
              <i className="ri-add-line"></i> Permintaan Pengujian
            </button>
            <button type="button" onClick={() => router.push('/qc/audit-trail')} className={buttonClass('outline')}>
              <i className="ri-history-line"></i> Lihat Riwayat
            </button>
          </>
        }
      />

      <div className={loading && data ? 'opacity-60 transition-opacity' : 'transition-opacity'} aria-busy={loading}>
        <StatsWidgets items={kpis} columns={5} />

        {!data ? (
          <div className="flex justify-center py-16">
            <i className="ri-loader-4-line text-3xl animate-spin text-emerald-600"></i>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-4">
              <div className="xl:col-span-4">
                <StatusPengujianCard data={data} />
              </div>
              <div className="xl:col-span-4">
                <JenisPengujianCard data={data} />
              </div>
              <div className="lg:col-span-2 xl:col-span-4">
                <AlurQcCard data={data} />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
              <div className="xl:col-span-8 space-y-4">
                <PengujianTerbaruCard data={data} />
                <QcCard title="Dokumen & Sertifikat" icon="ri-file-text-line">
                  <EmptyState icon="ri-file-list-3-line" title="Segera hadir" description="Ringkasan dokumen & sertifikat QC akan ditampilkan di sini." />
                </QcCard>
              </div>
              <div className="xl:col-span-4 space-y-4">
                <KomoditasCard data={data} />
                <QcCard title="Temuan QC (Terbaru)" icon="ri-error-warning-line">
                  <EmptyState icon="ri-search-eye-line" title="Segera hadir" description="Daftar temuan QC terbaru akan ditampilkan di sini." />
                </QcCard>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
