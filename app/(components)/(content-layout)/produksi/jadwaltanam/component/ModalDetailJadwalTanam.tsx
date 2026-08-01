import React, { useState } from 'react';
import { JadwalTanam } from '@/app/types/jadwalTanam';
import { toast } from 'react-toastify';
import jadwalTanamService from '@/app/services/jadwalTanamService';

interface ModalDetailJadwalTanamProps {
  isOpen: boolean;
  onClose: () => void;
  jadwal: JadwalTanam | null;
  onRefresh?: () => void;
}

export default function ModalDetailJadwalTanam({
  isOpen,
  onClose,
  jadwal,
  onRefresh,
}: ModalDetailJadwalTanamProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !jadwal) return null;

  const rawStatus = (jadwal.status || jadwal.informasiUmum?.statusJadwal || 'Draft').toString();
  const st = rawStatus.toLowerCase();
  const jadwalId = (jadwal as any).id;

  const personilList = (jadwal as any).personil || (jadwal as any).personilList || [];
  const peralatanList = (jadwal as any).peralatan || (jadwal as any).peralatanList || [];
  const dokumenList = (jadwal as any).dokumen || (jadwal as any).dokumenList || [];

  // Determine current active step (1-indexed)
  // Step 1: Diajukan Oleh (Automatically Completed upon creation!)
  // Step 2: Review Oleh (Supervisor)
  // Step 3: Persetujuan Oleh (Manajer)
  // Step 4: Konfirmasi Akhir (Direktur)
  // Step 5: Sedang Berlangsung
  // Step 6: Selesai

  let activeStep = 2; // Default to step 2 because creation completes step 1
  let statusBadge = { label: 'Dalam Review', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };

  if (st === 'menunggu persetujuan' || st === 'reviewed') {
    activeStep = 3;
    statusBadge = { label: 'Menunggu Persetujuan', bg: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' };
  } else if (st === 'menunggu konfirmasi akhir' || st === 'approved') {
    activeStep = 4;
    statusBadge = { label: 'Menunggu Konfirmasi Akhir', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' };
  } else if (st === 'sedang berlangsung' || st === 'berjalan' || st === 'disetujui') {
    activeStep = 5;
    statusBadge = { label: 'Sedang Berlangsung', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
  } else if (st === 'selesai') {
    activeStep = 6;
    statusBadge = { label: 'Selesai', bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' };
  }

  const handleUpdateStatus = async (newStatus: string) => {
    if (!jadwalId) {
      toast.info(`Status diubah menjadi "${newStatus}"`);
      if (onRefresh) onRefresh();
      onClose();
      return;
    }

    try {
      setIsUpdating(true);
      await jadwalTanamService.updateJadwalTanams(jadwalId, {
        statusJadwal: newStatus,
      });
      toast.success(`Status jadwal tanam berhasil diubah menjadi "${newStatus}"`);
      if (onRefresh) onRefresh();
      onClose();
    } catch (err: any) {
      console.error('Error updating status:', err);
      toast.error('Gagal memperbarui status');
    } finally {
      setIsUpdating(false);
    }
  };

  const steps = [
    { title: 'Diajukan Oleh', role: 'Staf / Koordinator', stepNum: 1 },
    { title: 'Review Oleh', role: 'Supervisor Produksi', stepNum: 2 },
    { title: 'Persetujuan Oleh', role: 'Manajer Produksi', stepNum: 3 },
    { title: 'Konfirmasi Akhir', role: 'Direktur Operasional', stepNum: 4 },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[75vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between bg-gray-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <h3 className="text-xs font-bold text-gray-800">
              Preview Jadwal Tanam: <span className="text-[#078836]">{jadwal.informasiUmum?.kodeJadwalTanam}</span>
            </h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadge.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></span>
              {statusBadge.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <i className="ri-close-line text-base"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 min-h-0 text-xs">
          <div className="grid grid-cols-12 gap-5">
            {/* Left Column (8 cols) */}
            <div className="col-span-12 lg:col-span-8 space-y-4">
              {/* Section 1: Informasi Umum */}
              <div className="bg-slate-50/70 rounded-lg p-3.5 border border-slate-200/60">
                <h4 className="font-bold text-gray-800 text-xs mb-2.5 flex items-center gap-1.5">
                  <i className="ri-information-line text-emerald-600 text-sm"></i> Informasi Umum
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                  <div>
                    <span className="text-gray-500 block text-[10px]">Penanggung Jawab</span>
                    <span className="font-semibold text-gray-800">{jadwal.informasiUmum?.penanggungJawab || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Musim Tanam</span>
                    <span className="font-semibold text-gray-800">{jadwal.informasiUmum?.musimTanam || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Tujuan Produksi</span>
                    <span className="font-semibold text-gray-800">{jadwal.informasiUmum?.tujuanProduksi || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Tipe Produksi</span>
                    <span className="font-semibold text-gray-800">{jadwal.informasiUmum?.tipeProduksi || '-'}</span>
                  </div>
                </div>
                {jadwal.informasiUmum?.deskripsi && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[11px]">
                    <span className="text-gray-500 block text-[10px]">Deskripsi / Catatan</span>
                    <p className="text-gray-700 font-medium">{jadwal.informasiUmum.deskripsi}</p>
                  </div>
                )}
              </div>

              {/* Section 2: Lahan & Komoditas */}
              <div className="bg-slate-50/70 rounded-lg p-3.5 border border-slate-200/60">
                <h4 className="font-bold text-gray-800 text-xs mb-2.5 flex items-center gap-1.5">
                  <i className="ri-landscape-line text-blue-600 text-sm"></i> Lahan & Komoditas
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                  <div>
                    <span className="text-gray-500 block text-[10px]">Lahan / Greenhouse</span>
                    <span className="font-semibold text-gray-800">{jadwal.lahanKomoditas?.namaLahan || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Luas Tanam</span>
                    <span className="font-semibold text-gray-800">
                      {typeof jadwal.lahanKomoditas?.luasTanam === 'number'
                        ? `${jadwal.lahanKomoditas.luasTanam.toFixed(2).replace('.', ',')} Ha`
                        : jadwal.lahanKomoditas?.luasTanam || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Komoditas</span>
                    <span className="font-semibold text-gray-800">{jadwal.lahanKomoditas?.komoditas || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Varietas</span>
                    <span className="font-semibold text-gray-800">{jadwal.lahanKomoditas?.varietas || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Asal Benih</span>
                    <span className="font-semibold text-gray-800">{jadwal.lahanKomoditas?.asalBenih || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Jarak Tanam</span>
                    <span className="font-semibold text-gray-800">{jadwal.lahanKomoditas?.jarakTanam || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Sistem Tanam</span>
                    <span className="font-semibold text-gray-800">{jadwal.lahanKomoditas?.sistemTanam || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Jumlah Benih</span>
                    <span className="font-semibold text-gray-800">
                      {jadwal.lahanKomoditas?.jumlahBenihDiperlukan ? `${jadwal.lahanKomoditas.jumlahBenihDiperlukan} Kg` : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: Rencana Tanam & Irigasi */}
              <div className="bg-slate-50/70 rounded-lg p-3.5 border border-slate-200/60">
                <h4 className="font-bold text-gray-800 text-xs mb-2.5 flex items-center gap-1.5">
                  <i className="ri-calendar-todo-line text-purple-600 text-sm"></i> Rencana Tanam & Irigasi
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                  <div>
                    <span className="text-gray-500 block text-[10px]">Tanggal Persemaian</span>
                    <span className="font-semibold text-gray-800">{jadwal.rencanaTanam?.tanggalPersemaian || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Tanggal Tanam</span>
                    <span className="font-semibold text-gray-800">{jadwal.rencanaTanam?.tanggalTanam || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Perkiraan Panen</span>
                    <span className="font-semibold text-gray-800">{jadwal.rencanaTanam?.perkiraanPanen || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Siklus Tanam</span>
                    <span className="font-semibold text-gray-800">
                      {jadwal.rencanaTanam?.siklusTanamHari ? `${jadwal.rencanaTanam.siklusTanamHari} Hari` : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Metode Tanam</span>
                    <span className="font-semibold text-gray-800">{jadwal.rencanaTanam?.metodeTanam || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Sistem Irigasi</span>
                    <span className="font-semibold text-gray-800">{jadwal.rencanaTanam?.irigasi || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Sumber Air</span>
                    <span className="font-semibold text-gray-800">{jadwal.rencanaTanam?.sumberAir || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Section 4: C. Personil & Peralatan (Gambar 2) */}
              <div className="border border-gray-200/80 bg-white rounded-lg p-3.5 shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <i className="ri-team-line text-emerald-600 text-sm"></i> Personil & Peralatan
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Ringkasan Personil */}
                  <div className="border border-gray-200/70 rounded-lg p-3 bg-slate-50/40">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-6 h-6 rounded bg-emerald-100/80 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                        <i className="ri-user-line text-xs"></i>
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-800 text-[11px] leading-tight mb-0">Ringkasan Personil</h5>
                        <span className="text-[10px] text-emerald-600 font-semibold block">
                          Total Personil {personilList.length} orang
                        </span>
                      </div>
                    </div>

                    {personilList.length > 0 ? (
                      <div className="space-y-1 mt-2">
                        {personilList.map((p: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-[10px] p-1.5 bg-white rounded border border-gray-100">
                            <span className="font-semibold text-gray-800">{p.nama || p.namaPersonil || 'Personil'}</span>
                            <span className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded font-medium">{p.peran || p.jabatan || 'Anggota'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-gray-400 italic mb-0 mt-1">
                        Belum ada personil yang ditugaskan
                      </p>
                    )}
                  </div>

                  {/* Ringkasan Peralatan */}
                  <div className="border border-gray-200/70 rounded-lg p-3 bg-slate-50/40">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-6 h-6 rounded bg-emerald-100/80 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                        <i className="ri-tools-line text-xs"></i>
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-800 text-[11px] leading-tight mb-0">Ringkasan Peralatan</h5>
                        <span className="text-[10px] text-emerald-600 font-semibold block">
                          Total Peralatan {peralatanList.length} item
                        </span>
                      </div>
                    </div>

                    {peralatanList.length > 0 ? (
                      <div className="space-y-1 mt-2">
                        {peralatanList.map((eq: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-[10px] p-1.5 bg-white rounded border border-gray-100">
                            <span className="font-semibold text-gray-800">{eq.nama || eq.namaAlat || 'Alat'}</span>
                            <span className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded font-medium">{eq.jumlah || 1} {eq.satuan || 'Unit'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-gray-400 italic mb-0 mt-1">
                        Belum ada peralatan yang digunakan
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (4 cols) */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              {/* Alur Approval */}
              <div className="border border-gray-200/80 bg-white rounded-lg p-3.5 shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <i className="ri-git-commit-line text-emerald-600 text-sm"></i> Alur Approval
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${statusBadge.bg}`}>
                    {statusBadge.label}
                  </span>
                </div>

                {/* Minimalist Compact Vertical Timeline */}
                <div className="space-y-3 relative pl-1">
                  {steps.map((item, idx) => {
                    const isCompleted = activeStep > item.stepNum;
                    const isCurrent = activeStep === item.stepNum;

                    return (
                      <div key={idx} className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 transition-colors ${
                              isCompleted
                                ? 'bg-emerald-500 text-white'
                                : isCurrent
                                ? 'bg-amber-500 text-white ring-2 ring-amber-100'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {isCompleted ? <i className="ri-check-line text-xs"></i> : item.stepNum}
                          </div>
                          <div>
                            <h5 className="font-bold text-gray-800 text-[11px] leading-tight mb-0">
                              {item.title}
                            </h5>
                            <span className="text-[9px] text-gray-400 block leading-tight">
                              {item.role}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-semibold shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : isCurrent
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : 'bg-gray-50 text-gray-400 border border-gray-100'
                          }`}
                        >
                          {isCompleted ? 'Disetujui' : isCurrent ? 'Menunggu' : 'Menunggu'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 5: E. Dokumen Pendukung (Gambar 3) */}
              <div className="border border-gray-200/80 bg-white rounded-lg p-3.5 shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <i className="ri-folder-open-line text-emerald-600 text-sm"></i> Dokumen Pendukung
                  </h4>
                  <span className="text-[10px] text-gray-500 font-semibold">
                    {dokumenList.length} File
                  </span>
                </div>

                {dokumenList.length > 0 ? (
                  <div className="space-y-1.5">
                    {dokumenList.map((doc: any, idx: number) => (
                      <div key={idx} className="border border-gray-200/70 rounded p-2 flex items-center justify-between bg-slate-50/50 text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <i className="ri-file-text-line text-emerald-600 text-sm shrink-0"></i>
                          <span className="font-semibold text-gray-800 truncate text-[11px]">{doc.nama || doc.name || `Dokumen_${idx + 1}`}</span>
                        </div>
                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 text-gray-500 hover:text-emerald-600 transition-colors"
                            title="Unduh / Lihat"
                          >
                            <i className="ri-download-line text-xs"></i>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-200/80 rounded-lg p-4 flex flex-col items-center justify-center gap-1 bg-slate-50/30 text-center">
                    <i className="ri-question-line text-2xl text-gray-300"></i>
                    <span className="text-[11px] text-gray-500 font-medium">Tidak ada berkas terunggah</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Action Buttons mapped to Alur Approval State */}
        <div className="px-5 py-2.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors shadow-xs"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2.5">
            {/* Step 2: Review Supervisor */}
            {activeStep <= 2 && (
              <button
                disabled={isUpdating}
                onClick={() => handleUpdateStatus('Menunggu Persetujuan')}
                className="px-4 py-1.5 bg-[#078836] hover:bg-[#06732d] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
              >
                <i className="ri-file-search-line text-sm"></i>
                {isUpdating ? 'Memproses...' : 'Setujui Review (Supervisor)'}
              </button>
            )}

            {/* Step 3: Approve Manajer */}
            {activeStep === 3 && (
              <button
                disabled={isUpdating}
                onClick={() => handleUpdateStatus('Menunggu Konfirmasi Akhir')}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
              >
                <i className="ri-checkbox-circle-line text-sm"></i>
                {isUpdating ? 'Memproses...' : 'Setujui Persetujuan (Manajer)'}
              </button>
            )}

            {/* Step 4: Disetujui Direktur Operasional */}
            {activeStep === 4 && (
              <button
                disabled={isUpdating}
                onClick={() => handleUpdateStatus('Sedang Berlangsung')}
                className="px-4 py-1.5 bg-[#078836] hover:bg-[#06732d] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
              >
                <i className="ri-shield-check-line text-sm"></i>
                {isUpdating ? 'Memproses...' : 'Konfirmasi Akhir (Direktur Operasional)'}
              </button>
            )}

            {/* Step 5: Selesaikan Tanam */}
            {activeStep === 5 && (
              <button
                disabled={isUpdating}
                onClick={() => handleUpdateStatus('Selesai')}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
              >
                <i className="ri-checkbox-circle-line text-sm"></i>
                {isUpdating ? 'Memproses...' : 'Selesaikan Tanam / Panen'}
              </button>
            )}

            {/* Step 6: Selesai */}
            {activeStep === 6 && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <i className="ri-check-double-line text-base"></i>
                Jadwal Tanam Telah Selesai
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
