import api from '@/app/lib/axios';
import { cleanParams } from '@/app/services/permintaanPengujianService';
import { PaginatedResponse } from '@/app/types/qc';
import { AkunPenguji, Penguji, PengujiFilters, PengujiPayload, PengujiStats } from '@/app/types/penguji';

type ApiData<T> = { success: boolean; data: T; message?: string };
type ListParams = Partial<PengujiFilters> & { page?: number; pageSize?: number; limit?: number };

const BASE_URL = '/qc/penguji';

export const pengujiService = {
  getPengujis: async (params?: ListParams) =>
    (await api.get<PaginatedResponse<Penguji>>(BASE_URL, { params: cleanParams(params) })).data,

  getStats: async () => (await api.get<ApiData<PengujiStats>>(`${BASE_URL}/stats`)).data,

  getPengujiById: async (id: string) => (await api.get<ApiData<Penguji>>(`${BASE_URL}/${id}`)).data,

  create: async (payload: PengujiPayload) =>
    (await api.post<ApiData<{ penguji: Penguji; akun: AkunPenguji }>>(BASE_URL, payload)).data,

  update: async (id: string, payload: PengujiPayload) =>
    (await api.put<ApiData<{ penguji: Penguji; akun: AkunPenguji | null }>>(`${BASE_URL}/${id}`, payload)).data,

  remove: async (id: string) => (await api.delete<ApiData<null>>(`${BASE_URL}/${id}`)).data,

  resetPassword: async (id: string) => (await api.post<ApiData<AkunPenguji>>(`${BASE_URL}/${id}/reset-password`)).data,
};
