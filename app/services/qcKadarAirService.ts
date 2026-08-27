import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';

const API_URL = '/qc/tests';
const JENIS_UJI = 'Kadar Air';

function mapToBackendPayload(data: any) {
  const {
    kodeBatch, commodityId, varietyId, testMethodId, lotNumber, tanggalUji, lokasiLab, petugasUji, jumlahSampel,
    lampiranUrl, kadarAir, batasMaksimal, status, alat, suhuUji, waktuPengeringan, ulangan, beratAwal, beratAkhir, catatan, parameterUji, ...rest
  } = data;

  return {
    kodeBatch, commodityId, varietyId, tanggalUji, petugasUji, jumlahSampel, lampiranUrl, catatan, lokasiLab,
    testMethodId: testMethodId,
    jenisUji: JENIS_UJI,
    nilaiHasil: kadarAir,
    batasAcuan: batasMaksimal,
    status: status || 'Sedang Diuji',
    detailUji: {
      lotNumber, alat, suhuUji, waktuPengeringan, ulangan, beratAwal, beratAkhir, parameterUji, ...rest
    }
  };
}

function mapToFrontendItem(item: any) {
  return {
    ...item,
    testMethodId: item.testMethod?.nama || item.testMethodId,
    kadarAir: item.nilaiHasil,
    batasMaksimal: item.batasAcuan,
    ...(item.detailUji || {})
  };
}

export const qcKadarAirService = {
  getKadarAir: async (params?: any) => {
    const response = await api.get<ApiResponse<any[]>>(API_URL, { params: { ...params, jenisUji: JENIS_UJI } });
    if (response.data?.data) {
      response.data.data = response.data.data.map(mapToFrontendItem);
    } else if (Array.isArray(response.data)) {
      response.data = response.data.map(mapToFrontendItem) as any;
    }
    return response.data;
  },
  getKadarAirById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`${API_URL}/${id}`);
    if (response.data?.data) response.data.data = mapToFrontendItem(response.data.data);
    return response.data;
  },
  createKadarAir: async (data: any) => {
    const response = await api.post<ApiResponse<any>>(API_URL, mapToBackendPayload(data));
    return response.data;
  },
  updateKadarAir: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`${API_URL}/${id}`, mapToBackendPayload(data));
    return response.data;
  },
  deleteKadarAir: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`${API_URL}/${id}`);
    return response.data;
  }
};
