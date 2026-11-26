"use client";

import React, { useEffect, useState } from "react";
import { getTokenPayload, stopImpersonation, TokenPayload } from "@/app/lib/auth";
import { authService } from "@/app/services/authService";

/** Halaman tujuan setelah kembali ke akun superadmin. */
const RETURN_PATH = "/qc/penguji";

/** Penanda jelas bahwa superadmin sedang "login sebagai" user lain, beserta tombol kembali. */
export default function ImpersonationBanner() {
  const [session, setSession] = useState<TokenPayload | null>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const payload = getTokenPayload();
    setSession(payload?.impersonatedBy ? payload : null);
  }, []);

  if (!session?.impersonatedBy) return null;

  const handleReturn = async () => {
    setLeaving(true);
    try {
      await authService.stopImpersonation(); // dicatat di audit trail
    } catch {
      // Tetap kembali walau pencatatan gagal (mis. token sudah kedaluwarsa).
    }
    // Muat ulang penuh agar seluruh state & cache dibangun ulang dengan token superadmin.
    window.location.href = stopImpersonation() ? RETURN_PATH : "/";
  };

  return (
    <div className="mt-4 mb-2 px-4 py-2.5 rounded-lg bg-amber-500 text-white flex flex-wrap items-center justify-between gap-2 shadow-sm" role="status">
      <p className="text-sm mb-0 flex items-center gap-2">
        <i className="ri-user-shared-line text-lg"></i>
        Anda sedang login sebagai <strong>{session.username}</strong>
        <span className="opacity-80">(oleh {session.impersonatedBy.username})</span>
      </p>
      <button
        type="button"
        onClick={handleReturn}
        disabled={leaving}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-white text-amber-700 text-xs font-semibold hover:bg-amber-50 disabled:opacity-60"
      >
        <i className={leaving ? "ri-loader-4-line animate-spin" : "ri-arrow-go-back-line"}></i>
        Kembali ke {session.impersonatedBy.username}
      </button>
    </div>
  );
}
