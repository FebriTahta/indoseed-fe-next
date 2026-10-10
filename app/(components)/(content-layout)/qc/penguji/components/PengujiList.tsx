"use client";

import React, { useMemo, useState } from 'react';
import DataTable from '@/app/(components)/(content-layout)/shared/DataTable';
import StatsWidgets, { StatItem } from '@/app/(components)/(content-layout)/shared/StatsWidgets';
import UserAvatar from '@/app/(components)/(content-layout)/shared/UserAvatar';
import { AddButton, DeleteIconButton, EditIconButton } from '@/app/(components)/(content-layout)/shared/ActionButtons';
import { iconButtonClass } from '@/app/(components)/(content-layout)/shared/buttonStyles';
import { useConfirm } from '@/app/(components)/(content-layout)/shared/ConfirmDialog';
import QcPageHeader from '../../shared/QcPageHeader';
import QcStatusBadge from '../../shared/QcStatusBadge';
import QcChipList from '../../shared/QcChipList';
import QcFilterBar, { QcFilterField } from '../../shared/QcFilterBar';
import { useLaboratoriumOptions, useMetodeUjiOptions } from '@/app/hooks/useQcReference';
import PengujiFormModal from './PengujiFormModal';
import AkunPengujiModal from './AkunPengujiModal';
import { usePengujiPage } from '@/app/hooks/usePengujiPage';
import { useCurrentUser } from '@/app/hooks/useCurrentUser';
import { formatDate, formatNumber } from '@/app/lib/format';
import { AkunPenguji, PENGUJI_STATUS, Penguji, PengujiFilters, PengujiStats } from '@/app/types/penguji';

const HEADERS = ['No.', 'Foto', 'Kode Penguji', 'Nama Penguji', 'Laboratorium', 'Metode Uji yang Dikuasai', 'Sertifikasi', 'Status', 'Berlaku Hingga', 'Aksi'];
const DAY_MS = 24 * 60 * 60 * 1000;

const persen = (part: number, total: number) =>
  total ? `${(Math.round((part / total) * 10000) / 100).toLocaleString('id-ID')}%` : '0%';

