import axiosInstance from '@/app/lib/axios';
import { cleanParams } from '@/app/services/permintaanPengujianService';
import { DashboardQc } from '@/app/types/dashboardQc';

export const dashboardQcService = {
  get: async (params: { startDate?: string; endDate?: string }) =>
    (await axiosInstance.get<{ success: boolean; data: DashboardQc }>('/qc/dashboard', { params: cleanParams(params) })).data,
};
