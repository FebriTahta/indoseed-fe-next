"use client";

import React, { useState } from "react";
import { useConfirmDeleteDokumentasi } from "./useConfirmDeleteDokumentasi";
import QcCard from "../../../shared/QcCard";
import QcDocumentList from "../../../shared/QcDocumentList";
import QcFileDropzone from "../../../shared/QcFileDropzone";
import { PemeriksaanDetailState } from "@/app/hooks/usePemeriksaanDetail";

const DokumentasiTab = ({ state }: { state: PemeriksaanDetailState }) => {
  const { data, busy, uploadDokumentasi, deleteDokumentasi } = state;
  const [keterangan, setKeterangan] = useState("");
  const confirmDeleteDokumentasi = useConfirmDeleteDokumentasi(deleteDokumentasi);
  if (!data) return null;

  const canEdit = state.canEditDokumentasi;
  const docs = (data.dokumen || []).filter((d) => d.kategori === "Dokumentasi");

  return (
    <QcCard
      title="Dokumentasi Pengujian"
      icon="ri-folder-image-line"
      action={<span className="text-[11px] text-gray-500">{docs.length} file</span>}
      bodyClassName="space-y-4"
    >
      {canEdit && (
        <div className="space-y-2">
          <input
            type="text"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder="Keterangan foto/dokumen (mis. Foto sampel, Hasil germinasi hari ke-7)"
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            aria-label="Keterangan dokumentasi"
          />
          <QcFileDropzone
            compact
            disabled={busy}
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            hint="JPG, PNG, WEBP, PDF"
            onSelect={async (file) => {
              await uploadDokumentasi(file, keterangan.trim() || undefined);
              setKeterangan("");
            }}
          />
        </div>
      )}
      <QcDocumentList
        variant="grid"
        documents={docs}
        emptyMessage="Belum ada dokumentasi pengujian."
        onDelete={canEdit ? confirmDeleteDokumentasi : undefined}
      />
    </QcCard>
  );
};

export default DokumentasiTab;
