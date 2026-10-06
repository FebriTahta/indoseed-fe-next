import axiosInstance from '@/app/lib/axios';
import { PermintaanPengujian, PermintaanSummary } from '@/app/types/qc';
import { ApiResponse } from '@/app/types/api';

const API_URL = '/qc/permintaan';

export interface PermintaanListParams {
  search?: string;
  status?: string;
  periode?: string;
  startDate?: string;
  endDate?: string;
  komoditas?: string;
  prioritas?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PermintaanListResponse {
  success: boolean;
  data: PermintaanPengujian[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const permintaanPengujianService = {
  getPermintaanList: async (params?: PermintaanListParams): Promise<PermintaanListResponse> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.periode) query.append('periode', params.periode);
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    if (params?.komoditas) query.append('komoditas', params.komoditas);
    if (params?.prioritas) query.append('prioritas', params.prioritas);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.pageSize) query.append('pageSize', params.pageSize.toString());

    const qs = query.toString();
    const url = qs ? `${API_URL}?${qs}` : API_URL;
    const response = await axiosInstance.get<PermintaanListResponse>(url);
    return response.data;
  },

  getPermintaanSummary: async (params?: { startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams();
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);

    const qs = query.toString();
    const url = qs ? `${API_URL}/summary?${qs}` : `${API_URL}/summary`;
    const response = await axiosInstance.get<ApiResponse<PermintaanSummary>>(url);
    return response.data;
  },

  getNextNumber: async () => {
    const response = await axiosInstance.get<ApiResponse<{ noPermintaan: string }>>(
      `${API_URL}/generate-number`
    );
    return response.data;
  },

  getPermintaanById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<PermintaanPengujian>>(`${API_URL}/${id}`);
    return response.data;
  },

  createPermintaan: async (data: any) => {
    let payload = data;
    const isFormData = data instanceof FormData;
    const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined;

    const response = await axiosInstance.post<ApiResponse<PermintaanPengujian>>(
      API_URL,
      payload,
      { headers }
    );
    return response.data;
  },

  updatePermintaan: async (id: string, data: any) => {
    let payload = data;
    const isFormData = data instanceof FormData;
    const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined;

    const response = await axiosInstance.put<ApiResponse<PermintaanPengujian>>(
      `${API_URL}/${id}`,
      payload,
      { headers }
    );
    return response.data;
  },

  updatePermintaanStatus: async (id: string, status: string, diubahOleh?: string) => {
    const response = await axiosInstance.patch<ApiResponse<PermintaanPengujian>>(
      `${API_URL}/${id}/status`,
      { status, diubahOleh }
    );
    return response.data;
  },

  deletePermintaan: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<any>>(`${API_URL}/${id}`);
    return response.data;
  },
};
