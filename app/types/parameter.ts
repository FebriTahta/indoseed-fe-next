export interface MasterParameterOption {
  id?: string;
  parameterId?: string;
  kode: string;
  nama: string;
  bobot?: number | string;
  urutan?: number;
  status?: string;
}

export interface MasterParameter {
  id: string;
  kode: string;
  nama: string;
  namaModul: string;
  tipeNilai: 'NUMBER' | 'TEXT' | 'OPTION' | 'RANGE' | 'BOOLEAN';
  satuan?: string | null;
  batasLulus?: number | string | null;
  deskripsi?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  options?: MasterParameterOption[];
  varietyParameters?: VarietyParameter[];
}

export interface VarietyParameter {
  id?: string;
  varietyId?: string;
  parameterId: string;
  optionId?: string | null;
  nilaiNumber?: number | null;
  nilaiText?: string | null;
  operator?: string | null;
  nilaiMin?: number | null;
  nilaiMax?: number | null;
  option?: MasterParameterOption | null;
  variety?: { id: string; namaVarietas: string; kodeVarietas: string };
}

export interface CombinedVarietyParameter {
  parameter: MasterParameter;
  varietyParameter: VarietyParameter | null;
}

export interface CreateMasterParameterPayload {
  kode: string;
  nama: string;
  namaModul: string;
  tipeNilai: 'NUMBER' | 'TEXT' | 'OPTION' | 'RANGE' | 'BOOLEAN';
  satuan?: string;
  batasLulus?: number | string | null;
  deskripsi?: string;
  status?: string;
  options?: {
    kode?: string;
    nama: string;
    bobot?: number | string;
    urutan?: number;
    status?: string;
  }[];
}

export interface SaveVarietyParameterPayload {
  parameterId: string;
  optionId?: string | null;
  nilaiNumber?: number | null;
  nilaiText?: string | null;
  operator?: string | null;
  nilaiMin?: number | null;
  nilaiMax?: number | null;
}
