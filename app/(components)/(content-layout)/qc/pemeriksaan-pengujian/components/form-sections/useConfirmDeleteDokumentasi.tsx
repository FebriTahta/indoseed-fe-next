import React, { useCallback } from "react";
import { useConfirm } from "@/app/(components)/(content-layout)/shared/ConfirmDialog";

interface DokumentasiRef {
  id?: string;
  namaFile: string;
  keterangan?: string | null;
}

/** Konfirmasi (modal) sebelum menghapus dokumentasi pengujian. */
export function useConfirmDeleteDokumentasi(deleteDokumentasi: (id: string) => unknown) {
  const confirm = useConfirm();
  return useCallback(
    async (doc: DokumentasiRef) => {
      if (!doc.id) return;
      const ok = await confirm({
        title: "Hapus Dokumentasi?",
        message: "File dokumentasi akan dihapus permanen dari penyimpanan dan tidak dapat dikembalikan.",
        details: (
          <>
            <span className="font-semibold break-all">{doc.namaFile}</span>
            {doc.keterangan && <span className="block text-gray-500 mt-0.5">{doc.keterangan}</span>}
          </>
        ),
        tone: "danger",
        confirmText: "Ya, Hapus",
      });
      if (ok) deleteDokumentasi(doc.id);
    },
    [confirm, deleteDokumentasi]
  );
}
