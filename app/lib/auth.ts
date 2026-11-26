/** Payload JWT login (lihat auth.controller di backend). */
export interface TokenPayload {
  userId?: string;
  username?: string;
  roles?: (string | { name: string })[];
  /** Ada bila sesi ini hasil "login sebagai" oleh superadmin. */
  impersonatedBy?: { userId: string; username: string };
  exp?: number;
}

const TOKEN_KEY = 'token';
/** Token superadmin asli yang disimpan selama sesi "login sebagai". */
const IMPERSONATOR_TOKEN_KEY = 'impersonatorToken';

/** Membaca payload JWT dari localStorage tanpa verifikasi (verifikasi tetap di server). */
export const getTokenPayload = (): TokenPayload | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(TOKEN_KEY);
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

/** Mulai sesi "login sebagai": simpan token superadmin, lalu pakai token user target. */
export const startImpersonation = (targetToken: string) => {
  const current = localStorage.getItem(TOKEN_KEY);
  if (current && !localStorage.getItem(IMPERSONATOR_TOKEN_KEY)) localStorage.setItem(IMPERSONATOR_TOKEN_KEY, current);
  localStorage.setItem(TOKEN_KEY, targetToken);
};

/** Akhiri sesi "login sebagai" dan pulihkan token superadmin. Mengembalikan false bila tidak ada sesi. */
export const stopImpersonation = () => {
  const original = localStorage.getItem(IMPERSONATOR_TOKEN_KEY);
  localStorage.removeItem(IMPERSONATOR_TOKEN_KEY);
  if (!original) return false;
  localStorage.setItem(TOKEN_KEY, original);
  return true;
};

/** Bersihkan seluruh sesi (logout). */
export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(IMPERSONATOR_TOKEN_KEY);
};
