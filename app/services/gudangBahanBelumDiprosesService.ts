import api from '@/app/lib/axios';
import {
  GudangBahanItem,
  GudangBahanStats,
  ReferensiPanenItem,
  CreateGudangBahanPayload,
  GetGudangBahanParams,
} from '../types/gudangBahanBelumDiproses';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export interface GudangBahanListResponse {
  status: string;
  data: GudangBahanItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats: GudangBahanStats;
}

export const gudangBahanBelumDiprosesService = {
  getList: async (params?: GetGudangBahanParams): Promise<GudangBahanListResponse> => {
    const response = await api.get(`${baseUrl}/produksi/gudang-bahan-belum-diproses`, { params });
    return response.data;
  },

  getById: async (id: string): Promise<{ status: string; data: GudangBahanItem }> => {
    const response = await api.get(`${baseUrl}/produksi/gudang-bahan-belum-diproses/${id}`);
    return response.data;
  },

  getStats: async (): Promise<{ status: string; data: GudangBahanStats }> => {
    const response = await api.get(`${baseUrl}/produksi/gudang-bahan-belum-diproses/stats`);
    return response.data;
  },

  getNextLotCode: async (): Promise<{ status: string; data: { nextLotCode: string } }> => {
    const response = await api.get(`${baseUrl}/produksi/gudang-bahan-belum-diproses/next-lot-code`);
    return response.data;
  },

  getReferensiPanen: async (): Promise<{ status: string; data: ReferensiPanenItem[] }> => {
    const response = await api.get(`${baseUrl}/produksi/gudang-bahan-belum-diproses/referensi-panen`);
    return response.data;
  },

  create: async (payload: CreateGudangBahanPayload): Promise<{ status: string; message: string; data: GudangBahanItem }> => {
    const response = await api.post(`${baseUrl}/produksi/gudang-bahan-belum-diproses`, payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<CreateGudangBahanPayload>): Promise<{ status: string; message: string; data: GudangBahanItem }> => {
    const response = await api.put(`${baseUrl}/produksi/gudang-bahan-belum-diproses/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<{ status: string; message: string }> => {
    const response = await api.delete(`${baseUrl}/produksi/gudang-bahan-belum-diproses/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<{ status: string; message: string; data: GudangBahanItem }> => {
    const response = await api.patch(`${baseUrl}/produksi/gudang-bahan-belum-diproses/${id}/status`, { status });
    return response.data;
  },
};
