import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';

const API_URL = '/qc/daya-tumbuh';

export const qcDayaTumbuhService = {
  getDayaTumbuh: async (params?: any) => {
    const response = await api.get<ApiResponse<any[]>>(API_URL, { params });
    return response.data;
  },
  getDayaTumbuhById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`${API_URL}/${id}`);
    return response.data;
  },
  createDayaTumbuh: async (data: any) => {
    const response = await api.post<ApiResponse<any>>(API_URL, data);
    return response.data;
  },
  updateDayaTumbuh: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`${API_URL}/${id}`, data);
    return response.data;
  },
  deleteDayaTumbuh: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`${API_URL}/${id}`);
    return response.data;
  }
};
