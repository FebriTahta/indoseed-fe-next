/** Helper tipe berkas yang dipakai bersama oleh daftar dokumen, pratinjau, dan unggah QC. */

const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
/** Berkas yang bisa ditampilkan langsung oleh browser di dalam iframe. */
const INLINE_EXT = ['pdf', 'txt', 'csv'];

interface FileLike {
  namaFile: string;
  tipeFile?: string | null;
}

/** Ekstensi berkas (huruf kecil) dari nama file, atau dari `tipeFile` (ekstensi / MIME). */
export const fileExt = ({ namaFile, tipeFile }: FileLike) =>
  (namaFile.includes('.') ? namaFile.split('.').pop() : tipeFile?.split('/').pop())?.toLowerCase() || '';

export const isImageFile = (file: FileLike) =>
  IMAGE_EXT.includes(fileExt(file)) || Boolean(file.tipeFile?.startsWith('image/'));

export const isInlinePreviewable = (file: FileLike) => isImageFile(file) || INLINE_EXT.includes(fileExt(file));

export const fileIconClass = (file: FileLike) => {
  const ext = fileExt(file);
  if (isImageFile(file)) return 'ri-image-line text-sky-500';
  if (ext === 'pdf') return 'ri-file-pdf-2-line text-rose-500';
  if (['doc', 'docx'].includes(ext)) return 'ri-file-word-line text-blue-500';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'ri-file-excel-line text-emerald-600';
  if (['ppt', 'pptx'].includes(ext)) return 'ri-file-ppt-line text-amber-500';
  return 'ri-file-text-line text-gray-400';
};

export const formatFileSize = (bytes: number) =>
  bytes > 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`;

/** Pisahkan nama dasar & ekstensi, mis. "laporan.final.pdf" → ["laporan.final", "pdf"]. */
export const splitFileName = (namaFile: string): [string, string] => {
  const dot = namaFile.lastIndexOf('.');
  return dot > 0 ? [namaFile.slice(0, dot), namaFile.slice(dot + 1)] : [namaFile, ''];
};
