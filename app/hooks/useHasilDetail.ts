import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { pemeriksaanPengujianService } from '@/app/services/pemeriksaanPengujianService';
import { PermintaanPengujian } from '@/app/types/qc';
import { getErrorMessage } from '@/app/lib/format';

/** Detail satu hasil pengujian (panel samping halaman Hasil Pengujian) beserta aksi review. */
export function useHasilDetail(id: string | null, onChanged?: () => void) {
  const [data, setData] = useState<PermintaanPengujian | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const requestId = useRef(0);

  /** `silent` = muat ulang tanpa mengosongkan panel (dipakai setelah aksi). */
  const load = useCallback(
    async (silent = false) => {
      const current = ++requestId.current;
      setError('');
      if (!silent) setData(null);
      if (!id) return;
      if (!silent) setLoading(true);
      try {
        const res = await pemeriksaanPengujianService.getById(id);
        if (current === requestId.current) setData(res.data);
      } catch (err) {
        if (current === requestId.current) setError(getErrorMessage(err, 'Gagal memuat detail'));
      } finally {
        if (current === requestId.current) setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    load();
  }, [load]);

  /** Jalankan aksi, lalu segarkan daftar (via `onChanged`) & detail. */
  const run = async (action: (id: string) => Promise<unknown>, success: string, failure: string) => {
    if (!data) return false;
    setBusy(true);
    try {
      await action(data.id);
      toast.success(success);
      onChanged?.();
      // Response aksi tidak memuat relasi lengkap; muat ulang agar riwayat terbaru tampil.
      await load(true);
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, failure));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const review = (keputusan: 'setujui' | 'revisi', catatan?: string) =>
    run(
      (id) => pemeriksaanPengujianService.review(id, keputusan, catatan),
      keputusan === 'setujui' ? 'Hasil pengujian disetujui' : 'Hasil dikembalikan untuk revisi',
      'Gagal memproses review'
    );

  const ujiUlang = (alasan: string) =>
    run(
      (id) => pemeriksaanPengujianService.ujiUlang(id, alasan),
      'Pengujian dikembalikan untuk diuji ulang',
      'Gagal memproses pengujian ulang'
    );

  return { data, loading, error, busy, reload: () => load(true), review, ujiUlang };
}

export type HasilDetailState = ReturnType<typeof useHasilDetail>;
