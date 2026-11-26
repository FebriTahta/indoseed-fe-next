"use client";

import React, { useState, useEffect } from 'react';
import { ReferensiJadwalTanamPanen, PanenItem } from '@/app/types/panen';

interface ModalTambahPanenProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => Promise<boolean>;
  isSaving: boolean;
  eligibleJadwals: ReferensiJadwalTanamPanen[];
  initialData?: PanenItem | null;
  totalRecords: number;
}

const FALLBACK_ELIGIBLE_JADWALS: ReferensiJadwalTanamPanen[] = [
  {
    id: 'jt-ref-1',
    kodeJadwalTanam: 'JT-2026-009',
    komoditas: 'Tomat',
    varietas: 'Melisa',
    namaPetani: 'Siti Rahayu',
    kodePetani: 'SRN-002',
    lahan: 'Lahan B / Blok 02',
    luasLahan: 1.5,
    targetProduksi: 2000,
    perkiraanPanen: '2026-10-01',
    statusJadwal: 'Disetujui',
    statusPersetujuan: 'Disetujui',
  },
  {
    id: 'jt-ref-2',
    kodeJadwalTanam: 'JT-2026-011',
    komoditas: 'Kangkung',
    varietas: 'Super Sempit',
    namaPetani: 'Budi Santoso',
    kodePetani: 'BTN-001',
    lahan: 'Lahan A / Blok 01',
    luasLahan: 1.0,
    targetProduksi: 1500,
    perkiraanPanen: '2026-09-30',
    statusJadwal: 'Disetujui',
    statusPersetujuan: 'Disetujui',
  },
  {
    id: 'jt-ref-3',
    kodeJadwalTanam: 'JT-2026-012',
    komoditas: 'Melon',
    varietas: 'Melon Tere F1',
    namaPetani: 'Budi Santoso',
    kodePetani: 'BTN-001',
    lahan: 'Lahan A / Blok 01',
    luasLahan: 1.0,
    targetProduksi: 1500,
    perkiraanPanen: '2026-09-30',
    statusJadwal: 'Disetujui',
    statusPersetujuan: 'Disetujui',
  },
  {
    id: 'jt-ref-4',
    kodeJadwalTanam: 'JT-2026-0018',
    komoditas: 'Melon',
    varietas: 'Melon Tere F1',
    namaPetani: 'Budi Santoso',
    kodePetani: 'BTN-001',
    lahan: 'LHN-001 / Blok 01',
    luasLahan: 1.0,
    targetProduksi: 1500,
    perkiraanPanen: '2026-09-30',
    statusJadwal: 'Disetujui',
    statusPersetujuan: 'Disetujui',
  },
  {
    id: 'jt-ref-5',
    kodeJadwalTanam: 'JT-2026-0017',
    komoditas: 'Cabai',
    varietas: 'Cabai Keriting',
    namaPetani: 'Siti Rahayu',
    kodePetani: 'SRN-002',
    lahan: 'LHN-002 / Blok 02',
    luasLahan: 1.2,
    targetProduksi: 2000,
    perkiraanPanen: '2026-11-01',
    statusJadwal: 'Disetujui',
    statusPersetujuan: 'Disetujui',
  },
];

