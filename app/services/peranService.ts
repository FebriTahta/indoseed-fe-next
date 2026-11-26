import api from '@/app/lib/axios';
import { Peran, PeranStats, PeranFormValues } from '../types/peran';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const peranService = {
  getPerans: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    kategori?: string;
    status?: string;
  }) => {
    const response = await api.get(`${baseUrl}/master/peran`, { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get(`${baseUrl}/master/peran/stats`);
    return response.data;
  },

  getNextKode: async () => {
    const response = await api.get(`${baseUrl}/master/peran/next-kode`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`${baseUrl}/master/peran/${id}`);
    return response.data;
  },

  create: async (data: PeranFormValues) => {
    const response = await api.post(`${baseUrl}/master/peran`, data);
    return response.data;
  },

  update: async (id: string, data: Partial<PeranFormValues>) => {
    const response = await api.put(`${baseUrl}/master/peran/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`${baseUrl}/master/peran/${id}`);
    return response.data;
  },
};

export default peranService;
