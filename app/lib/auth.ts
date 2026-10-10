/** Payload JWT login (lihat auth.controller di backend). */
export interface TokenPayload {
  userId?: string;
  username?: string;
  roles?: (string | { name: string })[];
}

/** Membaca payload JWT dari localStorage tanpa verifikasi (verifikasi tetap di server). */
export const getTokenPayload = (): TokenPayload | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

/** Daftar nama role user yang sedang login. */
export const getUserRoles = (): string[] =>
  (getTokenPayload()?.roles || []).map((r) => (typeof r === 'string' ? r : r.name)).filter(Boolean);
