import { useEffect, useMemo, useState } from 'react';
import { getTokenPayload, getUserRoles, TokenPayload } from '@/app/lib/auth';
import { hasAnyRole, PENGUJI_MANAGER_ROLES, REVIEWER_ROLES, ROLES } from '@/app/lib/roles';
import { authService, CurrentUser } from '@/app/services/authService';

/** Cache profil per token agar banyak komponen tidak memanggil /auth/me berulang. */
let profileCache: { token: string; promise: Promise<CurrentUser | null> } | null = null;

const loadProfile = () => {
  const token = typeof window === 'undefined' ? null : localStorage.getItem('token');
  if (!token) return Promise.resolve(null);
  if (profileCache?.token !== token) {
    profileCache = {
      token,
      promise: authService
        .me()
        .then((res) => res.data)
        .catch(() => null),
    };
  }
  return profileCache.promise;
};

/**
 * User yang sedang login. Role & izin dibaca langsung dari token (sinkron setelah mount),
 * profil lengkap (mis. data penguji) dimuat dari /auth/me.
 */
export function useCurrentUser() {
  const [payload, setPayload] = useState<TokenPayload | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [profile, setProfile] = useState<CurrentUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    setPayload(getTokenPayload());
    setRoles(getUserRoles());
    setReady(true);
    loadProfile().then((p) => active && setProfile(p));
    return () => {
      active = false;
    };
  }, []);

  return useMemo(
    () => ({
      ready,
      roles,
      profile,
      username: payload?.username,
      impersonatedBy: payload?.impersonatedBy ?? null,
      isSuperadmin: roles.includes(ROLES.SUPERADMIN),
      isPenguji: roles.includes(ROLES.PENGUJI) && !hasAnyRole(roles, REVIEWER_ROLES),
      canReview: hasAnyRole(roles, REVIEWER_ROLES),
      canManagePenguji: hasAnyRole(roles, PENGUJI_MANAGER_ROLES),
    }),
    [ready, roles, profile, payload]
  );
}
