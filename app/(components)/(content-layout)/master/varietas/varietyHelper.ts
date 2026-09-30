import {
  Variety,
  VarietyBrand,
  VarietyCharacteristicItem,
  VarietyProductionParam,
  VarietyQCConfig,
  VarietyInventoryConfig,
  VarietyDocItem,
} from '@/app/types/variety';

export interface VarietyMetadata {
  deskripsiText?: string;
  brands?: VarietyBrand[];
  kategoriBenih?: string;
  sumberBenih?: string;
  namaInternal?: string;
  tglMulaiDigunakan?: string;
  karakteristikList?: VarietyCharacteristicItem[];
  ketahananPenyakit?: string;
  toleransiCuaca?: string;
  catatanKarakteristik?: string;
  produksiParam?: VarietyProductionParam;
  qcConfig?: VarietyQCConfig;
  inventoryConfig?: VarietyInventoryConfig;
  documents?: VarietyDocItem[];
}

// Icon mapper for commodities
export const getCommodityIcon = (namaKomoditas?: string): { icon: string; color: string; bg: string } => {
  const name = (namaKomoditas || '').toLowerCase();
  if (name.includes('melon')) {
    return { icon: 'ri-pie-chart-2-line', color: 'text-emerald-600', bg: 'bg-emerald-50' };
  }
  if (name.includes('cabai') || name.includes('chili')) {
    return { icon: 'ri-fire-line', color: 'text-rose-600', bg: 'bg-rose-50' };
  }
  if (name.includes('tomat') || name.includes('tomato')) {
    return { icon: 'ri-record-circle-line', color: 'text-red-600', bg: 'bg-red-50' };
  }
  if (name.includes('padi') || name.includes('rice')) {
    return { icon: 'ri-seedling-line', color: 'text-lime-600', bg: 'bg-lime-50' };
  }
  if (name.includes('sawi') || name.includes('bayam') || name.includes('kangkung')) {
    return { icon: 'ri-leaf-line', color: 'text-green-600', bg: 'bg-green-50' };
  }
  if (name.includes('jagung') || name.includes('corn')) {
    return { icon: 'ri-flashlight-line', color: 'text-amber-600', bg: 'bg-amber-50' };
  }
  if (name.includes('bunga') || name.includes('flower') || name.includes('krisan')) {
    return { icon: 'ri-flower-line', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' };
  }
  return { icon: 'ri-plant-line', color: 'text-emerald-600', bg: 'bg-emerald-50' };
};

// Parse variety description which may contain JSON metadata
export const parseVarietyData = (variety: Variety): Variety => {
  let meta: VarietyMetadata = {};

  if (variety.deskripsi && variety.deskripsi.trim().startsWith('{')) {
    try {
      meta = JSON.parse(variety.deskripsi);
    } catch (e) {
      // plain text
      meta = { deskripsiText: variety.deskripsi };
    }
  } else {
    meta = { deskripsiText: variety.deskripsi || '' };
  }

  // Fallback default brands if none stored
  const brands: VarietyBrand[] = meta.brands || [];

  // Default characteristics from variety fields or fallback
  const defaultCharacteristics: VarietyCharacteristicItem[] = meta.karakteristikList || [
    { id: '1', parameter: 'Umur Panen', nilai: variety.umurTanam || '70', satuan: 'HST', keterangan: '-' },
    { id: '2', parameter: 'Potensi Hasil', nilai: variety.potensiHasil || '25', satuan: 'Ton/Ha', keterangan: '-' },
    { id: '3', parameter: 'Bobot Buah', nilai: '1,5', satuan: 'Kg', keterangan: '-' },
    { id: '4', parameter: 'Tingkat Kemanisan (Brix)', nilai: '14', satuan: '°Brix', keterangan: '-' },
    { id: '5', parameter: 'Bentuk Buah', nilai: variety.bentukBiji || 'Bulat', satuan: '-', keterangan: '-' },
    { id: '6', parameter: 'Warna Kulit', nilai: variety.warnaGabah || 'Hijau', satuan: '-', keterangan: '-' },
    { id: '7', parameter: 'Warna Daging', nilai: 'Orange', satuan: '-', keterangan: '-' },
    { id: '8', parameter: 'Diameter Buah', nilai: '15 - 18', satuan: 'cm', keterangan: '-' },
  ];

  const defaultProduksi: VarietyProductionParam = meta.produksiParam || {
    umurPanen: variety.umurTanam || '65 - 75',
    satuanUmurPanen: 'HST',
    jarakTanam: '60 x 50',
    satuanJarakTanam: 'cm',
    populasiTanaman: '30.000',
    satuanPopulasi: 'tanaman/ha',
    kebutuhanBenih: '0,5 - 1',
    satuanKebutuhanBenih: 'kg/ha',
    musimTanam: 'Keduanya',
    targetProduksi: '500',
    satuanTargetProduksi: 'kg/ha',
    perkiraanHasil: '300 - 500',
    satuanPerkiraanHasil: 'kg/ha',
    tingkatKeberhasilan: '90',
    satuanProduksi: 'Kg',
    jarakIsolasi: '500',
    satuanJarakIsolasi: 'meter',
    sumberBenihAwal: 'Benih Pokok (Foundation Seed)',
    standarProduksi: 'SNI 01-8493-2018',
    catatanProduksi: ''
  };

  const defaultQc: VarietyQCConfig = meta.qcConfig || {
    statusQc: 'Wajib QC',
    metodePengujian: 'ISTA - Germination Test',
    frekuensiPengujian: 'Per Lot',
    sampling: 'Wajib',
    masaBerlakuHasilUji: '12',
    standarAcuan: 'Standar Internal Perusahaan',
    noDokumenReferensi: 'SOP-QC-001',
    catatanQc: 'Parameter mengikuti standar mutu benih melon perusahaan.',
    parameters: [
      { id: '1', parameter: 'Kadar Air', nilaiMinimal: '-', nilaiMaksimal: '8', satuan: '%', keterangan: 'Maksimal' },
      { id: '2', parameter: 'Daya Kecambah', nilaiMinimal: '85', nilaiMaksimal: '-', satuan: '%', keterangan: 'Minimal' },
      { id: '3', parameter: 'Kemurnian Benih', nilaiMinimal: '99', nilaiMaksimal: '-', satuan: '%', keterangan: 'Minimal' },
      { id: '4', parameter: 'Benih Murni', nilaiMinimal: '98', nilaiMaksimal: '-', satuan: '%', keterangan: 'Minimal' },
      { id: '5', parameter: 'Tanaman Lain', nilaiMinimal: '-', nilaiMaksimal: '0', satuan: '%', keterangan: 'Maksimal' },
      { id: '6', parameter: 'Kotoran', nilaiMinimal: '-', nilaiMaksimal: '1', satuan: '%', keterangan: 'Maksimal' },
    ]
  };

  const defaultInventory: VarietyInventoryConfig = meta.inventoryConfig || {
    kelolaStok: 'Ya',
    satuanStok: 'Kg',
    satuanKemasan: 'Sachet',
    konversiJumlah: '1',
    konversiSatuanAwal: 'Sachet',
    konversiNilai: '10',
    konversiSatuanAkhir: 'Gram',
    metodeStok: 'FIFO',
    minimumStok: '50',
    maksimumStok: '500',
    statusInventory: 'Aktif',
    wajibNomorLot: 'Ya',
    wajibTanggalProduksi: 'Ya',
    wajibTanggalKadaluarsa: 'Tidak',
    wajibNomorSertifikat: 'Tidak',
    traceabilityLot: 'Aktif',
    masaBerlakuHasilUji: '12',
    catatan: '',
    kemasanList: [
      { id: '1', kemasan: 'Sachet', isi: '10', satuan: 'Gram', status: 'Aktif' },
      { id: '2', kemasan: 'Pack', isi: '100', satuan: 'Gram', status: 'Aktif' },
      { id: '3', kemasan: 'Box', isi: '1', satuan: 'Kg', status: 'Aktif' },
    ]
  };

  const defaultDocs: VarietyDocItem[] = meta.documents || [];

  return {
    ...variety,
    deskripsi: meta.deskripsiText !== undefined ? meta.deskripsiText : (variety.deskripsi || ''),
    brands,
    kategoriBenih: meta.kategoriBenih || 'Hibrida',
    sumberBenih: meta.sumberBenih || 'Benih Pokok (Foundation Seed)',
    namaInternal: meta.namaInternal || '',
    tglMulaiDigunakan: meta.tglMulaiDigunakan || '2025-01-01',
    karakteristikList: defaultCharacteristics,
    ketahananPenyakit: meta.ketahananPenyakit || '',
    toleransiCuaca: meta.toleransiCuaca || '',
    catatanKarakteristik: meta.catatanKarakteristik || '',
    produksiParam: defaultProduksi,
    qcConfig: defaultQc,
    inventoryConfig: defaultInventory,
    documents: defaultDocs,
  };
};

export const serializeVarietyMetadata = (meta: VarietyMetadata): string => {
  return JSON.stringify(meta);
};

