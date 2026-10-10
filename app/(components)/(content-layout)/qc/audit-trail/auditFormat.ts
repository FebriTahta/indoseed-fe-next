import { formatDateTime } from '@/app/lib/format';
import { AuditAksi } from '@/app/types/auditTrail';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
const NUMERIC = /^-?\d+(\.\d+)?$/;
const NEGATIVE_VALUES = ['tidak lulus', 'ditolak', 'reject', 'tidak valid', 'nonaktif'];

/** Tampilkan nilai perubahan dalam format lokal (tanggal & angka desimal). */
export const formatAuditValue = (value?: string | null) => {
  if (value === null || value === undefined || value === '') return '-';
  if (ISO_DATE.test(value)) return formatDateTime(value);
  if (NUMERIC.test(value)) return Number(value).toLocaleString('id-ID', { maximumFractionDigits: 4 });
  return value;
};

export const isNegativeValue = (value?: string | null) => NEGATIVE_VALUES.includes((value || '').trim().toLowerCase());

/** Waktu audit lengkap dengan detik, mis. "11/06/2026 14:35:21". */
export const formatAuditTime = (value: string) =>
  new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).replace(/\./g, ':').replace(',', '');

export const AKSI_STYLE: Record<AuditAksi, string> = {
  CREATE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  UPDATE: 'bg-sky-50 text-sky-700 border-sky-200',
  DELETE: 'bg-rose-50 text-rose-700 border-rose-200',
  LOGIN: 'bg-violet-50 text-violet-700 border-violet-200',
  LOGOUT: 'bg-gray-50 text-gray-600 border-gray-200',
};

/** Modul yang entitasId-nya adalah id permintaan pengujian (satu alur: permintaan → pengujian → hasil). */
const MODUL_PENGUJIAN = ['Permintaan Pengujian', 'Pemeriksaan Pengujian', 'Hasil Pengujian'];

/**
 * Tautan ke data yang terkait dengan aktivitas audit, atau null bila tidak ada halaman tujuan
 * (mis. data sudah dihapus atau modul tanpa halaman detail).
 */
export const auditEntityHref = (log: { modul: string; aksi: string; entitasId?: string | null }) => {
  if (!log.entitasId || log.aksi === 'DELETE') return null;
  if (MODUL_PENGUJIAN.includes(log.modul)) return `/qc/pemeriksaan-pengujian/${log.entitasId}`;
  if (log.modul === 'Metode Uji') return `/qc/standar-metode-uji/edit/${log.entitasId}`;
  if (log.modul === 'Penguji') return '/qc/penguji';
  return null;
};
