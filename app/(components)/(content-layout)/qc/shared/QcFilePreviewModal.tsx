"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { buttonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import { fileExt, fileIconClass, isImageFile, isInlinePreviewable } from "./fileUtils";
import { useFileDownload } from "@/app/hooks/useFileDownload";

export interface PreviewFile {
  namaFile: string;
  fileUrl: string;
  tipeFile?: string | null;
  ukuran?: string | null;
}

interface QcFilePreviewModalProps {
  /** Berkas yang dipratinjau; `null` = modal tertutup. */
  file: PreviewFile | null;
  onClose: () => void;
}

const headerButton =
  "w-9 h-9 inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors";

/** Pratinjau berkas layar penuh: gambar & PDF/TXT tampil langsung, tipe lain ditawarkan untuk dibuka/diunduh. */
export default function QcFilePreviewModal({ file, onClose }: QcFilePreviewModalProps) {
  const { download, pendingUrl } = useFileDownload();
  useEffect(() => {
    if (!file) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [file, onClose]);

  if (!file || typeof document === "undefined") return null;

  const renderBody = () => {
    if (isImageFile(file)) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={file.fileUrl} alt={file.namaFile} className="max-h-full max-w-full object-contain rounded-md shadow-2xl" />
      );
    }
    if (isInlinePreviewable(file)) {
      return <iframe src={file.fileUrl} title={file.namaFile} className="w-full h-full max-w-5xl bg-white rounded-md shadow-2xl" />;
    }
    return (
      <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-2xl">
        <i className={`${fileIconClass(file)} text-5xl`}></i>
        <p className="text-sm font-semibold text-gray-800 mt-3 break-all">{file.namaFile}</p>
        <p className="text-xs text-gray-500 mt-1 mb-4">
          Pratinjau untuk berkas .{fileExt(file) || "ini"} tidak tersedia di browser. Silakan buka atau unduh berkas.
        </p>
        <button
          type="button"
          onClick={() => download(file.fileUrl, file.namaFile)}
          disabled={pendingUrl === file.fileUrl}
          className={buttonClass("primary", "md", "w-full")}
        >
          <i className={pendingUrl === file.fileUrl ? "ri-loader-4-line animate-spin" : "ri-download-2-line"}></i> Unduh
        </button>
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] bg-black/85 flex flex-col" role="dialog" aria-modal="true" aria-label="Pratinjau berkas" onClick={onClose}>
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white" onClick={(e) => e.stopPropagation()}>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{file.namaFile}</p>
          <p className="text-[11px] text-white/60 truncate">
            {[fileExt(file).toUpperCase(), file.ukuran].filter(Boolean).join(" • ")}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button type="button" onClick={() => download(file.fileUrl, file.namaFile)} disabled={pendingUrl === file.fileUrl} title="Unduh" className={headerButton}>
            <i className={`${pendingUrl === file.fileUrl ? "ri-loader-4-line animate-spin" : "ri-download-2-line"} text-lg`}></i>
          </button>
          <button type="button" onClick={onClose} title="Tutup (Esc)" className={headerButton}>
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-14 pb-6 min-h-0">
        {/* `contents` agar ukuran konten mengikuti container, klik di luar konten tetap menutup modal. */}
        <div className="contents" onClick={(e) => e.stopPropagation()}>
          {renderBody()}
        </div>
      </div>
    </div>,
    document.body
  );
}
