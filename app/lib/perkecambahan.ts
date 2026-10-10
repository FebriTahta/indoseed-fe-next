import type { RincianHasil } from '@/app/types/qc';

/** Pilihan hari pengamatan (hitungan akhir) uji daya berkecambah. */
export const HARI_PENGAMATAN_OPTIONS = [7, 8, 9, 10];

export type RincianField = keyof RincianHasil;

/** Isian rincian di form (string agar input bisa dikosongkan). */
export type RincianDraft = Record<RincianField, string>;

export const RINCIAN_FIELDS: RincianField[] = [
  'jumlahBenih',
  'hariPengamatan',
  'benihNormal',
  'benihAbnormal',
  'benihMati',
  'benihKeras',
];

/** Kategori kecambah yang jumlahnya harus sama dengan jumlah benih diuji. */
export const KATEGORI_BENIH: { field: RincianField; label: string }[] = [
  { field: 'benihNormal', label: 'Benih Normal' },
  { field: 'benihAbnormal', label: 'Benih Abnormal' },
  { field: 'benihMati', label: 'Benih Mati' },
  { field: 'benihKeras', label: 'Benih Keras' },
];

export const toRincianDraft = (r?: RincianHasil | null): RincianDraft =>
  Object.fromEntries(RINCIAN_FIELDS.map((f) => [f, r?.[f] == null ? '' : String(r[f])])) as RincianDraft;

const toInt = (v: string): number | null => {
  if (v.trim() === '') return null;
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
};

/** Draft → payload; null bila seluruh isian kosong. */
export const toRincianPayload = (d?: RincianDraft): RincianHasil | null => {
  if (!d) return null;
  const r = Object.fromEntries(RINCIAN_FIELDS.map((f) => [f, toInt(d[f] ?? '')] as const)) as unknown as RincianHasil;
  return RINCIAN_FIELDS.some((f) => r[f] != null) ? r : null;
};

/** Daya berkecambah (%) = benih normal ÷ jumlah benih diuji × 100 (sama dengan perhitungan backend). */
export const hitungDayaBerkecambah = (r: RincianHasil | null) =>
  r?.jumlahBenih && r.benihNormal != null ? Math.round((r.benihNormal / r.jumlahBenih) * 10000) / 100 : null;

/** Total benih normal + abnormal + mati + keras yang sudah diisi. */
export const totalBenih = (r: RincianHasil | null) =>
  KATEGORI_BENIH.reduce((a, { field }) => a + (r?.[field] ?? 0), 0);

/** Parameter termasuk uji perkecambahan bila namanya memuat salah satu nama di master lookup. */
export const isParameterPerkecambahan = (nama: string, names: string[]) => {
  const n = nama.trim().toLowerCase();
  return names.some((x) => n.includes(x));
};
