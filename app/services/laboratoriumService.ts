import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { LaboratoriumData } from '@/app/types/laboratorium';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const laboratoriumService = {
  getLaboratoriumList: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
  }) => {
    const response = await api.get<ApiResponse<LaboratoriumData[]>>(`${baseUrl}/master/laboratorium/list`, { params });
    return response.data;
  },
  
  getLaboratoriums: async () => {
    const response = await api.get<ApiResponse<LaboratoriumData[]>>(`${baseUrl}/master/laboratorium`);
    return response.data;
  },
  
  createLaboratorium: async (data: FormData) => {
    const response = await api.post<ApiResponse<LaboratoriumData>>(`${baseUrl}/master/laboratorium`, data);
    return response.data;
  },

  updateLaboratorium: async (id: string, data: FormData) => {
    const response = await api.put<ApiResponse<LaboratoriumData>>(`${baseUrl}/master/laboratorium/${id}`, data);
    return response.data;
  },
};

export default laboratoriumService;
