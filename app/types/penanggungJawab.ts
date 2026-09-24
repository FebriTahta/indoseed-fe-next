export interface PenanggungJawab {
  id: string;
  nama: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePenanggungJawabPayload {
  nama: string;
  status?: string;
}

export interface UpdatePenanggungJawabPayload {
  nama?: string;
  status?: string;
}
