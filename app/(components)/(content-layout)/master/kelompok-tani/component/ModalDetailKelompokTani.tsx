"use client";

import React, { useState } from 'react';
import { KelompokTani } from '@/app/types/kelompokTani';

interface ModalDetailKelompokTaniProps {
  isOpen: boolean;
  item: KelompokTani | null;
  onClose: () => void;
  onEdit: (item: KelompokTani) => void;
}

export default function ModalDetailKelompokTani({
  isOpen,
  item,
  onClose,
  onEdit,
}: ModalDetailKelompokTaniProps) {
  const [showAllMembers, setShowAllMembers] = useState(false);

  if (!isOpen || !item) return null;

  // Build members list from partners or ketua + fallback
  const partnerMembers = item.partners || [];
  const fallbackAnggota = ['Budi Santoso', 'Rudi Hartono', 'Agus Salim', 'Wahyu', 'Sutrisno']
    .filter((n) => n.toLowerCase() !== (item.ketua || '').toLowerCase())
    .slice(0, 2);

  const members =
    partnerMembers.length > 0
      ? partnerMembers.map((p, idx) => ({
          id: p.id,
          nama: p.namaPetani,
          role: idx === 0 ? 'Ketua' : 'Anggota',
          status: p.status || 'Aktif',
        }))
      : [
          { id: '1', nama: item.ketua || 'Ketua Kelompok', role: 'Ketua', status: 'Aktif' },
          { id: '2', nama: fallbackAnggota[0] || 'Budi Santoso', role: 'Anggota', status: 'Aktif' },
          { id: '3', nama: fallbackAnggota[1] || 'Rudi Hartono', role: 'Anggota', status: 'Aktif' },
        ];

  const totalMembersCount = item.jumlahAnggota > 0 ? item.jumlahAnggota : members.length;
  const displayedMembers = showAllMembers ? members : members.slice(0, 3);

  const displayLokasi = item.kabupaten
    ? `${item.lokasi || item.desa || '-'} - Kab. ${item.kabupaten}`
    : item.lokasi || '-';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center text-xl shadow-2xs">
              <i className="ri-team-line"></i>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">
                Detail Kelompok Tani
              </h2>
              <p className="text-xs text-gray-500">
                Informasi profil kelompok tani dan anggota mitra
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
          {/* Main Profile Card matching screenshot */}
          <div className="p-4 rounded-xl bg-slate-50/90 border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
              <i className="ri-community-line"></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-bold text-gray-900 truncate">
                  {item.namaKelompok}
                </h4>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    item.status === 'Aktif'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.status === 'Aktif' ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                  ></span>
                  {item.status === 'Aktif' ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-mono">
                Kode Kelompok :{' '}
                <span className="font-semibold text-gray-800">{item.kodeKelompok}</span>
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                Lokasi :{' '}
                <span className="text-gray-700 font-medium">{displayLokasi}</span>
              </p>
            </div>
          </div>

          {/* Section: Informasi Umum */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 border-b border-gray-100 pb-2">
              <i className="ri-information-line text-emerald-600"></i>
              <span>Informasi Umum</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-0.5">
                <span className="text-gray-500">Ketua Kelompok</span>
                <span className="font-semibold text-gray-800">{item.ketua || '-'}</span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-gray-500">Kontak Ketua</span>
                <span className="font-mono font-medium text-gray-800">
                  {item.noHpKetua || '-'}
                </span>
              </div>

              {item.penanggungJawab && (
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-gray-500">Penanggung Jawab</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <i className="ri-user-star-line text-xs"></i>
                    {item.penanggungJawab.nama}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-0.5">
                <span className="text-gray-500">Jumlah Anggota</span>
                <span className="font-semibold text-gray-800">
                  {totalMembersCount} orang
                </span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-gray-500">Komoditas Utama</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  <i className="ri-leaf-line"></i>
                  {item.komoditasUtama || '-'}
                </span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-gray-500">Tahun Berdiri</span>
                <span className="font-medium text-gray-800">
                  {item.tahunBerdiri || '-'}
                </span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-gray-500">Desa</span>
                <span className="font-medium text-gray-800">{item.desa || item.lokasi || '-'}</span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-gray-500">Kecamatan</span>
                <span className="font-medium text-gray-800">{item.kecamatan || '-'}</span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-gray-500">Kabupaten</span>
                <span className="font-medium text-gray-800">{item.kabupaten || 'Malang'}</span>
              </div>
            </div>
          </div>

          {/* Section: Daftar Anggota */}
          <div className="space-y-2.5 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                <span>Daftar Anggota</span>
                <span className="text-gray-400 font-normal text-[11px]">
                  ({displayedMembers.length} dari {totalMembersCount})
                </span>
              </div>
              {members.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllMembers(!showAllMembers)}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  {showAllMembers ? 'Tampilkan Ringkas' : 'Lihat Semua'}
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {displayedMembers.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="p-2.5 rounded-xl bg-gray-50/70 hover:bg-gray-100/60 transition flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-gray-400 font-mono text-[11px] w-4">
                      {idx + 1}.
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800 truncate leading-tight">
                        {m.nama}
                      </p>
                      <p className="text-[10px] text-gray-500">{m.role}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Catatan */}
          {item.deskripsi && (
            <div className="space-y-1.5 pt-3 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-800 block">Catatan</span>
              <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 text-xs text-gray-600 leading-relaxed">
                {item.deskripsi}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(item);
            }}
            className="px-4 py-2 rounded-lg border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold shadow-2xs transition flex items-center gap-1.5"
          >
            <i className="ri-edit-line text-sm"></i>
            <span>Edit Kelompok</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold shadow-2xs transition"
          >
            <span>Tutup</span>
          </button>
        </div>
      </div>
    </div>
  );
}
