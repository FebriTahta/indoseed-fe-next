import { GudangData } from "./gudang";
import { SupplierData } from "./supplier";

export interface StokMasukData {
  id: string;
  noDokumen: string;
  tanggal: string;
  kategori: string;
  namaBarang: string;
  noBatch: string;
  jumlah: number;
  satuan: string;
  supplier: SupplierData;
  gudang: GudangData;
  asalStok: string;

  status: string;
  createdAt: string;
  updatedAt: string;
}
