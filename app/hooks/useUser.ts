import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import userService from '@/app/services/userService';
import { UserData } from '@/app/types/user';

export function useUser() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await userService.getUsers();
      if (result.success || result.status === 'success') {
        setUsers(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch user data');
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Unauthorized access');
        router.push('/');
        return;
      }
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        let currentUserRole = '';
        if (token) {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const payload = JSON.parse(jsonPayload);
            const firstRole = payload.roles && payload.roles.length > 0 ? payload.roles[0] : null;
            currentUserRole = payload.role || payload.activeRole?.name || (firstRole ? (typeof firstRole === 'object' ? firstRole.name : firstRole) : "");
          } catch (e) {
            console.error("Could not parse token", e);
          }
        }

        if (!token || (currentUserRole !== 'superadmin' && currentUserRole !== 'admin')) {
          setError('Unauthorized access');
          router.push('/');
          return;
        }

        await fetchUsers();
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [router, fetchUsers]);

  const handleAdd = () => {
    console.log("Add user clicked");
  };

  const handleEdit = (id: string) => {
    console.log("Edit user", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete user", id);
  };

  return {
    users,
    loading,
    error,
    handleAdd,
    handleEdit,
    handleDelete,
  };
}
export default useUser;
