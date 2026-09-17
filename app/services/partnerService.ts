import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { Partner } from '@/app/types/partner';

export const partnerService = {
  getPartners: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    kelompokTani?: string;
    status?: string;
    commodityId?: string;
    komoditasUtama?: string;
  }) => {
    const response = await api.get<ApiResponse<Partner[]>>('/master/partner', { params });
    return response.data;
  },

  getPartnerDetail: async (id: string) => {
    const response = await api.get<ApiResponse<Partner>>(`/master/partner/${id}`);
    return response.data;
  },

  createPartner: async (data: FormData) => {
    const response = await api.post<ApiResponse<Partner>>('/master/partner', data);
    return response.data;
  },

  updatePartner: async (id: string, data: FormData) => {
    const response = await api.put<ApiResponse<Partner>>(`/master/partner/${id}`, data);
    return response.data;
  },

  deletePartner: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/master/partner/${id}`);
    return response.data;
  },
};
export default partnerService;