export default function ModalTambahPanen({
  isOpen,
  onClose,
  onSave,
  isSaving,
  eligibleJadwals,
  initialData,
  totalRecords,
}: ModalTambahPanenProps) {
  const [jenisHasil, setJenisHasil] = useState<'Glondong / Buah' | 'OC / Benih'>('Glondong / Buah');
  const [kodePanen, setKodePanen] = useState<string>('');
  const [selectedJadwalId, setSelectedJadwalId] = useState<string>('');

  // Auto-filled fields (read only)
  const [komoditas, setKomoditas] = useState<string>('');
  const [varietas, setVarietas] = useState<string>('');
  const [petani, setPetani] = useState<string>('');
  const [petaniKode, setPetaniKode] = useState<string>('');
  const [lahan, setLahan] = useState<string>('');
  const [blokLahan, setBlokLahan] = useState<string>('');

  // Data Panen fields (empty by default on create)
  const [tanggalPanen, setTanggalPanen] = useState<string>('');
  const [luasDipanen, setLuasDipanen] = useState<number | string>('');
  const [jumlahBuah, setJumlahBuah] = useState<number | string>('');
  const [kadarAir, setKadarAir] = useState<number | string>('');
  const [beratBruto, setBeratBruto] = useState<number | string>('');
  const [beratNetto, setBeratNetto] = useState<number | string>('');
  const [kondisiHasil, setKondisiHasil] = useState<string>('Baik');

  // Dokumentasi photos (empty by default on create)
  const [photos, setPhotos] = useState<string[]>([]);

  const [catatan, setCatatan] = useState<string>('');

  // Combine fetched jadwals or fallback
  const availableJadwals =
    eligibleJadwals && eligibleJadwals.length > 0 ? eligibleJadwals : FALLBACK_ELIGIBLE_JADWALS;

  // Initialize or reset when opened
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setJenisHasil(
        initialData.jenisHasil?.includes('OC') || initialData.jenisHasil?.includes('Benih')
          ? 'OC / Benih'
          : 'Glondong / Buah'
      );
      setKodePanen(initialData.kodePanen || '');
      setSelectedJadwalId(initialData.jadwalTanamId || initialData.kodeJadwalTanam || '');
      setKomoditas(initialData.komoditas || '');
      setVarietas(initialData.varietas || '');
      setPetani(initialData.petani || '');
      setPetaniKode(initialData.petaniKode || '');
      setLahan(initialData.lahan || '');
      setBlokLahan(initialData.blokLahan || '');
      setTanggalPanen(
        initialData.tanggalPanen
          ? initialData.tanggalPanen.split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setLuasDipanen(initialData.luasHa ?? '');
      setJumlahBuah(initialData.jumlahBuah ?? '');
      setKadarAir(initialData.kadarAir ?? '');
      setBeratBruto(initialData.beratBruto ?? '');
      setBeratNetto(initialData.beratNetto ?? '');
      setKondisiHasil(initialData.kondisiHasil || 'Baik');
      setCatatan(initialData.catatan || '');
      if (initialData.dokumentasi && Array.isArray(initialData.dokumentasi)) {
        setPhotos(
          initialData.dokumentasi
            .map((d: any) => (typeof d === 'string' ? d : d?.url))
            .filter(Boolean)
        );
      } else {
        setPhotos([]);
      }
    } else {
      // Create mode: Default harusnya kosong
      const nextNum = String(totalRecords + 19).padStart(4, '0');
      setKodePanen(`PN-2026-06-${nextNum}`);
      setSelectedJadwalId('');
      setKomoditas('');
      setVarietas('');
      setPetani('');
      setPetaniKode('');
      setLahan('');
      setBlokLahan('');
      setTanggalPanen(new Date().toISOString().split('T')[0]);
      setJenisHasil('Glondong / Buah');
      setLuasDipanen('');
      setJumlahBuah('');
      setKadarAir('');
      setBeratBruto('');
      setBeratNetto('');
      setKondisiHasil('Baik');
      setPhotos([]);
      setCatatan('');
    }
  }, [isOpen, initialData, totalRecords]);

  // Handle Jadwal Tanam select change -> Informasi Panen terisi otomatis
  const handleJadwalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedJadwalId(val);

    if (!val) {
      setKomoditas('');
      setVarietas('');
      setPetani('');
      setPetaniKode('');
      setLahan('');
      setBlokLahan('');
      setLuasDipanen('');
      return;
    }

    const found = availableJadwals.find((j) => j.id === val || j.kodeJadwalTanam === val);
    if (found) {
      setKomoditas(found.komoditas || '');
      setVarietas(found.varietas || '');
      setPetani(found.namaPetani || '');
      setPetaniKode(found.kodePetani || '');
      setLahan(found.lahan || '');
      if (found.luasLahan) {
        setLuasDipanen(found.luasLahan);
      }
    }
  };

  // Upload photo handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedJadwal = availableJadwals.find(
      (j) => j.id === selectedJadwalId || j.kodeJadwalTanam === selectedJadwalId
    );

    const payload = {
      kodePanen,
      jadwalTanamId: selectedJadwal?.id || selectedJadwalId,
      kodeJadwalTanam: selectedJadwal?.kodeJadwalTanam || selectedJadwalId,
      jenisHasil,
      komoditas,
      varietas,
      petani,
      petaniKode,
      lahan,
      blokLahan,
      tanggalPanen,
      luasHa: luasDipanen !== '' ? Number(luasDipanen) : 0,
      jumlahBuah: jenisHasil === 'Glondong / Buah' ? (jumlahBuah !== '' ? Number(jumlahBuah) : 0) : 0,
      kadarAir: jenisHasil === 'OC / Benih' ? (kadarAir !== '' ? Number(kadarAir) : 0) : undefined,
      beratBruto: beratBruto !== '' ? Number(beratBruto) : 0,
      beratNetto: beratNetto !== '' ? Number(beratNetto) : 0,
      produksiKg: beratNetto !== '' ? Number(beratNetto) : 0,
      kondisiHasil,
      catatan,
      status: 'Selesai',
      dokumentasi: photos.map((url, i) => ({
        url,
        caption: `Foto Panen #${i + 1}`,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        size: '1.5 MB',
      })),
    };

    await onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl">
              <i className="ri-leaf-line"></i>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {initialData ? 'Edit Data Panen' : 'Tambah Data Panen'}
              </h2>
              <p className="text-xs text-gray-500">
                Lengkapi data panen sesuai dengan jenis hasil yang diperoleh.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Radio Selector: Jenis Hasil Panen */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-800">
              Jenis Hasil Panen <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Option 1: Glondong / Buah */}
              <div
                onClick={() => setJenisHasil('Glondong / Buah')}
                className={`p-3.5 rounded-xl border-2 flex items-center gap-3.5 cursor-pointer transition-all ${
                  jenisHasil === 'Glondong / Buah'
                    ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    jenisHasil === 'Glondong / Buah' ? 'border-emerald-600' : 'border-gray-300'
                  }`}
                >
                  {jenisHasil === 'Glondong / Buah' && (
                    <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                  )}
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center text-base">
                  <i className="ri-plant-line"></i>
                </div>
                <span className="font-bold text-xs">Glondong / Buah</span>
              </div>

              {/* Option 2: OC / Benih */}
              <div
                onClick={() => setJenisHasil('OC / Benih')}
                className={`p-3.5 rounded-xl border-2 flex items-center gap-3.5 cursor-pointer transition-all ${
                  jenisHasil === 'OC / Benih'
                    ? 'border-purple-600 bg-purple-50/40 text-purple-900 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    jenisHasil === 'OC / Benih' ? 'border-purple-600' : 'border-gray-300'
                  }`}
                >
                  {jenisHasil === 'OC / Benih' && (
                    <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  )}
                </div>
                <div className="w-8 h-8 rounded-lg bg-purple-100/70 text-purple-700 flex items-center justify-center text-base">
                  <i className="ri-seedling-line"></i>
                </div>
                <span className="font-bold text-xs">OC / Benih</span>
              </div>
            </div>
          </div>

          {/* Two-Column Section: Informasi Panen & Data Panen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Informasi Panen */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-100 text-xs font-bold text-gray-900">
                <i className="ri-file-info-line text-emerald-700"></i>
                <span>Informasi Panen</span>
              </div>

              {/* No. Panen */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  No. Panen <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={kodePanen}
                    onChange={(e) => setKodePanen(e.target.value)}
                    className="w-full h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-gray-50 text-xs font-mono font-medium text-gray-800 focus:outline-none focus:border-emerald-500"
                    placeholder="PN-2026-06-0019"
                    required
                  />
                  <span className="absolute right-2.5 top-2.5 text-gray-400 text-xs">
                    <i className="ri-qr-code-line"></i>
                  </span>
                </div>
              </div>

              {/* Jadwal Tanam (Approved Only) */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Jadwal Tanam <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedJadwalId}
                  onChange={handleJadwalChange}
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  required
                >
                  <option value="">Pilih Jadwal Tanam yang Disetujui</option>
                  {availableJadwals.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.kodeJadwalTanam} - {j.komoditas} ({j.varietas}) - {j.namaPetani}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  Hanya menampilkan jadwal yang telah disetujui pada Persetujuan Produksi.
                </span>
              </div>

              {/* Komoditas & Varietas (Auto-filled, Read Only) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-gray-700">
                      Komoditas <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      Read only
                    </span>
                  </div>
                  <input
                    type="text"
                    value={komoditas}
                    readOnly
                    tabIndex={-1}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-100/70 text-xs font-medium text-gray-700 cursor-not-allowed select-none focus:outline-none"
                    placeholder="Otomatis dari Jadwal Tanam"
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-gray-700">
                      Varietas <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      Read only
                    </span>
                  </div>
                  <input
                    type="text"
                    value={varietas}
                    readOnly
                    tabIndex={-1}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-100/70 text-xs font-medium text-gray-700 cursor-not-allowed select-none focus:outline-none"
                    placeholder="Otomatis dari Jadwal Tanam"
                    required
                  />
                </div>
              </div>

              {/* Petani & Lahan (Auto-filled, Read Only) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-gray-700">
                      Petani <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      Read only
                    </span>
                  </div>
                  <input
                    type="text"
                    value={petani}
                    readOnly
                    tabIndex={-1}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-100/70 text-xs font-medium text-gray-700 cursor-not-allowed select-none focus:outline-none"
                    placeholder="Otomatis dari Jadwal Tanam"
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-gray-700">
                      Lahan <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      Read only
                    </span>
                  </div>
                  <input
                    type="text"
                    value={lahan}
                    readOnly
                    tabIndex={-1}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-100/70 text-xs font-medium text-gray-700 cursor-not-allowed select-none focus:outline-none"
                    placeholder="Otomatis dari Jadwal Tanam"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Data Panen (Glondong / Buah or OC / Benih) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-100 text-xs font-bold text-gray-900">
                <i className="ri-scales-line text-emerald-700"></i>
                <span>Data Panen ({jenisHasil})</span>
              </div>

              {/* Tanggal Panen & Luas Dipanen */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Tanggal Panen <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={tanggalPanen}
                    onChange={(e) => setTanggalPanen(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Luas Dipanen <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={luasDipanen}
                      onChange={(e) => setLuasDipanen(e.target.value)}
                      className="w-full h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:border-emerald-500"
                      placeholder="0.00"
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-gray-400 font-medium text-xs">Ha</span>
                  </div>
                </div>
              </div>

              {/* Jumlah Buah (only for Glondong/Buah) & Berat Bruto */}
              <div className="grid grid-cols-2 gap-3">
                {jenisHasil === 'Glondong / Buah' ? (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Jumlah Buah <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={jumlahBuah}
                        onChange={(e) => setJumlahBuah(e.target.value)}
                        className="w-full h-9 pl-3 pr-12 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:border-emerald-500"
                        placeholder="0"
                        required
                      />
                      <span className="absolute right-3 top-2.5 text-gray-400 font-medium text-xs">buah</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Kadar Air (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={kadarAir}
                        onChange={(e) => setKadarAir(e.target.value)}
                        className="w-full h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:border-emerald-500"
                        placeholder="0.0"
                      />
                      <span className="absolute right-3 top-2.5 text-gray-400 font-medium text-xs">%</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Berat Bruto <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={beratBruto}
                      onChange={(e) => setBeratBruto(e.target.value)}
                      className="w-full h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:border-emerald-500"
                      placeholder="0"
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-gray-400 font-medium text-xs">kg</span>
                  </div>
                </div>
              </div>

              {/* Berat Netto & Kondisi Hasil */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Berat Netto <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={beratNetto}
                      onChange={(e) => setBeratNetto(e.target.value)}
                      className="w-full h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:border-emerald-500"
                      placeholder="0"
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-gray-400 font-medium text-xs">kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Kondisi Hasil <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={kondisiHasil}
                    onChange={(e) => setKondisiHasil(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Sangat Baik">Sangat Baik</option>
                    <option value="Baik">Baik</option>
                    <option value="Cukup">Cukup</option>
                    <option value="Kurang">Kurang</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Dokumentasi Panen */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <i className="ri-camera-line text-emerald-700"></i>
              Dokumentasi Panen
            </label>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Upload Dropzone */}
              <label className="md:col-span-5 border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-emerald-50/20 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1 text-sm">
                  <i className="ri-upload-cloud-2-line"></i>
                </div>
                <span className="font-semibold text-gray-700 text-xs">
                  Klik untuk upload atau tarik file ke sini
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  Format: JPG, JPEG, PNG (Maks 5MB)
                </span>
              </label>

              {/* Photo Previews */}
              <div className="md:col-span-7 flex flex-wrap items-center gap-2">
                {photos.length === 0 ? (
                  <div className="w-full text-xs text-gray-400 italic py-3 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 flex items-center justify-center">
                    Belum ada foto dokumentasi yang diunggah
                  </div>
                ) : (
                  <>
                    {photos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group bg-gray-100 flex-shrink-0"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                          title="Hapus foto"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    ))}

                    {/* Add Photo Button */}
                    <label className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-200 hover:border-emerald-500 flex items-center justify-center cursor-pointer text-gray-400 hover:text-emerald-600 transition-colors bg-white">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <i className="ri-add-line text-xl"></i>
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Section: Catatan (opsional) */}
          <div className="space-y-1 pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <i className="ri-file-edit-line text-gray-400"></i>
              Catatan (opsional)
            </label>
            <textarea
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 resize-none"
              placeholder="Masukkan catatan tambahan terkait panen..."
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-sm"></i>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <i className="ri-save-line text-sm"></i>
                  <span>Simpan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
