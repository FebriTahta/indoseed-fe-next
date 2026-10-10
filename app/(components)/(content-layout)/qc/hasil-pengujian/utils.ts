import { HASIL_AKHIR, PermintaanPengujianParameter } from '@/app/types/qc';

export interface ParameterSummary {
  /** Parameter yang dipilih untuk diuji. */
  aktif: PermintaanPengujianParameter[];
  lulus: number;
  gagal: PermintaanPengujianParameter[];
  belum: number;
}

/** Ringkasan status hasil per parameter aktif (lulus / tidak lulus / belum diuji). */
export const summarizeParameters = (parameters: PermintaanPengujianParameter[] = []): ParameterSummary => {
  const aktif = parameters.filter((p) => p.checked);
  const lulus = aktif.filter((p) => p.statusHasil === HASIL_AKHIR.LULUS).length;
  const gagal = aktif.filter((p) => p.statusHasil === HASIL_AKHIR.TIDAK_LULUS);
  return { aktif, lulus, gagal, belum: aktif.length - lulus - gagal.length };
};
