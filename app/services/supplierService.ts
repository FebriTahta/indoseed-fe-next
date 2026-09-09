import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { SupplierData } from '@/app/types/supplier';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const supplierService = {
  getSupplierList: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    kategori?: string;
    status?: string;
  }) => {
    const response = await api.get<ApiResponse<SupplierData[]>>(`${baseUrl}/master/supplier/list`, { params });
    return response.data;
  },
  getSuppliers: async () => {
    const response = await api.get<ApiResponse<SupplierData[]>>(`${baseUrl}/master/supplier`);
    return response.data;
  },
  createSupplier: async (data: FormData | Record<string, any>) => {
    const response = await api.post<ApiResponse<SupplierData>>(`${baseUrl}/master/supplier`, data);
    return response.data;
  },

  updateSupplier: async (id: string, data: FormData | Record<string, any>) => {
    console.log("==> Updating supplier with ID:", id, "and data:", data);
    const response = await api.put<ApiResponse<SupplierData>>(`${baseUrl}/master/supplier/${id}`, data);
    return response.data;
  },

  getSupplierById: async (id: string) => {
    const response = await api.get<ApiResponse<SupplierData>>(`${baseUrl}/master/supplier/${id}`);
    return response.data;
  },

  deleteSupplier: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`${baseUrl}/master/supplier/${id}`);
    return response.data;
  },
};


export default supplierService;
