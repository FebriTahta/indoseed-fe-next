/**
 * Padanan aturan backend (`services/qc/validitasHasil.ts`) untuk draft yang belum disimpan:
 * parameter dianggap sudah diuji bila memiliki nilai hasil (angka / teks) DAN status hasil.
 */
export const sudahDiuji = (p: { nilai?: string | number | null; teks?: string | null; status?: string | null }) => {
  const adaNilai = p.nilai !== null && p.nilai !== undefined && String(p.nilai).trim() !== '';
  return Boolean(p.status) && (adaNilai || Boolean(p.teks?.trim()));
};
