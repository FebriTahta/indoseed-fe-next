import axiosInstance from '@/app/lib/axios';

type ApiData<T> = { success: boolean; data: T };

export interface CurrentUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
  penguji: {
    id: string;
    kodePenguji: string;
    nama: string;
    foto?: string | null;
    status: string;
    laboratoriumId?: string | null;
    laboratorium?: { namaLaboratorium: string } | null;
  } | null;
  impersonatedBy: { userId: string; username: string } | null;
}

export const authService = {
  me: async () => (await axiosInstance.get<ApiData<CurrentUser>>('/auth/me')).data,

  /** Superadmin: terbitkan token untuk masuk sebagai user lain. */
  impersonate: async (userId: string) =>
    (await axiosInstance.post<ApiData<{ token: string; user: { id: string; username: string; roles: string[] } }>>(`/auth/impersonate/${userId}`)).data,

  /** Catat akhir sesi "login sebagai" (dipanggil dengan token user target). */
  stopImpersonation: async () => (await axiosInstance.post('/auth/impersonate/stop')).data,
};
