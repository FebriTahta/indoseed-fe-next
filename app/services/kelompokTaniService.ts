import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import {
  KelompokTani,
  KelompokTaniStats,
} from '@/app/types/kelompokTani';

export interface CreateKelompokTaniPayload {
  kodeKelompok?: string;
  namaKelompok: string;
  ketua: string;
  noHpKetua?: string | null;
  tahunBerdiri?: string | null;
  lokasi: string;
  desa?: string | null;
  kecamatan?: string | null;
  kabupaten?: string | null;
  komoditasUtama: string;
  commodityId?: string | null;
  jumlahAnggota?: number;
  deskripsi?: string | null;
  status?: string;
  penanggungJawabId?: string | null;
}

export interface UpdateKelompokTaniPayload {
  kodeKelompok?: string;
  namaKelompok?: string;
  ketua?: string;
  noHpKetua?: string | null;
  tahunBerdiri?: string | null;
  lokasi?: string;
  desa?: string | null;
  kecamatan?: string | null;
  kabupaten?: string | null;
  komoditasUtama?: string;
  commodityId?: string | null;
  jumlahAnggota?: number;
  deskripsi?: string | null;
  status?: string;
  penanggungJawabId?: string | null;
}

export const kelompokTaniService = {
  getKelompokTani: async (params?: {
    search?: string;
    lokasi?: string;
    komoditasUtama?: string;
    status?: string;
    penanggungJawabId?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const response = await api.get<ApiResponse<KelompokTani[]> & { stats?: KelompokTaniStats }>(
      '/master/kelompok-tani',
      { params }
    );
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<ApiResponse<KelompokTaniStats>>('/master/kelompok-tani/stats');
    return response.data;
  },

  getNextKode: async () => {
    const response = await api.get<ApiResponse<{ kodeKelompok: string }>>('/master/kelompok-tani/next-kode');
    return response.data;
  },

  getKelompokTaniById: async (id: string) => {
    const response = await api.get<ApiResponse<KelompokTani>>(`/master/kelompok-tani/${id}`);
    return response.data;
  },

  createKelompokTani: async (data: CreateKelompokTaniPayload) => {
    const response = await api.post<ApiResponse<KelompokTani>>('/master/kelompok-tani', data);
    return response.data;
  },

  updateKelompokTani: async (id: string, data: UpdateKelompokTaniPayload) => {
    const response = await api.put<ApiResponse<KelompokTani>>(`/master/kelompok-tani/${id}`, data);
    return response.data;
  },

  deleteKelompokTani: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/master/kelompok-tani/${id}`);
    return response.data;
  },
};

export default kelompokTaniService;
