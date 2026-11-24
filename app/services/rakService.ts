import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { RakData } from '@/app/types/rak';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const rakService = {
  getRakList: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    kategori?: string;
    status?: string;
    kodeGudang?: string;
  }) => {
    const response = await api.get<ApiResponse<RakData[]>>(`${baseUrl}/master/rak/list`, { params });
    return response.data;
  },

  getRaks: async () => {
    const response = await api.get<ApiResponse<RakData[]>>(`${baseUrl}/master/rak`);
    return response.data;
  },

  getRakById: async (id: string) => {
    const response = await api.get<ApiResponse<RakData>>(`${baseUrl}/master/rak/${id}`);
    return response.data;
  },

  getRakStats: async () => {
    const response = await api.get<ApiResponse<any>>(`${baseUrl}/master/rak/stats`);
    return response.data;
  },

  createRak: async (data: FormData | any) => {
    const response = await api.post<ApiResponse<RakData>>(`${baseUrl}/master/rak`, data);
    return response.data;
  },

  updateRak: async (id: string, data: FormData | any) => {
    const response = await api.put<ApiResponse<RakData>>(`${baseUrl}/master/rak/${id}`, data);
    return response.data;
  },

  deleteRak: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`${baseUrl}/master/rak/${id}`);
    return response.data;
  },
};

export default rakService;
