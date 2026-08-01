import api from '@/app/lib/axios';
import { KesiapanPanenItem } from '../types/kesiapanPanen';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const kesiapanPanenService = {
  getKesiapanPanenList: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    komoditas?: string;
    varietas?: string;
    lokasi?: string;
    status?: string;
  }) => {
    const response = await api.get(`${baseUrl}/produksi/kesiapan-panen`, { params });
    return response.data;
  },

  getKesiapanPanenById: async (id: string) => {
    const response = await api.get(`${baseUrl}/produksi/kesiapan-panen/${id}`);
    return response.data;
  },

  createKesiapanPanen: async (data: Partial<KesiapanPanenItem>) => {
    const response = await api.post(`${baseUrl}/produksi/kesiapan-panen`, data);
    return response.data;
  },

  updateKesiapanPanen: async (id: string, data: Partial<KesiapanPanenItem>) => {
    const response = await api.put(`${baseUrl}/produksi/kesiapan-panen/${id}`, data);
    return response.data;
  },

  deleteKesiapanPanen: async (id: string) => {
    const response = await api.delete(`${baseUrl}/produksi/kesiapan-panen/${id}`);
    return response.data;
  },
};
