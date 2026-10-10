/**
 * Warna grafik Dashboard QC. Palet status sudah divalidasi (lightness, chroma, pemisahan CVD
 * antar-irisan bersebelahan) dengan validator dataviz; urutan mengikuti alur status.
 * "Menunggu Persetujuan" sengaja abu-abu netral karena belum masuk proses.
 * Kontras < 3:1 pada beberapa warna diimbangi legenda berlabel + angka di setiap item.
 */
export const STATUS_COLOR: Record<string, string> = {
  'Menunggu Persetujuan': '#94a3b8',
  Sampling: '#8b5cf6',
  'Dalam Pengujian': '#0ea5e9',
  'Menunggu Review': '#f59e0b',
  Selesai: '#10b981',
  Ditolak: '#e11d48',
};

/** Warna status hasil (dipakai bersama ikon + label, tidak pernah warna saja). */
export const HASIL_COLOR = { lulus: '#10b981', tidakLulus: '#e11d48' };

/** Satu seri magnitudo → satu hue. */
export const MAGNITUDE_COLOR = '#10b981';

export const formatPersen = (part: number, total: number) =>
  total ? `${(Math.round((part / total) * 1000) / 10).toLocaleString('id-ID')}%` : '0%';
