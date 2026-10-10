import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  pemeriksaanPengujianService,
  SimpanHasilPayload,
  TerimaSampelPayload,
} from '@/app/services/pemeriksaanPengujianService';
import { HASIL_AKHIR, PermintaanPengujian, PermintaanPengujianParameter, QC_STATUS } from '@/app/types/qc';
import { evaluateHasil } from '@/app/lib/batasAcuan';
import { getErrorMessage } from '@/app/lib/format';

export interface ParamDraft {
  nilaiHasil: string;
  hasilTeks: string;
  statusHasil: string;
  catatanHasil: string;
}

const toDraft = (p: PermintaanPengujianParameter): ParamDraft => ({
  nilaiHasil: p.nilaiHasil === null || p.nilaiHasil === undefined ? '' : String(p.nilaiHasil),
  hasilTeks: p.hasilTeks || '',
  statusHasil: p.statusHasil || '',
  catatanHasil: p.catatanHasil || '',
});

const toNumberOrNull = (v: string) => {
  if (v.trim() === '') return null;
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

/** State & aksi halaman detail Pemeriksaan Pengujian. */
export function usePemeriksaanDetail(id: string) {
  const [data, setData] = useState<PermintaanPengujian | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, ParamDraft>>({});
  const [catatanPengujian, setCatatanPengujian] = useState('');
  const [dirty, setDirty] = useState(false);

  const apply = useCallback((d: PermintaanPengujian) => {
    // Response aksi (simpan/submit/review) tidak memuat lokasiAsal; pertahankan dari muatan awal.
    setData((prev) => ({ ...d, lokasiAsal: d.lokasiAsal ?? prev?.lokasiAsal }));
    setDrafts(Object.fromEntries((d.parameters || []).map((p) => [p.id, toDraft(p)])));
    setCatatanPengujian(d.catatanPengujian || '');
    setDirty(false);
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      apply((await pemeriksaanPengujianService.getById(id)).data);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Gagal memuat data pemeriksaan'));
    } finally {
      setLoading(false);
    }
  }, [id, apply]);

  useEffect(() => {
    reload();
  }, [reload]);

  const activeParams = useMemo(() => (data?.parameters || []).filter((p) => p.checked), [data]);
  const canInput = data?.status === QC_STATUS.DALAM_PENGUJIAN;

  const setParamDraft = (paramId: string, patch: Partial<ParamDraft>) => {
    setDrafts((prev) => ({ ...prev, [paramId]: { ...prev[paramId], ...patch } }));
    setDirty(true);
  };

  /** Status per parameter: otomatis dari batas acuan, atau pilihan manual untuk parameter kualitatif. */
  const statusOf = useCallback(
    (p: PermintaanPengujianParameter) => {
      const d = drafts[p.id];
      if (!d) return p.statusHasil || null;
      return evaluateHasil(toNumberOrNull(d.nilaiHasil), p.batasAcuan ?? p.standar) || d.statusHasil || null;
    },
    [drafts]
  );

  const hasilAkhirPreview = useMemo(() => {
    if (!activeParams.length) return null;
    const statuses = activeParams.map(statusOf);
    if (statuses.some((s) => !s)) return null;
    return statuses.includes(HASIL_AKHIR.TIDAK_LULUS) ? HASIL_AKHIR.TIDAK_LULUS : HASIL_AKHIR.LULUS;
  }, [activeParams, statusOf]);

  const run = async (fn: () => Promise<{ data: PermintaanPengujian }>, success?: string) => {
    setBusy(true);
    try {
      const res = await fn();
      apply(res.data);
      if (success) toast.success(success);
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Gagal memproses pemeriksaan'));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const buildHasilPayload = (): SimpanHasilPayload => ({
    parameters: activeParams.map((p) => {
      const d = drafts[p.id] || toDraft(p);
      return {
        id: p.id,
        nilaiHasil: toNumberOrNull(d.nilaiHasil),
        hasilTeks: d.hasilTeks.trim() || null,
        statusHasil: d.statusHasil || null,
        catatanHasil: d.catatanHasil.trim() || null,
      };
    }),
    catatanPengujian: catatanPengujian.trim() || null,
  });

  const saveDraft = () =>
    run(() => pemeriksaanPengujianService.simpanHasil(data!.id, buildHasilPayload()), 'Hasil pengujian tersimpan');

  const submitReview = async () => {
    if (!data) return false;
    setBusy(true);
    try {
      await pemeriksaanPengujianService.simpanHasil(data.id, buildHasilPayload());
      apply((await pemeriksaanPengujianService.submitReview(data.id)).data);
      toast.success('Hasil pengujian dikirim untuk review');
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Gagal mengirim hasil untuk review'));
      await reload();
      return false;
    } finally {
      setBusy(false);
    }
  };

  const terimaSampel = (payload: TerimaSampelPayload) =>
    run(() => pemeriksaanPengujianService.terimaSampel(data!.id, payload), 'Sampel diterima, pengujian dimulai');

  const review = (keputusan: 'setujui' | 'revisi', catatan?: string) =>
    run(
      () => pemeriksaanPengujianService.review(data!.id, keputusan, catatan),
      keputusan === 'setujui' ? 'Hasil pengujian disetujui' : 'Hasil dikembalikan untuk revisi'
    );

  const uploadDokumentasi = async (file: File, keterangan?: string) => {
    if (!data) return;
    setBusy(true);
    try {
      await pemeriksaanPengujianService.uploadDokumentasi(data.id, file, keterangan);
      toast.success('Dokumentasi berhasil diunggah');
      // Muat ulang tanpa menimpa draft hasil yang belum disimpan.
      const fresh = (await pemeriksaanPengujianService.getById(data.id)).data;
      setData((prev) => (prev ? { ...prev, dokumen: fresh.dokumen, riwayat: fresh.riwayat } : fresh));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Gagal mengunggah dokumentasi'));
    } finally {
      setBusy(false);
    }
  };

  const deleteDokumentasi = async (dokumenId: string) => {
    if (!data) return;
    setBusy(true);
    try {
      await pemeriksaanPengujianService.deleteDokumentasi(data.id, dokumenId);
      setData((prev) => (prev ? { ...prev, dokumen: (prev.dokumen || []).filter((d) => d.id !== dokumenId) } : prev));
      toast.success('Dokumentasi dihapus');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Gagal menghapus dokumentasi'));
    } finally {
      setBusy(false);
    }
  };

  return {
    data,
    loading,
    busy,
    dirty,
    canInput,
    activeParams,
    drafts,
    setParamDraft,
    statusOf,
    hasilAkhirPreview,
    catatanPengujian,
    setCatatanPengujian: (v: string) => {
      setCatatanPengujian(v);
      setDirty(true);
    },
    reload,
    saveDraft,
    submitReview,
    terimaSampel,
    review,
    uploadDokumentasi,
    deleteDokumentasi,
  };
}

export type PemeriksaanDetailState = ReturnType<typeof usePemeriksaanDetail>;
