"use client";

import React, { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { buttonClass, ButtonVariant } from "./buttonStyles";

export type ConfirmTone = "danger" | "warning" | "success" | "info";

const TONE: Record<ConfirmTone, { icon: string; iconWrap: string; accent: string; button: ButtonVariant }> = {
  danger: { icon: "ri-delete-bin-6-line", iconWrap: "bg-rose-50 text-rose-600 ring-rose-100", accent: "bg-rose-500", button: "dangerSolid" },
  warning: { icon: "ri-error-warning-line", iconWrap: "bg-amber-50 text-amber-600 ring-amber-100", accent: "bg-amber-500", button: "warningSolid" },
  success: { icon: "ri-checkbox-circle-line", iconWrap: "bg-emerald-50 text-emerald-600 ring-emerald-100", accent: "bg-emerald-500", button: "primary" },
  info: { icon: "ri-question-line", iconWrap: "bg-sky-50 text-sky-600 ring-sky-100", accent: "bg-sky-500", button: "primary" },
};

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message?: React.ReactNode;
  /** Ringkasan objek yang dikonfirmasi (mis. nomor dokumen), tampil dalam kotak abu-abu. */
  details?: React.ReactNode;
  /** Konten tambahan, mis. isian catatan / alasan. */
  children?: React.ReactNode;
  tone?: ConfirmTone;
  /** Ganti ikon bawaan tone (kelas Remix Icon). */
  icon?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  /** Dipanggil saat tombol konfirmasi ditekan / form disubmit (Enter). */
  onConfirm: () => void;
  onCancel: () => void;
}

/** Modal konfirmasi standar aplikasi: ikon bertone, judul, pesan, detail, dan dua tombol aksi. */
export function ConfirmDialog({
  open,
  title,
  message,
  details,
  children,
  tone = "info",
  icon,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const style = TONE[tone];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !loading && onCancel();
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, loading, onCancel]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={loading ? undefined : onCancel} aria-hidden="true" />

      <form
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onSubmit={(e) => {
          e.preventDefault();
          if (!loading) onConfirm();
        }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-down"
      >
        <span className={`absolute inset-x-0 top-0 h-1 ${style.accent}`} aria-hidden="true" />

        <div className="px-6 pt-7 pb-5">
          <div className="flex items-start gap-4">
            <span className={`w-12 h-12 shrink-0 rounded-full ring-8 flex items-center justify-center text-2xl ${style.iconWrap}`}>
              <i className={icon || style.icon}></i>
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <h3 id={titleId} className="text-base font-semibold text-gray-900 leading-snug">
                {title}
              </h3>
              {message && <div className="mt-1.5 text-[13px] leading-relaxed text-gray-600">{message}</div>}
            </div>
          </div>

          {details && (
            <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-700">{details}</div>
          )}
          {children && <div className="mt-4">{children}</div>}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-6 py-4 bg-gray-50/80 border-t border-gray-100">
          <button type="button" onClick={onCancel} disabled={loading} className={buttonClass("secondary", "md", "sm:min-w-[96px]")}>
            {cancelText}
          </button>
          <button type="submit" disabled={loading} autoFocus={!children} className={buttonClass(style.button, "md", "sm:min-w-[120px]")}>
            {loading && <i className="ri-loader-4-line animate-spin"></i>}
            {confirmText}
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}

// ---------- Konfirmasi berbasis Promise ----------

export type ConfirmOptions = Omit<ConfirmDialogProps, "open" | "loading" | "onConfirm" | "onCancel" | "children">;

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/** Menyediakan `useConfirm()` untuk seluruh halaman di bawahnya. */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    resolver.current?.(false); // tutup konfirmasi sebelumnya bila masih terbuka
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = useCallback((value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setOptions(null);
  }, []);

  const handleCancel = useCallback(() => close(false), [close]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog {...(options ?? { title: "" })} open={options !== null} onConfirm={() => close(true)} onCancel={handleCancel} />
    </ConfirmContext.Provider>
  );
}

/**
 * Pengganti `window.confirm` yang mengikuti desain aplikasi.
 * @example if (!(await confirm({ title: "Hapus data?", tone: "danger" }))) return;
 */
export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm harus dipakai di dalam <ConfirmProvider>");
  return ctx;
}
