import api from '@/app/lib/axios';
import { TreatmentBatchItem } from '../types/treatment';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const treatmentService = {
  getTreatmentList: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    komoditas?: string;
    varietas?: string;
    jenisTreatment?: string;
    status?: string;
    lokasi?: string;
  }) => {
    const response = await api.get(`${baseUrl}/produksi/treatment`, { params });
    return response.data;
  },

  getTreatmentById: async (id: string) => {
    const response = await api.get(`${baseUrl}/produksi/treatment/${id}`);
    return response.data;
  },

  createTreatment: async (data: Partial<TreatmentBatchItem>) => {
    const response = await api.post(`${baseUrl}/produksi/treatment`, data);
    return response.data;
  },

  updateTreatment: async (id: string, data: Partial<TreatmentBatchItem>) => {
    const response = await api.put(`${baseUrl}/produksi/treatment/${id}`, data);
    return response.data;
  },

  deleteTreatment: async (id: string) => {
    const response = await api.delete(`${baseUrl}/produksi/treatment/${id}`);
    return response.data;
  },
};
