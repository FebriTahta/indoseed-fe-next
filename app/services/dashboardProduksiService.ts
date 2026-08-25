import api from '@/app/lib/axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const dashboardProduksiService = {
  getDashboardProduksiData: async (startDate?: string, endDate?: string) => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get(`${baseUrl}/produksi/dashboard`, { params });
    return response.data;
  },
};
