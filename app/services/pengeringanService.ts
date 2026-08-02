import api from '@/app/lib/axios';
import { PengeringanBatchItem } from '../types/pengeringan';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const pengeringanService = {
  getPengeringanList: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    komoditas?: string;
    varietas?: string;
    alatPengering?: string;
    status?: string;
    lokasi?: string;
  }) => {
    const response = await api.get(`${baseUrl}/produksi/pengeringan`, { params });
    return response.data;
  },

  getPengeringanById: async (id: string) => {
    const response = await api.get(`${baseUrl}/produksi/pengeringan/${id}`);
    return response.data;
  },

  createPengeringan: async (data: Partial<PengeringanBatchItem>) => {
    const response = await api.post(`${baseUrl}/produksi/pengeringan`, data);
    return response.data;
  },

  updatePengeringan: async (id: string, data: Partial<PengeringanBatchItem>) => {
    const response = await api.put(`${baseUrl}/produksi/pengeringan/${id}`, data);
    return response.data;
  },

  deletePengeringan: async (id: string) => {
    const response = await api.delete(`${baseUrl}/produksi/pengeringan/${id}`);
    return response.data;
  },
};
