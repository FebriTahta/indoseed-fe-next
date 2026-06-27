import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { Land } from '@/app/types/greenhouse';

export const greenhouseService = {
  getLands: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    jenisLahan?: string;
    status?: string;
    commodityId?: string;
    lokasi?: string;
  }) => {
    const response = await api.get<ApiResponse<Land[]>>('/master/greenhouse', { params });
    return response.data;
  },

  getLandDetail: async (id: string) => {
    const response = await api.get<ApiResponse<Land>>(`/master/greenhouse/${id}`);
    return response.data;
  },

  createLand: async (data: FormData) => {
    const response = await api.post<ApiResponse<Land>>('/master/greenhouse', data);
    return response.data;
  },

  updateLand: async (id: string, data: FormData) => {
    const response = await api.put<ApiResponse<Land>>(`/master/greenhouse/${id}`, data);
    return response.data;
  },

  deleteLand: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/master/greenhouse/${id}`);
    return response.data;
  },
};
export default greenhouseService;
