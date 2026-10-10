import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { fileService } from '@/app/services/fileService';

/** Unduh / buka file dengan status loading per file dan pesan error yang jelas. */
export function useFileDownload() {
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  const run = useCallback(async (action: () => Promise<void>, fileUrl: string) => {
    setPendingUrl(fileUrl);
    try {
      await action();
    } catch (err) {
      toast.error((err as Error).message, { autoClose: 6000 });
    } finally {
      setPendingUrl(null);
    }
  }, []);

  const download = useCallback((fileUrl: string, name?: string) => run(() => fileService.download(fileUrl, name), fileUrl), [run]);
  const open = useCallback((fileUrl: string, name?: string) => run(() => fileService.open(fileUrl, name), fileUrl), [run]);

  return { download, open, pendingUrl };
}
