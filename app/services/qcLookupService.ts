import axiosInstance from '@/app/lib/axios';
import { QcLookup, QcLookupKategori, QcMeta } from '@/app/types/qc';

type ApiData<T> = { success: boolean; data: T };

export const qcLookupService = {
  /** Data master pilihan, dikelompokkan per kategori. */
  getLookups: async (kategori: QcLookupKategori[]) =>
    (
      await axiosInstance.get<ApiData<Partial<Record<QcLookupKategori, QcLookup[]>>>>('/qc/lookups', {
        params: { kategori: kategori.join(',') },
      })
    ).data,

  getMeta: async () => (await axiosInstance.get<ApiData<QcMeta>>('/qc/meta')).data,
};
