import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { GudData } from '@/app/types/gudang';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const gudangService = {
  getGudangList: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    kategori?: string;
    status?: string;
  }) => {
    const response = await api.get<ApiResponse<GudData[]>>(`${baseUrl}/master/gudang/list`, { params });
    return response.data;
  },
  getGudangs: async () => {
    const response = await api.get<ApiResponse<GudData[]>>(`${baseUrl}/master/gudang`);
    return response.data;
  },
  createGudang: async (data: FormData) => {
    const response = await api.post<ApiResponse<GudData>>(`${baseUrl}/master/gudang`, data);
    return response.data;
  },

  updateGudang: async (id: string, data: FormData) => {
    console.log("==> Updating gudang with ID:", id, "and data:", data);
    const response = await api.put<ApiResponse<GudData>>(`${baseUrl}/master/gudang/${id}`, data);
    return response.data;
  },
};


export default gudangService;
