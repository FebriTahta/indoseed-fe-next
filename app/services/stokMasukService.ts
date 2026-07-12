import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { CustData } from '@/app/types/customer';

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
    const response = await api.get<ApiResponse<CustData[]>>('/master/customer/list', { params });
    return response.data;
  },
  getCustomers: async () => {
    const response = await api.get<ApiResponse<CustData[]>>('/master/customer');
    return response.data;
  },
  createCustomer: async (data: FormData) => {
    const response = await api.post<ApiResponse<CustData>>('/api/master/customer', data);
    return response.data;
  },

  updateCustomer: async (id: string, data: FormData) => {
    const response = await api.put<ApiResponse<CustData>>(`/master/customer/${id}`, data);
    return response.data;
  },
};


export default custService;
