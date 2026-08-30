import axiosInstance from '@/app/lib/axios';

const BASE_URL = '/qc/penguji';

export const pengujiService = {
  getLaboratoriums: async () => {
    const response = await axiosInstance.get('/qc/laboratoriums');
    return response.data;
  },

  getTestMethods: async () => {
    const response = await axiosInstance.get('/qc/methods');
    return response.data;
  },

  getPenguji: async (params?: any) => {
    const response = await axiosInstance.get(BASE_URL, { params });
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/stats`);
    return response.data;
  },

  getPengujiById: async (id: string) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  createPenguji: async (data: any) => {
    const response = await axiosInstance.post(BASE_URL, data);
    return response.data;
  },

  updatePenguji: async (id: string, data: any) => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  deletePenguji: async (id: string) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return response.data;
  }
};
