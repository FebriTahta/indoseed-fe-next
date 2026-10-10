export const AUDIT_AKSI = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
} as const;

export type AuditAksi = (typeof AUDIT_AKSI)[keyof typeof AUDIT_AKSI];

export interface AuditChange {
  field: string;
  label: string;
  sebelum: string | null;
  sesudah: string | null;
}

export interface AuditLog {
  id: string;
  createdAt: string;
  userId?: string | null;
  username: string;
  role?: string | null;
  modul: string;
  aksi: AuditAksi;
  entitas?: string | null;
  entitasId?: string | null;
  entitasKode?: string | null;
  keterangan: string;
  perubahan?: AuditChange[] | null;
  ipAddress?: string | null;
  perangkat?: string | null;
  /** Superadmin yang melakukan aktivitas ini lewat fitur "login sebagai". */
  impersonatedBy?: string | null;
  /** Hanya pada detail. */
  metode?: string | null;
  endpoint?: string | null;
  userAgent?: string | null;
}

export interface AuditFilters {
  search: string;
  username: string;
  modul: string;
  aksi: string;
  entitas: string;
  startDate: string;
  endDate: string;
}

export interface AuditSummary {
  total: number;
  penggunaAktif: number;
  diubah: number;
  dihapus: number;
  login: number;
  rentangHari: number;
}

export interface AuditOptions {
  pengguna: string[];
  modul: string[];
  entitas: string[];
  aksi: AuditAksi[];
}
