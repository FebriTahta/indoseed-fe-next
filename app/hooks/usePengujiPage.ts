import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { usePaginatedList } from '@/app/hooks/usePaginatedList';
import { invalidateQcReference } from '@/app/hooks/useQcReference';
import { pengujiService } from '@/app/services/pengujiService';
import { authService } from '@/app/services/authService';
import { startImpersonation } from '@/app/lib/auth';
import { getHomePath } from '@/shared/layouts-components/sidebar/nav';
import { getErrorMessage } from '@/app/lib/format';
import { AkunPenguji, Penguji, PengujiFilters, PengujiStats } from '@/app/types/penguji';

export const EMPTY_PENGUJI_FILTERS: PengujiFilters = { search: '', status: '', laboratoriumId: '', testMethodId: '' };

/** State & aksi halaman master Penguji. */
export function usePengujiPage() {
  const [stats, setStats] = useState<PengujiStats | null>(null);
  const list = usePaginatedList<Penguji, PengujiFilters>((params) => pengujiService.getPengujis(params), EMPTY_PENGUJI_FILTERS);

  const loadStats = useCallback(() => {
    pengujiService
      .getStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Gagal memuat statistik penguji:', err));
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  /** Muat ulang daftar, statistik, dan cache opsi penguji yang dipakai halaman lain. */
  const { reload } = list;
  const refresh = useCallback(() => {
    reload();
    loadStats();
    invalidateQcReference('penguji');
  }, [reload, loadStats]);

  const remove = useCallback(
    async (penguji: Penguji) => {
      try {
        await pengujiService.remove(penguji.id);
        toast.success(`Penguji ${penguji.nama} berhasil dihapus`);
        refresh();
        return true;
      } catch (err) {
        toast.error(getErrorMessage(err, 'Gagal menghapus penguji'));
        return false;
      }
    },
    [refresh]
  );

  const resetPassword = useCallback(async (penguji: Penguji): Promise<AkunPenguji | null> => {
    try {
      return (await pengujiService.resetPassword(penguji.id)).data;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Gagal mereset password'));
      return null;
    }
  }, []);

  /** Superadmin masuk sebagai akun penguji, lalu dimuat ulang penuh ke halaman awal penguji. */
  const loginAs = useCallback(async (penguji: Penguji) => {
    if (!penguji.userId) return;
    try {
      const { token, user } = (await authService.impersonate(penguji.userId)).data;
      startImpersonation(token);
      window.location.href = getHomePath(user.roles);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Gagal login sebagai penguji'));
    }
  }, []);

  return { list, stats, refresh, remove, resetPassword, loginAs };
}
