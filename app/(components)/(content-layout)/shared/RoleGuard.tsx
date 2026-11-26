"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { canAccessPath, getHomePath } from "@/shared/layouts-components/sidebar/nav";
import { getUserRoles } from "@/app/lib/auth";

/**
 * Cegah user ber-role terbatas membuka halaman di luar aksesnya lewat URL langsung.
 * Ini hanya lapisan UX — otorisasi sebenarnya tetap ditegakkan di backend.
 */
export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const roles = getUserRoles();
    if (canAccessPath(pathname, roles)) {
      setAllowed(true);
    } else {
      setAllowed(false);
      router.replace(getHomePath(roles));
    }
  }, [pathname, router]);

  return allowed ? <>{children}</> : null;
}
