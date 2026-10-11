export interface PenanggungJawab {
  id: string;
  kodePersonel?: string | null;
  nama: string;
  peran?: string | null;
  areaModul?: string | null;
  lokasi?: string | null;
  noHp?: string | null;
  email?: string | null;
  status: string;
  tanggalMulai?: string | null;
  tanggalSelesai?: string | null;
  catatan?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePenanggungJawabPayload {
  kodePersonel?: string;
  nama: string;
  peran?: string;
  areaModul?: string;
  lokasi?: string;
  noHp?: string;
  email?: string;
  status?: string;
  tanggalMulai?: string | null;
  tanggalSelesai?: string | null;
  catatan?: string;
}

export interface UpdatePenanggungJawabPayload {
  kodePersonel?: string;
  nama?: string;
  peran?: string;
  areaModul?: string;
  lokasi?: string;
  noHp?: string;
  email?: string;
  status?: string;
  tanggalMulai?: string | null;
  tanggalSelesai?: string | null;
  catatan?: string;
}

export interface PenanggungJawabStats {
  totalPersonel: number;
  kepalaProduksi: number;
  penanggungJawab: number;
  aktif: number;
  nonaktif: number;
}
