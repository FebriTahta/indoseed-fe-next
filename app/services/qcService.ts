import axiosInstance from '@/app/lib/axios';
import { LaboratoriumRef, ReferenceStandard, TestMethod, TestMethodRiwayat, TestParameter } from '@/app/types/qc';
import { ApiResponse } from '@/app/types/api';

const API_URL = '/qc';

export const qcService = {
  // Reference Standards
  getStandards: async (hasDocuments?: boolean) => {
    const url = hasDocuments ? `${API_URL}/standards?hasDocuments=true` : `${API_URL}/standards`;
    const response = await axiosInstance.get<ApiResponse<ReferenceStandard[]>>(url);
    return response.data;
  },
  getStandardById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<ReferenceStandard>>(`${API_URL}/standards/${id}`);
    return response.data;
  },
  createStandard: async (data: Partial<ReferenceStandard>) => {
    const response = await axiosInstance.post<ApiResponse<ReferenceStandard>>(`${API_URL}/standards`, data);
    return response.data;
  },
  updateStandard: async (id: string, data: Partial<ReferenceStandard>) => {
    const response = await axiosInstance.put<ApiResponse<ReferenceStandard>>(`${API_URL}/standards/${id}`, data);
    return response.data;
  },
  deleteStandard: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<any>>(`${API_URL}/standards/${id}`);
    return response.data;
  },

  // Test Methods
  getMethods: async (params?: {
    search?: string;
    jenisUji?: string;
    komoditas?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.jenisUji) query.append('jenisUji', params.jenisUji);
    if (params?.komoditas) query.append('komoditas', params.komoditas);
    if (params?.status) query.append('status', params.status);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

    const queryString = query.toString();
    const url = queryString ? `${API_URL}/methods?${queryString}` : `${API_URL}/methods`;
    const response = await axiosInstance.get<ApiResponse<TestMethod[]>>(url);
    return response.data;
  },
  getMethodRiwayat: async (limit = 10) => {
    const response = await axiosInstance.get<ApiResponse<TestMethodRiwayat[]>>(`${API_URL}/methods/riwayat`, { params: { limit } });
    return response.data;
  },
  getMethodById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<TestMethod>>(`${API_URL}/methods/${id}`);
    return response.data;
  },
  createMethod: async (data: Partial<TestMethod>) => {
    const response = await axiosInstance.post<ApiResponse<TestMethod>>(`${API_URL}/methods`, data);
    return response.data;
  },
  updateMethod: async (id: string, data: Partial<TestMethod>) => {
    const response = await axiosInstance.put<ApiResponse<TestMethod>>(`${API_URL}/methods/${id}`, data);
    return response.data;
  },
  deleteMethod: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<any>>(`${API_URL}/methods/${id}`);
    return response.data;
  },

  // Laboratorium aktif
  getLaboratoriums: async () => {
    const response = await axiosInstance.get<ApiResponse<LaboratoriumRef[]>>(`${API_URL}/laboratoriums`);
    return response.data;
  },

  // Test Parameters
  getParameters: async () => {
    const response = await axiosInstance.get<ApiResponse<TestParameter[]>>(`${API_URL}/parameters`);
    return response.data;
  },
  getParameterById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<TestParameter>>(`${API_URL}/parameters/${id}`);
    return response.data;
  },
  createParameter: async (data: Partial<TestParameter>) => {
    const response = await axiosInstance.post<ApiResponse<TestParameter>>(`${API_URL}/parameters`, data);
    return response.data;
  },
  updateParameter: async (id: string, data: Partial<TestParameter>) => {
    const response = await axiosInstance.put<ApiResponse<TestParameter>>(`${API_URL}/parameters/${id}`, data);
    return response.data;
  },
  deleteParameter: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<any>>(`${API_URL}/parameters/${id}`);
    return response.data;
  },

  // Documents
  getDocuments: async () => {
    const response = await axiosInstance.get<ApiResponse<any[]>>(`${API_URL}/documents`);
    return response.data;
  },
  getDocumentById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<any>>(`${API_URL}/documents/${id}`);
    return response.data;
  },
  createDocument: async (data: any) => {
    let payload = data;
    if (data.file) {
      payload = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
          if (data[key] instanceof Date) {
            payload.append(key, data[key].toISOString());
          } else {
            payload.append(key, data[key]);
          }
        }
      });
    }
    const response = await axiosInstance.post<ApiResponse<any>>(`${API_URL}/documents`, payload, {
      headers: data.file ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },
  updateDocument: async (id: string, data: any) => {
    let payload = data;
    if (data.file) {
      payload = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
          if (data[key] instanceof Date) {
            payload.append(key, data[key].toISOString());
          } else {
            payload.append(key, data[key]);
          }
        }
      });
    }
    const response = await axiosInstance.put<ApiResponse<any>>(`${API_URL}/documents/${id}`, payload, {
      headers: data.file ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },
  deleteDocument: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<any>>(`${API_URL}/documents/${id}`);
    return response.data;
  },
};
