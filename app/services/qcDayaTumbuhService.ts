import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';

const API_URL = '/qc/tests';
const JENIS_UJI = 'Daya Tumbuh';

function mapToBackendPayload(data: any) {
  const {
    kodeBatch, commodityId, varietyId, metodeUji, tanggalUji, petugasUji, jumlahSampel,
    lampiranUrl, catatan, parameterUji,
    jumlahBenihDitanam, jumlahBerkecambah, jumlahTidakBerkecambah, waktuUjiHari, suhuUji, mediaUji, kelembabanMedia, ...rest
  } = data;

  const dayaTumbuhVal = jumlahBenihDitanam ? (jumlahBerkecambah / jumlahBenihDitanam) * 100 : 0;

  return {
    kodeBatch, commodityId, varietyId, tanggalUji, petugasUji, jumlahSampel, lampiranUrl, catatan,
    testMethodId: metodeUji,
    jenisUji: JENIS_UJI,
    nilaiHasil: dayaTumbuhVal,
    batasAcuan: 85,
    detailUji: {
      jumlahBenihDitanam, jumlahBerkecambah, jumlahTidakBerkecambah, waktuUjiHari, suhuUji, mediaUji, kelembabanMedia, parameterUji, ...rest
    }
  };
}

function mapToFrontendItem(item: any) {
  return {
    ...item,
    metodeUji: item.testMethod?.nama || item.testMethodId,
    dayaTumbuh: item.nilaiHasil,
    batasMinimal: item.batasAcuan,
    ...(item.detailUji || {})
  };
}

export const qcDayaTumbuhService = {
  getDayaTumbuh: async (params?: any) => {
    const response = await api.get<ApiResponse<any[]>>(API_URL, { params: { ...params, jenisUji: JENIS_UJI } });
    if (response.data?.data) {
      response.data.data = response.data.data.map(mapToFrontendItem);
    } else if (Array.isArray(response.data)) {
      response.data = response.data.map(mapToFrontendItem) as any;
    }
    return response.data;
  },
  getDayaTumbuhById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`${API_URL}/${id}`);
    if (response.data?.data) response.data.data = mapToFrontendItem(response.data.data);
    return response.data;
  },
  createDayaTumbuh: async (data: any) => {
    const response = await api.post<ApiResponse<any>>(API_URL, mapToBackendPayload(data));
    return response.data;
  },
  updateDayaTumbuh: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`${API_URL}/${id}`, mapToBackendPayload(data));
    return response.data;
  },
  deleteDayaTumbuh: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`${API_URL}/${id}`);
    return response.data;
  }
};
