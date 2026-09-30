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

  // Auto-filled fields
  const [komoditas, setKomoditas] = useState<string>('');
  const [varietas, setVarietas] = useState<string>('');
  const [petani, setPetani] = useState<string>('');
  const [petaniKode, setPetaniKode] = useState<string>('');
  const [lahan, setLahan] = useState<string>('');
  const [blokLahan, setBlokLahan] = useState<string>('');

  // Data Panen fields
  const [tanggalPanen, setTanggalPanen] = useState<string>('');
  const [luasDipanen, setLuasDipanen] = useState<number | string>(1.5);
  const [jumlahBuah, setJumlahBuah] = useState<number | string>(2800);
  const [beratBruto, setBeratBruto] = useState<number | string>(3200);
  const [beratNetto, setBeratNetto] = useState<number | string>(2950);
  const [kondisiHasil, setKondisiHasil] = useState<string>('Baik');

  // Dokumentasi photos
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=60',
  ]);

  const [catatan, setCatatan] = useState<string>('');

  // Initialize or reset when opened
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setJenisHasil(
        initialData.jenisHasil?.includes('OC') || initialData.jenisHasil?.includes('Benih')
          ? 'OC / Benih'
          : 'Glondong / Buah'
      );
      setKodePanen(initialData.kodePanen);
      setSelectedJadwalId(initialData.jadwalTanamId || initialData.kodeJadwalTanam || '');
      setKomoditas(initialData.komoditas || '');
      setVarietas(initialData.varietas || '');
      setPetani(initialData.petani || '');
      setPetaniKode(initialData.petaniKode || '');
      setLahan(initialData.lahan || '');
      setBlokLahan(initialData.blokLahan || '');
      setTanggalPanen(initialData.tanggalPanen ? initialData.tanggalPanen.split('T')[0] : new Date().toISOString().split('T')[0]);
      setLuasDipanen(initialData.luasHa || 1.0);
      setJumlahBuah(initialData.jumlahBuah || 0);
      setBeratBruto(initialData.beratBruto || initialData.produksiKg || 1500);
      setBeratNetto(initialData.beratNetto || initialData.produksiKg || 1480);
      setKondisiHasil(initialData.kondisiHasil || 'Baik');
      setCatatan(initialData.catatan || '');
    } else {
      // Create mode
      const nextNum = String(totalRecords + 19).padStart(4, '0');
      setKodePanen(`PN-2026-06-${nextNum}`);
      setTanggalPanen(new Date().toISOString().split('T')[0]);
      setJenisHasil('Glondong / Buah');
      setLuasDipanen(1.5);
      setJumlahBuah(2800);
      setBeratBruto(3200);
      setBeratNetto(2950);
      setKondisiHasil('Baik');
      setCatatan('');

      // If eligible jadwals exist, auto select first
      if (eligibleJadwals && eligibleJadwals.length > 0) {
        const first = eligibleJadwals[0];
        setSelectedJadwalId(first.id);
        setKomoditas(first.komoditas);
        setVarietas(first.varietas);
        setPetani(first.namaPetani);
        setPetaniKode(first.kodePetani || 'BTN-001');
        setLahan(first.lahan);
        setLuasDipanen(first.luasLahan || 1.5);
      } else {
        // Fallback default sample
        setSelectedJadwalId('JT-2026-009');
        setKomoditas('Tomat');
        setVarietas('Melisa');
        setPetani('Siti Rahayu');
        setPetaniKode('SRN-002');
        setLahan('Lahan B / Blok 02');
      }
    }
  }, [isOpen, initialData, eligibleJadwals, totalRecords]);

  // Handle Jadwal Tanam select change
  const handleJadwalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedJadwalId(val);

    const found = eligibleJadwals.find((j) => j.id === val || j.kodeJadwalTanam === val);
    if (found) {
      setKomoditas(found.komoditas);
      setVarietas(found.varietas);
      setPetani(found.namaPetani);
      setPetaniKode(found.kodePetani || 'BTN-001');
      setLahan(found.lahan);
      if (found.luasLahan) setLuasDipanen(found.luasLahan);
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

    const selectedJadwal = eligibleJadwals.find((j) => j.id === selectedJadwalId || j.kodeJadwalTanam === selectedJadwalId);

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
      luasHa: Number(luasDipanen) || 1.0,
      jumlahBuah: jenisHasil === 'Glondong / Buah' ? Number(jumlahBuah) || 0 : 0,
      beratBruto: Number(beratBruto) || 0,
      beratNetto: Number(beratNetto) || 0,
      produksiKg: Number(beratNetto) || 0,
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
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:border-emerald-500"
                  required
                >
                  <option value="" disabled>Pilih Jadwal Tanam yang Disetujui</option>
                  {eligibleJadwals.length > 0 ? (
                    eligibleJadwals.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.kodeJadwalTanam} - {j.komoditas} ({j.varietas}) - {j.namaPetani}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="JT-2026-009">JT-2026-009 - Tomat (Melisa) - Siti Rahayu</option>
                      <option value="JT-2026-011">JT-2026-011 - Kangkung (Super Sempit) - Budi Santoso</option>
                      <option value="JT-2026-012">JT-2026-012 - Melon (Melon Tere F1) - Budi Santoso</option>
                    </>
                  )}
                </select>
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  Hanya menampilkan jadwal yang telah disetujui pada Persetujuan Produksi.
                </span>
              </div>

              {/* Komoditas & Varietas (Auto-filled) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Komoditas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={komoditas}
                    onChange={(e) => setKomoditas(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs font-medium text-gray-800 focus:outline-none"
                    placeholder="Komoditas"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Varietas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={varietas}
                    onChange={(e) => setVarietas(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs font-medium text-gray-800 focus:outline-none"
                    placeholder="Varietas"
                    required
                  />
                </div>
              </div>

              {/* Petani & Lahan (Auto-filled) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Petani <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={petani}
                    onChange={(e) => setPetani(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs font-medium text-gray-800 focus:outline-none"
                    placeholder="Nama Petani"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Lahan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lahan}
                    onChange={(e) => setLahan(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs font-medium text-gray-800 focus:outline-none"
                    placeholder="Lahan / Blok"
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
                      placeholder="1.50"
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
                        placeholder="2800"
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
                        defaultValue={14.0}
                        className="w-full h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:border-emerald-500"
                        placeholder="14.0"
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
                      placeholder="3200"
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
                      placeholder="2950"
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
