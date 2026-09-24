import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import {
  PenanggungJawab,
  CreatePenanggungJawabPayload,
  UpdatePenanggungJawabPayload,
} from '@/app/types/penanggungJawab';

export const penanggungJawabService = {
  getPenanggungJawab: async (params?: {
    search?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const response = await api.get<ApiResponse<PenanggungJawab[]>>('/master/penanggung-jawab', { params });
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
