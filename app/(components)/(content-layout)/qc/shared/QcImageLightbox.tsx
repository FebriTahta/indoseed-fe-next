"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { formatDateTime } from "@/app/lib/format";
import { useFileDownload } from "@/app/hooks/useFileDownload";

export interface LightboxImage {
  id?: string;
  fileUrl: string;
  namaFile: string;
  keterangan?: string | null;
  diunggahOleh?: string | null;
  createdAt?: string | Date;
}

interface QcImageLightboxProps {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

/** Pratinjau gambar layar penuh dengan navigasi (← →) dan tombol unduh. */
export default function QcImageLightbox({ images, index, onClose, onIndexChange }: QcImageLightboxProps) {
  const open = index !== null && !!images[index];
  const { download, pendingUrl } = useFileDownload();
  const go = useCallback(
    (delta: number) => {
      if (index === null || images.length < 2) return;
      onIndexChange((index + delta + images.length) % images.length);
    },
    [index, images.length, onIndexChange]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, go, onClose]);

  if (!open || typeof document === "undefined") return null;
  const img = images[index!];

  return createPortal(
    <div className="fixed inset-0 z-[10000] bg-black/85 flex flex-col" role="dialog" aria-modal="true" aria-label="Pratinjau gambar" onClick={onClose}>
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white" onClick={(e) => e.stopPropagation()}>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{img.keterangan || img.namaFile}</p>
          <p className="text-[11px] text-white/60 truncate">
            {img.namaFile} • {formatDateTime(img.createdAt)} {img.diunggahOleh ? `• ${img.diunggahOleh}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {images.length > 1 && (
            <span className="text-xs text-white/70 mr-1">
              {index! + 1} / {images.length}
            </span>
          )}
          <button
            type="button"
            onClick={() => download(img.fileUrl, img.namaFile)}
            disabled={pendingUrl === img.fileUrl}
            title="Unduh"
            className="w-9 h-9 inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <i className={`${pendingUrl === img.fileUrl ? "ri-loader-4-line animate-spin" : "ri-download-2-line"} text-lg`}></i>
          </button>
          <button type="button" onClick={onClose} title="Tutup (Esc)" className="w-9 h-9 inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors">
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-14 pb-6 min-h-0">
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            title="Sebelumnya"
            className="absolute left-3 w-9 h-9 inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <i className="ri-arrow-left-s-line text-2xl"></i>
          </button>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.fileUrl}
          alt={img.keterangan || img.namaFile}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full object-contain rounded-md shadow-2xl"
        />
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            title="Berikutnya"
            className="absolute right-3 w-9 h-9 inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <i className="ri-arrow-right-s-line text-2xl"></i>
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}

/** State lightbox: `open(url)` membuka gambar dengan URL tersebut dari daftar. */
export function useImageLightbox(images: LightboxImage[]) {
  const [index, setIndex] = useState<number | null>(null);
  const open = (fileUrl: string) => {
    const i = images.findIndex((img) => img.fileUrl === fileUrl);
    if (i >= 0) setIndex(i);
  };
  const lightbox = <QcImageLightbox images={images} index={index} onClose={() => setIndex(null)} onIndexChange={setIndex} />;
  return { open, lightbox };
}
