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

export interface PermintaanPengujianParameter {
  id?: string;
  permintaanId?: string;
  parameterId?: string;
  kode: string;
  nama?: string;
  parameter?: string;
  kategori?: string;
  metodeId?: string;
  metode?: string;
  metodeKode?: string;
  metodeNama?: string;
  standar?: string;
  satuan?: string;
  checked: boolean;
  definisi?: string;
  keterangan?: string;
  isCustom?: boolean;
}

export interface PermintaanPengujianDokumen {
  id?: string;
  permintaanId?: string;
  namaFile: string;
  fileUrl: string;
  tipeFile?: string;
  ukuran?: string;
  createdAt?: string | Date;
}

export interface PermintaanPengujian {
  id: string;
  noPermintaan: string;
  tanggal: string | Date;
  kodeBatch: string;
  batchProduksiId?: string;
  komoditas?: string;
  varietas?: string;
  tipe?: string;
  petani?: string;
  lahan?: string;
  panen?: string;
  jumlahSampel?: number;
  satuanSampel?: string;
  metodeSampling?: string;
  pengambilSampel?: string;
  pemohon: string;
  prioritas: string;
  status: string;
  catatan?: string;
  fileLampiranUrl?: string;
  fileLampiranNama?: string;
  dibuatOleh?: string;
  diubahOleh?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  parameters?: PermintaanPengujianParameter[];
  dokumen?: PermintaanPengujianDokumen[];
  batchProduksi?: any;
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

