import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';

const API_URL = '/qc/tests';
const JENIS_UJI = 'Kemurnian';

function mapToBackendPayload(data: any) {
  const {
    kodeBatch, commodityId, varietyId, testMethodId, lotNoBenih, tanggalUji, lokasiLab, petugasUjiId, jumlahSampel,
    lampiranUrl, lampiranUrls, kemurnian, batasMinimal, status, beratBenihMurni, beratTanamanLain, beratGulma, beratBahanAsing, alatInstrumen, waktuPengujian, suhuRuangan, beratAwalSampel, ulangan, catatanTambahan, parameterUji, ...rest
  } = data;

  return {
    kodeBatch, commodityId, varietyId, tanggalUji, petugasUjiId, jumlahSampel, lampiranUrl, lampiranUrls, lokasiLab,
    testMethodId: testMethodId,
    jenisUji: JENIS_UJI,
    nilaiHasil: kemurnian,
    batasAcuan: batasMinimal,
    status: status || 'Sedang Diuji',
    detailUji: {
      lotNoBenih, beratBenihMurni, beratTanamanLain, beratGulma, beratBahanAsing, alatInstrumen, waktuPengujian, suhuRuangan, beratAwalSampel, ulangan, ...rest
    }
  };
}

function mapToFrontendItem(item: any) {
  return {
    ...item,
    kemurnian: item.nilaiHasil,
    batasMinimal: item.batasAcuan,
    ...(item.detailUji || {})
  };
}

export const qcKemurnianService = {
  getQcKemurnianList: async (params?: any) => {
    const response = await api.get<ApiResponse<any[]>>(API_URL, { params: { ...params, jenisUji: JENIS_UJI } });
    if (response.data?.data) {
      response.data.data = response.data.data.map(mapToFrontendItem);
    } else if (Array.isArray(response.data)) {
      response.data = response.data.map(mapToFrontendItem) as any;
    }
    return response.data;
  },
  getQcKemurnianById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`${API_URL}/${id}`);
    if (response.data?.data) response.data.data = mapToFrontendItem(response.data.data);
    return response.data;
  },
  createQcKemurnian: async (data: any) => {
    const response = await api.post<ApiResponse<any>>(API_URL, mapToBackendPayload(data));
    return response.data;
  },
  updateQcKemurnian: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`${API_URL}/${id}`, mapToBackendPayload(data));
    return response.data;
  },
  deleteQcKemurnian: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`${API_URL}/${id}`);
    return response.data;
  }
};
