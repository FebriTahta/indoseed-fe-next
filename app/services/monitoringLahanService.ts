import api from '@/app/lib/axios';
import { MonitoringLahanItem } from '../types/monitoringLahan';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const monitoringLahanService = {
  getMonitoringLahanList: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    komoditas?: string;
    varietas?: string;
    lokasi?: string;
    status?: string;
    kondisi?: string;
  }) => {
    const response = await api.get(`${baseUrl}/produksi/monitoring-lahan`, { params });
    return response.data;
  },

  getMonitoringLahanById: async (id: string) => {
    const response = await api.get(`${baseUrl}/produksi/monitoring-lahan/${id}`);
    return response.data;
  },

  createMonitoringLahan: async (data: Partial<MonitoringLahanItem>) => {
    const response = await api.post(`${baseUrl}/produksi/monitoring-lahan`, data);
    return response.data;
  },

  updateMonitoringLahan: async (id: string, data: Partial<MonitoringLahanItem>) => {
    const response = await api.put(`${baseUrl}/produksi/monitoring-lahan/${id}`, data);
    return response.data;
  },

  deleteMonitoringLahan: async (id: string) => {
    const response = await api.delete(`${baseUrl}/produksi/monitoring-lahan/${id}`);
    return response.data;
  },
};
