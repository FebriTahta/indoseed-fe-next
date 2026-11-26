import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { HarvestType, HarvestTypePrice } from '@/app/types/harvestType';

export const harvestTypeService = {
  getHarvestTypes: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    varietyId?: string;
  }) => {
    const response = await api.get<ApiResponse<HarvestType[]>>('/master/harvest-type', { params });
    return response.data;
  },

  getHarvestTypeDetail: async (id: string) => {
    const response = await api.get<ApiResponse<HarvestType>>(`/master/harvest-type/${id}`);
    return response.data;
  },

  createHarvestType: async (data: {
    kode: string;
    nama: string;
    varietyId: string;
    status: string;
    initialPrice?: number;
  }) => {
    const response = await api.post<ApiResponse<HarvestType>>('/master/harvest-type', data);
    return response.data;
  },

  updateHarvestType: async (id: string, data: {
    kode: string;
    nama: string;
    varietyId: string;
    status: string;
  }) => {
    const response = await api.put<ApiResponse<HarvestType>>(`/master/harvest-type/${id}`, data);
    return response.data;
  },

  deleteHarvestType: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/master/harvest-type/${id}`);
    return response.data;
  },

  addHarvestTypePrice: async (harvestTypeId: string, data: { harga: number; keterangan?: string }) => {
    const response = await api.post<ApiResponse<HarvestTypePrice>>(`/master/harvest-type/${harvestTypeId}/price`, data);
    return response.data;
  }
};

export default harvestTypeService;
