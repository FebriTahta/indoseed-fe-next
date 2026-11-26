import axiosInstance from '@/app/lib/axios';
import { cleanParams } from '@/app/services/permintaanPengujianService';
import {
  HasilSummary,
  PaginatedResponse,
  PemeriksaanSummary,
  PermintaanPengujian,
  PermintaanPengujianDokumen,
  QcListParams,
  RincianHasil,
} from '@/app/types/qc';

type ApiData<T> = { success: boolean; data: T; message?: string };

export interface TerimaSampelPayload {
  /** Diabaikan backend: petugas selalu penguji yang login. */
  petugasQcId?: string;
  laboratoriumId?: string | null;
  tanggalSampling: string;
  kondisiSampel: string;
  catatan?: string | null;
}

export interface HasilParameterPayload {
  id: string;
  nilaiHasil: number | null;
  hasilTeks?: string | null;
  statusHasil?: string | null;
  catatanHasil?: string | null;
  rincianHasil?: RincianHasil | null;
}

export interface SimpanHasilPayload {
  parameters: HasilParameterPayload[];
  catatanPengujian?: string | null;
}

const PEMERIKSAAN_URL = '/qc/pemeriksaan';
const HASIL_URL = '/qc/hasil';

export const pemeriksaanPengujianService = {
  getList: async (params?: QcListParams) =>
    (await axiosInstance.get<PaginatedResponse<PermintaanPengujian>>(PEMERIKSAAN_URL, { params: cleanParams(params) })).data,

  getSummary: async () => (await axiosInstance.get<ApiData<PemeriksaanSummary>>(`${PEMERIKSAAN_URL}/summary`)).data,

  getById: async (id: string) =>
    (await axiosInstance.get<ApiData<PermintaanPengujian>>(`${PEMERIKSAAN_URL}/${id}`)).data,

  terimaSampel: async (id: string, payload: TerimaSampelPayload) =>
    (await axiosInstance.post<ApiData<PermintaanPengujian>>(`${PEMERIKSAAN_URL}/${id}/terima-sampel`, payload)).data,

  simpanHasil: async (id: string, payload: SimpanHasilPayload) =>
    (await axiosInstance.put<ApiData<PermintaanPengujian>>(`${PEMERIKSAAN_URL}/${id}/hasil`, payload)).data,

  submitReview: async (id: string) =>
    (await axiosInstance.post<ApiData<PermintaanPengujian>>(`${PEMERIKSAAN_URL}/${id}/submit-review`)).data,

  review: async (id: string, keputusan: 'setujui' | 'revisi', catatan?: string) =>
    (await axiosInstance.post<ApiData<PermintaanPengujian>>(`${PEMERIKSAAN_URL}/${id}/review`, { keputusan, catatan })).data,

  /** Hasil tidak valid (ada parameter belum diuji) → kembali ke Dalam Pengujian. */
  ujiUlang: async (id: string, alasan: string) =>
    (await axiosInstance.post<ApiData<PermintaanPengujian>>(`${PEMERIKSAAN_URL}/${id}/uji-ulang`, { alasan })).data,

  uploadDokumentasi: async (id: string, file: File, keterangan?: string) => {
    const form = new FormData();
    form.append('file', file);
    if (keterangan) form.append('keterangan', keterangan);
    return (await axiosInstance.post<ApiData<PermintaanPengujianDokumen>>(`${PEMERIKSAAN_URL}/${id}/dokumentasi`, form)).data;
  },

  deleteDokumentasi: async (id: string, dokumenId: string) =>
    (await axiosInstance.delete<ApiData<null>>(`${PEMERIKSAAN_URL}/${id}/dokumentasi/${dokumenId}`)).data,

  // ---------- Hasil Pengujian ----------
  getHasilList: async (params?: QcListParams) =>
    (await axiosInstance.get<PaginatedResponse<PermintaanPengujian>>(HASIL_URL, { params: cleanParams(params) })).data,

  getHasilSummary: async () => (await axiosInstance.get<ApiData<HasilSummary>>(`${HASIL_URL}/summary`)).data,
};
