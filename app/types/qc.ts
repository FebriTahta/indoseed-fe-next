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

export interface TestMethod {
  id: string;
  kode: string;
  nama: string;
  jenisUji?: string;
  komoditas?: string;
  deskripsi?: string;
  status: string;
  standarId?: string;
  alatDigunakan?: string;
  versiMetode?: string;
  tanggalBerlaku?: string | Date;
  catatan?: string;
  standar?: ReferenceStandard;
  testParameters?: TestParameter[];
}

export interface TestParameter {
  id: string;
  kode: string;
  nama: string;
  kategori?: string;
  satuan?: string;
  batasAcuan?: string;
  keterangan?: string;
  metodeId?: string;
  standarId?: string;
  status: string;
  metode?: TestMethod;
  standar?: ReferenceStandard;
}
