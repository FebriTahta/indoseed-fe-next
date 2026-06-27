import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { Variety } from '@/app/types/variety';

export const varietyService = {
  getVarieties: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    commodityId?: string;
    status?: string;
  }) => {
    const response = await api.get<ApiResponse<Variety[]>>('/master/variety', { params });
    return response.data;
  },

  getVarietyDetail: async (id: string) => {
    const response = await api.get<ApiResponse<Variety>>(`/master/variety/${id}`);
    return response.data;
  },

  createVariety: async (data: FormData) => {
    const response = await api.post<ApiResponse<Variety>>('/master/variety', data);
    return response.data;
  },

  updateVariety: async (id: string, data: FormData) => {
    const response = await api.put<ApiResponse<Variety>>(`/master/variety/${id}`, data);
    return response.data;
  },

  deleteVariety: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/master/variety/${id}`);
    return response.data;
  },
};
export default varietyService;
