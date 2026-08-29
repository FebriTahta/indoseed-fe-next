import api from '@/app/lib/axios';

export const pengujiService = {
  getPengujis: async (params?: any) => {
    try {
      const response = await api.get('/qc/penguji', { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching penguji:", error);
      throw error;
    }
  },

  getPengujiById: async (id: string) => {
    try {
      const response = await api.get(`/qc/penguji/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching penguji ${id}:`, error);
      throw error;
    }
  }
};
