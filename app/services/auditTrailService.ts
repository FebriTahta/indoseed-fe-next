import axiosInstance from '@/app/lib/axios';
import { cleanParams } from '@/app/services/permintaanPengujianService';
import { PaginatedResponse } from '@/app/types/qc';
import { AuditFilters, AuditLog, AuditOptions, AuditSummary } from '@/app/types/auditTrail';

type ApiData<T> = { success: boolean; data: T };
type AuditListParams = Partial<AuditFilters> & { page?: number; pageSize?: number };

const BASE_URL = '/audit-trail';

/** Ambil nama file dari header Content-Disposition, fallback ke nama default. */
const fileNameFrom = (disposition: string | undefined, fallback: string) =>
  disposition?.match(/filename="?([^";]+)"?/)?.[1] || fallback;

export const auditTrailService = {
  getList: async (params: AuditListParams) =>
    (await axiosInstance.get<PaginatedResponse<AuditLog>>(BASE_URL, { params: cleanParams(params) })).data,

  getSummary: async () => (await axiosInstance.get<ApiData<AuditSummary>>(`${BASE_URL}/summary`)).data,

  getOptions: async () => (await axiosInstance.get<ApiData<AuditOptions>>(`${BASE_URL}/options`)).data,

  getById: async (id: string) => (await axiosInstance.get<ApiData<AuditLog>>(`${BASE_URL}/${id}`)).data,

  /** Unduh CSV sesuai filter aktif. */
  exportCsv: async (filters: Partial<AuditFilters>) => {
    const res = await axiosInstance.get<Blob>(`${BASE_URL}/export`, { params: cleanParams(filters), responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileNameFrom(res.headers['content-disposition'], 'audit-trail.csv');
    link.click();
    URL.revokeObjectURL(url);
  },
};
