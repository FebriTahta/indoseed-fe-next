import api from '@/app/lib/axios';
import {
  StokBenihBersihItem,
  NonBenihStokItem,
  ManajemenStokStats,
  KartuStokItem,
  ManajemenStokTab,
} from '../types/manajemenStok';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const manajemenStokService = {
  getManajemenStokList: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    tab?: ManajemenStokTab;
    gudang?: string;
    lokasi?: string;
    statusQc?: string;
    varietas?: string;
  }) => {
    const response = await api.get(`${baseUrl}/gudang/manajemen-stok`, { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get(`${baseUrl}/gudang/manajemen-stok/stats`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`${baseUrl}/gudang/manajemen-stok/${id}`);
    return response.data;
  },

  getKartuStok: async (lot: string) => {
    const response = await api.get(`${baseUrl}/gudang/manajemen-stok/kartu-stok/${lot}`);
    return response.data;
  },
};

