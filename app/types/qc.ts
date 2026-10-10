export interface ReferenceStandard {
  id: string;
  kode: string;
  nama: string;
  jenis: string;
  organisasi?: string;
  versiTahun?: string;
  kategori?: string;
  deskripsi?: string;
  fileUrl?: string;
  bahasa?: string;
  catatan?: string;
  status: string;
}

export interface TestMethodDocument {
  id?: string;
  testMethodId?: string;
  namaFile: string;
  fileUrl: string;
  tipeFile?: string;
  ukuran?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface TestMethod {
  id: string;
  kode: string;
  nama: string;
  jenisUji?: string;
  komoditas?: string;
  varietas?: string;
  tipe?: string;
  deskripsi?: string;
  status: string;
  standarId?: string;
  alatDigunakan?: string;
  versiMetode?: string;
  tanggalBerlaku?: string | Date;
  catatan?: string;
  standar?: ReferenceStandard;
  testParameters?: TestParameter[];
  dokumen?: TestMethodDocument[];
  riwayat?: TestMethodRiwayat[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface TestParameter {
  id: string;
  kode: string;
  nama: string;
  kategori?: string;
  satuan?: string;
  batasAcuan?: string;
  definisi?: string;
  keterangan?: string;
  metodeId?: string;
  standarId?: string;
  status: string;
  metode?: TestMethod;
  standar?: ReferenceStandard;
}

export interface TestMethodRiwayat {
  id: string;
  testMethodId: string;
  aksi: string;
  keterangan?: string | null;
  oleh?: string | null;
  createdAt: string;
  testMethod?: Pick<TestMethod, 'id' | 'kode' | 'nama'>;
}

// ---------- Master lookup & metadata ----------

export type QcLookupKategori =
  | 'JENIS_UJI'
  | 'TIPE_BENIH'
  | 'SATUAN_PARAMETER'
  | 'KATEGORI_PARAMETER'
  | 'SATUAN_SAMPEL'
  | 'METODE_SAMPLING'
  | 'PEMOHON'
  | 'PRIORITAS'
  | 'KONDISI_SAMPEL'
  | 'REKOMENDASI'
  | 'PARAMETER_PERKECAMBAHAN';

export interface QcLookup {
  id: string;
  kategori: QcLookupKategori;
  kode: string;
  nama: string;
  urutan: number;
  status: string;
}

export interface QcMeta {
  statuses: string[];
  pemeriksaanStatuses: string[];
  hasilStatuses: string[];
  editableStatuses: string[];
  hasilAkhir: string[];
  /** Rekomendasi default per kesimpulan, mis. { Lulus: 'Lanjut Proses' }. */
  rekomendasiDefault: Record<string, string>;
}

export interface SelectOption {
  value: string;
  label: string;
}

// ---------- Permintaan / Pemeriksaan / Hasil Pengujian ----------

export interface PengujiRef {
  id: string;
  kodePenguji: string;
  nama: string;
}

export interface LaboratoriumRef {
  id: string;
  kodeLaboratorium: string;
  namaLaboratorium: string;
}

export interface PermintaanPengujianParameter {
  id: string;
  permintaanId?: string;
  parameterId?: string | null;
  kode: string;
  nama: string;
  kategori?: string | null;
  metodeId?: string | null;
  metode?: string | null;
  metodeKode?: string | null;
  metodeNama?: string | null;
  standar?: string | null;
  batasAcuan?: string | null;
  satuan?: string | null;
  checked: boolean;
  definisi?: string | null;
  keterangan?: string | null;
  isCustom?: boolean;
  nilaiHasil?: number | null;
  hasilTeks?: string | null;
  statusHasil?: string | null;
  catatanHasil?: string | null;
  diujiOleh?: string | null;
  tanggalUji?: string | null;
  metodeRef?: {
    id: string;
    kode: string;
    nama: string;
    standar?: { id: string; kode: string; nama: string } | null;
    dokumen?: TestMethodDocument[];
  } | null;
}

export interface PermintaanPengujianDokumen {
  id: string;
  permintaanId?: string;
  namaFile: string;
  fileUrl: string;
  tipeFile?: string | null;
  ukuran?: string | null;
  kategori: 'Permintaan' | 'Dokumentasi' | string;
  keterangan?: string | null;
  diunggahOleh?: string | null;
  createdAt?: string;
}

export interface PermintaanPengujianRiwayat {
  id: string;
  aksi: string;
  statusDari?: string | null;
  statusKe?: string | null;
  keterangan?: string | null;
  oleh?: string | null;
  createdAt: string;
}

export interface PermintaanPengujian {
  id: string;
  noPermintaan: string;
  tanggal: string;
  kodeBatch: string;
  batchProduksiId?: string | null;
  komoditas?: string | null;
  varietas?: string | null;
  tipe?: string | null;
  petani?: string | null;
  lahan?: string | null;
  panen?: string | null;
  jumlahSampel?: number | null;
  satuanSampel?: string | null;
  metodeSampling?: string | null;
  pengambilSampel?: string | null;
  pengambilSampelId?: string | null;
  pemohon: string;
  prioritas: string;
  status: string;
  catatan?: string | null;
  fileLampiranUrl?: string | null;
  fileLampiranNama?: string | null;
  disetujuiOleh?: string | null;
  tanggalDisetujui?: string | null;
  alasanPenolakan?: string | null;
  noPengujian?: string | null;
  noSampel?: string | null;
  petugasQcId?: string | null;
  laboratoriumId?: string | null;
  tanggalSampling?: string | null;
  kondisiSampel?: string | null;
  tanggalMulaiUji?: string | null;
  tanggalSelesaiUji?: string | null;
  catatanPengujian?: string | null;
  hasilAkhir?: string | null;
  rekomendasi?: string | null;
  direviewOleh?: string | null;
  tanggalReview?: string | null;
  catatanReview?: string | null;
  dibuatOleh?: string | null;
  diubahOleh?: string | null;
  createdAt?: string;
  updatedAt?: string;
  parameters?: PermintaanPengujianParameter[];
  dokumen?: PermintaanPengujianDokumen[];
  riwayat?: PermintaanPengujianRiwayat[];
  pengambilSampelRef?: PengujiRef | null;
  petugasQc?: PengujiRef | null;
  laboratorium?: LaboratoriumRef | null;
  batchProduksi?: any;
  _count?: { dokumen: number };
  /** Hanya pada detail pemeriksaan: lahan asal sampel beserta koordinatnya. */
  lokasiAsal?: LokasiAsal | null;
}

export interface LokasiAsal {
  kodeLahan?: string | null;
  namaLahan?: string | null;
  lokasi?: string | null;
  koordinat?: string | null;
  posisi?: { lat: number; lng: number } | null;
}

export interface PermintaanSummary {
  total: number;
  menungguPersetujuan: number;
  sampling: number;
  dalamPengujian: number;
  menungguReview: number;
  selesai: number;
  ditolak: number;
}

export interface PemeriksaanSummary {
  total: number;
  sampling: number;
  dalamPengujian: number;
  menungguReview: number;
  selesai: number;
}

export interface HasilSummary {
  total: number;
  menungguReview: number;
  lulus: number;
  tidakLulus: number;
}

export interface BatchOption {
  id: string;
  kodeBatch: string;
  komoditas: string;
  varietas: string;
  sumberBahan: string;
  lokasi?: string | null;
  status: string;
  asalPanen: {
    kodePanen: string;
    petani?: string | null;
    lahan?: string | null;
    tanggalPanen?: string | null;
  } | null;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface QcListParams {
  search?: string;
  status?: string;
  periode?: string;
  startDate?: string;
  endDate?: string;
  komoditas?: string;
  prioritas?: string;
  petugasQcId?: string;
  hasilAkhir?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

/** Status alur QC (cermin dari `PERMINTAAN_STATUS` di backend). */
export const QC_STATUS = {
  MENUNGGU_PERSETUJUAN: 'Menunggu Persetujuan',
  SAMPLING: 'Sampling',
  DALAM_PENGUJIAN: 'Dalam Pengujian',
  MENUNGGU_REVIEW: 'Menunggu Review',
  SELESAI: 'Selesai',
  DITOLAK: 'Ditolak',
} as const;

export const HASIL_AKHIR = {
  LULUS: 'Lulus',
  TIDAK_LULUS: 'Tidak Lulus',
} as const;
