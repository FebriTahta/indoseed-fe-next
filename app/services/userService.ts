import api from '@/app/lib/axios';
import { ApiResponse } from '@/app/types/api';
import { UserData } from '@/app/types/user';

export const userService = {
  getUsers: async () => {
    const response = await api.get<ApiResponse<UserData[]>>('/master/user');
    return response.data;
  },
};
export default userService;
