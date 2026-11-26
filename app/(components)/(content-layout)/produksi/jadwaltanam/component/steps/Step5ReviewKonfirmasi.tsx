import React, { useState } from 'react';

interface Step5Props {
  options?: any;
  dataIU?: any;
  dataIL?: any;
  dataLK?: any;
  dataRT?: any;
  dataCT?: any;
  detailList?: any[];
  personilList?: any[];
  peralatanList?: any[];
  isEditMode?: boolean;
}

export default function Step5ReviewKonfirmasi({
  options,
  dataIU,
  dataIL,
  dataLK,
  dataRT,
  dataCT,
  detailList = [],
  personilList = [],
  peralatanList = [],
  isEditMode = false,
}: Step5Props) {
  // Modal states for detail views
  const [activeModal, setActiveModal] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [previewFile, setPreviewFile] = useState<{ file?: File; name: string; url: string; isPdf: boolean } | null>(null);

  // Resolvers for Komoditas & Varietas display names
  const getKomoditasDisplay = () => {
    if (dataLK?.namaKomoditas) return dataLK.namaKomoditas;
    const val = dataLK?.komoditas;
    if (!val) return 'Padi';
    const found = options?.lahanKomoOption?.komoditas?.find(
      (opt: any) => opt.value === val || opt.label === val
    );
    return found ? found.label : val;
  };

  const getVarietasDisplay = () => {
    if (dataLK?.namaVarietas) return dataLK.namaVarietas;
    const val = dataLK?.varietas;
    if (!val) return 'Inpari 32';
    const found = options?.lahanKomoOption?.varietas?.find(
      (opt: any) => opt.value === val || opt.label === val
    );
    if (found) return found.label;
    const foundAll = options?.lahanKomoOption?.allVarietas?.find(
      (v: any) => v.kodeVarietas === val || v.id === val || v.namaVarietas === val
    );
    return foundAll ? foundAll.namaVarietas : val;
  };

  // Personil & Peralatan summary (Step 4 dynamic data)
  const personilSummary = React.useMemo(() => {
    if (!personilList || personilList.length === 0) return [];
    const counts: Record<string, number> = {};
    personilList.forEach((p) => {
      const role = p.peran || 'Personil';
      counts[role] = (counts[role] || 0) + 1;
    });
    return Object.entries(counts).map(([role, count]) => ({ role, count }));
  }, [personilList]);

  const peralatanSummary = React.useMemo(() => {
    if (!peralatanList || peralatanList.length === 0) return [];
    const counts: Record<string, number> = {};
    peralatanList.forEach((eq) => {
      const jenis = eq.jenis || 'Peralatan';
      const qty = Number(eq.jumlah) || 1;
      counts[jenis] = (counts[jenis] || 0) + qty;
    });
    return Object.entries(counts).map(([jenis, count]) => ({ jenis, count }));
  }, [peralatanList]);

  // Dynamic calculation for Luas Total & Jumlah Lahan based on Step 3 detailList or Step 1/2 dataLK
  const jumlahLahanDisplay = React.useMemo(() => {
    if (detailList && detailList.length > 0) {
      return `${detailList.length} Lahan`;
    }
    if (dataLK?.jumlahLahan) {
      return `${dataLK.jumlahLahan} Lahan`;
    }
    if (dataLK?.idLahan || dataLK?.namaLahan) {
      return `1 Lahan`;
    }
    return `0 Lahan`;
  }, [detailList, dataLK]);

  const luasTotalDisplay = React.useMemo(() => {
    if (detailList && detailList.length > 0) {
      const sum = detailList.reduce((acc: number, item: any) => {
        const val = parseFloat(String(item.luas || '0').replace(',', '.'));
        return acc + (isNaN(val) ? 0 : val);
      }, 0);
      return `${sum.toFixed(2).replace('.', ',')} Ha`;
    }
    if (dataLK?.luasTanam) {
      return `${dataLK.luasTanam} Ha`;
    }
    if (dataLK?.luasTotal) {
      return `${dataLK.luasTotal} Ha`;
    }
    return `0,00 Ha`;
  }, [detailList, dataLK]);

  // Helper functions for files
  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileBadge = (fileName?: string) => {
    const nameStr = fileName || '';
    const ext = nameStr.includes('.') ? nameStr.split('.').pop()?.toLowerCase() : '';
    if (ext === 'pdf') {
      return { label: 'PDF', bg: 'bg-red-100 text-red-700' };
    }
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
      return { label: ext?.toUpperCase() || 'IMG', bg: 'bg-blue-100 text-blue-700' };
    }
    return { label: 'FILE', bg: 'bg-gray-100 text-gray-700' };
  };

  const handleViewFile = (fileItem: any) => {
    const name = fileItem?.name || fileItem?.nama || 'Dokumen';
    let url = fileItem?.url || fileItem?.fileUrl || '';
    const isPdf = name.toLowerCase().endsWith('.pdf');

    if (fileItem instanceof File) {
      url = URL.createObjectURL(fileItem);
    }

    setPreviewFile({ name, url, isPdf });
  };

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <div className="box border border-defaultborder/60 bg-slate-50/90 shadow-sm rounded-lg p-4">
        <h4 className="text-xs font-bold text-gray-800 mb-3">Ringkasan Rencana Tanam</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 text-xs">
          <div>
            <span className="text-gray-500 block text-[10px] mb-0.5">Periode Tanam</span>
            <span className="font-bold text-gray-800">
              {dataIU?.periodeTanam || (dataIU?.periodeTanamMulai && dataIU?.periodeTanamSelesai ? `${dataIU.periodeTanamMulai} - ${dataIU.periodeTanamSelesai}` : dataIU?.periodeTanamMulai || dataRT?.periodeTanam || '-')}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] mb-0.5">Tgl Mulai Tanam</span>
            <span className="font-bold text-gray-800">{dataRT?.tanggalTanam || '10 Juni 2025'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] mb-0.5">Tgl Selesai Tanam</span>
            <span className="font-bold text-gray-800">{dataRT?.perkiraanPanen || '20 Juni 2025'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] mb-0.5">Komoditas</span>
            <span className="font-bold text-gray-800">{getKomoditasDisplay()}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] mb-0.5">Varietas</span>
            <span className="font-bold text-gray-800">{getVarietasDisplay()}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] mb-0.5">Luas Total</span>
            <span className="font-bold text-gray-800">{luasTotalDisplay}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] mb-0.5">Jumlah Lahan</span>
            <span className="font-bold text-gray-800">{jumlahLahanDisplay}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] mb-0.5">Sistem Irigasi</span>
            <span className="font-bold text-gray-800">{dataRT?.irigasi || 'Irigasi Terjadwal'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column (8 cols on xl) */}
        <div className="xl:col-span-8 col-span-12 space-y-6">
          
          {/* A. Informasi Lahan (Step 3 + Step 1/2) */}
          <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">A. Informasi Lahan</h3>
              <button
                type="button"
                onClick={() => setActiveModal('A')}
                className="px-2.5 py-1 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
              >
                <i className="ri-eye-line"></i> Lihat Detail
              </button>
            </div>

            <div className="table-responsive">
              <table className="table whitespace-nowrap min-w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-slate-50 text-gray-700 font-semibold">
                    <th className="p-2.5 text-start">No</th>
                    <th className="p-2.5 text-start">Lahan</th>
                    <th className="p-2.5 text-start">Luas (Ha)</th>
                    <th className="p-2.5 text-start">Tipe Lahan</th>
                    <th className="p-2.5 text-start">Sistem Irigasi</th>
                    <th className="p-2.5 text-start">Sumber Air</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  {detailList && detailList.length > 0 ? (
                    detailList.map((l: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-2.5 font-bold text-gray-800">{l.no || idx + 1}</td>
                        <td className="p-2.5 font-semibold text-gray-800">{l.lahan}</td>
                        <td className="p-2.5">{l.luas}</td>
                        <td className="p-2.5">{l.tipe || 'Lahan Terbuka'}</td>
                        <td className="p-2.5">{l.irigasi || dataRT?.irigasi || '-'}</td>
                        <td className="p-2.5">{dataRT?.sumberAir || 'Sumur Bor'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-400">
                        Belum ada detail lahan (Tambahkan di Step 3: Rencana Tanam).
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* B. Komoditas & Varietas (Step 2 Data) */}
          <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">B. Komoditas & Varietas</h3>
              <button
                type="button"
                onClick={() => setActiveModal('B')}
                className="px-2.5 py-1 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
              >
                <i className="ri-eye-line"></i> Lihat Detail
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
              <div>
                <span className="text-gray-500 block text-[10px] mb-0.5">Komoditas</span>
                <span className="font-bold text-gray-800">{getKomoditasDisplay()}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] mb-0.5">Varietas</span>
                <span className="font-bold text-gray-800">{getVarietasDisplay()}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] mb-0.5">Target Produksi Benih (Kg)</span>
                <span className="font-bold text-gray-800">{dataLK?.targetProduksi || '6.500'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] mb-0.5">Standar Kualitas</span>
                <span className="font-bold text-gray-800">{dataLK?.standarKualitas || 'Sertifikat (SS)'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] mb-0.5">Perkecambahan Minimal (%)</span>
                <span className="font-bold text-gray-800">{dataLK?.perkecambahan || '80%'}</span>
              </div>
            </div>
          </div>

          {/* C. Personil & Peralatan (Step 4 Data) */}
          <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">C. Personil & Peralatan</h3>
              <button
                type="button"
                onClick={() => setActiveModal('C')}
                className="px-2.5 py-1 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
              >
                <i className="ri-eye-line"></i> Lihat Detail
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Ringkasan Personil */}
              <div className="border border-gray-200 rounded-lg p-3.5 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <i className="ri-user-line text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">Ringkasan Personil</h4>
                    <span className="text-[10px] text-emerald-700 font-semibold">Total Personil {personilList.length} orang</span>
                  </div>
                </div>
                {personilSummary.length === 0 ? (
                  <p className="text-[11px] text-gray-400 italic">Belum ada personil yang ditugaskan</p>
                ) : (
                  <ul className="text-[11px] text-gray-600 space-y-1 pl-1">
                    {personilSummary.map((p, idx) => (
                      <li key={idx}>• {p.role} : {p.count}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Ringkasan Peralatan */}
              <div className="border border-gray-200 rounded-lg p-3.5 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <i className="ri-tools-line text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">Ringkasan Peralatan</h4>
                    <span className="text-[10px] text-emerald-700 font-semibold">Total Peralatan {peralatanList.reduce((acc: number, item: any) => acc + (Number(item.jumlah) || 1), 0)} item</span>
                  </div>
                </div>
                {peralatanSummary.length === 0 ? (
                  <p className="text-[11px] text-gray-400 italic">Belum ada peralatan yang digunakan</p>
                ) : (
                  <ul className="text-[11px] text-gray-600 space-y-1 pl-1">
                    {peralatanSummary.map((eq, idx) => (
                      <li key={idx}>• {eq.jenis} : {eq.count}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* D. Jadwal Tanam (Step 3 Data) */}
          <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">D. Jadwal Tanam</h3>
              <button
                type="button"
                onClick={() => setActiveModal('D')}
                className="px-2.5 py-1 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
              >
                <i className="ri-eye-line"></i> Lihat Detail
              </button>
            </div>

            <div className="table-responsive">
              <table className="table whitespace-nowrap min-w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-slate-50 text-gray-700 font-semibold">
                    <th className="p-2.5 text-start">No</th>
                    <th className="p-2.5 text-start">Lahan</th>
                    <th className="p-2.5 text-start">Tanggal Tanam</th>
                    <th className="p-2.5 text-start">Populasi Tanaman</th>
                    <th className="p-2.5 text-start">Metode Tanam</th>
                    <th className="p-2.5 text-start">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  {detailList && detailList.length > 0 ? (
                    detailList.map((j: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-2.5 font-bold text-gray-800">{j.no || idx + 1}</td>
                        <td className="p-2.5 font-semibold text-gray-800">{j.lahan}</td>
                        <td className="p-2.5">{j.tglTanam}</td>
                        <td className="p-2.5">{j.populasi}</td>
                        <td className="p-2.5">{dataRT?.metodeTanam || 'Langsung'}</td>
                        <td className="p-2.5 text-gray-400">{dataCT?.catatan || '—'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-400">
                        Belum ada jadwal tanam per lahan (Tambahkan di Step 3: Rencana Tanam).
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols on xl) */}
        <div className="xl:col-span-4 col-span-12 space-y-6">
          {/* E. Dokumen Pendukung (Step 1 & Step 3 Data) */}
          <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">E. Dokumen Pendukung</h3>
              <span className="text-[11px] text-gray-400 font-medium">
                {(dataCT?.dokumenFiles || []).length} File
              </span>
            </div>

            <div className="space-y-2">
              {dataCT?.dokumenFiles && dataCT.dokumenFiles.length > 0 ? (
                dataCT.dokumenFiles.map((file: any, idx: number) => {
                  const fileName = file?.name || file?.nama || 'Dokumen Rencana Tanam';
                  const badge = getFileBadge(fileName);
                  return (
                    <div key={idx} className="border border-gray-200 rounded p-2.5 flex items-center justify-between bg-white text-xs shadow-sm hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${badge.bg} shrink-0`}>
                          {badge.label}
                        </span>
                        <div className="truncate">
                          <p className="font-semibold text-gray-800 truncate mb-0 text-[11px]" title={fileName}>{fileName}</p>
                          <span className="text-[9px] text-gray-400">
                            {file?.size ? formatFileSize(file.size) : 'Dokumen Pendukung'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-1">
                        <button
                          type="button"
                          onClick={() => handleViewFile(file)}
                          className="p-1 text-gray-500 hover:text-emerald-600 transition-colors"
                          title="Lihat Dokumen"
                        >
                          <i className="ri-eye-line text-xs"></i>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="border border-dashed border-gray-300 rounded p-3 flex items-center justify-center gap-2 bg-gray-50 text-gray-500 text-xs">
                  <i className="ri-file-unknow-line text-lg text-gray-400"></i>
                  <span className="text-[11px] text-gray-500 font-medium">Tidak ada berkas terunggah</span>
                </div>
              )}
            </div>
          </div>

          {/* F. Alur Approval */}
          <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">F. Alur Approval</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                (isEditMode || dataIU?.kodeJadwalTanam) ? 'bg-amber-100 text-amber-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {(isEditMode || dataIU?.kodeJadwalTanam) ? 'Menunggu Review' : 'Menunggu Pengajuan'}
              </span>
            </div>

            <div className="space-y-4 text-xs relative pl-2">
              {/* Step 1: Diajukan Oleh */}
              <div className="flex items-start gap-3 relative">
                <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 z-10 ${
                  (isEditMode || dataIU?.kodeJadwalTanam) ? 'bg-emerald-500' : 'bg-amber-500'
                }`}>
                  {(isEditMode || dataIU?.kodeJadwalTanam) ? <i className="ri-check-line text-xs"></i> : 1}
                </div>
                <div className="flex-1 border-b border-gray-100 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-bold text-gray-800 mb-0.5">Diajukan Oleh</h5>
                      <span className="text-[11px] text-gray-500 block">Staf / Koordinator Produksi</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      (isEditMode || dataIU?.kodeJadwalTanam)
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {(isEditMode || dataIU?.kodeJadwalTanam) ? 'Selesai' : 'Menunggu'}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {(isEditMode || dataIU?.kodeJadwalTanam)
                      ? `Status: Disetujui / Selesai (Diajukan oleh: ${dataIU?.penanggungJawab || 'Staf Produksi'})`
                      : 'Status: Menunggu Konfirmasi Simpan'}
                  </span>
                </div>
              </div>

              {/* Step 2: Review Oleh */}
              <div className="flex items-start gap-3 relative">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 ${
                  (isEditMode || dataIU?.kodeJadwalTanam)
                    ? 'bg-amber-500 text-white ring-2 ring-amber-100'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <div className="flex-1 border-b border-gray-100 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-bold text-gray-800 mb-0.5">Review Oleh</h5>
                      <span className="text-[11px] text-gray-500 block">Supervisor Produksi</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      (isEditMode || dataIU?.kodeJadwalTanam)
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      Menunggu
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {(isEditMode || dataIU?.kodeJadwalTanam) ? 'Status: Menunggu Review Supervisor' : '—'}
                  </span>
                </div>
              </div>

              {/* Step 3: Persetujuan Oleh */}
              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-xs shrink-0 z-10">
                  3
                </div>
                <div className="flex-1 border-b border-gray-100 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-bold text-gray-800 mb-0.5">Persetujuan Oleh</h5>
                      <span className="text-[11px] text-gray-500 block">Manajer Produksi</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">Menunggu</span>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block">—</span>
                </div>
              </div>

              {/* Step 4: Konfirmasi Akhir */}
              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-xs shrink-0 z-10">
                  4
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-bold text-gray-800 mb-0.5">Konfirmasi Akhir</h5>
                      <span className="text-[11px] text-gray-500 block">Direktur Operasional</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">Menunggu</span>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block">—</span>
                </div>
              </div>
            </div>
          </div>

          {/* G. Catatan Review */}
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <i className="ri-file-edit-line text-lg"></i>
              </div>
              <div>
                <h6 className="text-xs font-bold text-amber-900 mb-1">Belum ada catatan review.</h6>
                <p className="text-xs text-amber-800 leading-relaxed mb-0">
                  Catatan akan muncul setelah transaksi disimpan dan diajukan ke pihak peninjau.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Detail Sections */}
      {activeModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full flex flex-col overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h4 className="font-bold text-sm text-gray-800">
                Detail {activeModal === 'A' ? 'Informasi Lahan' : activeModal === 'B' ? 'Komoditas & Varietas' : activeModal === 'C' ? 'Personil & Peralatan' : 'Jadwal Tanam'}
              </h4>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded text-gray-400 hover:text-gray-700"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh] text-xs">
              {activeModal === 'A' && (
                <div className="space-y-4">
                  <p className="text-gray-600">Berikut detail seluruh lahan yang terdaftar pada transaksi ini (Diambil dari Step 3 & Step 1/2):</p>
                  <table className="table whitespace-nowrap min-w-full text-xs border border-gray-200">
                    <thead className="bg-slate-50 font-semibold text-gray-700">
                      <tr>
                        <th className="p-2 border">No</th>
                        <th className="p-2 border">Nama Lahan</th>
                        <th className="p-2 border">Luas</th>
                        <th className="p-2 border">Tipe Lahan</th>
                        <th className="p-2 border">Irigasi</th>
                        <th className="p-2 border">Sumber Air</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailList && detailList.length > 0 ? (
                        detailList.map((l: any, idx: number) => (
                          <tr key={idx}>
                            <td className="p-2 border text-center font-bold">{l.no || idx + 1}</td>
                            <td className="p-2 border font-semibold">{l.lahan}</td>
                            <td className="p-2 border">{l.luas} Ha</td>
                            <td className="p-2 border">{l.tipe || 'Lahan Terbuka'}</td>
                            <td className="p-2 border">{l.irigasi || dataRT?.irigasi || '-'}</td>
                            <td className="p-2 border">{dataRT?.sumberAir || 'Sumur Bor'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-gray-400">
                            Belum ada detail lahan. Tambahkan lahan di Step 3 (Rencana Tanam).
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeModal === 'B' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <span className="text-gray-500 text-[10px] block">Komoditas Utama</span>
                    <span className="font-bold text-sm text-gray-800">{getKomoditasDisplay()}</span>
                  </div>
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <span className="text-gray-500 text-[10px] block">Varietas Utama</span>
                    <span className="font-bold text-sm text-gray-800">{getVarietasDisplay()}</span>
                  </div>
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <span className="text-gray-500 text-[10px] block">Target Produksi Benih</span>
                    <span className="font-bold text-sm text-gray-800">{dataLK?.targetProduksi || '6.500'} Kg</span>
                  </div>
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <span className="text-gray-500 text-[10px] block">Standar Kualitas Benih</span>
                    <span className="font-bold text-sm text-gray-800">{dataLK?.standarKualitas || 'Sertifikat (SS)'}</span>
                  </div>
                </div>
              )}

              {activeModal === 'C' && (
                <div className="space-y-6">
                  <div>
                    <h5 className="font-bold text-gray-800 text-xs mb-2 flex items-center gap-1.5">
                      <i className="ri-user-line text-emerald-600"></i> Daftar Personil (Step 4)
                    </h5>
                    <div className="table-responsive">
                      <table className="table whitespace-nowrap min-w-full text-xs border border-gray-200">
                        <thead className="bg-slate-50 font-semibold text-gray-700">
                          <tr>
                            <th className="p-2 border">No</th>
                            <th className="p-2 border">Nama Personil</th>
                            <th className="p-2 border">Peran / Jabatan</th>
                            <th className="p-2 border">Tugas</th>
                            <th className="p-2 border">Kontak</th>
                          </tr>
                        </thead>
                        <tbody>
                          {personilList && personilList.length > 0 ? (
                            personilList.map((p: any, idx: number) => (
                              <tr key={idx}>
                                <td className="p-2 border text-center font-bold">{p.no || idx + 1}</td>
                                <td className="p-2 border font-semibold">{p.nama}</td>
                                <td className="p-2 border">{p.peran}</td>
                                <td className="p-2 border">{p.tugas}</td>
                                <td className="p-2 border">{p.kontak || '-'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="p-3 text-center text-gray-400">
                                Belum ada personil yang ditugaskan di Step 4.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-gray-800 text-xs mb-2 flex items-center gap-1.5">
                      <i className="ri-tools-line text-emerald-600"></i> Daftar Peralatan (Step 4)
                    </h5>
                    <div className="table-responsive">
                      <table className="table whitespace-nowrap min-w-full text-xs border border-gray-200">
                        <thead className="bg-slate-50 font-semibold text-gray-700">
                          <tr>
                            <th className="p-2 border">No</th>
                            <th className="p-2 border">Nama Peralatan</th>
                            <th className="p-2 border">Jenis</th>
                            <th className="p-2 border">Jumlah</th>
                            <th className="p-2 border">Satuan</th>
                            <th className="p-2 border">Kondisi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {peralatanList && peralatanList.length > 0 ? (
                            peralatanList.map((eq: any, idx: number) => (
                              <tr key={idx}>
                                <td className="p-2 border text-center font-bold">{eq.no || idx + 1}</td>
                                <td className="p-2 border font-semibold">{eq.nama}</td>
                                <td className="p-2 border">{eq.jenis}</td>
                                <td className="p-2 border text-center font-bold">{eq.jumlah}</td>
                                <td className="p-2 border">{eq.satuan}</td>
                                <td className="p-2 border">{eq.kondisi}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="p-3 text-center text-gray-400">
                                Belum ada peralatan yang digunakan di Step 4.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'D' && (
                <div className="space-y-4">
                  <p className="text-gray-600">Detail Jadwal Tanam per Lahan (Step 3):</p>
                  <table className="table whitespace-nowrap min-w-full text-xs border border-gray-200">
                    <thead className="bg-slate-50 font-semibold text-gray-700">
                      <tr>
                        <th className="p-2 border">No</th>
                        <th className="p-2 border">Nama Lahan</th>
                        <th className="p-2 border">Tanggal Tanam</th>
                        <th className="p-2 border">Populasi</th>
                        <th className="p-2 border">Metode</th>
                        <th className="p-2 border">Catatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailList && detailList.length > 0 ? (
                        detailList.map((j: any, idx: number) => (
                          <tr key={idx}>
                            <td className="p-2 border text-center font-bold">{j.no || idx + 1}</td>
                            <td className="p-2 border font-semibold">{j.lahan}</td>
                            <td className="p-2 border">{j.tglTanam}</td>
                            <td className="p-2 border">{j.populasi}</td>
                            <td className="p-2 border">{dataRT?.metodeTanam || 'Langsung'}</td>
                            <td className="p-2 border text-gray-400">{dataCT?.catatan || '—'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-gray-400">
                            Belum ada detail jadwal tanam per lahan. Tambahkan di Step 3 (Rencana Tanam).
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="px-5 py-3 border-t bg-gray-50 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-gray-800 text-white rounded text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview Dokumen Pendukung */}
      {previewFile && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <i className={`${previewFile.isPdf ? 'ri-file-pdf-2-line text-red-600' : 'ri-image-line text-blue-600'} text-lg`}></i>
                <h4 className="font-bold text-sm text-gray-800">
                  Preview Dokumen — {previewFile.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="p-6 flex-1 overflow-auto flex items-center justify-center bg-gray-900/5 min-h-[350px]">
              {previewFile.url ? (
                previewFile.isPdf ? (
                  <iframe src={previewFile.url} className="w-full h-[550px] rounded border border-gray-200 shadow-sm" title="Preview Dokumen PDF" />
                ) : (
                  <img src={previewFile.url} alt={previewFile.name} className="max-h-[550px] max-w-full object-contain rounded shadow-lg border border-gray-200 bg-white" />
                )
              ) : (
                <div className="text-center p-8 bg-white rounded-lg border border-gray-200 shadow-sm max-w-md w-full">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                    <i className="ri-file-pdf-2-line text-3xl"></i>
                  </div>
                  <h5 className="font-bold text-sm text-gray-800 mb-1">{previewFile.name}</h5>
                  <p className="text-xs text-gray-500 mb-4">Preview dokumen rencana tanam.</p>
                </div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md text-xs font-semibold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
