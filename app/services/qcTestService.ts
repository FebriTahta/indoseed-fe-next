import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';

const API_URL = '/qc/tests';

export const qcTestService = {
  getQcTests: async (params?: any) => {
    const response = await api.get<ApiResponse<any[]>>(API_URL, { params });
    return response.data;
  },
  getQcTestSummary: async (params?: any) => {
    const response = await api.get<ApiResponse<any>>(`${API_URL}/summary`, { params });
    return response.data;
  },
  getQcTestById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`${API_URL}/${id}`);
    return response.data;
  },
  createQcTest: async (data: any) => {
    const response = await api.post<ApiResponse<any>>(API_URL, data);
    return response.data;
  },
  updateQcTest: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`${API_URL}/${id}`, data);
    return response.data;
  },
  deleteQcTest: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`${API_URL}/${id}`);
    return response.data;
  }
};
