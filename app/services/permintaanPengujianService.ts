import axiosInstance from '@/app/lib/axios';
import {
  BatchOption,
  PaginatedResponse,
  PermintaanPengujian,
  PermintaanSummary,
  QcListParams,
} from '@/app/types/qc';

const API_URL = '/qc/permintaan';

type ApiData<T> = { success: boolean; data: T; message?: string };

/** Hapus parameter kosong agar tidak terkirim sebagai `?status=`. */
export const cleanParams = <T extends object>(params?: T) =>
  Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ) as Partial<T>;

export interface PermintaanPayload {
  tanggal: string;
  batchProduksiId: string;
  jumlahSampel: number;
  satuanSampel: string;
  metodeSampling: string;
  pengambilSampelId: string;
  pemohon: string;
  prioritas: string;
  catatan?: string | null;
  parameters: { parameterId: string; checked: boolean }[];
}

/** Kirim sebagai multipart bila ada lampiran, selain itu JSON biasa. */
const toRequestBody = (payload: PermintaanPayload, file?: File | null) => {
  if (!file) return payload;
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
  });
  form.append('file', file);
  return form;
};

export const permintaanPengujianService = {
  getPermintaanList: async (params?: QcListParams) =>
    (await axiosInstance.get<PaginatedResponse<PermintaanPengujian>>(API_URL, { params: cleanParams(params) })).data,

  getPermintaanSummary: async (params?: { startDate?: string; endDate?: string }) =>
    (await axiosInstance.get<ApiData<PermintaanSummary>>(`${API_URL}/summary`, { params: cleanParams(params) })).data,

  getNextNumber: async () =>
    (await axiosInstance.get<ApiData<{ noPermintaan: string }>>(`${API_URL}/generate-number`)).data,

  getBatchOptions: async (excludePermintaanId?: string) =>
    (
      await axiosInstance.get<ApiData<BatchOption[]>>(`${API_URL}/batch-options`, {
        params: cleanParams({ excludePermintaanId }),
      })
    ).data,

  getPermintaanById: async (id: string) =>
    (await axiosInstance.get<ApiData<PermintaanPengujian>>(`${API_URL}/${id}`)).data,

  createPermintaan: async (payload: PermintaanPayload, file?: File | null) =>
    (await axiosInstance.post<ApiData<PermintaanPengujian>>(API_URL, toRequestBody(payload, file))).data,

  updatePermintaan: async (id: string, payload: PermintaanPayload, file?: File | null) =>
    (await axiosInstance.put<ApiData<PermintaanPengujian>>(`${API_URL}/${id}`, toRequestBody(payload, file))).data,

  approvePermintaan: async (id: string, catatan?: string) =>
    (await axiosInstance.post<ApiData<PermintaanPengujian>>(`${API_URL}/${id}/approve`, { catatan })).data,

  rejectPermintaan: async (id: string, alasan: string) =>
    (await axiosInstance.post<ApiData<PermintaanPengujian>>(`${API_URL}/${id}/reject`, { alasan })).data,

  deletePermintaan: async (id: string) =>
    (await axiosInstance.delete<ApiData<null>>(`${API_URL}/${id}`)).data,
};
