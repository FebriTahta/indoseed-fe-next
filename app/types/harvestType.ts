import { Variety } from './variety';

export interface HarvestTypePrice {
  id: string;
  harvestTypeId: string;
  harga: number;
  keterangan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HarvestType {
  id: string;
  kode: string;
  nama: string;
  varietyId: string;
  status: 'Aktif' | 'Non Aktif';
  createdAt: string;
  updatedAt: string;
  
  variety?: Variety;
  prices?: HarvestTypePrice[];
}
