"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { commodityService } from '@/app/services/commodityService';
import { varietyService } from '@/app/services/varietyService';
import { partnerService } from '@/app/services/partnerService';
import { greenhouseService } from '@/app/services/greenhouseService';
import { perencanaanProduksiService } from '@/app/services/perencanaanProduksiService';
import { Commodity } from '@/app/types/commodity';
import { Variety } from '@/app/types/variety';
import { Partner } from '@/app/types/partner';
import { Land } from '@/app/types/greenhouse';
import { PerencanaanProduksiPetani } from '@/app/types/perencanaanProduksi';
import { parseVarietyData } from '@/app/(components)/(content-layout)/master/varietas/varietyHelper';

export default function TambahPerencanaanProduksiPage() {
  const router = useRouter();

  // Master data states
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [allPartners, setAllPartners] = useState<Partner[]>([]);
  const [allLands, setAllLands] = useState<Land[]>([]);
  const [isLoadingMaster, setIsLoadingMaster] = useState(true);

  // Form states - Informasi Utama
  const [noPerencanaan, setNoPerencanaan] = useState('');
  const [selectedCommodityId, setSelectedCommodityId] = useState('');
  const [selectedCommodityName, setSelectedCommodityName] = useState('');
  const [selectedVarietyId, setSelectedVarietyId] = useState('');
  const [selectedVarietyName, setSelectedVarietyName] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [targetProduksi, setTargetProduksi] = useState<number | ''>('');
  const [metodeProduksi, setMetodeProduksi] = useState('Pindah Tanam');
  const [status, setStatus] = useState('Draft');
  const [catatan, setCatatan] = useState('');

  // Petani Distribution List
  const [petaniList, setPetaniList] = useState<PerencanaanProduksiPetani[]>([]);

  // Modal Tambah/Edit Petani state
  const [isPetaniModalOpen, setIsPetaniModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [modalPetaniData, setModalPetaniData] = useState<PerencanaanProduksiPetani>({
    partnerId: '',
    namaPetani: '',
    greenhouseId: '',
    namaLahan: '',
    luasLahan: 0,
    targetProduksi: 0,
    tanggalTanam: '',
    tanggalPanen: '',
    keterangan: '',
  });

  // Submit loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load initial master data: Commodities, Partners, Lands
  useEffect(() => {
    async function loadMasterData() {
      setIsLoadingMaster(true);
      try {
        const [commRes, partRes, landRes] = await Promise.all([
          commodityService.getCommodities({ status: 'Aktif' }).catch(() => ({ data: [] })),
          partnerService.getPartners({ pageSize: 100, status: 'Aktif' }).catch(() => ({ data: [] })),
          greenhouseService.getLands({ pageSize: 100, status: 'Aktif' }).catch(() => ({ data: [] })),
        ]);

        setCommodities(commRes.data || []);
        setAllPartners(partRes.data || []);
        setAllLands(landRes.data || []);
      } catch (err) {
        console.error('Error loading master data:', err);
      } finally {
        setIsLoadingMaster(false);
      }
    }
    loadMasterData();
  }, []);

  // Fetch varieties when commodity changes
  useEffect(() => {
    if (!selectedCommodityId) {
      setVarieties([]);
      setSelectedVarietyId('');
      setSelectedVarietyName('');
      return;
    }

    async function loadVarieties() {
      try {
        const res = await varietyService.getVarieties({
          commodityId: selectedCommodityId,
          status: 'Aktif',
        });
        const parsed = (res.data || []).map((v: Variety) => parseVarietyData(v));
        setVarieties(parsed);
        setSelectedVarietyId('');
        setSelectedVarietyName('');
      } catch (err) {
        console.error('Error loading varieties:', err);
        setVarieties([]);
      }
    }
    loadVarieties();
  }, [selectedCommodityId]);

  // Filter partners based on selected commodity
  const filteredPartners = useMemo(() => {
    if (!selectedCommodityId && !selectedCommodityName) {
      return allPartners;
    }

    const matched = allPartners.filter((p) => {
      // Direct match via commodityId if connected
      if (p.commodityId && p.commodityId === selectedCommodityId) return true;
      // Match via komoditasUtama name
      if (p.komoditasUtama && selectedCommodityName) {
        const pKom = p.komoditasUtama.toLowerCase();
        const selKom = selectedCommodityName.toLowerCase();
        if (pKom.includes(selKom) || selKom.includes(pKom)) return true;
      }
      return false;
    });

    // If no specific match found, fallback to all partners so user is not blocked
    return matched.length > 0 ? matched : allPartners;
  }, [allPartners, selectedCommodityId, selectedCommodityName]);

  // Handle commodity selection
  const handleCommodityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedCommodityId(id);
    const found = commodities.find((c) => c.id === id);
    setSelectedCommodityName(found ? found.namaKomoditas : '');
  };

  // Handle variety selection
  const handleVarietyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedVarietyId(id);
    const found = varieties.find((v) => v.id === id);
    setSelectedVarietyName(found ? found.namaVarietas : '');
  };

  const selectedVariety = useMemo(() => {
    if (!selectedVarietyId) return null;
    return varieties.find((v) => v.id === selectedVarietyId) || null;
  }, [varieties, selectedVarietyId]);

  // Range parser helper functions
  const cleanNumber = (s: string): number => {
    let cleaned = s.trim();
    if (/\.\d{3}$/.test(cleaned) && !cleaned.includes(',')) {
      cleaned = cleaned.replace(/\./g, '');
    } else if (cleaned.includes(',') && !cleaned.includes('.')) {
      cleaned = cleaned.replace(',', '.');
    } else if (cleaned.includes('.') && cleaned.includes(',')) {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    }
    cleaned = cleaned.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned);
  };

  const parseRangeString = (val?: string | number | null): { min: number; max: number } | null => {
    if (val === undefined || val === null) return null;
    const str = String(val).trim();
    if (!str || str === '-') return null;

    if (str.includes('-')) {
      const parts = str.split('-');
      if (parts.length >= 2) {
        const min = cleanNumber(parts[0]);
        const max = cleanNumber(parts[1]);
        if (!isNaN(min) && !isNaN(max) && min >= 0 && max >= 0) {
          return {
            min: Math.min(min, max),
            max: Math.max(min, max),
          };
        }
      }
    }

    const num = cleanNumber(str);
    if (!isNaN(num) && num > 0) {
      return { min: num, max: num };
    }
    return null;
  };

  const formatNumberId = (num: number, maxFractionDigits: number = 2): string => {
    if (Number.isInteger(num)) {
      return num.toLocaleString('id-ID');
    }
    return num.toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxFractionDigits,
    });
  };

  const formatRangeDisplay = (min: number, max: number, maxFractionDigits: number = 2): string => {
    if (min === max) {
      return formatNumberId(min, maxFractionDigits);
    }
    return `${formatNumberId(min, maxFractionDigits)} - ${formatNumberId(max, maxFractionDigits)}`;
  };

  // Auto-calculated stats for Section 2
  const totalLuasLahan = useMemo(() => {
    return petaniList.reduce((acc, curr) => acc + (Number(curr.luasLahan) || 0), 0);
  }, [petaniList]);

  const jumlahPetani = useMemo(() => {
    const uniqueFarmers = new Set(petaniList.map((p) => p.partnerId || p.namaPetani).filter(Boolean));
    return uniqueFarmers.size;
  }, [petaniList]);

  // Perhitungan Kebutuhan Benih:
  // Rumus: (Target Produksi / Perkiraan Hasil Benih Varietas) * Kebutuhan Benih Varietas
  // Menghasilkan rentang x - x
  const kebutuhanBenihInfo = useMemo(() => {
    const target = Number(targetProduksi) || 0;
    if (target <= 0) {
      return { min: 0, max: 0, text: '0', nominal: 0 };
    }

    const yieldRange = parseRangeString(selectedVariety?.produksiParam?.perkiraanHasil || '300 - 500');
    const seedRateRange = parseRangeString(selectedVariety?.produksiParam?.kebutuhanBenih || '0,5 - 1');

    if (!yieldRange || yieldRange.max <= 0 || !seedRateRange) {
      const fallback = Math.round((target / 1000) * 20) || 5;
      return { min: fallback, max: fallback, text: formatNumberId(fallback), nominal: fallback };
    }

    // Luas acuan = Target Produksi / Perkiraan Hasil Maksimum Varietas (cth: 1000 / 500 = 2 ha)
    const baseYield = yieldRange.max > 0 ? yieldRange.max : yieldRange.min;
    const targetLuas = target / baseYield;

    const min = targetLuas * seedRateRange.min;
    const max = targetLuas * seedRateRange.max;

    const finalMin = Math.min(min, max);
    const finalMax = Math.max(min, max);

    return {
      min: finalMin,
      max: finalMax,
      text: formatRangeDisplay(finalMin, finalMax, 2),
      nominal: Math.round(finalMax * 100) / 100,
    };
  }, [targetProduksi, selectedVariety]);

  // Perhitungan Estimasi Hasil Panen:
  // Menghasilkan rentang x - x berdasarkan luas lahan & perkiraan hasil varietas
  const estimasiHasilPanenInfo = useMemo(() => {
    const target = Number(targetProduksi) || 0;
    const yieldRange = parseRangeString(selectedVariety?.produksiParam?.perkiraanHasil || '300 - 500');

    // Jika sudah ada lahan petani mitra yang didistribusikan
    if (totalLuasLahan > 0 && yieldRange) {
      const min = Math.round(totalLuasLahan * yieldRange.min);
      const max = Math.round(totalLuasLahan * yieldRange.max);
      return {
        min,
        max,
        text: formatRangeDisplay(min, max, 0),
        nominal: max,
      };
    }

    // Jika belum ada lahan petani mitra, dihitung dari luas acuan (Target / Perkiraan Hasil Maksimum)
    // Cth: 1000 / 500 = 2 ha -> (2 * 300) s/d (2 * 500) = 600 - 1.000 kg
    if (target > 0 && yieldRange && (yieldRange.max > 0 || yieldRange.min > 0)) {
      const baseYield = yieldRange.max > 0 ? yieldRange.max : yieldRange.min;
      const targetLuas = target / baseYield;
      const min = Math.round(targetLuas * yieldRange.min);
      const max = Math.round(targetLuas * yieldRange.max);
      return {
        min,
        max,
        text: formatRangeDisplay(min, max, 0),
        nominal: target,
      };
    }

    if (target > 0) {
      return { min: target, max: target, text: formatNumberId(target, 0), nominal: target };
    }

    return { min: 0, max: 0, text: '0', nominal: 0 };
  }, [totalLuasLahan, targetProduksi, selectedVariety]);

  // Petani Distribution Modal Handlers
  const handleOpenTambahPetani = () => {
    setEditingIndex(null);
    setModalPetaniData({
      partnerId: '',
      namaPetani: '',
      greenhouseId: '',
      namaLahan: '',
      luasLahan: 0,
      targetProduksi: 0,
      tanggalTanam: tanggalMulai || '',
      tanggalPanen: tanggalSelesai || '',
      keterangan: '',
    });
    setIsPetaniModalOpen(true);
  };

  const handleOpenEditPetani = (index: number) => {
    setEditingIndex(index);
    setModalPetaniData({ ...petaniList[index] });
    setIsPetaniModalOpen(true);
  };

  const handleDeletePetani = (index: number) => {
    setPetaniList((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePartnerSelectInModal = (partnerId: string) => {
    const partner = allPartners.find((p) => p.id === partnerId);
    if (partner) {
      // Check if partner has greenhouses linked
      const partnerLands = partner.greenhouses && partner.greenhouses.length > 0 ? partner.greenhouses : [];
      const defaultLand = partnerLands[0];
      setModalPetaniData((prev) => ({
        ...prev,
        partnerId: partner.id,
        namaPetani: partner.namaPetani,
        greenhouseId: defaultLand ? defaultLand.id : '',
        namaLahan: defaultLand ? defaultLand.namaLahan : prev.namaLahan || '',
        luasLahan: prev.luasLahan || partner.luasLahan || 0,
      }));
    } else {
      setModalPetaniData((prev) => ({
        ...prev,
        partnerId: '',
        namaPetani: '',
      }));
    }
  };

  const handleSaveModalPetani = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalPetaniData.namaPetani.trim()) {
      Swal.fire('Peringatan', 'Silakan pilih petani terlebih dahulu.', 'warning');
      return;
    }

    if (editingIndex !== null) {
      // Edit existing
      setPetaniList((prev) => {
        const copy = [...prev];
        copy[editingIndex] = { ...modalPetaniData };
        return copy;
      });
    } else {
      // Add new
      setPetaniList((prev) => [...prev, { ...modalPetaniData }]);
    }

    setIsPetaniModalOpen(false);
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCommodityName) {
      Swal.fire('Peringatan', 'Silakan pilih komoditas terlebih dahulu.', 'warning');
      return;
    }
    if (!selectedVarietyName) {
      Swal.fire('Peringatan', 'Silakan pilih varietas terlebih dahulu.', 'warning');
      return;
    }
    if (!targetProduksi || Number(targetProduksi) <= 0) {
      Swal.fire('Peringatan', 'Target produksi harus lebih dari 0.', 'warning');
      return;
    }
    if (!tanggalMulai || !tanggalSelesai) {
      Swal.fire('Peringatan', 'Silakan tentukan periode tanggal mulai dan tanggal selesai.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      // Format periode string e.g. "01/06/2026 - 30/06/2026"
      const formatPeriodDate = (d: string) => {
        if (!d) return '';
        const [y, m, day] = d.split('-');
        return `${day}/${m}/${y}`;
      };
      const periodeString = `${formatPeriodDate(tanggalMulai)} - ${formatPeriodDate(tanggalSelesai)}`;

      const payload = {
        noPerencanaan: noPerencanaan.trim() || undefined,
        commodityId: selectedCommodityId || null,
        komoditas: selectedCommodityName,
        varietyId: selectedVarietyId || null,
        varietas: selectedVarietyName,
        periode: periodeString,
        periodeMulai: new Date(tanggalMulai).toISOString(),
        periodeSelesai: new Date(tanggalSelesai).toISOString(),
        targetProduksi: Number(targetProduksi),
        aktualProduksi: 0,
        produksiTerpenuhi: 0,
        metodeTanam: metodeProduksi,
        status: status,
        catatan: catatan || null,
        targetLuasLahan: totalLuasLahan > 0
          ? totalLuasLahan
          : (Number(targetProduksi) > 0 && selectedVariety?.produksiParam?.perkiraanHasil
              ? Number((Number(targetProduksi) / (parseRangeString(selectedVariety.produksiParam.perkiraanHasil)?.max || 500)).toFixed(2))
              : Number((Number(targetProduksi) / 5000).toFixed(2))),
        lahanTersedia: totalLuasLahan > 0 ? totalLuasLahan : 0,
        realisasiTanam: 0,
        kebutuhanBenih: kebutuhanBenihInfo.nominal,
        estimasiHasilPerHa: totalLuasLahan > 0
          ? Number((Number(targetProduksi) / totalLuasLahan).toFixed(2))
          : (parseRangeString(selectedVariety?.produksiParam?.perkiraanHasil)?.max || 0),
        // First partner as default penanggung jawab if available
        partnerId: petaniList[0]?.partnerId || null,
        namaPetani: petaniList[0]?.namaPetani || null,
        greenhouseId: petaniList[0]?.greenhouseId || null,
        namaLahan: petaniList[0]?.namaLahan || null,
        petaniDistribusi: petaniList.map((p) => ({
          partnerId: p.partnerId || null,
          namaPetani: p.namaPetani,
          greenhouseId: p.greenhouseId || null,
          namaLahan: p.namaLahan || null,
          luasLahan: Number(p.luasLahan) || 0,
          targetProduksi: Number(p.targetProduksi) || 0,
          tanggalTanam: p.tanggalTanam ? new Date(p.tanggalTanam).toISOString() : null,
          tanggalPanen: p.tanggalPanen ? new Date(p.tanggalPanen).toISOString() : null,
          keterangan: p.keterangan || null,
        })),
      };

      const res = await perencanaanProduksiService.create(payload);

      if (res.success) {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Rencana produksi baru berhasil disimpan.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        router.push('/produksi/perencanaan-produksi');
      } else {
        Swal.fire('Gagal', res.message || 'Gagal menyimpan rencana produksi', 'error');
      }
    } catch (err: any) {
      console.error('Error saving rencana produksi:', err);
      Swal.fire('Gagal', err.message || 'Terjadi kesalahan sistem saat menyimpan rencana produksi', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-12 text-gray-800">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2">
        <Link
          href="/produksi/perencanaan-produksi"
          className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Produksi
        </Link>
        <span className="text-gray-400">›</span>
        <Link
          href="/produksi/perencanaan-produksi"
          className="hover:text-emerald-600 transition-colors"
        >
          Perencanaan Produksi
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-700 font-semibold">Tambah Rencana Produksi</span>
      </nav>

      {/* Page Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Tambah Rencana Produksi</h1>
          <p className="text-xs text-gray-500 mt-0.5 font-normal">
            Buat rencana produksi baru dengan menentukan target, periode, komoditas, dan kebutuhan lainnya.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Informasi Utama */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
          {/* Section Header */}
          <div className="flex items-center gap-2.5 mb-5 pb-3.5 border-b border-gray-100">
            <span className="w-6 h-6 rounded-full bg-[#078836] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
              1
            </span>
            <h2 className="text-sm font-bold text-gray-800">Informasi Utama</h2>
          </div>

          {/* Section 1 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
            {/* No. Rencana Produksi */}
            <div className="md:col-span-4">
              <label className="block font-medium text-gray-700 mb-1.5">
                No. Rencana Produksi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={noPerencanaan}
                onChange={(e) => setNoPerencanaan(e.target.value)}
                placeholder="Auto generate / akan dibuat otomatis"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder:text-gray-400 placeholder:italic"
              />
            </div>

            {/* Komoditas */}
            <div className="md:col-span-4">
              <label className="block font-medium text-gray-700 mb-1.5">
                Komoditas <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <select
                  required
                  value={selectedCommodityId}
                  onChange={handleCommodityChange}
                  className="w-full pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                >
                  <option value="">Pilih komoditas</option>
                  {commodities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.namaKomoditas}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Varietas */}
            <div className="md:col-span-4">
              <label className="block font-medium text-gray-700 mb-1.5">
                Varietas <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <select
                  required
                  disabled={!selectedCommodityId}
                  value={selectedVarietyId}
                  onChange={handleVarietyChange}
                  className="w-full pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!selectedCommodityId ? 'Pilih komoditas terlebih dahulu' : 'Pilih varietas'}
                  </option>
                  {varieties.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.namaVarietas} ({v.kodeVarietas})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Periode Produksi */}
            <div className="md:col-span-4">
              <label className="block font-medium text-gray-700 mb-1.5">
                Periode Produksi <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="date"
                    required
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs"
                  />
                </div>
                <span className="text-gray-400 font-medium">-</span>
                <div className="relative flex-1">
                  <input
                    type="date"
                    required
                    value={tanggalSelesai}
                    onChange={(e) => setTanggalSelesai(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Target Produksi (kg) */}
            <div className="md:col-span-3">
              <label className="block font-medium text-gray-700 mb-1.5">
                Target Produksi (kg) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  placeholder="0"
                  value={targetProduksi}
                  onChange={(e) => setTargetProduksi(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs text-gray-500 font-medium">
                  kg
                </span>
              </div>
            </div>

            {/* Metode Produksi */}
            <div className="md:col-span-3">
              <label className="block font-medium text-gray-700 mb-1.5">
                Metode Produksi <span className="text-red-500">*</span>
              </label>
              <select
                value={metodeProduksi}
                onChange={(e) => setMetodeProduksi(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Pindah Tanam">Pindah Tanam</option>
                <option value="Tanam Langsung">Tanam Langsung</option>
              </select>
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label className="block font-medium text-gray-700 mb-1.5">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full pl-7 pr-7 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                >
                  <option value="Draft">Draft</option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Proses">Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <span className={`w-2 h-2 rounded-full ${status === 'Draft' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                </span>
              </div>
            </div>

            {/* Catatan / Keterangan */}
            <div className="md:col-span-12">
              <label className="block font-medium text-gray-700 mb-1.5">
                Catatan / Keterangan
              </label>
              <textarea
                rows={3}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Masukkan catatan tambahan terkait rencana produksi..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-y"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Rincian Kebutuhan Produksi */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
          {/* Section Header */}
          <div className="flex items-center gap-2.5 mb-4 pb-3.5 border-b border-gray-100">
            <span className="w-6 h-6 rounded-full bg-[#078836] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
              2
            </span>
            <h2 className="text-sm font-bold text-gray-800">Rincian Kebutuhan Produksi</h2>
          </div>

          {/* Info Notice Banner */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-emerald-800">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-normal leading-relaxed">
                Kebutuhan benih dihitung otomatis dari <span className="font-semibold">(Target Produksi ÷ Perkiraan Hasil) × Kebutuhan Benih Varietas</span>.
              </p>
            </div>
            {selectedVariety && (
              <div className="flex items-center gap-2 shrink-0 bg-white/80 border border-emerald-200/60 px-2.5 py-1 rounded-lg text-[11px] text-emerald-800 font-medium">
                <span>Varietas: <strong className="font-bold text-emerald-950">{selectedVariety.namaVarietas}</strong></span>
                <span className="text-emerald-300">|</span>
                <span>Hasil: <strong>{selectedVariety.produksiParam?.perkiraanHasil || '300 - 500'} kg/ha</strong></span>
                <span className="text-emerald-300">|</span>
                <span>Benih: <strong>{selectedVariety.produksiParam?.kebutuhanBenih || '0,5 - 1'} kg/ha</strong></span>
              </div>
            )}
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Kebutuhan Benih */}
            <div className="p-4 rounded-xl border border-gray-200/80 bg-white flex items-center gap-3.5 shadow-2xs hover:border-emerald-300 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-medium text-gray-500 block">Kebutuhan Benih</span>
                <span className="text-base font-extrabold text-gray-900 tracking-tight block">
                  {kebutuhanBenihInfo.text} <span className="text-xs font-semibold text-gray-500">kg</span>
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5 truncate">
                  Rentang kebutuhan tanam
                </span>
              </div>
            </div>

            {/* Luas Lahan */}
            <div className="p-4 rounded-xl border border-gray-200/80 bg-white flex items-center gap-3.5 shadow-2xs hover:border-emerald-300 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-medium text-gray-500 block">Luas Lahan</span>
                <span className="text-base font-extrabold text-gray-900 tracking-tight block">
                  {totalLuasLahan.toLocaleString('id-ID')} <span className="text-xs font-semibold text-gray-500">ha</span>
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5 truncate">
                  Total dari distribusi petani
                </span>
              </div>
            </div>

            {/* Jumlah Petani */}
            <div className="p-4 rounded-xl border border-gray-200/80 bg-white flex items-center gap-3.5 shadow-2xs hover:border-emerald-300 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-medium text-gray-500 block">Jumlah Petani</span>
                <span className="text-base font-extrabold text-gray-900 tracking-tight block">
                  {jumlahPetani} <span className="text-xs font-semibold text-gray-500">orang</span>
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5 truncate">
                  Petani mitra terdaftar
                </span>
              </div>
            </div>

            {/* Estimasi Hasil Panen */}
            <div className="p-4 rounded-xl border border-gray-200/80 bg-white flex items-center gap-3.5 shadow-2xs hover:border-emerald-300 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-medium text-gray-500 block">Estimasi Hasil Panen</span>
                <span className="text-base font-extrabold text-gray-900 tracking-tight block">
                  {estimasiHasilPanenInfo.text} <span className="text-xs font-semibold text-gray-500">kg</span>
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5 truncate">
                  {totalLuasLahan > 0 ? `Dihitung dari ${totalLuasLahan} ha lahan` : 'Estimasi hasil panen varietas'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Rencana Distribusi ke Petani */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#078836] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                3
              </span>
              <h2 className="text-sm font-bold text-gray-800">Rencana Distribusi ke Petani</h2>
            </div>
            <button
              type="button"
              onClick={handleOpenTambahPetani}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#078836] hover:bg-[#06732e] rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Tambah Petani</span>
            </button>
          </div>

          {/* Table / Empty State */}
          <div className="overflow-x-auto rounded-lg border border-gray-200/80">
            <table className="w-full text-xs text-left text-gray-600">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200 text-[11px]">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">No.</th>
                  <th className="py-3 px-3">Petani</th>
                  <th className="py-3 px-3">Lahan</th>
                  <th className="py-3 px-3 text-right">Luas Lahan (ha)</th>
                  <th className="py-3 px-3 text-right">Target Produksi (kg)</th>
                  <th className="py-3 px-3 text-center">Tanggal Tanam (Est.)</th>
                  <th className="py-3 px-3 text-center">Tanggal Panen (Est.)</th>
                  <th className="py-3 px-3">Keterangan</th>
                  <th className="py-3 px-3 text-center w-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {petaniList.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-2">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-gray-600">Belum ada data petani</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Klik tombol Tambah Petani untuk menambahkan data.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  petaniList.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 text-center font-medium text-gray-500">{idx + 1}</td>
                      <td className="py-3 px-3 font-semibold text-emerald-800">{row.namaPetani}</td>
                      <td className="py-3 px-3 text-gray-700">{row.namaLahan || '-'}</td>
                      <td className="py-3 px-3 text-right font-medium text-gray-800">{row.luasLahan}</td>
                      <td className="py-3 px-3 text-right font-semibold text-emerald-700">
                        {Number(row.targetProduksi).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-center text-gray-600">
                        {row.tanggalTanam ? row.tanggalTanam : '-'}
                      </td>
                      <td className="py-3 px-3 text-center text-gray-600">
                        {row.tanggalPanen ? row.tanggalPanen : '-'}
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-[11px] max-w-xs truncate">
                        {row.keterangan || '-'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditPetani(idx)}
                            className="p-1 text-gray-400 hover:text-sky-600 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePetani(idx)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Hapus"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/produksi/perencanaan-produksi"
            className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Batal</span>
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#078836] hover:bg-[#06732e] rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Simpan</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal Tambah / Edit Petani Mitra */}
      {isPetaniModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150 text-xs">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-800">
                  {editingIndex !== null ? 'Edit Distribusi Petani' : 'Tambah Distribusi Petani'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPetaniModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModalPetani} className="p-5 space-y-3.5">
              {/* Petani Mitra Dropdown */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Petani Mitra <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={modalPetaniData.partnerId || ''}
                  onChange={(e) => handlePartnerSelectInModal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Pilih petani mitra</option>
                  {filteredPartners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.namaPetani} ({p.kelompokTani} - Komoditas: {p.komoditasUtama || 'Umum'})
                    </option>
                  ))}
                </select>
                {selectedCommodityName && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    Petani difilter berdasarkan komoditas: <span className="font-semibold text-emerald-700">{selectedCommodityName}</span>
                  </p>
                )}
              </div>

              {/* Lahan / Greenhouse */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Lahan / Greenhouse</label>
                <select
                  value={modalPetaniData.greenhouseId || ''}
                  onChange={(e) => {
                    const id = e.target.value;
                    const found = allLands.find((l) => l.id === id);
                    setModalPetaniData((prev) => ({
                      ...prev,
                      greenhouseId: id,
                      namaLahan: found ? found.namaLahan : '',
                      luasLahan: found ? found.luas : prev.luasLahan,
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Pilih lahan / greenhouse</option>
                  {allLands.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.namaLahan} ({l.kodeLahan} - {l.luas} ha)
                    </option>
                  ))}
                </select>
              </div>

              {/* Luas Lahan & Target Produksi */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Luas Lahan (ha)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={modalPetaniData.luasLahan}
                    onChange={(e) =>
                      setModalPetaniData((prev) => ({
                        ...prev,
                        luasLahan: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Target Produksi (kg)</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={modalPetaniData.targetProduksi}
                    onChange={(e) =>
                      setModalPetaniData((prev) => ({
                        ...prev,
                        targetProduksi: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Tanggal Tanam & Tanggal Panen Est. */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Tanggal Tanam (Est.)</label>
                  <input
                    type="date"
                    value={modalPetaniData.tanggalTanam || ''}
                    onChange={(e) =>
                      setModalPetaniData((prev) => ({
                        ...prev,
                        tanggalTanam: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Tanggal Panen (Est.)</label>
                  <input
                    type="date"
                    value={modalPetaniData.tanggalPanen || ''}
                    onChange={(e) =>
                      setModalPetaniData((prev) => ({
                        ...prev,
                        tanggalPanen: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Keterangan</label>
                <input
                  type="text"
                  placeholder="Catatan penugasan petani..."
                  value={modalPetaniData.keterangan || ''}
                  onChange={(e) =>
                    setModalPetaniData((prev) => ({
                      ...prev,
                      keterangan: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPetaniModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#078836] hover:bg-[#06732e] rounded-lg transition-colors shadow-xs"
                >
                  {editingIndex !== null ? 'Simpan Perubahan' : 'Tambahkan Petani'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
