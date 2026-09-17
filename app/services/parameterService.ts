import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import {
  MasterParameter,
  CreateMasterParameterPayload,
  CombinedVarietyParameter,
  SaveVarietyParameterPayload,
} from '@/app/types/parameter';

export const parameterService = {
  // Master Parameter API
  getModulList: async () => {
    const response = await api.get<ApiResponse<string[]>>('/master/parameter/modul-list');
    return response.data;
  },

  getParameters: async (params?: {
    search?: string;
    namaModul?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const response = await api.get<ApiResponse<MasterParameter[]>>('/master/parameter', { params });
    return response.data;
  },

  getParameterById: async (id: string) => {
    const response = await api.get<ApiResponse<MasterParameter>>(`/master/parameter/${id}`);
    return response.data;
  },

  createParameter: async (data: CreateMasterParameterPayload) => {
    const response = await api.post<ApiResponse<MasterParameter>>('/master/parameter', data);
    return response.data;
  },

  updateParameter: async (id: string, data: Partial<CreateMasterParameterPayload>) => {
    const response = await api.put<ApiResponse<MasterParameter>>(`/master/parameter/${id}`, data);
    return response.data;
  },

  deleteParameter: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/master/parameter/${id}`);
    return response.data;
  },

  // Variety Parameter API
  getVarietyParameters: async (varietyId: string, namaModul?: string) => {
    const response = await api.get<ApiResponse<CombinedVarietyParameter[]>>(
      `/master/variety-parameter/${varietyId}`,
      { params: { namaModul } }
    );
    return response.data;
  },

  saveVarietyParameters: async (varietyId: string, parameters: SaveVarietyParameterPayload[]) => {
    const response = await api.post<ApiResponse<any>>(
      `/master/variety-parameter/${varietyId}/batch`,
      { parameters }
    );
    return response.data;
  },
};

export default parameterService;
