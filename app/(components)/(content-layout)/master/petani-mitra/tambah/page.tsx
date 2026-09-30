"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';

import Seo from '@/shared/layouts-components/seo/seo';
import api from '@/app/lib/axios';
import penanggungJawabService from '@/app/services/penanggungJawabService';
import commodityService from '@/app/services/commodityService';
import varietyService from '@/app/services/varietyService';
import partnerService from '@/app/services/partnerService';

import { Commodity } from '@/app/types/commodity';
import { Variety } from '@/app/types/variety';
import { PenanggungJawab } from '@/app/types/penanggungJawab';

import ModalTambahLahan, { LahanItem } from './component/ModalTambahLahan';
import PetaDaftarLahan from './component/PetaDaftarLahan';

interface UploadedDoc {
  id: string;
  name: string;
  size: string;
  type: string;
  file?: File;
}

export default function TambahPetaniMitraPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Master Data States
  const [penanggungJawabList, setPenanggungJawabList] = useState<PenanggungJawab[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [isLoadingMaster, setIsLoadingMaster] = useState(true);

  // Form State: Informasi Petani
  const [kodePetani, setKodePetani] = useState('PM-001');
  const [namaPetani, setNamaPetani] = useState('');
  const [nik, setNik] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [kelompokTani, setKelompokTani] = useState('');
  const [komoditasUtama, setKomoditasUtama] = useState('');
  const [status, setStatus] = useState<'Aktif' | 'Non Aktif'>('Aktif');

  // Form State: Informasi Rekening
  const [namaBank, setNamaBank] = useState('');
  const [noRekening, setNoRekening] = useState('');
  const [atasNama, setAtasNama] = useState('');

  // Form State: Informasi Legal (Dokumen) - Awalnya harus kosong
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);

  // Form State: Catatan
  const [catatan, setCatatan] = useState('');

  // Form State: Daftar Lahan Petani (Points on Map) - Awalnya harus kosong
  const [lahanList, setLahanList] = useState<LahanItem[]>([]);

  // Modal Lahan State
  const [isLahanModalOpen, setIsLahanModalOpen] = useState(false);
  const [editingLahanIndex, setEditingLahanIndex] = useState<number | null>(null);

  // Submit Loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bank Options
  const bankOptions = ['BCA', 'Mandiri', 'BRI'];

  // Load Master Data concurrently with multi-tiered resilient individual fallbacks
  useEffect(() => {
    const fetchMasterData = async () => {
      setIsLoadingMaster(true);
      try {
        const [pjRes, comRes, varRes, partnerRes] = await Promise.all([
          penanggungJawabService
            .getPenanggungJawab({ pageSize: 100, status: 'Aktif' })
            .catch(async (err) => {
              console.warn('Error fetching penanggung jawab, fallback to api.get:', err);
              try {
                const res = await api.get('/master/penanggung-jawab', { params: { pageSize: 100, status: 'Aktif' } });
                return res.data;
              } catch {
                return { status: 'error', data: [] } as any;
              }
            }),
          commodityService
            .getCommodities({ pageSize: 1000 })
            .catch(async (err) => {
              console.warn('Error fetching commodities, fallback to api.get:', err);
              try {
                const res = await api.get('/master/commodity', { params: { pageSize: 1000 } });
                return res.data;
              } catch {
                return { status: 'error', data: [] } as any;
              }
            }),
          varietyService
            .getVarieties({ pageSize: 1000 })
            .catch(async (err) => {
              console.warn('Error fetching varieties, fallback to api.get:', err);
              try {
                const res = await api.get('/master/variety', { params: { pageSize: 1000 } });
                return res.data;
              } catch {
                return { status: 'error', data: [] } as any;
              }
            }),
          partnerService
            .getPartners({ pageSize: 1 })
            .catch(async (err) => {
              console.warn('Error fetching partner count, fallback to api.get:', err);
              try {
                const res = await api.get('/master/partner', { params: { pageSize: 1 } });
                return res.data;
              } catch {
                return { pagination: { totalItems: 0 } } as any;
              }
            }),
        ]);

        // 1. Penanggung Jawab for Kelompok Tani
        let pjList = Array.isArray(pjRes?.data)
          ? pjRes.data
          : Array.isArray(pjRes?.items)
          ? pjRes.items
          : Array.isArray(pjRes)
          ? pjRes
          : [];
        if (pjList.length === 0) {
          try {
            const fallbackPj = await api.get('/master/penanggung-jawab?pageSize=100&status=Aktif');
            if (Array.isArray(fallbackPj.data?.data)) pjList = fallbackPj.data.data;
            else if (Array.isArray(fallbackPj.data)) pjList = fallbackPj.data;
          } catch (e) {
            console.error('Final fallback penanggung jawab error:', e);
          }
        }
        setPenanggungJawabList(pjList);

        // 2. Master Komoditas
        let comList = Array.isArray(comRes?.data)
          ? comRes.data
          : Array.isArray(comRes?.items)
          ? comRes.items
          : Array.isArray(comRes)
          ? comRes
          : [];
        if (comList.length === 0) {
          try {
            const fallbackCom = await api.get('/master/commodity?pageSize=1000');
            if (Array.isArray(fallbackCom.data?.data)) comList = fallbackCom.data.data;
            else if (Array.isArray(fallbackCom.data)) comList = fallbackCom.data;
          } catch (e) {
            console.error('Final fallback commodity error:', e);
          }
        }
        setCommodities(comList);

        // 3. Master Varietas
        let varList = Array.isArray(varRes?.data)
          ? varRes.data
          : Array.isArray(varRes?.items)
          ? varRes.items
          : Array.isArray(varRes)
          ? varRes
          : [];
        if (varList.length === 0) {
          try {
            const fallbackVar = await api.get('/master/variety?pageSize=1000');
            if (Array.isArray(fallbackVar.data?.data)) varList = fallbackVar.data.data;
            else if (Array.isArray(fallbackVar.data)) varList = fallbackVar.data;
          } catch (e) {
            console.error('Final fallback variety error:', e);
          }
        }
        setVarieties(varList);

        // 4. Generate next Kode Petani
        const totalExisting = partnerRes?.pagination?.totalItems ?? 0;
        setKodePetani(`PM-${String(totalExisting + 1).padStart(3, '0')}`);
      } catch (err) {
        console.error('Error fetching master data:', err);
      } finally {
        setIsLoadingMaster(false);
      }
    };

    fetchMasterData();
  }, []);

  // Regenerate Kode Petani manually
  const handleRegenerateCode = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setKodePetani(`PM-${randomNum}`);
    toast.info('Kode petani diperbarui');
  };

  // Upload Document Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    const newDocs: UploadedDoc[] = files.map((file, idx) => {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const sizeKB = (file.size / 1024).toFixed(0);
      const displaySize = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;
      const ext = file.name.split('.').pop() || 'doc';

      return {
        id: `${Date.now()}-${idx}`,
        name: file.name,
        size: displaySize,
        type: ext.toLowerCase(),
        file,
      };
    });

    setDocuments((prev) => [...prev, ...newDocs]);
    toast.success(`${files.length} dokumen berhasil ditambahkan`);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Lahan Handlers
  const handleOpenAddLahanModal = () => {
    setEditingLahanIndex(null);
    setIsLahanModalOpen(true);
  };

  const handleOpenEditLahanModal = (index: number) => {
    setEditingLahanIndex(index);
    setIsLahanModalOpen(true);
  };

  const handleDeleteLahan = (index: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus lahan ini?')) {
      setLahanList((prev) => prev.filter((_, idx) => idx !== index));
      toast.info('Lahan berhasil dihapus');
    }
  };

  const handleSaveLahanModal = (lahan: LahanItem) => {
    if (editingLahanIndex !== null) {
      setLahanList((prev) =>
        prev.map((item, idx) => (idx === editingLahanIndex ? lahan : item))
      );
      toast.success('Lahan berhasil diperbarui');
    } else {
      setLahanList((prev) => [...prev, lahan]);
      toast.success('Lahan baru berhasil ditambahkan');
    }
    setIsLahanModalOpen(false);
  };

  // Submit Handler
  const handleSaveForm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!namaPetani.trim()) {
      toast.error('Nama petani wajib diisi!');
      return;
    }
    if (!kodePetani.trim()) {
      toast.error('Kode petani wajib diisi!');
      return;
    }
    if (!nik.trim() || nik.length < 16) {
      toast.error('NIK wajib diisi 16 digit!');
      return;
    }
    if (!alamat.trim()) {
      toast.error('Alamat wajib diisi!');
      return;
    }
    if (!noHp.trim()) {
      toast.error('Nomor handphone wajib diisi!');
      return;
    }
    if (!kelompokTani.trim()) {
      toast.error('Kelompok tani wajib dipilih!');
      return;
    }
    if (!komoditasUtama.trim()) {
      toast.error('Komoditas utama wajib dipilih!');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCommodity = commodities.find(c => c.namaKomoditas === komoditasUtama);

      // Compute total luas from registered lahan
      const totalLuasHa = lahanList.reduce((acc, l) => acc + (l.luas / 10000), 0);

      const formData = new FormData();
      formData.append('kodePetani', kodePetani);
      formData.append('namaPetani', namaPetani);
      formData.append('kelompokTani', kelompokTani);
      formData.append('komoditasUtama', komoditasUtama);
      if (selectedCommodity) {
        formData.append('commodityId', selectedCommodity.id);
      }
      formData.append('noKtp', nik);
      formData.append('noTelepon', noHp);
      if (email) formData.append('email', email);
      formData.append('alamat', alamat);
      formData.append('luasLahan', totalLuasHa.toFixed(2));
      formData.append('status', status);

      // Rekening
      if (namaBank) formData.append('namaBank', namaBank);
      if (noRekening) formData.append('noRekening', noRekening);
      if (atasNama) formData.append('atasNama', atasNama);

      // Catatan
      if (catatan) formData.append('catatan', catatan);

      // Dokumen metadata JSON
      if (documents.length > 0) {
        formData.append(
          'dokumen',
          JSON.stringify(documents.map((d) => ({ name: d.name, size: d.size, type: d.type })))
        );
      }

      // Lahan list JSON
      if (lahanList.length > 0) {
        formData.append(
          'lahanList',
          JSON.stringify(
            lahanList.map((l) => ({
              namaLahan: l.namaLahan,
              luas: l.luas,
              komoditas: l.komoditas,
              commodityId: l.commodityId,
              varietas: l.varietas,
              varietyId: l.varietyId,
              koordinat: `${l.latitude}, ${l.longitude}`,
              status: l.status,
              detailLokasi: l.detailLokasi,
            }))
          )
        );
      }

      const res = await partnerService.createPartner(formData);
      if (res.status === 'success') {
        toast.success('Petani Mitra berhasil didaftarkan!');
        setTimeout(() => {
          router.push('/master/petani-mitra');
        }, 1200);
      } else {
        toast.error(res.message || 'Gagal menyimpan data');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main-content pb-12">
      <Seo title="Tambah Petani Mitra" />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header & Breadcrumb */}
      <div className="mb-6 pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5">
            <Link href="/" className="hover:text-emerald-600 transition">
              Master Data
            </Link>
            <i className="ri-arrow-right-s-line text-gray-400"></i>
            <Link href="/master/petani-mitra" className="hover:text-emerald-600 transition">
              Petani Mitra
            </Link>
            <i className="ri-arrow-right-s-line text-gray-400"></i>
            <span className="text-emerald-700 font-semibold">Tambah Petani Mitra</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center text-xl shadow-2xs">
              <i className="ri-plant-line"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                Tambah Petani Mitra
              </h1>
              <p className="text-xs text-gray-500">
                Lengkapi informasi petani mitra untuk kerjasama produksi benih.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <button
            type="button"
            onClick={() => router.push('/master/petani-mitra')}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-2xs transition flex items-center gap-1.5"
          >
            <i className="ri-close-line text-sm"></i>
            <span>Batal</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveForm()}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition flex items-center gap-2"
          >
            {isSubmitting ? (
              <i className="ri-loader-4-line animate-spin text-sm"></i>
            ) : (
              <i className="ri-save-line text-sm"></i>
            )}
            <span>Simpan</span>
          </button>
        </div>
      </div>

      {/* Main Form Two-Column Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* =========================================================================
            LEFT COLUMN: Informasi Petani, Rekening, Informasi Legal, Catatan
           ========================================================================= */}
        <div className="col-span-12 xl:col-span-6 space-y-6">
          {/* CARD 1: INFORMASI PETANI */}
          <div className="box border border-defaultborder bg-white rounded-xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-defaultborder flex items-center gap-3 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-base">
                <i className="ri-user-3-line"></i>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">Informasi Petani</h3>
                <p className="text-[11px] text-gray-500">
                  Data identitas dan kontak petani mitra.
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Row 1: Kode Petani & Nama Petani */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Kode Petani <span className="text-danger">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={kodePetani}
                      onChange={(e) => setKodePetani(e.target.value)}
                      className="form-control w-full border border-defaultborder p-2.5 pr-10 rounded-lg text-xs font-mono font-semibold bg-gray-50 text-gray-800 focus:bg-white focus:border-emerald-500 transition"
                      placeholder="PM-001"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleRegenerateCode}
                      title="Generate Ulang Kode"
                      className="absolute right-2.5 text-gray-400 hover:text-emerald-600 transition"
                    >
                      <i className="ri-refresh-line text-sm"></i>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Nama Petani <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={namaPetani}
                    onChange={(e) => setNamaPetani(e.target.value)}
                    className="form-control w-full border border-defaultborder p-2.5 rounded-lg text-xs text-gray-800 focus:border-emerald-500 transition"
                    placeholder="Masukkan nama petani"
                    required
                  />
                </div>
              </div>

              {/* Row 2: NIK & Alamat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    NIK <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={nik}
                    onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                    className="form-control w-full border border-defaultborder p-2.5 rounded-lg text-xs font-mono text-gray-800 focus:border-emerald-500 transition"
                    placeholder="Masukkan NIK (16 digit)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Alamat <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    className="form-control w-full border border-defaultborder p-2.5 rounded-lg text-xs text-gray-800 focus:border-emerald-500 transition"
                    placeholder="Masukkan alamat lengkap"
                    required
                  />
                </div>
              </div>

              {/* Row 3: No. HP & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    No. HP <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    className="form-control w-full border border-defaultborder p-2.5 rounded-lg text-xs font-mono text-gray-800 focus:border-emerald-500 transition"
                    placeholder="Masukkan nomor handphone"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control w-full border border-defaultborder p-2.5 rounded-lg text-xs text-gray-800 focus:border-emerald-500 transition"
                    placeholder="Masukkan email (opsional)"
                  />
                </div>
              </div>

              {/* Row 4: Kelompok Tani (Master Penanggung Jawab), Komoditas Utama, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Kelompok Tani <span className="text-danger">*</span>
                  </label>
                  <select
                    value={kelompokTani}
                    onChange={(e) => setKelompokTani(e.target.value)}
                    className="form-select w-full border border-defaultborder p-2.5 rounded-lg text-xs bg-white text-gray-800 cursor-pointer focus:border-emerald-500 transition"
                  >
                    <option value="">Pilih kelompok tani</option>
                    {penanggungJawabList.map((pj: any) => {
                      const name = pj.nama || pj.namaPenanggungJawab || '';
                      const key = pj.id || name;
                      return (
                        <option key={key} value={name}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Komoditas Utama <span className="text-danger">*</span>
                  </label>
                  <select
                    value={komoditasUtama}
                    onChange={(e) => setKomoditasUtama(e.target.value)}
                    className="form-select w-full border border-defaultborder p-2.5 rounded-lg text-xs bg-white text-gray-800 cursor-pointer focus:border-emerald-500 transition"
                  >
                    <option value="">Pilih komoditas utama</option>
                    {commodities.map((c: any) => {
                      const name = c.namaKomoditas || c.nama || c.label || '';
                      const key = c.id || c.kodeKomoditas || name;
                      return (
                        <option key={key} value={name}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Status <span className="text-danger">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="form-select w-full border border-defaultborder p-2.5 rounded-lg text-xs bg-white text-gray-800 font-semibold cursor-pointer focus:border-emerald-500 transition"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non Aktif">Non Aktif</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: INFORMASI REKENING */}
          <div className="box border border-defaultborder bg-white rounded-xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-defaultborder flex items-center gap-3 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-base">
                <i className="ri-bank-line"></i>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">Informasi Rekening</h3>
                <p className="text-[11px] text-gray-500">
                  Untuk keperluan pembayaran hasil panen.
                </p>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Nama Bank
                  </label>
                  <select
                    value={namaBank}
                    onChange={(e) => setNamaBank(e.target.value)}
                    className="form-select w-full border border-defaultborder p-2.5 rounded-lg text-xs bg-white text-gray-800 cursor-pointer focus:border-emerald-500 transition"
                  >
                    <option value="">Pilih bank</option>
                    {bankOptions.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    No. Rekening
                  </label>
                  <input
                    type="text"
                    value={noRekening}
                    onChange={(e) => setNoRekening(e.target.value)}
                    className="form-control w-full border border-defaultborder p-2.5 rounded-lg text-xs font-mono text-gray-800 focus:border-emerald-500 transition"
                    placeholder="Masukkan nomor rekening"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Atas Nama
                  </label>
                  <input
                    type="text"
                    value={atasNama}
                    onChange={(e) => setAtasNama(e.target.value)}
                    className="form-control w-full border border-defaultborder p-2.5 rounded-lg text-xs text-gray-800 focus:border-emerald-500 transition"
                    placeholder="Masukkan nama pemilik rekening"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: INFORMASI LEGAL */}
          <div className="box border border-defaultborder bg-white rounded-xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-defaultborder flex items-center gap-3 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-base">
                <i className="ri-file-text-line"></i>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">Informasi Legal</h3>
                <p className="text-[11px] text-gray-500">
                  Dokumen pendukung kerjasama.
                </p>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Upload Drag & Drop Area */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-300 rounded-xl bg-emerald-50/30 text-center hover:bg-emerald-50/50 transition">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mb-2.5">
                  <i className="ri-upload-cloud-2-line"></i>
                </div>
                <h4 className="text-xs font-bold text-gray-800 mb-0.5">
                  Upload Dokumen Pendukung
                </h4>
                <p className="text-[11px] text-gray-400 mb-3">
                  (KTP, NPWP, Surat Kerja Sama, dll)
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-1.5 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white text-xs font-semibold transition shadow-2xs"
                >
                  Pilih File
                </button>
              </div>

              {/* Uploaded Documents List */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <span className="text-[11px] font-bold text-gray-500 mb-2">
                  Dokumen yang diupload
                </span>
                {documents.length === 0 ? (
                  <div className="text-xs text-gray-400 italic py-4">
                    Belum ada dokumen yang diunggah.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 bg-white hover:border-gray-300 shadow-2xs transition"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-8 h-8 rounded bg-red-50 text-red-500 flex items-center justify-center text-lg flex-shrink-0">
                            <i className="ri-file-pdf-line"></i>
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-semibold text-gray-800 truncate">
                              {doc.name}
                            </p>
                            <span className="text-[10px] text-gray-400">{doc.size}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            title="Download Dokumen"
                            className="w-7 h-7 rounded hover:bg-gray-100 text-gray-500 hover:text-emerald-600 flex items-center justify-center text-xs transition"
                          >
                            <i className="ri-download-2-line"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(doc.id)}
                            title="Hapus Dokumen"
                            className="w-7 h-7 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center text-xs transition"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CARD 4: CATATAN */}
          <div className="box border border-defaultborder bg-white rounded-xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-defaultborder flex items-center gap-3 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-base">
                <i className="ri-chat-1-line"></i>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">Catatan</h3>
                <p className="text-[11px] text-gray-500">
                  Informasi tambahan (opsional).
                </p>
              </div>
            </div>

            <div className="p-5">
              <textarea
                value={catatan}
                maxLength={500}
                onChange={(e) => setCatatan(e.target.value)}
                rows={3}
                className="form-control w-full border border-defaultborder p-2.5 rounded-lg text-xs text-gray-800 focus:border-emerald-500 transition"
                placeholder="Masukkan catatan tambahan..."
              />
              <div className="text-right text-[11px] text-gray-400 mt-1">
                {catatan.length}/500
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: Lokasi dan Lahan, Daftar Lahan Petani, Informasi Penting
           ========================================================================= */}
        <div className="col-span-12 xl:col-span-6 space-y-6">
          {/* CARD 1: LOKASI DAN LAHAN (PETA) */}
          <div className="box border border-defaultborder bg-white rounded-xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-defaultborder flex items-center gap-3 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-base">
                <i className="ri-map-pin-line"></i>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">Lokasi dan Lahan</h3>
                <p className="text-[11px] text-gray-500">
                  Tentukan lokasi lahan petani pada peta dan tambahkan data lahan yang dimiliki.
                </p>
              </div>
            </div>

            <div className="p-4">
              <PetaDaftarLahan lahanList={lahanList} heightClass="h-[340px]" />
            </div>
          </div>

          {/* CARD 2: DAFTAR LAHAN PETANI */}
          <div className="box border border-defaultborder bg-white rounded-xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-defaultborder flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-base">
                  <i className="ri-plant-line"></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Daftar Lahan Petani</h3>
                  <p className="text-[11px] text-gray-500">
                    Tambah dan kelola lahan yang dimiliki petani.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenAddLahanModal}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-2xs transition flex items-center gap-1.5"
              >
                <i className="ri-add-line text-sm"></i>
                <span>Tambah Lahan</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50/80 border-b border-defaultborder text-gray-600 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-3.5 font-bold">No.</th>
                    <th className="py-3 px-3.5 font-bold">Nama Lahan</th>
                    <th className="py-3 px-3.5 font-bold">Luas</th>
                    <th className="py-3 px-3.5 font-bold">Komoditas</th>
                    <th className="py-3 px-3.5 font-bold">Varietas</th>
                    <th className="py-3 px-3.5 font-bold">Koordinat</th>
                    <th className="py-3 px-3.5 font-bold">Status</th>
                    <th className="py-3 px-3.5 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lahanList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-400 italic">
                        Belum ada lahan yang ditambahkan. Klik tombol "+ Tambah Lahan".
                      </td>
                    </tr>
                  ) : (
                    lahanList.map((item, index) => (
                      <tr key={item.id || index} className="hover:bg-gray-50/60 transition">
                        <td className="py-3 px-3.5 font-medium">{index + 1}</td>
                        <td className="py-3 px-3.5 font-bold text-gray-800">{item.namaLahan}</td>
                        <td className="py-3 px-3.5 font-semibold text-gray-700">
                          {item.luas.toLocaleString('id-ID')} m²
                        </td>
                        <td className="py-3 px-3.5 text-gray-800">
                          {item.komoditas ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                              <i className="ri-leaf-line text-[10px]"></i>
                              {item.komoditas}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-3.5 text-gray-600">
                          {item.varietas || <span className="text-gray-400">-</span>}
                        </td>
                        <td className="py-3 px-3.5">
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-gray-600">
                            <i className="ri-map-pin-line text-emerald-600"></i>
                            {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
                          </span>
                        </td>
                        <td className="py-3 px-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.status === 'Aktif'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditLahanModal(index)}
                              title="Edit Lahan"
                              className="w-7 h-7 rounded hover:bg-emerald-50 text-gray-500 hover:text-emerald-700 flex items-center justify-center text-xs transition"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLahan(index)}
                              title="Hapus Lahan"
                              className="w-7 h-7 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center text-xs transition"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-3.5 border-t border-defaultborder flex justify-between items-center text-xs text-gray-500 bg-gray-50/30">
              <span>Menampilkan {lahanList.length === 0 ? 0 : 1} - {lahanList.length} dari {lahanList.length} data</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 cursor-not-allowed text-[11px]"
                >
                  <i className="ri-arrow-left-s-line"></i>
                </button>
                <button
                  type="button"
                  className="w-6 h-6 rounded bg-emerald-700 text-white font-bold flex items-center justify-center text-[11px]"
                >
                  1
                </button>
                <button
                  type="button"
                  disabled
                  className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 cursor-not-allowed text-[11px]"
                >
                  <i className="ri-arrow-right-s-line"></i>
                </button>
              </div>
            </div>
          </div>

          {/* CARD 3: INFORMASI PENTING */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 text-emerald-900 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-200/80 text-emerald-800 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                <i className="ri-lightbulb-line"></i>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-emerald-950">Informasi Penting</h4>
                <ul className="list-disc list-inside text-[11px] text-emerald-800/90 space-y-0.5">
                  <li>Lokasi lahan akan digunakan untuk keperluan traceability dan monitoring.</li>
                  <li>Pastikan koordinat sesuai dengan lokasi sebenarnya.</li>
                  <li>Anda dapat menambahkan lebih dari satu lahan untuk satu petani mitra.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pop-up Modal Tambah / Edit Lahan */}
      <ModalTambahLahan
        isOpen={isLahanModalOpen}
        onClose={() => setIsLahanModalOpen(false)}
        onSave={handleSaveLahanModal}
        initialData={editingLahanIndex !== null ? lahanList[editingLahanIndex] : null}
        commodities={commodities}
        varieties={varieties}
      />
    </div>
  );
}
