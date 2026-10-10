import React, { useMemo } from 'react';
import { iconButtonClass } from '@/app/(components)/(content-layout)/shared/buttonStyles';
import { formatDateTime } from '@/app/lib/format';
import { useImageLightbox } from './QcImageLightbox';
import { fileIconClass, isImageFile } from './fileUtils';
import { useFileDownload } from '@/app/hooks/useFileDownload';

export interface QcDocumentItem {
  id?: string;
  namaFile: string;
  fileUrl: string;
  tipeFile?: string | null;
  ukuran?: string | null;
  keterangan?: string | null;
  diunggahOleh?: string | null;
  createdAt?: string | Date;
}

/** Dipertahankan untuk kompatibilitas impor lama. */
export const isImageDoc = (doc: QcDocumentItem) => isImageFile(doc);

interface QcDocumentListProps {
  documents: QcDocumentItem[];
  emptyMessage?: string;
  onDelete?: (doc: QcDocumentItem) => void;
  /** grid = kartu dengan preview gambar, list = baris ringkas. */
  variant?: 'list' | 'grid';
}

export default function QcDocumentList({
  documents,
  emptyMessage = 'Belum ada dokumen.',
  onDelete,
  variant = 'list',
}: QcDocumentListProps) {
  const images = useMemo(() => documents.filter(isImageDoc), [documents]);
  const { open: openPreview, lightbox } = useImageLightbox(images);
  const { download, open: openFile, pendingUrl } = useFileDownload();

  if (!documents.length) return <p className="text-xs text-gray-400 italic">{emptyMessage}</p>;

  /**
   * Gambar dibuka di lightbox; file lain dibuka di tab baru lewat server (keberadaan file dicek
   * lebih dulu sehingga file yang hilang dari penyimpanan menampilkan pesan yang jelas).
   */
  const docLink = (doc: QcDocumentItem, className: string, children: React.ReactNode) => (
    <button
      type="button"
      onClick={() => (isImageDoc(doc) ? openPreview(doc.fileUrl) : openFile(doc.fileUrl, doc.namaFile))}
      className={`text-left ${className}`}
      title={isImageDoc(doc) ? 'Lihat pratinjau' : 'Buka dokumen'}
    >
      {children}
    </button>
  );

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {documents.map((doc) => (
          <div key={doc.id || doc.fileUrl} className="relative group border border-gray-200 rounded-lg overflow-hidden">
            {docLink(
              doc,
              "block w-full",
              <>
              <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                {isImageDoc(doc) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={doc.fileUrl} alt={doc.keterangan || doc.namaFile} className="w-full h-full object-cover" />
                ) : (
                  <i className={`${fileIconClass(doc)} text-3xl`}></i>
                )}
              </div>
              <div className="p-2">
                <p className="text-[11px] font-medium text-gray-800 truncate" title={doc.namaFile}>
                  {doc.keterangan || doc.namaFile}
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  {formatDateTime(doc.createdAt)} {doc.diunggahOleh ? `• ${doc.diunggahOleh}` : ''}
                </p>
              </div>
              </>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(doc)}
                className={iconButtonClass("gray", "absolute top-1.5 right-1.5 !w-6 !h-6 shadow-sm hover:!text-rose-600")}
                title="Hapus dokumentasi"
              >
                <i className="ri-close-line text-sm"></i>
              </button>
            )}
          </div>
        ))}
        {lightbox}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-50">
      {documents.map((doc) => (
        <li key={doc.id || doc.fileUrl} className="flex items-start justify-between gap-2 py-2">
          <div className="flex items-start gap-2 min-w-0">
            <i className={`${fileIconClass(doc)} text-lg mt-0.5`}></i>
            <div className="min-w-0">
              {docLink(doc, "block max-w-full text-xs font-medium text-gray-800 truncate hover:text-emerald-700", doc.namaFile)}
              <p className="text-[10px] text-gray-400">{[doc.ukuran, doc.keterangan].filter(Boolean).join(' • ') || '-'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => download(doc.fileUrl, doc.namaFile)}
              disabled={pendingUrl === doc.fileUrl}
              className={iconButtonClass("emerald")}
              title="Unduh"
              aria-label={`Unduh ${doc.namaFile}`}
            >
              <i className={pendingUrl === doc.fileUrl ? "ri-loader-4-line animate-spin" : "ri-download-2-line"}></i>
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(doc)}
                className={iconButtonClass("rose")}
                title="Hapus"
              >
                <i className="ri-delete-bin-line"></i>
              </button>
            )}
          </div>
        </li>
      ))}
      {lightbox}
    </ul>
  );
}
