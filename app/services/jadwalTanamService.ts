import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { JadwalTanam, JadwalTanamStats, CreateJadwalTanamPayload } from '@/app/types/jadwalTanam';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const jadwalTanamService = {
  getJadwalTanamList: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    statusJadwal?: string;
    commodityId?: string;
    varietyId?: string;
    partnerId?: string;
    namaPetani?: string;
    greenhouseId?: string;
    periodeTanam?: string;
  }) => {
    const response = await api.get<ApiResponse<JadwalTanam[]>>(`${baseUrl}/produksi/jadwal-tanam`, { params });
    return response.data;
  },

  getJadwalTanamStats: async () => {
    const response = await api.get<{ status: string; data: JadwalTanamStats }>(`${baseUrl}/produksi/jadwal-tanam/stats`);
    return response.data;
  },

  getNextKodeJadwalTanam: async () => {
    const response = await api.get<{ status: string; data: { nextKodeJadwalTanam: string } }>(
      `${baseUrl}/produksi/jadwal-tanam/next-code`
    );
    return response.data;
  },

  getJadwalTanamById: async (id: string) => {
    const response = await api.get<ApiResponse<JadwalTanam>>(`${baseUrl}/produksi/jadwal-tanam/${id}`);
    return response.data;
  },

  createJadwalTanams: async (data: CreateJadwalTanamPayload) => {
    const response = await api.post<ApiResponse<JadwalTanam>>(`${baseUrl}/produksi/jadwal-tanam`, data);
    return response.data;
  },

  updateJadwalTanams: async (id: string, data: Partial<CreateJadwalTanamPayload>) => {
    const response = await api.put<ApiResponse<JadwalTanam>>(`${baseUrl}/produksi/jadwal-tanam/${id}`, data);
    return response.data;
  },

  updateStatusJadwalTanam: async (id: string, statusJadwal: string, keterangan?: string) => {
    const response = await api.patch<ApiResponse<JadwalTanam>>(`${baseUrl}/produksi/jadwal-tanam/${id}/status`, {
      statusJadwal,
      keterangan,
    });
    return response.data;
  },

  deleteJadwalTanam: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`${baseUrl}/produksi/jadwal-tanam/${id}`);
    return response.data;
  },
};

export default jadwalTanamService;
