export type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

/**
 * Nomor halaman ringkas dengan elipsis, mis. halaman 1 dari 1.246 → [1, 2, 3, 4, 5, …, 1246].
 * Selalu menampilkan halaman pertama, terakhir, dan `siblings` halaman di sekitar halaman aktif.
 */
export const getPageItems = (current: number, total: number, siblings = 1): PageItem[] => {
  const windowSize = siblings * 2 + 5; // first + last + current + 2 elipsis + siblings
  if (total <= windowSize) return Array.from({ length: total }, (_, i) => i + 1);

  const start = Math.max(current - siblings, 2);
  const end = Math.min(current + siblings, total - 1);
  const showStartEllipsis = start > 3;
  const showEndEllipsis = end < total - 2;

  if (!showStartEllipsis) {
    const head = Array.from({ length: windowSize - 2 }, (_, i) => i + 1);
    return [...head, 'ellipsis-end', total];
  }
  if (!showEndEllipsis) {
    const tail = Array.from({ length: windowSize - 2 }, (_, i) => total - (windowSize - 3) + i);
    return [1, 'ellipsis-start', ...tail];
  }
  return [1, 'ellipsis-start', ...Array.from({ length: end - start + 1 }, (_, i) => start + i), 'ellipsis-end', total];
};
