import api from '@/app/lib/axios';
import {
  MonitoringGudangItem,
  MonitoringGudangStats,
  MonitoringAlertItem,
  MasterGudangOption,
  MonitoringFormInput,
} from '../types/monitoringGudang';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const monitoringGudangService = {
  getMonitoringList: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    gudangId?: string;
    namaGudang?: string;
    zona?: string;
    status?: string;
    sumberData?: string;
    dateRange?: string;
  }) => {
    const response = await api.get(`${baseUrl}/gudang/monitoring-kondisi`, { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get(`${baseUrl}/gudang/monitoring-kondisi/stats`);
    return response.data;
  },

  getTren: async (days = 7) => {
    const response = await api.get(`${baseUrl}/gudang/monitoring-kondisi/tren`, {
      params: { days },
    });
    return response.data;
  },

  getAlerts: async () => {
    const response = await api.get(`${baseUrl}/gudang/monitoring-kondisi/alerts`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`${baseUrl}/gudang/monitoring-kondisi/${id}`);
    return response.data;
  },

  createPengukuran: async (payload: MonitoringFormInput) => {
    const response = await api.post(`${baseUrl}/gudang/monitoring-kondisi`, payload);
    return response.data;
  },

  updatePengukuran: async (id: string, payload: Partial<MonitoringFormInput>) => {
    const response = await api.put(`${baseUrl}/gudang/monitoring-kondisi/${id}`, payload);
    return response.data;
  },

  deletePengukuran: async (id: string) => {
    const response = await api.delete(`${baseUrl}/gudang/monitoring-kondisi/${id}`);
    return response.data;
  },

  getMasterGudangOptions: async () => {
    const response = await api.get(`${baseUrl}/gudang/monitoring-kondisi/gudang-options`);
    return response.data;
  },
};
