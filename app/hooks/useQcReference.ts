import { useCallback, useEffect, useMemo, useState } from 'react';
import { qcLookupService } from '@/app/services/qcLookupService';
import { qcService } from '@/app/services/qcService';
import { pengujiService } from '@/app/services/pengujiService';
import { commodityService } from '@/app/services/commodityService';
import { QcLookup, QcLookupKategori, QcMeta, SelectOption } from '@/app/types/qc';

/**
 * Cache sederhana tingkat modul untuk data referensi yang jarang berubah
 * (lookup, metadata status, penguji, laboratorium, komoditas) agar tidak
 * di-fetch ulang di setiap komponen yang memakainya.
 */
const cache = new Map<string, Promise<unknown>>();

const cachedFetch = <T,>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  if (!cache.has(key)) {
    cache.set(
      key,
      fetcher().catch((err) => {
        cache.delete(key);
        throw err;
      })
    );
  }
  return cache.get(key) as Promise<T>;
};

export const invalidateQcReference = (keyPrefix?: string) => {
  [...cache.keys()].filter((k) => !keyPrefix || k.startsWith(keyPrefix)).forEach((k) => cache.delete(k));
};

/** `enabled = false` melewati fetch (mis. role tidak berhak mengakses endpoint tersebut). */
export function useCachedResource<T>(key: string, fetcher: () => Promise<T>, initial: T, enabled = true) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(enabled);

  const load = useCallback(
    (force = false) => {
      if (!enabled) {
        setLoading(false);
        return;
      }
      if (force) cache.delete(key);
      setLoading(true);
      cachedFetch(key, fetcher)
        .then(setData)
        .catch((err) => console.error(`Gagal memuat ${key}:`, err))
        .finally(() => setLoading(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, enabled]
  );

  useEffect(() => load(), [load]);

  return { data, loading, reload: () => load(true) };
}

// ---------- Lookup master (tabel qc_lookups) ----------

export function useQcLookups(kategori: QcLookupKategori[]) {
  const key = `lookup:${[...kategori].sort().join(',')}`;
  const { data, loading } = useCachedResource(
    key,
    async () => (await qcLookupService.getLookups(kategori)).data,
    {} as Partial<Record<QcLookupKategori, QcLookup[]>>
  );

  const options = useCallback(
    (k: QcLookupKategori): SelectOption[] => (data[k] || []).map((l) => ({ value: l.kode, label: l.nama })),
    [data]
  );

  const labelOf = useCallback(
    (k: QcLookupKategori, kode?: string | null) =>
      kode ? data[k]?.find((l) => l.kode === kode)?.nama || kode : '-',
    [data]
  );

  return { lookups: data, options, labelOf, loading };
}

// ---------- Metadata alur status ----------

const EMPTY_META: QcMeta = { statuses: [], pemeriksaanStatuses: [], hasilStatuses: [], editableStatuses: [], hasilAkhir: [], rekomendasiDefault: {} };

export function useQcMeta() {
  const { data, loading } = useCachedResource('meta', async () => (await qcLookupService.getMeta()).data, EMPTY_META);
  return { meta: data, loading };
}

// ---------- Referensi data master lain ----------

export function usePengujiOptions(enabled = true) {
  const { data, loading } = useCachedResource(
    'penguji:aktif',
    async () => {
      const res = await pengujiService.getPengujis({ status: 'Aktif', limit: 500 });
      return (res?.data || []) as { id: string; nama: string; kodePenguji: string; laboratoriumId?: string | null; laboratorium?: { namaLaboratorium: string } | null }[];
    },
    [],
    enabled
  );
  const options = useMemo<SelectOption[]>(
    () =>
      data.map((p) => ({
        value: p.id,
        label: p.laboratorium?.namaLaboratorium ? `${p.nama} (${p.laboratorium.namaLaboratorium})` : p.nama,
      })),
    [data]
  );
  return { penguji: data, options, loading };
}

export function useLaboratoriumOptions() {
  const { data, loading } = useCachedResource(
    'laboratorium:aktif',
    async () => (await qcService.getLaboratoriums()).data || [],
    []
  );
  const options = useMemo<SelectOption[]>(
    () => data.map((l) => ({ value: l.id, label: l.namaLaboratorium })),
    [data]
  );
  return { laboratorium: data, options, loading };
}

export function useKomoditasOptions() {
  const { data, loading } = useCachedResource(
    'komoditas:all',
    async () => (await commodityService.getCommodities({ pageSize: 1000 })).data || [],
    []
  );
  const options = useMemo<SelectOption[]>(
    () => data.map((c) => ({ value: c.namaKomoditas, label: c.namaKomoditas })),
    [data]
  );
  return { komoditas: data, options, loading };
}

export function useMetodeUjiOptions() {
  const { data, loading } = useCachedResource(
    'metode-uji:aktif',
    async () => (await qcService.getMethods({ status: 'Aktif' })).data || [],
    []
  );
  const options = useMemo<SelectOption[]>(() => data.map((m) => ({ value: m.id, label: m.nama })), [data]);
  return { metodeUji: data, options, loading };
}