const buildStats = (s: PengujiStats | null): StatItem[] => {
  const total = s?.total ?? 0;
  return [
    { title: 'Total Penguji', value: formatNumber(total), subtitle: `${formatNumber(s?.aktif ?? 0)} penguji aktif`, icon: 'ri-group-line', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { title: 'Penguji Aktif', value: formatNumber(s?.aktif ?? 0), subtitle: persen(s?.aktif ?? 0, total), icon: 'ri-user-follow-line', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { title: 'Penguji Nonaktif', value: formatNumber(s?.nonaktif ?? 0), subtitle: persen(s?.nonaktif ?? 0, total), icon: 'ri-user-unfollow-line', bgColor: 'bg-rose-50', textColor: 'text-rose-600' },
    { title: 'Bersertifikat', value: formatNumber(s?.bersertifikat ?? 0), subtitle: persen(s?.bersertifikat ?? 0, total), icon: 'ri-award-line', bgColor: 'bg-amber-50', textColor: 'text-amber-600' },
    { title: 'Akan Expired', value: formatNumber(s?.akanExpired ?? 0), subtitle: `Dalam ${s?.hariAkanExpired ?? 30} hari`, icon: 'ri-calendar-event-line', bgColor: 'bg-sky-50', textColor: 'text-sky-600' },
  ];
};

/** Tanggal berlaku dengan penanda: merah bila lewat, kuning bila ≤ 30 hari lagi. */
const BerlakuHingga = ({ value }: { value?: string | null }) => {
  if (!value) return <span className="text-gray-400">-</span>;
  const sisaHari = Math.ceil((new Date(value).getTime() - Date.now()) / DAY_MS);
  const tone = sisaHari < 0 ? 'text-rose-600 font-semibold' : sisaHari <= 30 ? 'text-amber-600 font-semibold' : 'text-gray-700';
  const title = sisaHari < 0 ? 'Sudah lewat masa berlaku' : sisaHari <= 30 ? `Berakhir dalam ${sisaHari} hari` : undefined;
  return (
    <span className={tone} title={title}>
      {formatDate(value)}
    </span>
  );
};

type ModalState = { type: 'form'; penguji: Penguji | null } | { type: 'akun'; akun: AkunPenguji; context: 'dibuat' | 'direset' } | null;

/** Halaman Penguji: header, statistik, filter, tabel, serta modal tambah/edit & kredensial akun. */
export default function PengujiList() {
  const { list, stats, refresh, remove, resetPassword, loginAs } = usePengujiPage();
  const { canManagePenguji, isSuperadmin } = useCurrentUser();
  const confirm = useConfirm();
  const [modal, setModal] = useState<ModalState>(null);
  const statItems = useMemo(() => buildStats(stats), [stats]);
  const { options: labOptions, loading: loadingLab } = useLaboratoriumOptions();
  const { options: metodeOptions, loading: loadingMetode } = useMetodeUjiOptions();
  const filterFields = useMemo<QcFilterField<PengujiFilters>[]>(
    () => [
      { type: 'search', label: 'Cari', key: 'search', placeholder: 'Cari penguji, kode, atau email...', grow: 1.6 },
      { type: 'select', label: 'Status', key: 'status', options: PENGUJI_STATUS.map((s) => ({ value: s, label: s })), placeholder: 'Semua Status' },
      { type: 'select', label: 'Laboratorium', key: 'laboratoriumId', options: labOptions, placeholder: 'Semua Laboratorium', loading: loadingLab },
      { type: 'select', label: 'Metode Uji', key: 'testMethodId', options: metodeOptions, placeholder: 'Semua Metode Uji', loading: loadingMetode },
    ],
    [labOptions, loadingLab, metodeOptions, loadingMetode]
  );

  const handleDelete = async (p: Penguji) => {
    const ok = await confirm({
      title: 'Hapus Penguji?',
      message: 'Data penguji beserta akun login-nya akan dihapus permanen. Penguji yang sudah memiliki riwayat pengujian tidak dapat dihapus — nonaktifkan saja.',
      details: (
        <>
          <strong>{p.kodePenguji}</strong> — {p.nama}
          {p.user && <span className="block text-gray-500">Akun: {p.user.username}</span>}
        </>
      ),
      tone: 'danger',
      confirmText: 'Ya, Hapus',
    });
    if (ok) remove(p);
  };

  const handleResetPassword = async (p: Penguji) => {
    const ok = await confirm({
      title: 'Reset Password Penguji?',
      message: 'Password lama tidak berlaku lagi. Password sementara baru akan ditampilkan satu kali.',
      details: `${p.nama} (${p.user?.username})`,
      tone: 'warning',
      icon: 'ri-lock-password-line',
      confirmText: 'Reset Password',
    });
    if (!ok) return;
    const akun = await resetPassword(p);
    if (akun) setModal({ type: 'akun', akun, context: 'direset' });
  };

  const handleLoginAs = async (p: Penguji) => {
    const ok = await confirm({
      title: `Login sebagai ${p.nama}?`,
      message: 'Anda akan melihat dan menjalankan aplikasi dengan hak akses penguji ini. Seluruh aktivitas tercatat di audit trail atas nama Anda. Gunakan tombol "Kembali" pada banner untuk kembali ke akun superadmin.',
      details: `${p.kodePenguji} — akun ${p.user?.username}`,
      tone: 'info',
      icon: 'ri-user-shared-line',
      confirmText: 'Login sebagai Penguji',
    });
    if (ok) loginAs(p);
  };

  const renderRow = (p: Penguji, index: number) => {
    const canLoginAs = isSuperadmin && p.userId && p.status === 'Aktif';
    return (
      <tr key={p.id} className="border-b border-defaultborder hover:bg-gray-50 transition-colors">
        <td className="p-3 text-gray-500">{(list.page - 1) * list.pageSize + index + 1}</td>
        <td className="p-3">
          <UserAvatar name={p.nama} imageUrl={p.foto} size="lg" avatarOnly />
        </td>
        <td className="p-3 whitespace-nowrap font-medium text-gray-800">{p.kodePenguji}</td>
        <td className="p-3 whitespace-nowrap">
          <span className="block font-medium text-gray-800">{p.nama}</span>
          <span className="block text-[10px] text-gray-500">{p.user?.email || 'Belum memiliki akun'}</span>
        </td>
        <td className="p-3 whitespace-nowrap">{p.laboratorium?.namaLaboratorium || '-'}</td>
        <td className="p-3 min-w-[220px]">
          <QcChipList items={p.metodeUji.map((m) => m.testMethod.nama)} />
        </td>
        <td className="p-3">
          {p.sertifikasi[0] ? (
            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-medium whitespace-nowrap" title={p.sertifikasi[0].nomorSertifikat || undefined}>
              {p.sertifikasi[0].namaSertifikasi}
            </span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </td>
        <td className="p-3">
          <QcStatusBadge status={p.status} />
        </td>
        <td className="p-3 whitespace-nowrap">
          <BerlakuHingga value={p.berlakuHingga} />
        </td>
        <td className="p-3">
          <div className="flex items-center gap-1">
            {canManagePenguji && <EditIconButton onClick={() => setModal({ type: 'form', penguji: p })} />}
            {canManagePenguji && p.userId && (
              <button type="button" onClick={() => handleResetPassword(p)} className={iconButtonClass('amber')} title="Reset password">
                <i className="ri-key-2-line"></i>
              </button>
            )}
            {canLoginAs && (
              <button type="button" onClick={() => handleLoginAs(p)} className={iconButtonClass('emerald')} title="Login sebagai penguji ini">
                <i className="ri-login-circle-line"></i>
              </button>
            )}
            {canManagePenguji && <DeleteIconButton onClick={() => handleDelete(p)} />}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      <QcPageHeader
        title="Penguji"
        description="Kelola data penguji yang bertugas melakukan pengujian benih di laboratorium dan lapangan."
        icon="ri-user-star-line"
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        actionButtons={canManagePenguji && <AddButton label="Tambah Penguji" onClick={() => setModal({ type: 'form', penguji: null })} />}
      />

      <StatsWidgets items={statItems} columns={5} />

      <QcFilterBar id="penguji" value={list.filters} fields={filterFields} onApply={list.setFilters} onReset={list.resetFilters} />

      <h5 className="text-base font-semibold text-gray-800 mb-3">Daftar Penguji</h5>
      <DataTable
        headers={HEADERS}
        items={list.items}
        renderRow={renderRow}
        currentPage={list.page}
        pageSize={list.pageSize}
        totalPages={list.totalPages}
        totalRecords={list.total}
        onPageChange={list.setPage}
        onPageSizeChange={list.setPageSize}
        headerTextSize="11px"
        bodyTextSize="11px"
        isLoading={list.loading}
        emptyMessage="Belum ada penguji yang sesuai dengan filter."
      />

      <PengujiFormModal
        isOpen={modal?.type === 'form'}
        penguji={modal?.type === 'form' ? modal.penguji : null}
        onClose={() => setModal(null)}
        onSaved={(akun) => {
          refresh();
          setModal(akun ? { type: 'akun', akun, context: 'dibuat' } : null);
        }}
      />

      <AkunPengujiModal
        akun={modal?.type === 'akun' ? modal.akun : null}
        context={modal?.type === 'akun' ? modal.context : undefined}
        onClose={() => setModal(null)}
      />
    </>
  );
}
