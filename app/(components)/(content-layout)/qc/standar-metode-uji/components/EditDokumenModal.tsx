"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CrudModal from "@/app/(components)/(content-layout)/shared/CrudModal";
import { iconButtonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import QcFileDropzone from "../../shared/QcFileDropzone";
import { fileIconClass, formatFileSize, splitFileName } from "../../shared/fileUtils";
import uploadService from "@/app/services/uploadService";
import { TestMethodDocument } from "@/app/types/qc";
import { getErrorMessage } from "@/app/lib/format";
import { DOKUMEN_ACCEPT, DOKUMEN_FOLDER, DOKUMEN_HINT, DOKUMEN_MAX_MB } from "./dokumenConfig";

interface EditDokumenModalProps {
  /** Dokumen yang diedit; `null` = modal tertutup. */
  dokumen: TestMethodDocument | null;
  onClose: () => void;
  onSave: (updated: TestMethodDocument) => void;
}

/** Ubah nama tampilan dokumen dan/atau ganti berkasnya dengan unggahan baru. */
export default function EditDokumenModal({ dokumen, onClose, onSave }: EditDokumenModalProps) {
  const [namaDasar, setNamaDasar] = useState("");
  const [replacement, setReplacement] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!dokumen) return;
    setNamaDasar(splitFileName(dokumen.namaFile)[0]);
    setReplacement(null);
    setError("");
  }, [dokumen]);

  if (!dokumen) return null;

  // Ekstensi mengikuti berkas aktif (berkas pengganti bila ada) agar nama & isi tetap konsisten.
  const ext = splitFileName(replacement?.name ?? dokumen.namaFile)[1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nama = namaDasar.trim();
    if (!nama) {
      setError("Nama berkas wajib diisi");
      return;
    }

    setSaving(true);
    try {
      let updated: TestMethodDocument = { ...dokumen, namaFile: ext ? `${nama}.${ext}` : nama };
      if (replacement) {
        const res = await uploadService.uploadFile(replacement, DOKUMEN_FOLDER);
        if (!res.success || !res.data?.fileUrl) throw new Error("Gagal mengunggah berkas pengganti");
        updated = { ...updated, fileUrl: res.data.fileUrl, tipeFile: ext.toLowerCase(), ukuran: formatFileSize(replacement.size) };
      }
      onSave(updated);
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal memperbarui dokumen"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <CrudModal isOpen onClose={onClose} title="Edit Dokumen" onSubmit={handleSubmit} submitText="Simpan" isLoading={saving}>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Nama Berkas <span className="text-rose-500">*</span>
        </label>
        <div className="flex items-stretch">
          <input
            type="text"
            value={namaDasar}
            onChange={(e) => {
              setNamaDasar(e.target.value);
              setError("");
            }}
            className={`form-control flex-1 text-sm ${ext ? "!rounded-e-none" : ""} ${error ? "!border-rose-400" : ""}`}
            placeholder="Nama berkas"
            autoFocus
          />
          {ext && (
            <span className="px-3 flex items-center text-xs text-gray-500 bg-gray-50 border border-s-0 border-defaultborder rounded-e-md">
              .{ext}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Ganti Berkas (opsional)</label>
        {replacement ? (
          <div className="flex items-center gap-3 border border-emerald-200 bg-emerald-50/60 rounded-lg p-3">
            <i className={`${fileIconClass({ namaFile: replacement.name })} text-2xl`}></i>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-800 truncate">{replacement.name}</p>
              <p className="text-[11px] text-gray-500">{formatFileSize(replacement.size)} • diunggah saat disimpan</p>
            </div>
            <button
              type="button"
              onClick={() => setReplacement(null)}
              className={iconButtonClass("gray")}
              title="Batalkan penggantian"
              disabled={saving}
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
        ) : (
          <QcFileDropzone
            compact
            onSelect={setReplacement}
            accept={DOKUMEN_ACCEPT}
            maxSizeMb={DOKUMEN_MAX_MB}
            hint={DOKUMEN_HINT}
            disabled={saving}
          />
        )}
      </div>
    </CrudModal>
  );
}
