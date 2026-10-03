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
