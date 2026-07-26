import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { JadwalTanam } from '@/app/types/jadwalTanam';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const jadwalTanamService = {
  getJadwalTanamList: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    periode?: string;
    jenisLahan?: string;
    komoditas?: string;
    varietas?: string;
    status?: string;
    commodityId?: string;
    lokasi?: string;
  }) => {
    const response = await api.get<ApiResponse<JadwalTanam[]>>(`${baseUrl}/master/customer/list`, { params });
    return response.data;
  },
  getJadwalTanams: async () => {
    const response = await api.get<ApiResponse<JadwalTanam[]>>(`${baseUrl}/master/customer`);
    return response.data;
  },
  createJadwalTanams: async (data: FormData) => {
    const response = await api.post<ApiResponse<JadwalTanam>>(`${baseUrl}/master/customer`, data);
    return response.data;
  },

  updateJadwalTanams: async (id: string, data: FormData) => {
    console.log("==> Updating customer with ID:", id, "and data:", data);
    const response = await api.put<ApiResponse<JadwalTanam>>(`${baseUrl}/master/customer/${id}`, data);
    return response.data;
  },
};


export default jadwalTanamService;
