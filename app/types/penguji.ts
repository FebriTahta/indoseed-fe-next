export const PENGUJI_STATUS = ['Aktif', 'Nonaktif'] as const;
export type PengujiStatus = (typeof PENGUJI_STATUS)[number];

export interface PengujiSertifikasi {
  id: string;
  namaSertifikasi: string;
  nomorSertifikat?: string | null;
  tanggalSertifikat?: string | null;
  berlakuHingga?: string | null;
  lampiranUrl?: string | null;
}

export interface Penguji {
  id: string;
  kodePenguji: string;
  nama: string;
  userId?: string | null;
  laboratoriumId?: string | null;
  noTelepon?: string | null;
  foto?: string | null;
  keterangan?: string | null;
  tanggalBergabung?: string | null;
  berlakuHingga?: string | null;
  status: PengujiStatus;
  laboratorium?: { id: string; kodeLaboratorium: string; namaLaboratorium: string } | null;
  user?: { id: string; username: string; email: string } | null;
  metodeUji: { testMethodId: string; testMethod: { id: string; kode: string; nama: string; jenisUji?: string | null } }[];
  sertifikasi: PengujiSertifikasi[];
}

export interface PengujiStats {
  total: number;
  aktif: number;
  nonaktif: number;
  bersertifikat: number;
  akanExpired: number;
  hariAkanExpired: number;
}

export interface PengujiFilters {
  search: string;
  status: string;
  laboratoriumId: string;
  testMethodId: string;
}

export interface PengujiPayload {
  kodePenguji?: string | null;
  nama: string;
  email: string;
  noTelepon?: string | null;
  laboratoriumId: string;
  metodeUjiIds: string[];
  tanggalBergabung: string;
  berlakuHingga?: string | null;
  status: PengujiStatus;
  keterangan?: string | null;
  foto?: string | null;
  sertifikasi?: {
    namaSertifikasi: string;
    nomorSertifikat?: string | null;
    tanggalSertifikat?: string | null;
    lampiranUrl?: string | null;
  } | null;
}

/** Kredensial akun yang ditampilkan sekali setelah penguji dibuat / password direset. */
export interface AkunPenguji {
  username: string;
  email: string;
  passwordSementara: string;
}
