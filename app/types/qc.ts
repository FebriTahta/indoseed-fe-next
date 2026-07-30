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
  deskripsi?: string;
  status: string;
  standarId?: string;
  standar?: ReferenceStandard;
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
