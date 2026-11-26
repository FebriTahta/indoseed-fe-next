/** Padanan `constants/roles.constants.ts` di backend. */
export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  QC_SUPERVISOR: 'qc_supervisor',
  PENGUJI: 'penguji',
} as const;

export const PENGUJI_MANAGER_ROLES: string[] = [ROLES.SUPERADMIN, ROLES.ADMIN];
export const REVIEWER_ROLES: string[] = [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.QC_SUPERVISOR];

const ROLE_LABEL: Record<string, string> = {
  [ROLES.SUPERADMIN]: 'Superadmin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.QC_SUPERVISOR]: 'QC Supervisor',
  [ROLES.PENGUJI]: 'Penguji',
};

/** Nama role yang ramah dibaca, mis. "qc_supervisor" → "QC Supervisor". */
export const roleLabel = (role?: string | null) =>
  role ? ROLE_LABEL[role] || role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '';

export const hasAnyRole = (roles: string[], allowed: string[]) => roles.some((r) => allowed.includes(r));
