export interface LaboratoriumData {
  id: string;
  kodeLaboratorium: string;
  namaLaboratorium: string;
  deskripsi: string;
  alamat: string;
  telepon: string;
  nomorAkreditasi: string;
  lembagaAkreditasi: string;
  tanggalAkreditasi: string;
  tanggalBerlakuAkreditasi: string;
  ruangLingkupPengujian: string;
  status: 'Aktif' | 'Tidak Aktif';
  createdAt: string;
  updatedAt: string;
}
