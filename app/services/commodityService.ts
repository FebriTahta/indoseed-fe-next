import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { Commodity } from '@/app/types/commodity';

export const commodityService = {
  getCommodities: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    kategori?: string;
    status?: string;
  }) => {
    const response = await api.get<ApiResponse<Commodity[]>>('/master/commodity', { params });
    return response.data;
  },

  getCommodityDetail: async (id: string) => {
    const response = await api.get<ApiResponse<Commodity>>(`/master/commodity/${id}`);
    return response.data;
  },

  createCommodity: async (data: FormData) => {
    const response = await api.post<ApiResponse<Commodity>>('/master/commodity', data);
    return response.data;
  },

  updateCommodity: async (id: string, data: FormData) => {
    const response = await api.put<ApiResponse<Commodity>>(`/master/commodity/${id}`, data);
    return response.data;
  },

  deleteCommodity: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/master/commodity/${id}`);
    return response.data;
  },
};
export default commodityService;
