import api from '@/app/lib/axios';
import { SortasiBatchItem } from '../types/sortasi';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const sortasiService = {
  getSortasiList: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    komoditas?: string;
    varietas?: string;
    alatSortasi?: string;
    status?: string;
    lokasi?: string;
  }) => {
    const response = await api.get(`${baseUrl}/produksi/sortasi`, { params });
    return response.data;
  },

  getSortasiById: async (id: string) => {
    const response = await api.get(`${baseUrl}/produksi/sortasi/${id}`);
    return response.data;
  },

  createSortasi: async (data: Partial<SortasiBatchItem>) => {
    const response = await api.post(`${baseUrl}/produksi/sortasi`, data);
    return response.data;
  },

  updateSortasi: async (id: string, data: Partial<SortasiBatchItem>) => {
    const response = await api.put(`${baseUrl}/produksi/sortasi/${id}`, data);
    return response.data;
  },

  deleteSortasi: async (id: string) => {
    const response = await api.delete(`${baseUrl}/produksi/sortasi/${id}`);
    return response.data;
  },
};
