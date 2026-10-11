import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import {
  PenanggungJawab,
  CreatePenanggungJawabPayload,
  UpdatePenanggungJawabPayload,
  PenanggungJawabStats,
} from '@/app/types/penanggungJawab';

export const penanggungJawabService = {
  getPenanggungJawab: async (params?: {
    search?: string;
    status?: string;
    peran?: string;
    areaModul?: string;
    lokasi?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const response = await api.get<ApiResponse<PenanggungJawab[]> & { stats?: PenanggungJawabStats }>(
      '/master/penanggung-jawab',
      { params }
    );
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<ApiResponse<PenanggungJawabStats>>('/master/penanggung-jawab/stats');
    return response.data;
  },

  getNextKode: async () => {
    const response = await api.get<ApiResponse<{ kodePersonel: string }>>('/master/penanggung-jawab/next-kode');
    return response.data;
  },

  getPenanggungJawabById: async (id: string) => {
    const response = await api.get<ApiResponse<PenanggungJawab>>(`/master/penanggung-jawab/${id}`);
    return response.data;
  },

  createPenanggungJawab: async (data: CreatePenanggungJawabPayload) => {
    const response = await api.post<ApiResponse<PenanggungJawab>>('/master/penanggung-jawab', data);
    return response.data;
  },

  updatePenanggungJawab: async (id: string, data: UpdatePenanggungJawabPayload) => {
    const response = await api.put<ApiResponse<PenanggungJawab>>(`/master/penanggung-jawab/${id}`, data);
    return response.data;
  },

  deletePenanggungJawab: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/master/penanggung-jawab/${id}`);
    return response.data;
  },
};

export default penanggungJawabService;
