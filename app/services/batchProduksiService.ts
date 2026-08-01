import api from '@/app/lib/axios';
import { BatchProduksiItem } from '../types/batchProduksi';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const batchProduksiService = {
  getBatchProduksiList: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    komoditas?: string;
    varietas?: string;
    sumberBahan?: string;
    status?: string;
    lokasi?: string;
  }) => {
    const response = await api.get(`${baseUrl}/produksi/batch-produksi`, { params });
    return response.data;
  },

  getBatchProduksiById: async (id: string) => {
    const response = await api.get(`${baseUrl}/produksi/batch-produksi/${id}`);
    return response.data;
  },

  createBatchProduksi: async (data: Partial<BatchProduksiItem>) => {
    const response = await api.post(`${baseUrl}/produksi/batch-produksi`, data);
    return response.data;
  },

  updateBatchProduksi: async (id: string, data: Partial<BatchProduksiItem>) => {
    const response = await api.put(`${baseUrl}/produksi/batch-produksi/${id}`, data);
    return response.data;
  },

  deleteBatchProduksi: async (id: string) => {
    const response = await api.delete(`${baseUrl}/produksi/batch-produksi/${id}`);
    return response.data;
  },
};
