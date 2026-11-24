import api from '@/app/lib/axios';
import { Lokasi, LokasiStats, LokasiFormValues } from '../types/lokasi';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const lokasiService = {
  getLokasis: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    tipeLokasi?: string;
    status?: string;
  }) => {
    const response = await api.get(`${baseUrl}/master/lokasi`, { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get(`${baseUrl}/master/lokasi/stats`);
    return response.data;
  },

  getNextKode: async () => {
    const response = await api.get(`${baseUrl}/master/lokasi/next-kode`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`${baseUrl}/master/lokasi/${id}`);
    return response.data;
  },

  create: async (data: LokasiFormValues) => {
    const response = await api.post(`${baseUrl}/master/lokasi`, data);
    return response.data;
  },

  update: async (id: string, data: Partial<LokasiFormValues>) => {
    const response = await api.put(`${baseUrl}/master/lokasi/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`${baseUrl}/master/lokasi/${id}`);
    return response.data;
  },
};

export default lokasiService;
