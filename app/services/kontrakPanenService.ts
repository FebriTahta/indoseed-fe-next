import api from '@/app/lib/axios';
import { KontrakPanen, KontrakPanenFilterParams, KontrakPanenStats } from '@/app/types/kontrakPanen';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const kontrakPanenService = {
  getList: async (params?: KontrakPanenFilterParams) => {
    const response = await api.get<{
      success: boolean;
      data: KontrakPanen[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }>(`${baseUrl}/produksi/kontrak-panen`, { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<{
      success: boolean;
      data: KontrakPanenStats;
    }>(`${baseUrl}/produksi/kontrak-panen/stats`);
    return response.data;
  },

  getNextNumber: async () => {
    const response = await api.get<{
      success: boolean;
      data: { nextNoKontrak: string };
    }>(`${baseUrl}/produksi/kontrak-panen/next-number`);
    return response.data;
  },

  getHarvestTypes: async (varietyId?: string) => {
    const response = await api.get<{
      success: boolean;
      data: any[];
    }>(`${baseUrl}/produksi/kontrak-panen/harvest-types`, {
      params: varietyId ? { varietyId } : {},
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{
      success: boolean;
      data: KontrakPanen;
    }>(`${baseUrl}/produksi/kontrak-panen/${id}`);
    return response.data;
  },

  create: async (data: Partial<KontrakPanen>) => {
    const response = await api.post<{
      success: boolean;
      data: KontrakPanen;
      message: string;
    }>(`${baseUrl}/produksi/kontrak-panen`, data);
    return response.data;
  },

  update: async (id: string, data: Partial<KontrakPanen>) => {
    const response = await api.put<{
      success: boolean;
      data: KontrakPanen;
      message: string;
    }>(`${baseUrl}/produksi/kontrak-panen/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<{
      success: boolean;
      message: string;
    }>(`${baseUrl}/produksi/kontrak-panen/${id}`);
    return response.data;
  },
};

export default kontrakPanenService;
