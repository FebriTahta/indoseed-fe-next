import axiosInstance from '@/app/lib/axios';

/** Error unduhan berisi pesan yang siap ditampilkan ke pengguna. */
export class FileDownloadError extends Error {}

const DOWNLOAD_URL = '/files/download';

/** Respons error dengan responseType "blob" perlu dibaca ulang sebagai JSON untuk mengambil pesannya. */
const toDownloadError = async (err: any) => {
  const data = err?.response?.data;
  let message = '';
  if (data instanceof Blob) {
    try {
      message = JSON.parse(await data.text())?.message || '';
    } catch {
      /* bukan JSON */
    }
  }
  if (!message && !err?.response) message = 'Tidak dapat terhubung ke server. Periksa koneksi Anda lalu coba lagi.';
  return new FileDownloadError(message || 'File gagal diunduh. Silakan coba lagi.');
};

const fetchBlob = async (fileUrl: string, name?: string, inline = false) => {
  try {
    const res = await axiosInstance.get<Blob>(DOWNLOAD_URL, {
      params: { url: fileUrl, name, ...(inline ? { inline: 1 } : {}) },
      responseType: 'blob',
    });
    return res.data;
  } catch (err) {
    throw await toDownloadError(err);
  }
};

export const fileService = {
  /** Unduh file dari penyimpanan; melempar FileDownloadError dengan pesan jelas bila gagal. */
  download: async (fileUrl: string, name?: string) => {
    const blob = await fetchBlob(fileUrl, name);
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = name || fileUrl.split('/').pop() || 'dokumen';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  },

  /**
   * Buka file di tab baru (mis. PDF). Tab dibuka lebih dulu secara sinkron agar tidak diblokir
   * popup blocker, lalu diisi setelah file berhasil diambil — atau ditutup bila gagal.
   */
  open: async (fileUrl: string, name?: string) => {
    const tab = window.open('', '_blank');
    try {
      const blob = await fetchBlob(fileUrl, name, true);
      const objectUrl = URL.createObjectURL(blob);
      if (tab) tab.location.href = objectUrl;
      else window.location.href = objectUrl;
    } catch (err) {
      tab?.close();
      throw err;
    }
  },
};
