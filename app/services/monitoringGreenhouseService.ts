import api from '@/app/lib/axios';
import { MonitoringGreenhouseItem } from '../types/monitoringGreenhouse';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const monitoringGreenhouseService = {
  getMonitoringGreenhouseList: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    komoditas?: string;
    varietas?: string;
    lokasi?: string;
    status?: string;
    kondisi?: string;
  }) => {
    const response = await api.get(`${baseUrl}/produksi/monitoring-greenhouse`, { params });
    return response.data;
  },

  getMonitoringGreenhouseById: async (id: string) => {
    const response = await api.get(`${baseUrl}/produksi/monitoring-greenhouse/${id}`);
    return response.data;
  },

  createMonitoringGreenhouse: async (data: Partial<MonitoringGreenhouseItem>) => {
    const response = await api.post(`${baseUrl}/produksi/monitoring-greenhouse`, data);
    return response.data;
  },

  updateMonitoringGreenhouse: async (id: string, data: Partial<MonitoringGreenhouseItem>) => {
    const response = await api.put(`${baseUrl}/produksi/monitoring-greenhouse/${id}`, data);
    return response.data;
  },

  deleteMonitoringGreenhouse: async (id: string) => {
    const response = await api.delete(`${baseUrl}/produksi/monitoring-greenhouse/${id}`);
    return response.data;
  },
};
