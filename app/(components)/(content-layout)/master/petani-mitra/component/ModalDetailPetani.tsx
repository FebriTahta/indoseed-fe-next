"use client";

import React, { useMemo } from 'react';
import 'leaflet/dist/leaflet.css';

import { Partner } from '@/app/types/partner';
import { Land } from '@/app/types/greenhouse';
import PetaDaftarLahan from '../tambah/component/PetaDaftarLahan';
import { LahanItem } from '../tambah/component/ModalTambahLahan';

interface ModalDetailPetaniProps {
  isOpen: boolean;
  partner: Partner | null;
  allGreenhouses?: Land[];
  onClose: () => void;
  onEdit?: (partner: Partner) => void;
  onToggleStatus?: (partner: Partner) => void;
  isLoading?: boolean;
}

export default function ModalDetailPetani({
  isOpen,
  partner,
  allGreenhouses = [],
  onClose,
  onEdit,
  onToggleStatus,
  isLoading = false,
}: ModalDetailPetaniProps) {
  // Compute partner's lands
  const partnerLands = useMemo(() => {
    if (!partner) return [];
    if (Array.isArray(partner.greenhouses) && partner.greenhouses.length > 0) {
      return partner.greenhouses;
    }
    if (allGreenhouses && allGreenhouses.length > 0) {
      return allGreenhouses.filter(
        (g) => g.partnerId === partner.id || g.petaniMitra === partner.namaPetani
      );
    }
    return [];
  }, [partner, allGreenhouses]);

  // Map partner lands into LahanItem for PetaDaftarLahan and Table
  const mappedLahanList: LahanItem[] = useMemo(() => {
    return partnerLands.map((g: any, idx: number) => {
      let lat = -7.635200 + (idx * 0.002);
      let lng = 110.841200 + (idx * 0.002);

      if (g.koordinat && typeof g.koordinat === 'string' && g.koordinat.includes(',')) {
        const parts = g.koordinat.split(',');
        const pLat = parseFloat(parts[0].trim());
        const pLng = parseFloat(parts[1].trim());
        if (!isNaN(pLat) && !isNaN(pLng)) {
          lat = pLat;
          lng = pLng;
        }
      } else if (typeof g.latitude === 'number' && typeof g.longitude === 'number') {
        lat = g.latitude;
        lng = g.longitude;
      }

      let dokumenUrl = '';
      let dokumenNama = '';
      if (g.keterangan) {
        try {
          const parsedKet = JSON.parse(g.keterangan);
          if (parsedKet && parsedKet.dokumenUrl) {
            dokumenUrl = parsedKet.dokumenUrl;
            dokumenNama = parsedKet.dokumenNama || 'Dokumen Lahan';
          }
        } catch {}
      }

      return {
        id: g.id || `lahan-${idx}`,
        namaLahan: g.namaLahan || `Lahan ${idx + 1}`,
        jenisLahan: g.jenisLahan || 'Lahan Terbuka',
        luas: Number(g.luas || 0),
        komoditas: g.commodity?.namaKomoditas || g.komoditasUtama || g.komoditas || '',
        commodityId: g.commodityId || '',
        varietas: g.variety?.kodeVarietas || g.varietas || '',
        varietyId: g.varietyId || '',
        latitude: lat,
        longitude: lng,
        status: (g.status === 'Aktif' ? 'Aktif' : 'Non Aktif') as 'Aktif' | 'Non Aktif',
        detailLokasi: g.detailLokasi || g.lokasi || '',
        fotoUrl: g.image || g.fotoUrl || '',
        dokumenUrl: dokumenUrl || g.dokumenUrl || '',
        dokumenNama: dokumenNama || g.dokumenNama || '',
      };
    });
  }, [partnerLands]);

  // Compute total area in Ha and m2
  const totalLuasM2 = useMemo(() => {
    return mappedLahanList.reduce((acc, l) => acc + (Number(l.luas) || 0), 0);
  }, [mappedLahanList]);

  const totalLuasHa = useMemo(() => {
    if (totalLuasM2 > 0) {
      return totalLuasM2 / 10000;
    }
    return Number(partner?.luasLahan || 0);
  }, [totalLuasM2, partner?.luasLahan]);

  // Parse documents
  const documents = useMemo(() => {
    if (!partner?.dokumen) return [];
    try {
      const parsed = typeof partner.dokumen === 'string' ? JSON.parse(partner.dokumen) : partner.dokumen;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [partner?.dokumen]);

  if (!isOpen || !partner) return null;

  const formatDate = (isoStr?: string | null) => {
    if (!isoStr) return '-';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      {/* Modal Dialog Container */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-defaultborder animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* =========================================================================
            MODAL HEADER (Design consistent with Tambah Petani Header & Profile)
           ========================================================================= */}
        <div className="px-6 py-4 border-b border-defaultborder flex justify-between items-center bg-gray-50/80">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center text-xl shadow-xs font-bold flex-shrink-0">
              {partner.image ? (
                <img src={partner.image} alt={partner.namaPetani} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <i className="ri-plant-line"></i>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                  Detail Petani Mitra
                </h2>
                <span className={`badge px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  partner.status === 'Aktif'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 ${
                    partner.status === 'Aktif' ? 'bg-emerald-500' : 'bg-red-500'
                  }`}></span>
                  {partner.status === 'Aktif' ? 'Aktif' : 'Non Aktif'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Informasi lengkap petani mitra dan daftar lahan binaan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(partner);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold shadow-2xs transition"
              >
                <i className="ri-edit-line text-emerald-600"></i>
                <span>Edit</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition"
              title="Tutup Modal"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>
        </div>

        {/* =========================================================================
            MODAL BODY (Exact Two-Column Layout from Tambah Petani - Read Only / No Inputs)
           ========================================================================= */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[78vh] custom-scrollbar bg-slate-50/40">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-gray-500">
              <i className="ri-loader-4-line animate-spin text-3xl text-emerald-600 mb-2"></i>
              <span className="text-xs font-semibold">Memuat data lengkap petani mitra...</span>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-6">
              
              {/* =========================================================================
                  LEFT COLUMN: Informasi Petani, Rekening, Informasi Legal, Catatan
                 ========================================================================= */}
              <div className="col-span-12 xl:col-span-6 space-y-6">

                {/* CARD 1: INFORMASI PETANI */}
                <div className="box border border-defaultborder bg-white rounded-xl shadow-xs overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-defaultborder flex items-center gap-3 bg-gray-50/50">
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

                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Row 1: Kode Petani & Nama Petani */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs font-bold text-gray-700 mb-1.5">
                          Kode Petani
                        </span>
                        <div className="w-full border border-defaultborder p-2.5 rounded-lg text-xs font-mono font-bold bg-gray-50/80 text-emerald-800 flex items-center justify-between">
                          <span>{partner.kodePetani || '-'}</span>
                          <i className="ri-barcode-line text-emerald-600 text-sm"></i>
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-gray-700 mb-1.5">
                          Nama Petani
                        </span>
                        <div className="w-full border border-defaultborder p-2.5 rounded-lg text-xs font-semibold bg-gray-50/80 text-gray-900">
                          {partner.namaPetani || '-'}
                        </div>
                      </div>
                    </div>

                    {/* Row 2: NIK & Alamat */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs font-bold text-gray-700 mb-1.5">
                          NIK
                        </span>
                        <div className="w-full border border-defaultborder p-2.5 rounded-lg text-xs font-mono bg-gray-50/80 text-gray-800">
                          {partner.noKtp || '-'}
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-gray-700 mb-1.5">
                          Alamat
                        </span>
                        <div className="w-full border border-defaultborder p-2.5 rounded-lg text-xs bg-gray-50/80 text-gray-800 min-h-[38px] flex items-center">
                          {partner.alamat || '-'}
                        </div>
                      </div>
                    </div>

                    {/* Row 3: No. HP & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs font-bold text-gray-700 mb-1.5">
                          No. HP
                        </span>
                        <div className="w-full border border-defaultborder p-2.5 rounded-lg text-xs font-mono bg-gray-50/80 text-gray-800 flex items-center gap-1.5">
                          <i className="ri-phone-line text-emerald-600"></i>
                          <span>{partner.noTelepon || '-'}</span>
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-gray-700 mb-1.5">
                          Email
                        </span>
                        <div className="w-full border border-defaultborder p-2.5 rounded-lg text-xs bg-gray-50/80 text-gray-800">
                          {partner.email || '-'}
                        </div>
                      </div>
                    </div>

                    {/* Row 4: Penanggung Jawab & Kelompok Tani */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs font-bold text-gray-700 mb-1.5">
                          Penanggung Jawab
                        </span>
                        <div className="w-full border border-defaultborder p-2.5 rounded-lg text-xs bg-gray-50/80 text-emerald-800 font-semibold flex items-center gap-1.5 truncate">
                          <i className="ri-user-star-line text-emerald-600"></i>
                          <span>
                            {partner.penanggungJawab?.nama || (typeof partner.penanggungJawab === 'string' ? partner.penanggungJawab : '-')}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-gray-700 mb-1.5">
                          Kelompok Tani
                        </span>
                        <div className="w-full border border-defaultborder p-2.5 rounded-lg text-xs bg-gray-50/80 text-gray-800 font-medium truncate" title={partner.kelompokTani || '-'}>
                          {partner.kelompokTani || '-'}
                        </div>
                      </div>
                    </div>

                    {/* Row 5: Komoditas Utama & Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs font-bold text-gray-700 mb-1.5">
                          Komoditas Utama
                        </span>
                        <div className="w-full border border-defaultborder p-2.5 rounded-lg text-xs bg-gray-50/80 text-emerald-700 font-semibold flex items-center gap-1 truncate" title={partner.komoditasUtama || '-'}>
                          <i className="ri-leaf-line text-emerald-500 flex-shrink-0"></i>
                          <span className="truncate">{partner.komoditasUtama || '-'}</span>
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-gray-700 mb-1.5">
                          Status
                        </span>
                        <div className="w-full border border-defaultborder p-2 rounded-lg text-xs bg-gray-50/80 flex items-center justify-between">
                          <span className={`badge px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                            partner.status === 'Aktif'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 ${
                              partner.status === 'Aktif' ? 'bg-emerald-500' : 'bg-red-500'
                            }`}></span>
                            {partner.status === 'Aktif' ? 'Aktif' : 'Non Aktif'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 2: INFORMASI REKENING */}
                <div className="box border border-defaultborder bg-white rounded-xl shadow-xs overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-defaultborder flex items-center gap-3 bg-gray-50/50">
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

                  <div className="p-4 sm:p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <span className="block text-xs font-bold text-gray-700 mb-1.5">
                          Nama Bank
                        </span>
                        <div className="w-full border border-defaultborder p-2.5 rounded-lg text-xs bg-gray-50/80 text-gray-800 font-semibold flex items-center gap-1.5">
                          <i className="ri-bank-card-line text-emerald-600"></i>
                          <span>{partner.namaBank || '-'}</span>
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-gray-700 mb-1.5">
                          No. Rekening
                        </span>
                        <div className="w-full border border-defaultborder p-2.5 rounded-lg text-xs font-mono font-bold bg-gray-50/80 text-gray-800">
                          {partner.noRekening || '-'}
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-gray-700 mb-1.5">
                          Atas Nama
                        </span>
                        <div className="w-full border border-defaultborder p-2.5 rounded-lg text-xs font-semibold bg-gray-50/80 text-gray-800">
                          {partner.atasNama || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 3: INFORMASI LEGAL */}
                <div className="box border border-defaultborder bg-white rounded-xl shadow-xs overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-defaultborder flex items-center gap-3 bg-gray-50/50">
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

                  <div className="p-4 sm:p-5">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-gray-500 mb-2 block">
                        Dokumen yang terlampir
                      </span>

                      {documents.length === 0 ? (
                        <div className="text-xs text-gray-400 italic py-4 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                          Belum ada dokumen legal yang diunggah.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {documents.map((doc: any, idx: number) => (
                            <div
                              key={doc.id || idx}
                              className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 bg-white shadow-2xs hover:border-emerald-200 transition"
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <div className="w-8 h-8 rounded bg-red-50 text-red-500 flex items-center justify-center text-lg flex-shrink-0">
                                  <i className="ri-file-pdf-line"></i>
                                </div>
                                <div className="truncate">
                                  <p className="text-xs font-semibold text-gray-800 truncate" title={doc.name}>
                                    {doc.name || `Dokumen-${idx + 1}`}
                                  </p>
                                  <span className="text-[10px] text-gray-400">{doc.size || 'PDF Document'}</span>
                                </div>
                              </div>

                              <span className="badge bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200 flex-shrink-0">
                                Terverifikasi
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* CARD 4: CATATAN */}
                <div className="box border border-defaultborder bg-white rounded-xl shadow-xs overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-defaultborder flex items-center gap-3 bg-gray-50/50">
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

                  <div className="p-4 sm:p-5">
                    <div className="w-full border border-defaultborder p-3 rounded-lg text-xs text-gray-700 bg-gray-50/80 min-h-[70px] whitespace-pre-line leading-relaxed">
                      {partner.catatan ? (
                        partner.catatan
                      ) : (
                        <span className="text-gray-400 italic">Tidak ada catatan tambahan untuk petani mitra ini.</span>
                      )}
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
                  <div className="p-4 sm:p-5 border-b border-defaultborder flex items-center gap-3 bg-gray-50/50">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-base">
                      <i className="ri-map-pin-line"></i>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">Lokasi dan Lahan</h3>
                      <p className="text-[11px] text-gray-500">
                        Lokasi titik lahan petani pada peta interaktif.
                      </p>
                    </div>
                  </div>

                  <div className="p-4">
                    <PetaDaftarLahan lahanList={mappedLahanList} heightClass="h-[340px]" />
                  </div>
                </div>

                {/* CARD 2: DAFTAR LAHAN PETANI */}
                <div className="box border border-defaultborder bg-white rounded-xl shadow-xs overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-defaultborder flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-base">
                        <i className="ri-plant-line"></i>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">Daftar Lahan Petani</h3>
                        <p className="text-[11px] text-gray-500">
                          Daftar lahan yang dimiliki petani.
                        </p>
                      </div>
                    </div>

                    <span className="badge px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center gap-1.5">
                      <i className="ri-map-pin-2-line"></i>
                      <span>{mappedLahanList.length} Lahan</span>
                    </span>
                  </div>

                  {/* Table Lahan */}
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
                          <th className="py-3 px-3.5 font-bold text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {mappedLahanList.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-gray-400 italic">
                              Belum ada data lahan yang terdaftar untuk petani mitra ini.
                            </td>
                          </tr>
                        ) : (
                          mappedLahanList.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-gray-50/60 transition">
                              <td className="py-3 px-3.5 font-medium">{index + 1}</td>
                              <td className="py-3 px-3.5 font-bold text-gray-800">
                                <div className="flex items-center gap-2.5">
                                  {item.fotoUrl && (
                                    <img
                                      src={item.fotoUrl}
                                      alt="Foto Lahan"
                                      className="w-8 h-8 object-cover rounded-lg border border-gray-200 shadow-2xs shrink-0"
                                    />
                                  )}
                                  <div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span>{item.namaLahan}</span>
                                      {item.jenisLahan && (
                                        <span
                                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                            item.jenisLahan === 'Greenhouse'
                                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                          }`}
                                        >
                                          <i
                                            className={
                                              item.jenisLahan === 'Greenhouse'
                                                ? 'ri-building-line text-[9px]'
                                                : 'ri-landscape-line text-[9px]'
                                            }
                                          ></i>
                                          <span>{item.jenisLahan}</span>
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      {item.dokumenUrl && (
                                        <a
                                          href={item.dokumenUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 transition"
                                          title={item.dokumenNama || 'Lihat Dokumen'}
                                        >
                                          <i className="ri-file-text-line text-[10px]"></i>
                                          <span>Dokumen</span>
                                        </a>
                                      )}
                                      {item.fotoUrl && (
                                        <a
                                          href={item.fotoUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-0.5 text-[10px] text-blue-700 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200 transition"
                                          title={item.fotoNama || 'Lihat Foto'}
                                        >
                                          <i className="ri-image-line text-[10px]"></i>
                                          <span>Foto</span>
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3.5 font-semibold text-gray-700">
                                {item.luas.toLocaleString('id-ID')} m²
                                <span className="block text-[10px] text-gray-400 font-normal">
                                  ({(item.luas / 10000).toFixed(2)} Ha)
                                </span>
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
                                {item.latitude && item.longitude ? (
                                  <a
                                    href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 hover:text-emerald-800 hover:underline"
                                    title="Buka di Google Maps"
                                  >
                                    <i className="ri-map-pin-line text-red-500"></i>
                                    {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
                                  </a>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="py-3 px-3.5 text-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  item.status === 'Aktif'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Footer */}
                  <div className="p-3.5 border-t border-defaultborder flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500 bg-gray-50/30">
                    <span>
                      Menampilkan {mappedLahanList.length === 0 ? 0 : 1} - {mappedLahanList.length} dari {mappedLahanList.length} lahan
                    </span>
                    <span className="font-semibold text-emerald-800 font-mono">
                      Total Luas: {totalLuasHa.toFixed(2)} Ha ({totalLuasM2.toLocaleString('id-ID')} m²)
                    </span>
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
                        <li>Lokasi lahan digunakan untuk keperluan traceability dan monitoring produksi benih.</li>
                        <li>Petani mitra memiliki <strong>{mappedLahanList.length} titik lahan</strong> terdaftar dengan total luas <strong>{totalLuasHa.toFixed(2)} Ha</strong>.</li>
                        <li>Data ini digunakan sebagai acuan penugasan pemeriksaan lapangan dan kontrak panen.</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

        {/* =========================================================================
            MODAL FOOTER
           ========================================================================= */}
        <div className="px-6 py-3.5 border-t border-defaultborder bg-gray-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-gray-400 font-mono">
            Terdaftar sejak: {formatDate(partner.tglBergabung || partner.tglDibuat || partner.createdAt)}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {onToggleStatus && (
              <button
                type="button"
                onClick={() => onToggleStatus(partner)}
                className={`px-3.5 py-2 rounded-lg border text-xs font-semibold transition flex items-center gap-1.5 ${
                  partner.status === 'Aktif'
                    ? 'border-red-300 text-red-700 bg-white hover:bg-red-50'
                    : 'border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-50'
                }`}
              >
                <i className={partner.status === 'Aktif' ? 'ri-shut-down-line' : 'ri-checkbox-circle-line'}></i>
                <span>{partner.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}</span>
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(partner);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-2xs transition flex items-center gap-1.5"
              >
                <i className="ri-edit-line"></i>
                <span>Edit Data</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold shadow-2xs transition"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
