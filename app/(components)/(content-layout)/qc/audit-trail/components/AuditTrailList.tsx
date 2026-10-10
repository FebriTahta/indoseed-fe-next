"use client";

import React, { useMemo } from 'react';
import DataTable from '@/app/(components)/(content-layout)/shared/DataTable';
import StatsWidgets, { StatItem } from '@/app/(components)/(content-layout)/shared/StatsWidgets';
import UserAvatar from '@/app/(components)/(content-layout)/shared/UserAvatar';
import { ViewIconButton } from '@/app/(components)/(content-layout)/shared/ActionButtons';
import QcFilterBar, { QcFilterField } from '../../shared/QcFilterBar';
import AuditDetailPanel from './AuditDetailPanel';
import AuditChangeSummary from './AuditChangeSummary';
import { AuditActionBadge } from './AuditBadges';
import { formatAuditTime } from '../auditFormat';
import { useAuditTrail } from '@/app/hooks/useAuditTrail';
import { AuditFilters, AuditLog, AuditOptions, AuditSummary } from '@/app/types/auditTrail';
import { formatNumber } from '@/app/lib/format';
import { roleLabel } from '@/app/lib/roles';

const HEADERS = ['No.', 'Waktu', 'Pengguna', 'Modul', 'Aksi', 'Entitas', 'Keterangan Perubahan', 'IP Address', 'Perangkat', ''];
const PAGE_SIZES = [10, 25, 50, 100];

const buildStats = (s: AuditSummary | null): StatItem[] => {
  const rentang = `Dalam ${s?.rentangHari ?? 30} hari terakhir`;
  const value = (n?: number) => formatNumber(n ?? 0);
  return [
    { title: 'Total Aktivitas', value: value(s?.total), subtitle: 'Semua waktu', icon: 'ri-history-line', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { title: 'Pengguna Aktif', value: value(s?.penggunaAktif), subtitle: rentang, icon: 'ri-user-line', bgColor: 'bg-indigo-50', textColor: 'text-indigo-600' },
    { title: 'Data Diubah', value: value(s?.diubah), subtitle: rentang, icon: 'ri-file-edit-line', bgColor: 'bg-amber-50', textColor: 'text-amber-600' },
    { title: 'Data Dihapus', value: value(s?.dihapus), subtitle: rentang, icon: 'ri-delete-bin-6-line', bgColor: 'bg-rose-50', textColor: 'text-rose-600' },
    { title: 'Login', value: value(s?.login), subtitle: rentang, icon: 'ri-login-box-line', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
  ];
};

const toOptions = (values: string[]) => values.map((v) => ({ value: v, label: v }));

const buildFilterFields = (o: AuditOptions): QcFilterField<AuditFilters>[] => [
  { type: 'dateRange', label: 'Periode', startKey: 'startDate', endKey: 'endDate', placeholder: 'Semua periode', grow: 1.3 },
  { type: 'select', label: 'Pengguna', key: 'username', options: toOptions(o.pengguna), placeholder: 'Semua' },
  { type: 'select', label: 'Modul', key: 'modul', options: toOptions(o.modul), placeholder: 'Semua' },
  { type: 'select', label: 'Aksi', key: 'aksi', options: toOptions(o.aksi), placeholder: 'Semua', grow: 0.8 },
  { type: 'select', label: 'Entitas', key: 'entitas', options: toOptions(o.entitas), placeholder: 'Semua' },
  { type: 'search', label: 'Kata Kunci', key: 'search', placeholder: 'Cari batch, nomor dokumen...', grow: 1.4 },
];

interface AuditTrailListProps {
  state: ReturnType<typeof useAuditTrail>;
}

/** Isi halaman Audit Trail: statistik, filter, tabel aktivitas, dan panel detail. */
export default function AuditTrailList({ state }: AuditTrailListProps) {
  const { list, summary, options, selected, setSelected, applyFilters, clearFilters } = state;
  const stats = useMemo(() => buildStats(summary), [summary]);
  const filterFields = useMemo(() => buildFilterFields(options), [options]);

  const renderRow = (log: AuditLog, index: number) => {
    const isSelected = selected?.id === log.id;
    return (
      <tr
        key={log.id}
        onClick={() => setSelected(log)}
        aria-selected={isSelected}
        className={`border-b border-defaultborder cursor-pointer transition-colors align-top ${
          isSelected ? 'bg-emerald-50/60' : 'hover:bg-gray-50'
        }`}
      >
        <td className="p-3 text-gray-500">{(list.page - 1) * list.pageSize + index + 1}</td>
        <td className="p-3 whitespace-nowrap">{formatAuditTime(log.createdAt)}</td>
        <td className="p-3 max-w-[160px]">
          <UserAvatar name={log.username} subtitle={log.impersonatedBy ? `via ${log.impersonatedBy}` : roleLabel(log.role)} />
        </td>
        <td className="p-3 whitespace-nowrap">{log.modul}</td>
        <td className="p-3">
          <AuditActionBadge aksi={log.aksi} />
        </td>
        <td className="p-3 max-w-[180px]">
          <span className="block text-gray-800 truncate">{log.entitas || '-'}</span>
          {(log.entitasKode || log.entitasId) && (
            <span className="block text-gray-500 truncate" title={log.entitasKode || log.entitasId || ''}>
              {log.entitasKode || log.entitasId}
            </span>
          )}
        </td>
        <td className="p-3 min-w-[240px] whitespace-normal">
          <AuditChangeSummary log={log} />
        </td>
        <td className="p-3 whitespace-nowrap">{log.ipAddress || '-'}</td>
        <td className="p-3 whitespace-nowrap">{log.perangkat || '-'}</td>
        <td className="p-3" onClick={(e) => e.stopPropagation()}>
          <ViewIconButton onClick={() => setSelected(log)} />
        </td>
      </tr>
    );
  };

  return (
    <>
      <StatsWidgets items={stats} columns={5} />

      <QcFilterBar id="audit" value={list.filters} fields={filterFields} onApply={applyFilters} onReset={clearFilters} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <div className={selected ? 'xl:col-span-8 2xl:col-span-9' : 'xl:col-span-12'}>
          <h5 className="text-base font-semibold text-gray-800 mb-3">Daftar Audit Trail</h5>
          <DataTable
            headers={HEADERS}
            items={list.items}
            renderRow={renderRow}
            currentPage={list.page}
            pageSize={list.pageSize}
            pageSizeOptions={PAGE_SIZES}
            totalPages={list.totalPages}
            totalRecords={list.total}
            onPageChange={list.setPage}
            onPageSizeChange={list.setPageSize}
            headerTextSize="11px"
            bodyTextSize="11px"
            isLoading={list.loading}
            emptyMessage="Belum ada aktivitas yang sesuai dengan filter."
          />
        </div>

        {selected && (
          <aside className="xl:col-span-4 2xl:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] overflow-hidden">
            <AuditDetailPanel log={selected} onClose={() => setSelected(null)} />
          </aside>
        )}
      </div>
    </>
  );
}
