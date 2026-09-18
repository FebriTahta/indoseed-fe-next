import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import {
  PersetujuanProduksi,
  PersetujuanProduksiStats,
  FilterPersetujuanProduksiParams,
} from '@/app/types/persetujuanProduksi';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const persetujuanProduksiService = {
  getList: async (params?: FilterPersetujuanProduksiParams) => {
    const response = await api.get<ApiResponse<PersetujuanProduksi[]>>(
      `${baseUrl}/produksi/persetujuan-produksi`,
      { params }
    );
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<{ status: string; data: PersetujuanProduksiStats }>(
      `${baseUrl}/produksi/persetujuan-produksi/stats`
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<PersetujuanProduksi>>(
      `${baseUrl}/produksi/persetujuan-produksi/${id}`
    );
    return response.data;
  },

  approve: async (id: string, catatan?: string) => {
    const response = await api.patch<ApiResponse<PersetujuanProduksi>>(
      `${baseUrl}/produksi/persetujuan-produksi/${id}/approve`,
      { catatan }
    );
    return response.data;
  },

  reject: async (id: string, alasan: string) => {
    const response = await api.patch<ApiResponse<PersetujuanProduksi>>(
      `${baseUrl}/produksi/persetujuan-produksi/${id}/reject`,
      { alasan }
    );
    return response.data;
  },
};

export default persetujuanProduksiService;
