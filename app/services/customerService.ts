import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { CustData } from '@/app/types/customer';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const custService = {
  getCustomerList: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    jenisLahan?: string;
    status?: string;
    commodityId?: string;
    lokasi?: string;
  }) => {
    const response = await api.get<ApiResponse<CustData[]>>(`${baseUrl}/master/customer/list`, { params });
    return response.data;
  },
  getCustomers: async () => {
    const response = await api.get<ApiResponse<CustData[]>>(`${baseUrl}/master/customer`);
    return response.data;
  },
  createCustomer: async (data: FormData) => {
    const response = await api.post<ApiResponse<CustData>>(`${baseUrl}/master/customer`, data);
    return response.data;
  },

  updateCustomer: async (id: string, data: FormData) => {
    console.log("==> Updating customer with ID:", id, "and data:", data);
    const response = await api.put<ApiResponse<CustData>>(`${baseUrl}/master/customer/${id}`, data);
    return response.data;
  },
};


export default custService;
