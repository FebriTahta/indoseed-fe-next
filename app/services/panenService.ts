import api from '@/app/lib/axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export interface PanenItem {
  id: string;
  kodePanen: string;
  jadwalTanamId?: string;
  komoditas: string;
  varietas: string;
  lahan: string;
  tanggalPanen: string;
  luasHa: number;
  produksiKg: number;
  hasilKgHa: number;
  status: 'Selesai' | 'Berlangsung' | 'Belum Mulai' | string;
  penanggungJawab?: string;
  metodePanen?: string;
  produksiKotorKg?: number;
  kadarAir?: number;
  kebersihan?: number;
  catatan?: string;
  dokumen?: string | any[];
  createdAt?: string;
  updatedAt?: string;
}

export const panenService = {
  getPanenList: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    komoditas?: string;
    varietas?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get(`${baseUrl}/produksi/panen`, { params });
    return response.data;
  },

  getPanenById: async (id: string) => {
    const response = await api.get(`${baseUrl}/produksi/panen/${id}`);
    return response.data;
  },

  createPanen: async (data: Partial<PanenItem>) => {
    const response = await api.post(`${baseUrl}/produksi/panen`, data);
    return response.data;
  },

  updatePanen: async (id: string, data: Partial<PanenItem>) => {
    const response = await api.put(`${baseUrl}/produksi/panen/${id}`, data);
    return response.data;
  },

  deletePanen: async (id: string) => {
    const response = await api.delete(`${baseUrl}/produksi/panen/${id}`);
    return response.data;
  },
};
