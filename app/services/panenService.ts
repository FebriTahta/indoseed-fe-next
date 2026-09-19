import api from '@/app/lib/axios';
import {
  PanenItem,
  PanenStats,
  RingkasanKomoditasItem,
  ChartPanenData,
  ReferensiJadwalTanamPanen,
  CreatePanenPayload,
} from '../types/panen';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export type {
  PanenItem,
  PanenStats,
  RingkasanKomoditasItem,
  ChartPanenData,
  ReferensiJadwalTanamPanen,
  CreatePanenPayload,
};

export interface GetPanenParams {
  page?: number;
  limit?: number;
  search?: string;
  komoditas?: string;
  varietas?: string;
  status?: string;
  jenisHasil?: string;
  petani?: string;
  startDate?: string;
  endDate?: string;
}

export interface PanenListResponse {
  status: string;
  data: PanenItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats: PanenStats;
}

export const panenService = {
  getPanenList: async (params?: GetPanenParams): Promise<PanenListResponse> => {
    const response = await api.get(`${baseUrl}/produksi/panen`, { params });
    return response.data;
  },

  getPanenById: async (id: string): Promise<{ status: string; data: PanenItem }> => {
    const response = await api.get(`${baseUrl}/produksi/panen/${id}`);
    return response.data;
  },

  getStats: async (): Promise<{ status: string; data: PanenStats }> => {
    const response = await api.get(`${baseUrl}/produksi/panen/stats`);
    return response.data;
  },

  getRingkasanKomoditas: async (): Promise<{ status: string; data: RingkasanKomoditasItem[] }> => {
    const response = await api.get(`${baseUrl}/produksi/panen/ringkasan-komoditas`);
    return response.data;
  },

  getChartData: async (period = '7_hari'): Promise<{ status: string; data: ChartPanenData }> => {
    const response = await api.get(`${baseUrl}/produksi/panen/chart-data`, { params: { period } });
    return response.data;
  },

  getReferensiJadwalTanam: async (): Promise<{ status: string; data: ReferensiJadwalTanamPanen[]; total: number }> => {
    const response = await api.get(`${baseUrl}/produksi/panen/referensi-jadwal-tanam`);
    return response.data;
  },

  getNextKode: async (): Promise<{ status: string; kodePanen: string }> => {
    const response = await api.get(`${baseUrl}/produksi/panen/next-code`);
    return response.data;
  },

  createPanen: async (data: Partial<CreatePanenPayload | PanenItem>) => {
    const response = await api.post(`${baseUrl}/produksi/panen`, data);
    return response.data;
  },

  updatePanen: async (id: string, data: Partial<PanenItem>) => {
    const response = await api.put(`${baseUrl}/produksi/panen/${id}`, data);
    return response.data;
  },

  deletePanen: async (id: string) => {
    const response = await api.delete(`${baseUrl}/produksi/panen/${id}`);
    return response.data;
  },
};
