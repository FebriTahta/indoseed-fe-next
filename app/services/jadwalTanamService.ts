import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { JadwalTanam } from '@/app/types/jadwalTanam';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const jadwalTanamService = {
  getJadwalTanamList: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    statusJadwal?: string;
    commodityId?: string;
    varietyId?: string;
    greenhouseId?: string;
  }) => {
    const response = await api.get<ApiResponse<JadwalTanam[]>>(`${baseUrl}/produksi/jadwal-tanam`, { params });
    return response.data;
  },
  getJadwalTanams: async () => {
    const response = await api.get<ApiResponse<JadwalTanam[]>>(`${baseUrl}/produksi/jadwal-tanam`);
    return response.data;
  },
  getJadwalTanamById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`${baseUrl}/produksi/jadwal-tanam/${id}`);
    return response.data;
  },
  createJadwalTanams: async (data: any) => {
    const response = await api.post<ApiResponse<JadwalTanam>>(`${baseUrl}/produksi/jadwal-tanam`, data);
    return response.data;
  },
  updateJadwalTanams: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<JadwalTanam>>(`${baseUrl}/produksi/jadwal-tanam/${id}`, data);
    return response.data;
  },
  deleteJadwalTanam: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`${baseUrl}/produksi/jadwal-tanam/${id}`);
    return response.data;
  },
};

export default jadwalTanamService;
