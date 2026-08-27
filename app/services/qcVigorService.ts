import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';

const API_URL = '/qc/tests';
const JENIS_UJI = 'Vigor';

function mapToBackendPayload(data: any) {
  const {
    kodeBatch, commodityId, varietyId, metodeUji, lotNoBenih, tanggalUji, lokasiLab, petugasUji, jumlahSampel,
    vigor, kategori, batasMinimal, status, alatInstrumen, waktuPengujian, suhuRuangan, catatan, lampiranUrl, parameterUji, ...rest
  } = data;

  return {
    kodeBatch, commodityId, varietyId, tanggalUji, petugasUji, jumlahSampel, lampiranUrl, catatan, lokasiLab,
    testMethodId: metodeUji,
    jenisUji: JENIS_UJI,
    nilaiHasil: vigor,
    batasAcuan: batasMinimal,
    status: status || 'Sedang Diuji',
    detailUji: {
      lotNoBenih, kategori, alatInstrumen, waktuPengujian, suhuRuangan, parameterUji, ...rest
    }
  };
}

function mapToFrontendItem(item: any) {
  return {
    ...item,
    metodeUji: item.testMethod?.nama || item.testMethodId,
    vigor: item.nilaiHasil,
    batasMinimal: item.batasAcuan,
    ...(item.detailUji || {})
  };
}

export const qcVigorService = {
  getQcVigorList: async (params?: any) => {
    const response = await api.get<ApiResponse<any[]>>(API_URL, { params: { ...params, jenisUji: JENIS_UJI } });
    if (response.data?.data) {
      response.data.data = response.data.data.map(mapToFrontendItem);
    } else if (Array.isArray(response.data)) {
      response.data = response.data.map(mapToFrontendItem) as any;
    }
    return response.data;
  },
  getQcVigorById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`${API_URL}/${id}`);
    if (response.data?.data) response.data.data = mapToFrontendItem(response.data.data);
    return response.data;
  },
  createQcVigor: async (data: any) => {
    const response = await api.post<ApiResponse<any>>(API_URL, mapToBackendPayload(data));
    return response.data;
  },
  updateQcVigor: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`${API_URL}/${id}`, mapToBackendPayload(data));
    return response.data;
  },
  deleteQcVigor: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`${API_URL}/${id}`);
    return response.data;
  }
};
