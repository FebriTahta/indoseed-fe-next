import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { PerencanaanProduksi, PerencanaanStats, PerencanaanFilterParams } from '@/app/types/perencanaanProduksi';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const perencanaanProduksiService = {
  getList: async (params?: PerencanaanFilterParams) => {
    const response = await api.get<{
      success: boolean;
      data: PerencanaanProduksi[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }>(`${baseUrl}/produksi/perencanaan-produksi`, { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<{
      success: boolean;
      data: PerencanaanStats;
    }>(`${baseUrl}/produksi/perencanaan-produksi/stats`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{
      success: boolean;
      data: PerencanaanProduksi;
    }>(`${baseUrl}/produksi/perencanaan-produksi/${id}`);
    return response.data;
  },

  create: async (data: Partial<PerencanaanProduksi>) => {
    const response = await api.post<{
      success: boolean;
      data: PerencanaanProduksi;
      message: string;
    }>(`${baseUrl}/produksi/perencanaan-produksi`, data);
    return response.data;
  },

  update: async (id: string, data: Partial<PerencanaanProduksi>) => {
    const response = await api.put<{
      success: boolean;
      data: PerencanaanProduksi;
      message: string;
    }>(`${baseUrl}/produksi/perencanaan-produksi/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<{
      success: boolean;
      message: string;
    }>(`${baseUrl}/produksi/perencanaan-produksi/${id}`);
    return response.data;
  },
};

export default perencanaanProduksiService;
