import os

services = [
    {
        "file": "app/services/qcDayaTumbuhService.ts",
        "name": "qcDayaTumbuhService",
        "jenisUji": "Daya Tumbuh",
        "methodIdKey": "metodeUji",
        "methods": {
            "get": "getDayaTumbuh",
            "getById": "getDayaTumbuhById",
            "create": "createDayaTumbuh",
            "update": "updateDayaTumbuh",
            "delete": "deleteDayaTumbuh"
        },
        "payloadMapper": """
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
    jenisUji: 'Daya Tumbuh',
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
"""
    },
    {
        "file": "app/services/qcKadarAirService.ts",
        "name": "qcKadarAirService",
        "jenisUji": "Kadar Air",
        "methods": {
            "get": "getKadarAir",
            "getById": "getKadarAirById",
            "create": "createKadarAir",
            "update": "updateKadarAir",
            "delete": "deleteKadarAir"
        },
        "payloadMapper": """
function mapToBackendPayload(data: any) {
  const {
    kodeBatch, commodityId, varietyId, testMethodId, lotNumber, tanggalUji, lokasiLab, petugasUji, jumlahSampel,
    lampiranUrl, kadarAir, batasMaksimal, status, alat, suhuUji, waktuPengeringan, ulangan, beratAwal, beratAkhir, catatan, parameterUji, ...rest
  } = data;

  return {
    kodeBatch, commodityId, varietyId, tanggalUji, petugasUji, jumlahSampel, lampiranUrl, catatan, lokasiLab,
    testMethodId: testMethodId,
    jenisUji: 'Kadar Air',
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
"""
    },
    {
        "file": "app/services/qcKemurnianService.ts",
        "name": "qcKemurnianService",
        "jenisUji": "Kemurnian",
        "methods": {
            "get": "getQcKemurnianList",
            "getById": "getQcKemurnianById",
            "create": "createQcKemurnian",
            "update": "updateQcKemurnian",
            "delete": "deleteQcKemurnian"
        },
        "payloadMapper": """
function mapToBackendPayload(data: any) {
  const {
    kodeBatch, commodityId, varietyId, metodeUji, lotNoBenih, tanggalUji, lokasiLab, petugasUji, jumlahSampel,
    kemurnian, batasMinimal, status, beratBenihMurni, beratTanamanLain, beratGulma, beratBahanAsing, alatInstrumen, waktuPengujian, suhuRuangan, beratAwalSampel, ulangan, catatan, lampiranUrl, ...rest
  } = data;

  return {
    kodeBatch, commodityId, varietyId, tanggalUji, petugasUji, jumlahSampel, lampiranUrl, catatan, lokasiLab,
    testMethodId: metodeUji,
    jenisUji: 'Kemurnian',
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
    metodeUji: item.testMethod?.nama || item.testMethodId,
    kemurnian: item.nilaiHasil,
    batasMinimal: item.batasAcuan,
    ...(item.detailUji || {})
  };
}
"""
    },
    {
        "file": "app/services/qcVigorService.ts",
        "name": "qcVigorService",
        "jenisUji": "Vigor",
        "methods": {
            "get": "getQcVigorList",
            "getById": "getQcVigorById",
            "create": "createQcVigor",
            "update": "updateQcVigor",
            "delete": "deleteQcVigor"
        },
        "payloadMapper": """
function mapToBackendPayload(data: any) {
  const {
    kodeBatch, commodityId, varietyId, metodeUji, lotNoBenih, tanggalUji, lokasiLab, petugasUji, jumlahSampel,
    vigor, kategori, batasMinimal, status, alatInstrumen, waktuPengujian, suhuRuangan, catatan, lampiranUrl, parameterUji, ...rest
  } = data;

  return {
    kodeBatch, commodityId, varietyId, tanggalUji, petugasUji, jumlahSampel, lampiranUrl, catatan, lokasiLab,
    testMethodId: metodeUji,
    jenisUji: 'Vigor',
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
"""
    }
]

template = """import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';

const API_URL = '/qc/tests';
const JENIS_UJI = '{jenisUji}';
{payloadMapper}
export const {name} = {{
  {get}: async (params?: any) => {{
    const response = await api.get<ApiResponse<any[]>>(API_URL, {{ params: {{ ...params, jenisUji: JENIS_UJI }} }});
    if (response.data?.data) {{
      response.data.data = response.data.data.map(mapToFrontendItem);
    }} else if (Array.isArray(response.data)) {{
      response.data = response.data.map(mapToFrontendItem) as any;
    }}
    return response.data;
  }},
  {getById}: async (id: string) => {{
    const response = await api.get<ApiResponse<any>>(`${{API_URL}}/${{id}}`);
    if (response.data?.data) response.data.data = mapToFrontendItem(response.data.data);
    return response.data;
  }},
  {create}: async (data: any) => {{
    const response = await api.post<ApiResponse<any>>(API_URL, mapToBackendPayload(data));
    return response.data;
  }},
  {update}: async (id: string, data: any) => {{
    const response = await api.put<ApiResponse<any>>(`${{API_URL}}/${{id}}`, mapToBackendPayload(data));
    return response.data;
  }},
  {delete}: async (id: string) => {{
    const response = await api.delete<ApiResponse<any>>(`${{API_URL}}/${{id}}`);
    return response.data;
  }}
}};
"""

for s in services:
    content = template.format(
        jenisUji=s["jenisUji"],
        payloadMapper=s["payloadMapper"],
        name=s["name"],
        get=s["methods"]["get"],
        getById=s["methods"]["getById"],
        create=s["methods"]["create"],
        update=s["methods"]["update"],
        delete=s["methods"]["delete"]
    )
    with open(s["file"], "w") as f:
        f.write(content)

