import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';

export const uploadService = {
  uploadFile: async (file: File, folder: string = 'uploads') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await api.post<ApiResponse<{ fileUrl: string }>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};

export default uploadService;
