import api from '@/app/lib/axios';
import { StokBenihItem } from '../types/stokBenih';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const stokBenihService = {
  getStokBenihList: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    gudang?: string;
    kategoriBenih?: string;
    produkBenih?: string;
    status?: string;
    tab?: string;
  }) => {
    const response = await api.get(`${baseUrl}/gudang/stok-benih`, { params });
    return response.data;
  },

  getStokBenihById: async (id: string) => {
    const response = await api.get(`${baseUrl}/gudang/stok-benih/${id}`);
    return response.data;
  },

  createStokBenih: async (data: Partial<StokBenihItem>) => {
    const response = await api.post(`${baseUrl}/gudang/stok-benih`, data);
    return response.data;
  },

  updateStokBenih: async (id: string, data: Partial<StokBenihItem>) => {
    const response = await api.put(`${baseUrl}/gudang/stok-benih/${id}`, data);
    return response.data;
  },

  deleteStokBenih: async (id: string) => {
    const response = await api.delete(`${baseUrl}/gudang/stok-benih/${id}`);
    return response.data;
  },
};
