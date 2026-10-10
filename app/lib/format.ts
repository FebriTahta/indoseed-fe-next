const toDate = (value?: string | Date | null) => {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

/** 16 Jun 2026 */
export const formatDate = (value?: string | Date | null, fallback = '-') => {
  const d = toDate(value);
  return d ? d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : fallback;
};

/** 16 Jun 2026 08:15 */
export const formatDateTime = (value?: string | Date | null, fallback = '-') => {
  const d = toDate(value);
  if (!d) return fallback;
  const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':');
  return `${formatDate(d)} ${time}`;
};

/** Nilai untuk <input type="date"> (YYYY-MM-DD, zona waktu lokal). */
export const toDateInputValue = (value?: string | Date | null) => {
  const d = toDate(value) || new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const formatNumber = (value?: number | null, fallback = '-') =>
  value === null || value === undefined || Number.isNaN(value) ? fallback : value.toLocaleString('id-ID');

/** Pesan error yang ramah dari response axios. */
export const getErrorMessage = (err: any, fallback = 'Terjadi kesalahan') =>
  err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
