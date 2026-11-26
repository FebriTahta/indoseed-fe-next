"use client";

import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { buttonClass, iconButtonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import QcFilePreviewModal from "../../shared/QcFilePreviewModal";
import { fileExt, fileIconClass, formatFileSize, isImageFile } from "../../shared/fileUtils";
import EditDokumenModal from "./EditDokumenModal";
import { useConfirm } from "@/app/(components)/(content-layout)/shared/ConfirmDialog";
import uploadService from "@/app/services/uploadService";
import { TestMethodDocument } from "@/app/types/qc";
import { DOKUMEN_ACCEPT, DOKUMEN_FOLDER, DOKUMEN_HINT, DOKUMEN_MAX_MB } from "./dokumenConfig";

interface DokumenTerkaitSectionProps {
  documents: TestMethodDocument[];
  onChange: React.Dispatch<React.SetStateAction<TestMethodDocument[]>>;
  isUploading: boolean;
  onUploadingChange: (uploading: boolean) => void;
}

const TH_CLASS = "py-2 px-2.5 font-semibold border-b border-defaultborder";
/** Tombol aksi baris 24px agar tiga tombol muat di kolom sempit. */
const ACTION_SIZE = "!w-6 !h-6 !text-xs";

const tempId = () => `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/** Kartu "Dokumen Terkait" pada form Metode Uji: unggah, pratinjau, edit, dan hapus berkas. */
export default function DokumenTerkaitSection({ documents, onChange, isUploading, onUploadingChange }: DokumenTerkaitSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<TestMethodDocument | null>(null);
  const [editingDoc, setEditingDoc] = useState<TestMethodDocument | null>(null);
  const confirm = useConfirm();

  const handleUpload = async (fileList: FileList) => {
    const files = Array.from(fileList);
    const tooLarge = files.filter((f) => f.size > DOKUMEN_MAX_MB * 1024 * 1024);
    if (tooLarge.length) {
      toast.error(`Melebihi ${DOKUMEN_MAX_MB} MB, dilewati: ${tooLarge.map((f) => f.name).join(", ")}`);
    }
    const valid = files.filter((f) => !tooLarge.includes(f));
    if (!valid.length) return;

    onUploadingChange(true);
    try {
      const newDocs: TestMethodDocument[] = [];
      for (const file of valid) {
        const res = await uploadService.uploadFile(file, DOKUMEN_FOLDER);
        if (res.success && res.data?.fileUrl) {
          newDocs.push({
            id: tempId(),
            namaFile: file.name,
            fileUrl: res.data.fileUrl,
            tipeFile: fileExt({ namaFile: file.name }),
            ukuran: formatFileSize(file.size),
          });
        }
      }
      onChange((prev) => [...prev, ...newDocs]);
      toast.success(`${newDocs.length} dokumen berhasil diunggah ke MinIO`);
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Gagal mengupload dokumen ke MinIO");
    } finally {
      onUploadingChange(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isUploading && e.dataTransfer.files?.length) handleUpload(e.dataTransfer.files);
  };

  const handleSaveEdit = (updated: TestMethodDocument) => {
    onChange((prev) => prev.map((d) => (d === editingDoc ? updated : d)));
    toast.success("Dokumen diperbarui");
  };

  const handleRemove = async (doc: TestMethodDocument) => {
    const ok = await confirm({
      title: "Hapus Dokumen?",
      message: "Dokumen dihapus dari daftar dan berkasnya dihapus permanen saat metode uji disimpan.",
      details: (
        <span className="flex items-center justify-between gap-2">
          <span className="font-semibold truncate">{doc.namaFile}</span>
          <span className="text-gray-500 shrink-0">{doc.ukuran || "-"}</span>
        </span>
      ),
      tone: "danger",
      confirmText: "Ya, Hapus",
    });
    if (!ok) return;
    onChange((prev) => prev.filter((d) => d !== doc));
  };

  return (
    <div className="box">
      <div className="box-header flex items-center justify-between border-b border-defaultborder pb-3">
        <div className="flex items-center gap-2">
          <i className="ri-file-list-3-line text-lg text-primary"></i>
          <h3 className="box-title font-semibold text-base">Dokumen Terkait</h3>
        </div>
        <span className="badge bg-primary/10 text-primary font-semibold text-xs rounded-full px-2.5 py-0.5">
          {documents.length} File
        </span>
      </div>
      <div className="box-body pt-4">
        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer relative ${
            isDragging
              ? "border-primary bg-primary/10 scale-[1.01]"
              : isUploading
                ? "border-gray-200 bg-gray-50 cursor-wait"
                : "border-gray-300 hover:border-primary/60 hover:bg-gray-50/80"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
            disabled={isUploading}
            className="hidden"
            accept={DOKUMEN_ACCEPT}
          />

          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-7 h-7 border-3 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-xs font-semibold text-primary">Mengunggah ke MinIO Storage...</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Mohon tunggu sebentar</p>
            </div>
          ) : (
            <>
              <div className="text-primary mb-1.5 flex justify-center">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <i className="ri-cloud-upload-line text-xl"></i>
                </div>
              </div>
              <p className="text-[11px] font-semibold text-gray-800 mb-0.5">Upload Dokumen & Gambar Pendukung</p>
              <p className="text-[10px] text-gray-500 mb-2">
                {DOKUMEN_HINT} (Maks. {DOKUMEN_MAX_MB} MB per file)
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className={buttonClass("outline", "sm")}>Pilih File</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5 flex items-center gap-1 font-medium">
                  <i className="ri-hard-drive-2-line"></i> MinIO
                </span>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 rounded-md border border-defaultborder overflow-hidden">
          <table className="w-full table-fixed text-left border-collapse">
            <colgroup>
              <col />
              <col className="w-16" />
              <col className="w-[92px]" />
            </colgroup>
            <thead className="bg-gray-50/80">
              <tr className="text-[11px] text-primary">
                <th className={TH_CLASS}>Berkas</th>
                <th className={`${TH_CLASS} text-center`}>Ukuran</th>
                <th className={`${TH_CLASS} text-center`}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-defaultborder">
              {documents.length > 0 ? (
                documents.map((doc, i) => (
                  <tr key={doc.id || i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-2 px-2.5">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="flex items-center gap-2 w-full min-w-0 text-left group"
                        title="Klik untuk pratinjau"
                      >
                        {isImageFile(doc) && doc.fileUrl ? (
                          <span className="block w-7 h-7 rounded border border-gray-200 overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={doc.fileUrl} alt={doc.namaFile} className="w-full h-full object-cover" />
                          </span>
                        ) : (
                          <span className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center shrink-0">
                            <i className={`${fileIconClass(doc)} text-base`}></i>
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span
                            className="block text-[11px] font-medium text-gray-800 truncate leading-tight group-hover:text-primary"
                            title={doc.namaFile}
                          >
                            {doc.namaFile}
                          </span>
                          <span className="text-[9px] font-mono text-gray-500 uppercase bg-gray-100 px-1 rounded leading-none">
                            {fileExt(doc) || "FILE"}
                          </span>
                        </span>
                      </button>
                    </td>
                    <td className="py-2 px-1 text-[10px] text-center text-gray-500 whitespace-nowrap">{doc.ukuran || "-"}</td>
                    <td className="py-2 px-1.5">
                      <div className="flex items-center justify-center gap-1">
                        <button type="button" onClick={() => setPreviewDoc(doc)} className={iconButtonClass("blue", ACTION_SIZE)} title="Pratinjau">
                          <i className="ri-eye-line"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingDoc(doc)}
                          disabled={isUploading}
                          className={iconButtonClass("amber", ACTION_SIZE)}
                          title="Edit Berkas"
                        >
                          <i className="ri-pencil-line"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(doc)}
                          disabled={isUploading}
                          className={iconButtonClass("rose", ACTION_SIZE)}
                          title="Hapus Berkas"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-6 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <i className="ri-folder-open-line text-2xl mb-1 opacity-40"></i>
                      <span className="text-[11px] font-medium">Belum ada dokumen yang diunggah</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Dokumen atau gambar akan otomatis disimpan ke MinIO</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <QcFilePreviewModal file={previewDoc} onClose={() => setPreviewDoc(null)} />
      <EditDokumenModal dokumen={editingDoc} onClose={() => setEditingDoc(null)} onSave={handleSaveEdit} />
    </div>
  );
}
