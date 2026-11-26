import api from '@/app/lib/axios';
import {
  PemeriksaanLahanItem,
  PemeriksaanStats,
  ReferensiJadwalTanamItem,
} from '../types/pemeriksaanLahan';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export interface GetPemeriksaanLahanParams {
  search?: string;
  komoditas?: string;
  status?: string;
  tab?: string;
  fase?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface PemeriksaanLahanResponse {
  status: string;
  data: PemeriksaanLahanItem[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  stats: PemeriksaanStats;
}

export const pemeriksaanLahanService = {
  getList: async (params?: GetPemeriksaanLahanParams): Promise<PemeriksaanLahanResponse> => {
    const response = await api.get(`${baseUrl}/produksi/pemeriksaan-lahan`, { params });
    return response.data;
  },

  getStats: async (): Promise<{ status: string; data: PemeriksaanStats }> => {
    const response = await api.get(`${baseUrl}/produksi/pemeriksaan-lahan/stats`);
    return response.data;
  },

  getById: async (id: string): Promise<{ status: string; data: PemeriksaanLahanItem }> => {
    const response = await api.get(`${baseUrl}/produksi/pemeriksaan-lahan/${id}`);
    return response.data;
  },

  getReferensiJadwalTanam: async (): Promise<{ status: string; data: ReferensiJadwalTanamItem[]; total: number }> => {
    const response = await api.get(`${baseUrl}/produksi/pemeriksaan-lahan/referensi-jadwal-tanam`);
    return response.data;
  },

  create: async (data: Partial<PemeriksaanLahanItem>) => {
    const response = await api.post(`${baseUrl}/produksi/pemeriksaan-lahan`, data);
    return response.data;
  },

  update: async (id: string, data: Partial<PemeriksaanLahanItem>) => {
    const response = await api.put(`${baseUrl}/produksi/pemeriksaan-lahan/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`${baseUrl}/produksi/pemeriksaan-lahan/${id}`);
    return response.data;
  },
};
