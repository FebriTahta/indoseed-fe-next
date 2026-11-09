import api from '@/app/lib/axios';
import {
  SortasiBatchItem,
  SortasiStats,
  ReferensiGudangBahanItem,
  CreateSortasiPayload,
} from '../types/sortasi';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export interface SortasiListResponse {
  status: string;
  data: SortasiBatchItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats: SortasiStats;
}

export const sortasiService = {
  getSortasiList: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    komoditas?: string;
    varietas?: string;
    alatSortasi?: string;
    status?: string;
    lokasi?: string;
    periode?: string;
  }): Promise<SortasiListResponse> => {
    const response = await api.get(`${baseUrl}/produksi/sortasi`, { params });
    return response.data;
  },

  getSortasiById: async (id: string): Promise<{ status: string; data: SortasiBatchItem }> => {
    const response = await api.get(`${baseUrl}/produksi/sortasi/${id}`);
    return response.data;
  },

  getReferensiGudangBahan: async (): Promise<{ status: string; data: ReferensiGudangBahanItem[] }> => {
    const response = await api.get(`${baseUrl}/produksi/sortasi/referensi-gudang-bahan`);
    return response.data;
  },

  createSortasi: async (
    data: CreateSortasiPayload
  ): Promise<{ status: string; message: string; data: SortasiBatchItem }> => {
    const response = await api.post(`${baseUrl}/produksi/sortasi`, data);
    return response.data;
  },

  updateSortasi: async (
    id: string,
    data: Partial<CreateSortasiPayload>
  ): Promise<{ status: string; message: string; data: SortasiBatchItem }> => {
    const response = await api.put(`${baseUrl}/produksi/sortasi/${id}`, data);
    return response.data;
  },

  deleteSortasi: async (id: string): Promise<{ status: string; message: string }> => {
    const response = await api.delete(`${baseUrl}/produksi/sortasi/${id}`);
    return response.data;
  },
};
