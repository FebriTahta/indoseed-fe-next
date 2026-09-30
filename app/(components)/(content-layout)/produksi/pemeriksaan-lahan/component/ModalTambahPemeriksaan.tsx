"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ReferensiJadwalTanamItem } from '@/app/types/pemeriksaanLahan';
import { pemeriksaanLahanService } from '@/app/services/pemeriksaanLahanService';

interface ModalTambahPemeriksaanProps {
  isOpen: boolean;
  onClose: () => void;
  eligibleJadwals: ReferensiJadwalTanamItem[];
  loadingEligible: boolean;
  onSuccess?: () => void;
}

interface TemuanOffTypeRow {
  no: number;
  jenisKarakter: string;
  jumlah: number;
  keterangan: string;
  foto: string;
}

interface DokumenItem {
  no: number;
  nama: string;
  tipe: string;
  ukuran: string;
  tanggal: string;
  icon: string;
  iconBg: string;
}

export default function ModalTambahPemeriksaan({
  isOpen,
  onClose,
  eligibleJadwals,
  loadingEligible,
  onSuccess,
}: ModalTambahPemeriksaanProps) {
  // Wizard step state (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);

  // Form Fields - Step 1
  const [selectedJadwalId, setSelectedJadwalId] = useState<string>('');
  const [tanggalPemeriksaan, setTanggalPemeriksaan] = useState<string>('2026-10-12');
  const [jamPemeriksaan, setJamPemeriksaan] = useState<string>('08:15');
  const [petugasQc, setPetugasQc] = useState<string>('Andi Pratama');
  const [fasePertumbuhan, setFasePertumbuhan] = useState<string>('Vegetatif');
  const [kondisiUmum, setKondisiUmum] = useState<string>('Baik');

  // Kemurnian Inputs
  const [jumlahTanamanDiamati, setJumlahTanamanDiamati] = useState<number>(1000);
  const [tanamanSesuai, setTanamanSesuai] = useState<number>(992);
  const [tanamanOffType, setTanamanOffType] = useState<number>(8);
  const [catatan, setCatatan] = useState<string>('');

  // Step 3 Table state
  const [selectedOffTypeIds, setSelectedOffTypeIds] = useState<number[]>([]);
  const [filterKarakter, setFilterKarakter] = useState<string>('Semua Karakter');
  const [filterJumlah, setFilterJumlah] = useState<string>('Semua Jumlah');
  const [filterKeterangan, setFilterKeterangan] = useState<string>('Semua Keterangan');

  // Step 4 Gallery state
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  // Default eligible selection when opened
  useEffect(() => {
    if (isOpen && eligibleJadwals && eligibleJadwals.length > 0 && !selectedJadwalId) {
      setSelectedJadwalId(eligibleJadwals[0].id);
    }
  }, [isOpen, eligibleJadwals, selectedJadwalId]);

  // Selected Jadwal Tanam metadata
  const selectedJadwal = useMemo(() => {
    return eligibleJadwals.find((j) => j.id === selectedJadwalId) || eligibleJadwals[0] || null;
  }, [eligibleJadwals, selectedJadwalId]);

  const displayKodeJadwal = selectedJadwal?.kodeJadwalTanam || 'JT-2026-0018';
  const displayKomoditas = selectedJadwal?.komoditas || 'Kangkung';
  const displayVarietas = selectedJadwal?.varietas || 'Super Sempit';
  const displayPetani = selectedJadwal?.namaPetani || 'Budi Santoso';
  const displayLahan = selectedJadwal?.lahan || 'Lahan A / Blok 01';
  const displayLuasLahan = selectedJadwal?.luasLahan ? `${selectedJadwal.luasLahan} Ha` : '1,00 Ha';

  // Handle auto-sync numbers
  const handleJumlahTanamanChange = (val: number) => {
    const num = Math.max(0, val || 0);
    setJumlahTanamanDiamati(num);
    const sesuai = Math.min(tanamanSesuai, num);
    setTanamanSesuai(sesuai);
    setTanamanOffType(Math.max(0, num - sesuai));
  };

  const handleTanamanSesuaiChange = (val: number) => {
    const num = Math.max(0, val || 0);
    setTanamanSesuai(num);
    setTanamanOffType(Math.max(0, jumlahTanamanDiamati - num));
  };

  const handleTanamanOffTypeChange = (val: number) => {
    const num = Math.max(0, val || 0);
    setTanamanOffType(num);
    setTanamanSesuai(Math.max(0, jumlahTanamanDiamati - num));
  };

  // Calculations
  const kemurnianVal = useMemo(() => {
    if (jumlahTanamanDiamati <= 0) return 100.0;
    return parseFloat(((tanamanSesuai / jumlahTanamanDiamati) * 100).toFixed(1));
  }, [jumlahTanamanDiamati, tanamanSesuai]);

  const kemurnianFormatted = String(kemurnianVal).replace('.', ',');
  const offTypePercentFormatted = String((100 - kemurnianVal).toFixed(1)).replace('.', ',');

  const statusPemeriksaan = useMemo(() => {
    if (kemurnianVal >= 98.0) return 'Memenuhi standar';
    if (kemurnianVal >= 95.0) return 'Perlu Roguing';
    return 'Tidak Memenuhi';
  }, [kemurnianVal]);

  // SVG Gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeOffsetKemurnian = circumference - (Math.min(kemurnianVal, 100) / 100) * circumference;

  // Step 2 parameters
  const parameterHasilRows = [
    { no: 1, parameter: 'Tinggi Tanaman', hasil: '28 cm', standar: '≥ 25 cm', status: 'Sesuai' },
    { no: 2, parameter: 'Jumlah Tanaman', hasil: `${tanamanSesuai} tanaman`, standar: '≥ 900 tanaman', status: 'Sesuai' },
    { no: 3, parameter: 'Kondisi Daun', hasil: 'Baik', standar: 'Baik', status: 'Sesuai' },
    { no: 4, parameter: 'Kondisi Tanah', hasil: 'Lembab', standar: 'Lembab', status: 'Sesuai' },
    { no: 5, parameter: 'Serangan Hama/Penyakit', hasil: 'Ringan', standar: 'Ringan', status: 'Sesuai' },
  ];

  // Step 3 Temuan Off-Type data
  const temuanOffTypeList: TemuanOffTypeRow[] = [
    { no: 1, jenisKarakter: 'Bentuk daun', jumlah: 3, keterangan: 'Daun lebih lebar', foto: '/assets/images/media/media-41.jpg' },
    { no: 2, jenisKarakter: 'Warna batang', jumlah: 2, keterangan: 'Warna lebih pucat', foto: '/assets/images/media/media-42.jpg' },
    { no: 3, jenisKarakter: 'Tinggi tanaman', jumlah: 2, keterangan: 'Tinggi lebih pendek', foto: '/assets/images/media/media-43.jpg' },
    { no: 4, jenisKarakter: 'Bentuk buah', jumlah: 1, keterangan: 'Bentuk tidak seragam', foto: '/assets/images/media/media-44.jpg' },
  ];

  // Step 4 Documentation photos & documents
  const photoGallery = [
    { id: 1, src: '/assets/images/media/media-41.jpg', name: 'IMG_0001.jpg', date: '12 Okt 2026 08:15', size: '2.4 MB' },
    { id: 2, src: '/assets/images/media/media-42.jpg', name: 'IMG_0002.jpg', date: '12 Okt 2026 08:16', size: '2.1 MB' },
    { id: 3, src: '/assets/images/media/media-43.jpg', name: 'IMG_0003.jpg', date: '12 Okt 2026 08:18', size: '3.0 MB' },
    { id: 4, src: '/assets/images/media/media-44.jpg', name: 'IMG_0004.jpg', date: '12 Okt 2026 08:20', size: '2.6 MB' },
    { id: 5, src: '/assets/images/media/media-45.jpg', name: 'IMG_0005.jpg', date: '12 Okt 2026 08:22', size: '1.9 MB' },
    { id: 6, src: '/assets/images/media/media-46.jpg', name: 'IMG_0006.jpg', date: '12 Okt 2026 08:25', size: '2.8 MB' },
  ];

  const supportingDocs: DokumenItem[] = [
    { no: 1, nama: 'Berita Acara Pemeriksaan.pdf', tipe: 'PDF', ukuran: '1.2 MB', tanggal: '12 Okt 2026 08:20', icon: 'ri-file-pdf-line', iconBg: 'bg-rose-50 text-rose-600' },
    { no: 2, nama: 'Formulir Pemeriksaan.xlsx', tipe: 'XLSX', ukuran: '856 KB', tanggal: '12 Okt 2026 08:25', icon: 'ri-file-excel-line', iconBg: 'bg-emerald-50 text-emerald-600' },
    { no: 3, nama: 'Catatan Lapangan.docx', tipe: 'DOCX', ukuran: '432 KB', tanggal: '12 Okt 2026 08:30', icon: 'ri-file-word-line', iconBg: 'bg-blue-50 text-blue-600' },
    { no: 4, nama: 'Dokumentasi Tambahan.zip', tipe: 'ZIP', ukuran: '5.8 MB', tanggal: '12 Okt 2026 08:35', icon: 'ri-file-zip-line', iconBg: 'bg-purple-50 text-purple-600' },
  ];

  // Save submission
  const handleSimpanPemeriksaan = async () => {
    try {
      setSaving(true);
      const payload = {
        jadwalTanamId: selectedJadwal?.id || null,
        kodeJadwalTanam: displayKodeJadwal,
        tanggalPemeriksaan: new Date(`${tanggalPemeriksaan}T${jamPemeriksaan}:00`),
        komoditas: displayKomoditas,
        varietas: displayVarietas,
        petani: displayPetani,
        lahan: displayLahan,
        fase: fasePertumbuhan,
        petugasQc,
        persentaseKemurnian: kemurnianVal,
        status: statusPemeriksaan.includes('Memenuhi') ? 'Memenuhi' : statusPemeriksaan.includes('Roguing') ? 'Perlu Roguing' : 'Tidak Memenuhi',
        jumlahTanamanDiamati,
        tanamanSesuai,
        tanamanOffType,
        keterangan: statusPemeriksaan,
        catatan: catatan || 'Kondisi tanaman dalam lahan baik, dengan tingkat kemurnian ' + kemurnianFormatted + '% dan ketidaksesuaian (off type) sebesar ' + offTypePercentFormatted + '%. Rekomendasi: Lanjutkan monitoring dan lakukan roguing pada tanaman yang teridentifikasi off type.',
        temuanOffType: temuanOffTypeList.map((t) => ({
          no: t.no,
          jenisKarakter: t.jenisKarakter,
          jumlah: t.jumlah,
          keterangan: t.keterangan,
        })),
        dokumentasi: photoGallery.map((p) => p.src),
        roguingData: {
          status: statusPemeriksaan.includes('Roguing') ? 'Perlu Roguing' : 'Selesai / Terkendali',
          tanggalRencana: '15 Okt 2026',
          petugas: displayPetani,
          catatan: 'Segera lakukan roguing pada tanaman off-type yang teridentifikasi.',
        },
      };

      await pemeriksaanLahanService.create(payload);
      if (onSuccess) {
        onSuccess();
      }
      onClose();
      setCurrentStep(1);
    } catch (err: any) {
      console.warn('Gagal menyimpan pemeriksaan lahan:', err?.message || String(err));
      alert('Gagal menyimpan pemeriksaan lahan: ' + (err?.message || 'Server error'));
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  // Dynamic titles and subtitles per step
  const stepMeta = [
    { title: 'Tambah Pemeriksaan Lahan', subtitle: 'Lakukan pemeriksaan lapangan untuk memastikan kemurnian varietas dan mengidentifikasi tanaman off type.' },
    { title: 'Hasil Pemeriksaan Lahan', subtitle: 'Lihat detail hasil pemeriksaan lapangan yang dilakukan pada lokasi lahan.' },
    { title: 'Temuan Off Type', subtitle: 'Lihat dan kelola seluruh temuan off type yang ditemukan pada pemeriksaan lahan.' },
    { title: 'Dokumentasi', subtitle: 'Lihat dan kelola dokumentasi terkait kegiatan pemeriksaan lahan.' },
    { title: 'Ringkasan Pemeriksaan Lahan', subtitle: 'Ringkasan hasil pemeriksaan lahan untuk memberikan gambaran umum kondisi lahan.' },
  ];

  const currentMeta = stepMeta[currentStep - 1] || stepMeta[0];

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Scrollable Parent Centering Container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div
          className="relative w-full max-w-4xl rounded-2xl bg-white text-left shadow-2xl border border-gray-100 my-4 sm:my-8 transform transition-all flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
        
        {/* ================================================================
            MODAL HEADER: Dynamic Title & Subtitle + Close Icon
            ================================================================ */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-[#055127] flex items-center justify-center text-xl flex-shrink-0 shadow-xs">
              <i className="ri-plant-line"></i>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-tight">
                {currentMeta.title}
              </h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {currentMeta.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* ================================================================
            STEP WIZARD STEPPER BAR (1 to 5)
            ================================================================ */}
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-center overflow-x-auto flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            {[
              { step: 1, label: 'Informasi Pemeriksaan' },
              { step: 2, label: 'Hasil Pemeriksaan' },
              { step: 3, label: 'Temuan Off Type' },
              { step: 4, label: 'Dokumentasi' },
              { step: 5, label: 'Ringkasan' },
            ].map((s) => {
              const isActive = currentStep === s.step;
              const isPassed = currentStep > s.step;

              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setCurrentStep(s.step)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs font-semibold'
                      : isPassed
                      ? 'text-emerald-700 hover:bg-emerald-50/50'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? 'bg-[#055127] text-white'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'border border-gray-300 text-gray-400'
                    }`}
                  >
                    {isPassed ? <i className="ri-check-line text-xs"></i> : s.step}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================================
            MODAL BODY: Switch based on currentStep
            ================================================================ */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-gray-50/30 text-xs">

          {/* -------------------------------------------------------------
              STEP 1: INFORMASI PEMERIKSAAN
              ------------------------------------------------------------- */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              {/* Card 1: Informasi Pemeriksaan Form */}
              <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-gray-800 font-bold text-xs">
                  <i className="ri-file-text-line text-[#055127] text-sm"></i>
                  <span>Informasi Pemeriksaan</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {/* Jadwal Tanam Dropdown */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Jadwal Tanam <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedJadwalId}
                      onChange={(e) => setSelectedJadwalId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      {loadingEligible ? (
                        <option value="">Memuat data jadwal...</option>
                      ) : eligibleJadwals.length === 0 ? (
                        <option value="">Tidak ada jadwal tanam yang eligible</option>
                      ) : (
                        eligibleJadwals.map((j) => (
                          <option key={j.id} value={j.id}>
                            {j.kodeJadwalTanam} - {j.komoditas} / {j.varietas}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Tanggal & Jam Pemeriksaan */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Tanggal Pemeriksaan <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <input
                          type="date"
                          value={tanggalPemeriksaan}
                          onChange={(e) => setTanggalPemeriksaan(e.target.value)}
                          className="w-full pl-2 pr-1 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="time"
                          value={jamPemeriksaan}
                          onChange={(e) => setJamPemeriksaan(e.target.value)}
                          className="w-full pl-2 pr-1 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Petugas QC */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Petugas QC <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={petugasQc}
                      onChange={(e) => setPetugasQc(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      <option value="Andi Pratama">Andi Pratama</option>
                      <option value="Budi Santoso">Budi Santoso</option>
                      <option value="Siti Rahma">Siti Rahma</option>
                      <option value="Hendra Wijaya">Hendra Wijaya</option>
                    </select>
                  </div>

                  {/* Fase Pertumbuhan */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Fase Pertumbuhan <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={fasePertumbuhan}
                      onChange={(e) => setFasePertumbuhan(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      <option value="Vegetatif">Vegetatif</option>
                      <option value="Generatif">Generatif</option>
                      <option value="Pembungaan">Pembungaan</option>
                      <option value="Masak Fisiologis">Masak Fisiologis</option>
                    </select>
                  </div>

                  {/* Kondisi Umum */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Kondisi Umum <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={kondisiUmum}
                      onChange={(e) => setKondisiUmum(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      <option value="Sangat Baik">Sangat Baik</option>
                      <option value="Baik">Baik</option>
                      <option value="Cukup">Cukup</option>
                      <option value="Kurang">Kurang</option>
                    </select>
                  </div>
                </div>

                {/* Auto-filled strip: Petani, Lahan, Luas Lahan, Varietas */}
                <div className="pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/60 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <i className="ri-user-line text-emerald-600 text-sm"></i>
                    <div>
                      <span className="text-[10px] text-gray-400 block">Petani</span>
                      <span className="font-semibold text-gray-800 text-[11px] truncate block">
                        {displayPetani}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <i className="ri-map-pin-line text-emerald-600 text-sm"></i>
                    <div>
                      <span className="text-[10px] text-gray-400 block">Lahan</span>
                      <span className="font-semibold text-gray-800 text-[11px] truncate block">
                        {displayLahan}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <i className="ri-shape-line text-emerald-600 text-sm"></i>
                    <div>
                      <span className="text-[10px] text-gray-400 block">Luas Lahan</span>
                      <span className="font-semibold text-gray-800 text-[11px] truncate block">
                        {displayLuasLahan}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <i className="ri-price-tag-3-line text-emerald-600 text-sm"></i>
                    <div>
                      <span className="text-[10px] text-gray-400 block">Varietas</span>
                      <span className="font-semibold text-gray-800 text-[11px] truncate block">
                        {displayVarietas}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Pemeriksaan Kemurnian with Gauge */}
              <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-gray-800 font-bold text-xs">
                  <i className="ri-leaf-line text-[#055127] text-sm"></i>
                  <span>Pemeriksaan Kemurnian</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {/* Numeric Inputs */}
                  <div className="md:col-span-7 space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Jumlah Tanaman Diamati <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={jumlahTanamanDiamati}
                          onChange={(e) => handleJumlahTanamanChange(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 pr-20 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]">
                          tanaman
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Tanaman Sesuai Varietas <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={tanamanSesuai}
                          onChange={(e) => handleTanamanSesuaiChange(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 pr-20 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]">
                          tanaman
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Tanaman Off Type <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={tanamanOffType}
                          onChange={(e) => handleTanamanOffTypeChange(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 pr-20 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]">
                          tanaman
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Circular Gauge & Calculation Card */}
                  <div className="md:col-span-5 bg-emerald-50/40 rounded-xl p-4 border border-emerald-100 flex flex-col items-center text-center">
                    <span className="text-[11px] font-bold text-gray-700 mb-2">Persentase Kemurnian</span>
                    
                    <div className="relative w-28 h-28 flex items-center justify-center my-1">
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r={radius}
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r={radius}
                          stroke="#059669"
                          strokeWidth="8"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeOffsetKemurnian}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-700 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-extrabold text-gray-900 tracking-tight leading-none">
                          {kemurnianFormatted}%
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium mt-0.5">
                          Kemurnian
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-600 space-y-0.5 mb-2">
                      <span className="text-[10px] text-gray-400 block">Perhitungan:</span>
                      <span className="font-mono text-gray-700 font-medium block">
                        ({tanamanSesuai.toLocaleString('id-ID')} / {jumlahTanamanDiamati.toLocaleString('id-ID')}) × 100%
                      </span>
                      <span className="font-bold text-emerald-800 text-xs block">
                        = {kemurnianFormatted}%
                      </span>
                    </div>

                    <div className="mt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <i className="ri-checkbox-circle-fill text-emerald-600 text-xs"></i>
                        {statusPemeriksaan}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Keterangan Tambahan */}
              <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-gray-800 font-bold text-xs">
                  <i className="ri-file-edit-line text-[#055127] text-sm"></i>
                  <span>Keterangan Tambahan</span>
                </div>
                <div className="relative">
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Masukkan catatan tambahan hasil pemeriksaan..."
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  ></textarea>
                  <span className="absolute right-3 bottom-2.5 text-[10px] text-gray-400">
                    {catatan.length}/500
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
              STEP 2: HASIL PEMERIKSAAN
              ------------------------------------------------------------- */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              {/* Header Meta Strip */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs">
                <div className="flex items-center gap-2 text-gray-800 font-bold text-xs mb-3">
                  <i className="ri-survey-line text-[#055127] text-sm"></i>
                  <span>Hasil Pemeriksaan</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm">
                      <i className="ri-calendar-line"></i>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block">Tanggal Pemeriksaan</span>
                      <span className="font-bold text-gray-800 text-xs">
                        {new Date(tanggalPemeriksaan).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm">
                      <i className="ri-user-star-line"></i>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block">Petugas QC</span>
                      <span className="font-bold text-gray-800 text-xs">{petugasQc}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm">
                      <i className="ri-plant-line"></i>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block">Fase Pertumbuhan</span>
                      <span className="font-bold text-gray-800 text-xs">{fasePertumbuhan}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm">
                      <i className="ri-heart-pulse-line"></i>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block">Kondisi Umum</span>
                      <span className="font-bold text-gray-800 text-xs">{kondisiUmum}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rangkuman Hasil Pemeriksaan & Gauge Tanaman Sehat */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* 2x2 Metric tiles */}
                <div className="lg:col-span-7 bg-white rounded-xl p-4 border border-gray-100 shadow-xs">
                  <div className="flex items-center gap-2 text-gray-800 font-bold text-xs mb-3">
                    <i className="ri-bar-chart-box-line text-[#055127] text-sm"></i>
                    <span>Rangkuman Hasil Pemeriksaan</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-base">
                        <i className="ri-map-2-line"></i>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">Luas Lahan</span>
                        <span className="font-bold text-gray-900 text-xs">{displayLuasLahan}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-base">
                        <i className="ri-seedling-line"></i>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">Jumlah Tanaman</span>
                        <span className="font-bold text-gray-900 text-xs">{tanamanSesuai.toLocaleString('id-ID')} tanaman</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-base">
                        <i className="ri-leaf-line"></i>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">Tanaman Sehat</span>
                        <span className="font-bold text-emerald-700 text-xs">
                          {Math.round(tanamanSesuai * 0.984).toLocaleString('id-ID')} tanaman <span className="text-[10px] font-normal text-emerald-600">(98,4%)</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-rose-100 bg-rose-50/30 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center text-base">
                        <i className="ri-alert-line"></i>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">Tanaman Off Type</span>
                        <span className="font-bold text-rose-600 text-xs">
                          {tanamanOffType} tanaman <span className="text-[10px] font-normal text-rose-500">({offTypePercentFormatted}%)</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gauge Tanaman Sehat */}
                <div className="lg:col-span-5 bg-white rounded-xl p-4 border border-gray-100 shadow-xs flex flex-col justify-center">
                  <span className="text-[11px] font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                    <i className="ri-donut-chart-line text-[#055127]"></i>
                    Persentase Tanaman Sehat
                  </span>

                  <div className="flex items-center justify-center gap-5">
                    <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="36" stroke="#fee2e2" strokeWidth="7" fill="transparent" />
                        <circle
                          cx="48"
                          cy="48"
                          r="36"
                          stroke="#059669"
                          strokeWidth="7"
                          strokeDasharray={2 * Math.PI * 36}
                          strokeDashoffset={2 * Math.PI * 36 * (1 - 0.984)}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-base font-extrabold text-gray-900 leading-tight">98,4%</span>
                        <span className="text-[9px] text-gray-400">Tanaman Sehat</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex-shrink-0"></span>
                        <div>
                          <span className="font-bold text-gray-800">Sehat</span>
                          <span className="text-[10px] text-gray-500 block">976 tanaman (98,4%)</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0"></span>
                        <div>
                          <span className="font-bold text-gray-800">Off Type</span>
                          <span className="text-[10px] text-gray-500 block">{tanamanOffType} tanaman ({offTypePercentFormatted}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detail Hasil Pemeriksaan Table */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-900 text-xs">
                  <i className="ri-table-line text-[#055127] text-sm"></i>
                  <span>Detail Hasil Pemeriksaan</span>
                </div>

                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 text-[11px] font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">No</th>
                      <th className="py-2.5 px-3">Parameter</th>
                      <th className="py-2.5 px-3">Hasil</th>
                      <th className="py-2.5 px-3">Standar</th>
                      <th className="py-2.5 px-3 text-center w-24">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {parameterHasilRows.map((row) => (
                      <tr key={row.no} className="hover:bg-gray-50/50">
                        <td className="py-2.5 px-3 text-center text-gray-400">{row.no}</td>
                        <td className="py-2.5 px-3 font-medium text-gray-800">{row.parameter}</td>
                        <td className="py-2.5 px-3 text-gray-700 font-semibold">{row.hasil}</td>
                        <td className="py-2.5 px-3 text-gray-500">{row.standar}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <i className="ri-check-line text-xs"></i>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Catatan Pemeriksaan Strip */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-2.5">
                <i className="ri-checkbox-circle-fill text-emerald-600 text-base mt-0.5"></i>
                <div className="text-xs">
                  <span className="font-bold text-emerald-950 block">Catatan Pemeriksaan</span>
                  <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
                    Tanaman tumbuh dengan baik, kondisi lahan cukup lembab. Terdapat serangan hama ringan pada beberapa titik, namun masih dalam batas aman.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
              STEP 3: TEMUAN OFF TYPE
              ------------------------------------------------------------- */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Filter Row */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-gray-800 font-bold text-xs">
                  <i className="ri-filter-3-line text-[#055127] text-sm"></i>
                  <span>Daftar Temuan Off Type</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-center">
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value="12/10/2026 - 12/10/2026"
                      className="w-full px-3 py-2 bg-gray-50/70 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 cursor-default"
                    />
                  </div>

                  <div>
                    <select
                      value={filterKarakter}
                      onChange={(e) => setFilterKarakter(e.target.value)}
                      className="w-full px-2.5 py-2 bg-gray-50/70 border border-gray-200 rounded-lg text-xs font-medium text-gray-700"
                    >
                      <option value="Semua Karakter">Semua Karakter</option>
                      <option value="Bentuk daun">Bentuk daun</option>
                      <option value="Warna batang">Warna batang</option>
                      <option value="Tinggi tanaman">Tinggi tanaman</option>
                      <option value="Bentuk buah">Bentuk buah</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={filterJumlah}
                      onChange={(e) => setFilterJumlah(e.target.value)}
                      className="w-full px-2.5 py-2 bg-gray-50/70 border border-gray-200 rounded-lg text-xs font-medium text-gray-700"
                    >
                      <option value="Semua Jumlah">Semua Jumlah</option>
                      <option value="1">1 Tanaman</option>
                      <option value="2">2 Tanaman</option>
                      <option value="3">3 Tanaman</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={filterKeterangan}
                      onChange={(e) => setFilterKeterangan(e.target.value)}
                      className="w-full px-2.5 py-2 bg-gray-50/70 border border-gray-200 rounded-lg text-xs font-medium text-gray-700"
                    >
                      <option value="Semua Keterangan">Semua Keterangan</option>
                    </select>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="w-full px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <i className="ri-add-line text-sm"></i>
                      Filter
                    </button>
                  </div>
                </div>
              </div>

              {/* Table Temuan Off Type */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 text-[11px] font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={selectedOffTypeIds.length === temuanOffTypeList.length}
                          onChange={() => {
                            if (selectedOffTypeIds.length === temuanOffTypeList.length) {
                              setSelectedOffTypeIds([]);
                            } else {
                              setSelectedOffTypeIds(temuanOffTypeList.map((t) => t.no));
                            }
                          }}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </th>
                      <th className="py-2.5 px-2 w-10 text-center">No</th>
                      <th className="py-2.5 px-3">Jenis Karakter</th>
                      <th className="py-2.5 px-3 text-center w-16">Jumlah</th>
                      <th className="py-2.5 px-3">Keterangan</th>
                      <th className="py-2.5 px-3 text-center w-16">Foto</th>
                      <th className="py-2.5 px-3 text-center w-16">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {temuanOffTypeList.map((item) => (
                      <tr key={item.no} className="hover:bg-gray-50/50">
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedOffTypeIds.includes(item.no)}
                            onChange={() => {
                              if (selectedOffTypeIds.includes(item.no)) {
                                setSelectedOffTypeIds(selectedOffTypeIds.filter((id) => id !== item.no));
                              } else {
                                setSelectedOffTypeIds([...selectedOffTypeIds, item.no]);
                              }
                            }}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-center text-gray-400">{item.no}</td>
                        <td className="py-2.5 px-3 font-semibold text-gray-900">{item.jenisKarakter}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-gray-800">{item.jumlah}</td>
                        <td className="py-2.5 px-3 text-gray-600">{item.keterangan}</td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 inline-block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.foto}
                              alt={item.jenisKarakter}
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            className="w-7 h-7 rounded-lg text-emerald-700 hover:bg-emerald-50 inline-flex items-center justify-center transition-colors"
                          >
                            <i className="ri-eye-line text-sm"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Bottom summary info strip */}
                <div className="p-3 border-t border-gray-100 bg-emerald-50/40 flex items-center gap-2 text-xs text-emerald-800">
                  <i className="ri-information-line text-emerald-600 text-sm"></i>
                  <span>
                    Total temuan off type pada pemeriksaan ini: <strong>{tanamanOffType} tanaman</strong> dari {jumlahTanamanDiamati.toLocaleString('id-ID')} tanaman yang diamati ({offTypePercentFormatted}%).
                  </span>
                </div>

                {/* Pagination */}
                <div className="p-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Menampilkan 1 - 4 dari 4 data</span>
                  <div className="flex items-center gap-1">
                    <button type="button" disabled className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-300">
                      <i className="ri-arrow-left-s-line"></i>
                    </button>
                    <span className="w-6 h-6 rounded bg-[#055127] text-white font-bold flex items-center justify-center text-[10px]">
                      1
                    </span>
                    <button type="button" disabled className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-300">
                      <i className="ri-arrow-right-s-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
              STEP 4: DOKUMENTASI
              ------------------------------------------------------------- */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fadeIn">
              {/* Foto Kegiatan Section */}
              <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-800 font-bold text-xs">
                    <i className="ri-camera-line text-[#055127] text-sm"></i>
                    <span>Foto Kegiatan</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Pilih foto dokumentasi dari perangkat Anda')}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1 transition-colors"
                  >
                    <i className="ri-add-line text-sm"></i>
                    Tambah Foto
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* 2x3 grid thumbnails */}
                  <div className="md:col-span-6 grid grid-cols-3 gap-2">
                    {photoGallery.map((photo, index) => {
                      const isSelected = activePhotoIdx === index;
                      return (
                        <div
                          key={photo.id}
                          onClick={() => setActivePhotoIdx(index)}
                          className={`aspect-square rounded-lg overflow-hidden border relative cursor-pointer group transition-all ${
                            isSelected ? 'ring-2 ring-emerald-600 border-transparent shadow-xs' : 'border-gray-200 hover:opacity-90'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.src}
                            alt={photo.name}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/60 text-white text-[9px] font-medium backdrop-blur-[1px]">
                            {index + 1}/6
                          </span>
                          <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-base">
                            <i className="ri-zoom-in-line"></i>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Large Active Photo Preview */}
                  <div className="md:col-span-6 flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-gray-900 relative">
                    <div className="relative aspect-video w-full flex-1 overflow-hidden bg-black/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoGallery[activePhotoIdx]?.src || photoGallery[0].src}
                        alt="Preview Foto"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        className="w-full h-full object-cover"
                      />
                      {/* Top bar indicators */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
                        {activePhotoIdx + 1}/6
                      </div>

                      {/* Navigation arrows */}
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : photoGallery.length - 1))}
                          className="w-6 h-6 rounded bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                        >
                          <i className="ri-arrow-left-s-line text-xs"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivePhotoIdx((prev) => (prev < photoGallery.length - 1 ? prev + 1 : 0))}
                          className="w-6 h-6 rounded bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                        >
                          <i className="ri-arrow-right-s-line text-xs"></i>
                        </button>
                      </div>
                    </div>

                    {/* Bottom info bar */}
                    <div className="p-2.5 bg-white border-t border-gray-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-gray-900 block text-[11px]">
                          {photoGallery[activePhotoIdx]?.name}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {photoGallery[activePhotoIdx]?.date} • {photoGallery[activePhotoIdx]?.size}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert(`Hapus foto ${photoGallery[activePhotoIdx]?.name}`)}
                        className="w-7 h-7 rounded text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                      >
                        <i className="ri-delete-bin-line text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dokumen Pendukung Section */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-900 text-xs">
                  <i className="ri-file-text-line text-[#055127] text-sm"></i>
                  <span>Dokumen Pendukung</span>
                </div>

                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 text-[11px] font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">No</th>
                      <th className="py-2.5 px-3">Nama Dokumen</th>
                      <th className="py-2.5 px-3 w-20">Tipe File</th>
                      <th className="py-2.5 px-3 w-20">Ukuran</th>
                      <th className="py-2.5 px-3 w-32">Tanggal Upload</th>
                      <th className="py-2.5 px-3 text-center w-20">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {supportingDocs.map((doc) => (
                      <tr key={doc.no} className="hover:bg-gray-50/50">
                        <td className="py-2.5 px-3 text-center text-gray-400">{doc.no}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded flex items-center justify-center text-sm ${doc.iconBg}`}>
                              <i className={doc.icon}></i>
                            </div>
                            <span className="font-semibold text-gray-800 text-[11px]">{doc.nama}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-gray-600 uppercase font-mono text-[11px]">{doc.tipe}</td>
                        <td className="py-2.5 px-3 text-gray-500 text-[11px]">{doc.ukuran}</td>
                        <td className="py-2.5 px-3 text-gray-500 text-[11px]">{doc.tanggal}</td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              title="Download dokumen"
                              className="w-6 h-6 rounded text-emerald-700 hover:bg-emerald-50 flex items-center justify-center transition-colors"
                            >
                              <i className="ri-download-line text-xs"></i>
                            </button>
                            <button
                              type="button"
                              title="Hapus dokumen"
                              className="w-6 h-6 rounded text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                            >
                              <i className="ri-delete-bin-line text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex items-center gap-2 text-[11px] text-gray-500">
                  <i className="ri-information-line text-gray-400 text-sm"></i>
                  <span>Maksimal ukuran file per dokumen adalah 10 MB. Format yang didukung: JPG, PNG, PDF, XLSX, DOCX, ZIP.</span>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
              STEP 5: RINGKASAN PEMERIKSAAN LAHAN
              ------------------------------------------------------------- */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-fadeIn">
              {/* Top 5 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg flex-shrink-0">
                    <i className="ri-map-2-line"></i>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Luas Lahan</span>
                    <div className="font-extrabold text-gray-900 text-sm">{displayLuasLahan}</div>
                    <span className="text-[9px] text-gray-400 block -mt-0.5">Total luas diperiksa</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg flex-shrink-0">
                    <i className="ri-plant-line"></i>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Jumlah Tanaman Diamati</span>
                    <div className="font-extrabold text-gray-900 text-sm">{jumlahTanamanDiamati.toLocaleString('id-ID')}</div>
                    <span className="text-[9px] text-gray-400 block -mt-0.5">Tanaman diamati</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg flex-shrink-0">
                    <i className="ri-checkbox-circle-line"></i>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Tanaman Sesuai Varietas</span>
                    <div className="font-extrabold text-emerald-700 text-sm">{tanamanSesuai.toLocaleString('id-ID')}</div>
                    <span className="text-[9px] text-emerald-600 block -mt-0.5">{kemurnianFormatted}% dari total</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg flex-shrink-0">
                    <i className="ri-alert-line"></i>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Tanaman Off Type</span>
                    <div className="font-extrabold text-rose-600 text-sm">{tanamanOffType}</div>
                    <span className="text-[9px] text-rose-500 block -mt-0.5">{offTypePercentFormatted}% dari total</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg flex-shrink-0">
                    <i className="ri-award-line"></i>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Status Pemeriksaan</span>
                    <div className="font-extrabold text-emerald-700 text-xs truncate">{statusPemeriksaan}</div>
                    <span className="text-[9px] text-gray-400 block -mt-0.5">Standar varietas</span>
                  </div>
                </div>
              </div>

              {/* Split: Komposisi Tanaman Off Type (Left) & Persentase Kemurnian Gauge (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Komposisi Tanaman Off Type */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                  <div className="p-3.5 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-900 text-xs">
                    <i className="ri-pie-chart-line text-[#055127] text-sm"></i>
                    <span>Komposisi Tanaman Off Type</span>
                  </div>

                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 text-[11px] font-semibold">
                      <tr>
                        <th className="py-2 px-3 w-10 text-center">No</th>
                        <th className="py-2 px-3">Jenis Karakter</th>
                        <th className="py-2 px-3 text-center w-20">Jumlah</th>
                        <th className="py-2 px-3 text-center w-24">Persentase</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-2 px-3 text-center text-gray-400">1</td>
                        <td className="py-2 px-3 font-medium text-gray-800">Bentuk daun</td>
                        <td className="py-2 px-3 text-center font-bold text-gray-800">3</td>
                        <td className="py-2 px-3 text-center text-gray-700 font-semibold">37,5%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-center text-gray-400">2</td>
                        <td className="py-2 px-3 font-medium text-gray-800">Warna batang</td>
                        <td className="py-2 px-3 text-center font-bold text-gray-800">2</td>
                        <td className="py-2 px-3 text-center text-gray-700 font-semibold">25,0%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-center text-gray-400">3</td>
                        <td className="py-2 px-3 font-medium text-gray-800">Tinggi tanaman</td>
                        <td className="py-2 px-3 text-center font-bold text-gray-800">2</td>
                        <td className="py-2 px-3 text-center text-gray-700 font-semibold">25,0%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-center text-gray-400">4</td>
                        <td className="py-2 px-3 font-medium text-gray-800">Bentuk buah</td>
                        <td className="py-2 px-3 text-center font-bold text-gray-800">1</td>
                        <td className="py-2 px-3 text-center text-gray-700 font-semibold">12,5%</td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-sky-50/60 font-bold border-t border-sky-100 text-sky-950">
                      <tr>
                        <td colSpan={2} className="py-2 px-3">Total Off Type</td>
                        <td className="py-2 px-3 text-center">{tanamanOffType}</td>
                        <td className="py-2 px-3 text-center">100%</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Right: Persentase Kemurnian Gauge */}
                <div className="lg:col-span-5 bg-white rounded-xl p-4 border border-gray-100 shadow-xs flex flex-col justify-center">
                  <span className="text-[11px] font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                    <i className="ri-donut-chart-line text-[#055127]"></i>
                    Persentase Kemurnian
                  </span>

                  <div className="flex items-center justify-center gap-5">
                    <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle cx="56" cy="56" r="42" stroke="#fee2e2" strokeWidth="8" fill="transparent" />
                        <circle
                          cx="56"
                          cy="56"
                          r="42"
                          stroke="#059669"
                          strokeWidth="8"
                          strokeDasharray={2 * Math.PI * 42}
                          strokeDashoffset={2 * Math.PI * 42 * (1 - kemurnianVal / 100)}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-extrabold text-gray-900 leading-tight">{kemurnianFormatted}%</span>
                        <span className="text-[9px] text-gray-400">Kemurnian</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex-shrink-0"></span>
                        <div>
                          <span className="font-bold text-gray-800">Sesuai Varietas</span>
                          <span className="text-[10px] text-gray-500 block">
                            {kemurnianFormatted}% ({tanamanSesuai.toLocaleString('id-ID')} tanaman)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0"></span>
                        <div>
                          <span className="font-bold text-gray-800">Off Type</span>
                          <span className="text-[10px] text-gray-500 block">
                            {offTypePercentFormatted}% ({tanamanOffType} tanaman)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: Catatan Pemeriksaan Card */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-3">
                <i className="ri-checkbox-circle-fill text-emerald-600 text-lg mt-0.5"></i>
                <div className="text-xs space-y-1">
                  <span className="font-bold text-emerald-950 block">Catatan Pemeriksaan</span>
                  <p className="text-emerald-900 text-[11px] leading-relaxed">
                    Kondisi tanaman dalam lahan baik, dengan tingkat kemurnian <strong>{kemurnianFormatted}%</strong> dan ketidaksesuaian (off type) sebesar <strong>{offTypePercentFormatted}%</strong>.
                  </p>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    <strong>Rekomendasi:</strong> Lanjutkan monitoring dan lakukan roguing pada tanaman yang teridentifikasi off type.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================================================================
            MODAL FOOTER: Navigation buttons (Batal, Sebelumnya, Selanjutnya, Simpan)
            ================================================================ */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-white flex items-center justify-end gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <i className="ri-close-line text-sm"></i>
            Batal
          </button>

          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <i className="ri-arrow-left-line text-sm"></i>
              Sebelumnya
            </button>
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 5))}
              className="px-5 py-2 bg-[#055127] hover:bg-[#04401f] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Selanjutnya</span>
              <i className="ri-arrow-right-line text-sm"></i>
            </button>
          ) : (
            <button
              type="button"
              disabled={saving}
              onClick={handleSimpanPemeriksaan}
              className="px-6 py-2 bg-[#055127] hover:bg-[#04401f] disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              {saving ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-sm"></i>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <i className="ri-check-line text-sm"></i>
                  <span>Simpan</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
      </div>
    </div>
  );
}
