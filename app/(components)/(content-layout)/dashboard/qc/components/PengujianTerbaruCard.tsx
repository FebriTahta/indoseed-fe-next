import React from 'react';
import Link from 'next/link';
import QcCard from '@/app/(components)/(content-layout)/qc/shared/QcCard';
import QcStatusBadge from '@/app/(components)/(content-layout)/qc/shared/QcStatusBadge';
import { iconButtonClass } from '@/app/(components)/(content-layout)/shared/buttonStyles';
import EmptyState from './EmptyState';
import { DashboardQc } from '@/app/types/dashboardQc';
import { HASIL_TIDAK_VALID, PermintaanPengujian, QC_STATUS } from '@/app/types/qc';
import { formatDate } from '@/app/lib/format';

const HEADERS = ['No.', 'No. Permintaan', 'No. Batch', 'Komoditas / Varietas', 'Jenis Uji', 'Status', 'Tgl Sampling', 'Aksi'];

/** Status yang paling informatif: tidak valid → kesimpulan (bila selesai) → status alur. */
const statusTampil = (p: PermintaanPengujian) => {
  if (p.hasilTidakValid) return HASIL_TIDAK_VALID;
  return p.status === QC_STATUS.SELESAI && p.hasilAkhir ? p.hasilAkhir : p.status;
};

/** Pengujian yang paling baru diperbarui pada periode terpilih. */
export default function PengujianTerbaruCard({ data }: { data: DashboardQc }) {
  return (
    <QcCard
      title="Pengujian Terbaru"
      icon="ri-time-line"
      action={
        <Link href="/qc/pemeriksaan-pengujian" className="text-xs font-medium text-emerald-700 hover:underline">
          Lihat Semua
        </Link>
      }
    >
      {!data.terbaru.length ? (
        <EmptyState icon="ri-flask-line" title="Belum ada pengujian pada periode ini" />
      ) : (
        <div className="overflow-x-auto -mx-4">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                {HEADERS.map((h) => (
                  <th key={h} className="text-left font-semibold px-3 py-2 whitespace-nowrap first:pl-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.terbaru.map((p, i) => {
                const jenisUji = (p.parameters || []).filter((x) => x.checked).map((x) => x.nama).join(', ');
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2.5 pl-4 text-gray-500">{i + 1}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap font-medium text-emerald-700">{p.noPermintaan}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{p.kodeBatch}</td>
                    <td className="px-3 py-2.5 max-w-[150px]">
                      <span className="block truncate text-gray-800">{p.komoditas || '-'}</span>
                      <span className="block truncate text-[10px] text-gray-500">{p.varietas || '-'}</span>
                    </td>
                    <td className="px-3 py-2.5 max-w-[150px] truncate" title={jenisUji}>
                      {jenisUji || '-'}
                    </td>
                    <td className="px-3 py-2.5">
                      <QcStatusBadge status={statusTampil(p)} />
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{formatDate(p.tanggalSampling)}</td>
                    <td className="px-3 py-2.5">
                      <Link href={`/qc/pemeriksaan-pengujian/${p.id}`} className={iconButtonClass('emerald')} title="Lihat detail pengujian">
                        <i className="ri-eye-line"></i>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </QcCard>
  );
}
