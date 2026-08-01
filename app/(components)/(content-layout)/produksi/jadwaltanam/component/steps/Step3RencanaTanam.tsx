import React, { useState, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import SpkDatepickr from '@/shared/@spk-reusable-components/spk-packages/datepicker-component';

interface Step3Props {
  options?: any;
  dataLK?: any;
  dataRT?: any;
  dataCT?: any;
  onChangeRT?: (field: string, val: any) => void;
  onChangeCT?: (field: string, val: any) => void;
  detailList?: any[];
  setDetailList?: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function Step3RencanaTanam({ options, dataLK, dataRT, dataCT, onChangeRT, onChangeCT, detailList, setDetailList }: Step3Props) {
  // Parse date helpers for dataRT sync from Step 1
  const parseDateHelper = (val: any): Date | null => {
    if (!val) return null;
    if (val instanceof Date) return val;
    if (typeof val === 'string') {
      if (val.includes('/')) {
        const parts = val.split('/');
        if (parts.length === 3) {
          const d = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const y = parseInt(parts[2], 10);
          return new Date(y, m, d);
        }
      }
      const parsed = new Date(val);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return null;
  };

  const formatDateStrHelper = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const selectedTglMulai = useMemo(() => {
    return parseDateHelper(dataRT?.tanggalTanam) || new Date();
  }, [dataRT?.tanggalTanam]);

  const selectedTglSelesai = useMemo(() => {
    return parseDateHelper(dataRT?.perkiraanPanen) || new Date();
  }, [dataRT?.perkiraanPanen]);

  // File Upload & Preview State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ file?: File; name: string; url: string; isPdf: boolean } | null>(null);

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileBadge = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      return { label: 'PDF', bg: 'bg-red-100 text-red-700' };
    }
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
      return { label: ext?.toUpperCase() || 'IMG', bg: 'bg-blue-100 text-blue-700' };
    }
    return { label: 'FILE', bg: 'bg-gray-100 text-gray-700' };
  };

  const handleFilesAdded = (files: FileList | File[]) => {
    const validFiles: File[] = [];
    const maxSizeBytes = 5 * 1024 * 1024;

    Array.from(files).forEach(file => {
      if (file.size > maxSizeBytes) {
        toast.error(`File "${file.name}" melebihi batas 5 MB.`);
        return;
      }
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['pdf', 'png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) {
        toast.error(`Format file "${file.name}" tidak didukung (gunakan PDF, PNG, JPG).`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      const existing: File[] = dataCT?.dokumenFiles || [];
      const updated = [...existing, ...validFiles];
      if (onChangeCT) {
        onChangeCT('dokumenFiles', updated);
      }
      toast.success(`${validFiles.length} file berhasil ditambahkan.`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesAdded(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const removeFile = (indexToRemove: number) => {
    const existing: File[] = dataCT?.dokumenFiles || [];
    const updated = existing.filter((_, idx) => idx !== indexToRemove);
    if (onChangeCT) {
      onChangeCT('dokumenFiles', updated);
    }
  };

  const handleViewFile = (fileItem: File | { name: string; url?: string }) => {
    let name = fileItem.name;
    let url = '';
    let isPdf = name.toLowerCase().endsWith('.pdf');

    if (fileItem instanceof File) {
      url = URL.createObjectURL(fileItem);
    } else if (fileItem.url) {
      url = fileItem.url;
    }

    setPreviewFile({ name, url, isPdf });
  };

  const [internalDetailList, setInternalDetailList] = useState<any[]>([]);
  const activeDetailList = detailList !== undefined ? detailList : internalDetailList;
  const setActiveDetailList = setDetailList || setInternalDetailList;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingNo, setEditingNo] = useState<number | null>(null);

  const [formDetail, setFormDetail] = useState({
    idLahan: '',
    lahan: '',
    luas: '',
    idKomoditas: '',
    komoditas: '',
    idVarietas: '',
    varietas: '',
    tipe: 'Lahan Terbuka',
    tglTanam: '',
    populasi: '',
    irigasi: 'Irigasi Terjadwal'
  });

  // Dynamic varietas options for Modal based on selected komoditas
  const filteredVarietasForModal = useMemo(() => {
    const selectedKomo = formDetail.idKomoditas || formDetail.komoditas;
    const allVarieties = options?.lahanKomoOption?.allVarietas || [];

    if (!selectedKomo) {
      if (allVarieties.length > 0) {
        return allVarieties.map((v: any) => ({
          value: v.kodeVarietas || v.id,
          label: v.namaVarietas
        }));
      }
      return options?.lahanKomoOption?.varietas || [];
    }

    if (allVarieties.length > 0) {
      return allVarieties
        .filter((v: any) => {
          return (
            v.commodityId === selectedKomo ||
            v.commodity?.id === selectedKomo ||
            v.commodity?.kodeKomoditas === selectedKomo ||
            v.commodity?.namaKomoditas === selectedKomo
          );
        })
        .map((v: any) => ({
          value: v.kodeVarietas || v.id,
          label: v.namaVarietas
        }));
    }

    return options?.lahanKomoOption?.varietas || [];
  }, [formDetail.idKomoditas, formDetail.komoditas, options]);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingNo(null);

    const firstLahan = options?.lahanKomoOption?.lahan?.[0];
    const defaultKomo = options?.lahanKomoOption?.komoditas?.find((o: any) => o.value === dataLK?.komoditas || o.label === dataLK?.namaKomoditas);
    const defaultVar = options?.lahanKomoOption?.varietas?.find((o: any) => o.value === dataLK?.varietas || o.label === dataLK?.namaVarietas);

    setFormDetail({
      idLahan: dataLK?.idLahan || firstLahan?.value || '',
      lahan: dataLK?.namaLahan || firstLahan?.label || 'Lahan A1 - Blok 01',
      luas: dataLK?.luasTanam ? String(dataLK.luasTanam) : '1,00',
      idKomoditas: dataLK?.komoditas || defaultKomo?.value || '',
      komoditas: dataLK?.namaKomoditas || defaultKomo?.label || 'Padi',
      idVarietas: dataLK?.varietas || defaultVar?.value || '',
      varietas: dataLK?.namaVarietas || defaultVar?.label || 'Inpari 32',
      tipe: 'Lahan Terbuka',
      tglTanam: '10/06/2025',
      populasi: '250.000 batang/Ha',
      irigasi: 'Irigasi Terjadwal'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setModalMode('edit');
    setEditingNo(item.no);

    const lahanOpt = options?.lahanKomoOption?.lahan?.find((o: any) => o.label === item.lahan || o.value === item.idLahan);
    const komoOpt = options?.lahanKomoOption?.komoditas?.find((o: any) => o.label === item.komoditas || o.value === item.idKomoditas);
    const varOpt = options?.lahanKomoOption?.varietas?.find((o: any) => o.label === item.varietas || o.value === item.idVarietas);

    setFormDetail({
      idLahan: lahanOpt?.value || item.idLahan || '',
      lahan: item.lahan,
      luas: item.luas,
      idKomoditas: komoOpt?.value || item.idKomoditas || '',
      komoditas: item.komoditas,
      idVarietas: varOpt?.value || item.idVarietas || '',
      varietas: item.varietas,
      tipe: item.tipe,
      tglTanam: item.tglTanam,
      populasi: item.populasi,
      irigasi: item.irigasi
    });
    setIsModalOpen(true);
  };

  const handleDeleteItem = (no: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus detail rencana tanam per lahan ini?')) {
      setActiveDetailList(prev => prev.filter(item => item.no !== no).map((item, idx) => ({ ...item, no: idx + 1 })));
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDetail.lahan) return;

    if (modalMode === 'add') {
      const newItem = {
        no: activeDetailList.length + 1,
        ...formDetail
      };
      setActiveDetailList(prev => [...prev, newItem]);
    } else if (modalMode === 'edit' && editingNo !== null) {
      setActiveDetailList(prev => prev.map(item => item.no === editingNo ? { ...item, ...formDetail } : item));
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Section A: Rencana Jadwal Tanam */}
      <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">A. Rencana Jadwal Tanam</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Tanggal Mulai Tanam <span className="text-red-500">*</span></label>
            <div className="relative flex items-center">
              <SpkDatepickr
                selected={selectedTglMulai}
                onChange={(date: Date | null) => {
                  if (date && onChangeRT) {
                    onChangeRT('tanggalTanam', formatDateStrHelper(date));
                  }
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YYYY"
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 pr-8 text-gray-700 w-full bg-white"
              />
              <i className="ri-calendar-line absolute right-2.5 text-gray-400 text-sm pointer-events-none z-10"></i>
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Perkiraan Tanggal Selesai <span className="text-red-500">*</span></label>
            <div className="relative flex items-center">
              <SpkDatepickr
                selected={selectedTglSelesai}
                onChange={(date: Date | null) => {
                  if (date && onChangeRT) {
                    onChangeRT('perkiraanPanen', formatDateStrHelper(date));
                  }
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YYYY"
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 pr-8 text-gray-700 w-full bg-white"
              />
              <i className="ri-calendar-line absolute right-2.5 text-gray-400 text-sm pointer-events-none z-10"></i>
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Periode Tanam <span className="text-red-500">*</span></label>
            <select className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white">
              <option>Juni II - 2025</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Musim Tanam</label>
            <select className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white">
              <option>Kemarau</option>
              <option>Hujan</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Metode Tanam</label>
            <select
              value={dataRT?.metodeTanam || 'Langsung'}
              onChange={(e) => onChangeRT && onChangeRT('metodeTanam', e.target.value)}
              className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
            >
              <option value="Langsung">Langsung</option>
              <option value="Transplanting">Transplanting</option>
              <option value="Manual">Manual</option>
              <option value="Mesin">Mesin</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Sistem Irigasi</label>
            <select
              value={dataRT?.irigasi || 'Irigasi Terjadwal'}
              onChange={(e) => onChangeRT && onChangeRT('irigasi', e.target.value)}
              className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
            >
              <option value="Irigasi Terjadwal">Irigasi Terjadwal</option>
              <option value="Irigasi Otomatis">Irigasi Otomatis</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Sumber Air</label>
            <select
              value={dataRT?.sumberAir || 'Sumur Bor'}
              onChange={(e) => onChangeRT && onChangeRT('sumberAir', e.target.value)}
              className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
            >
              <option value="Sumur Bor">Sumur Bor</option>
              <option value="Sungai">Sungai</option>
              <option value="Irigasi Teknis">Irigasi Teknis</option>
              <option value="Waduk / Embung">Waduk / Embung</option>
            </select>
          </div>

          {/* Catatan diperlebar memenuhi baris */}
          <div className="col-span-1 md:col-span-4 mt-2">
            <label className="font-semibold text-gray-700 mb-1 block">Catatan Rencana Tanam</label>
            <textarea
              rows={3}
              value={dataCT?.catatan || ''}
              onChange={(e) => onChangeCT && onChangeCT('catatan', e.target.value)}
              className="form-control text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full resize-y"
              placeholder="Masukkan catatan pendukung rencana tanam..."
            />
          </div>
        </div>
      </div>

      {/* Section B: Target Produksi */}
      <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">B. Target Produksi</h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Luas Tanam (Ha) <span className="text-red-500">*</span></label>
            <input type="text" defaultValue="5,00" className="form-control text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full" />
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Target Produksi Benih (Kg) <span className="text-red-500">*</span></label>
            <input type="text" defaultValue="6.500" className="form-control text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full" />
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Varietas</label>
            <select
              value={dataLK?.varietas || ''}
              className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
            >
              <option value="">Pilih Varietas</option>
              {options?.lahanKomoOption?.varietas?.map((opt: any, idx: number) => (
                <option key={idx} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Standar Kualitas</label>
            <select className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white">
              <option>Sertifikat (SS)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-1 block">Persentase Perkecambahan Minimal (%)</label>
            <input type="text" defaultValue="80" className="form-control text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full" />
          </div>
        </div>
      </div>

      {/* Section C: Detail Rencana Tanam per Lahan */}
      <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-800">C. Detail Rencana Tanam per Lahan</h3>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-3 py-1.5 border border-emerald-600 text-emerald-700 bg-white hover:bg-emerald-50 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <i className="ri-add-line"></i> Tambah Lahan
          </button>
        </div>

        <div className="table-responsive mb-4">
          <table className="table whitespace-nowrap min-w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50 text-gray-700 font-semibold">
                <th className="p-2.5 text-start">No</th>
                <th className="p-2.5 text-start">Lahan</th>
                <th className="p-2.5 text-start">Luas (Ha)</th>
                <th className="p-2.5 text-start">Komoditas</th>
                <th className="p-2.5 text-start">Varietas</th>
                <th className="p-2.5 text-start">Tipe Lahan</th>
                <th className="p-2.5 text-start">Tanggal Tanam</th>
                <th className="p-2.5 text-start">Populasi Tanaman</th>
                <th className="p-2.5 text-start">Sistem Irigasi</th>
                <th className="p-2.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600">
              {activeDetailList.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-4 text-center text-gray-400 text-xs">
                    Belum ada detail rencana tanam per lahan. Klik "Tambah Lahan" untuk menambahkan.
                  </td>
                </tr>
              ) : (
                activeDetailList.map((item) => (
                  <tr key={item.no} className="hover:bg-slate-50/60">
                    <td className="p-2.5 font-bold text-gray-800">{item.no}</td>
                    <td className="p-2.5 font-semibold text-gray-800">{item.lahan}</td>
                    <td className="p-2.5">{item.luas}</td>
                    <td className="p-2.5">{item.komoditas}</td>
                    <td className="p-2.5">{item.varietas}</td>
                    <td className="p-2.5">{item.tipe}</td>
                    <td className="p-2.5">{item.tglTanam}</td>
                    <td className="p-2.5">{item.populasi}</td>
                    <td className="p-2.5">{item.irigasi}</td>
                    <td className="p-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1 border border-emerald-300 rounded text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Edit"
                        >
                          <i className="ri-pencil-line text-xs"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.no)}
                          className="p-1 border border-red-300 rounded text-red-500 hover:bg-red-50 transition-colors"
                          title="Hapus"
                        >
                          <i className="ri-delete-bin-line text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-3 py-1.5 border border-emerald-600 text-emerald-700 bg-white hover:bg-emerald-50 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <i className="ri-add-line"></i> Tambah Lahan
        </button>
      </div>

      {/* Section D: Dokumen Pendukung */}
      <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">D. Dokumen Pendukung</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: List of Uploaded Files */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">Berkas Terunggah</label>
            
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {dataCT?.dokumenFiles && dataCT.dokumenFiles.length > 0 ? (
                dataCT.dokumenFiles.map((file: File, idx: number) => {
                  const badge = getFileBadge(file.name);
                  return (
                    <div key={idx} className="border border-gray-200 rounded-lg p-2.5 flex items-center justify-between bg-gray-50/50 hover:bg-gray-100/60 transition-colors">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className={`w-9 h-9 rounded ${badge.bg} flex items-center justify-center font-bold text-[11px] shrink-0`}>
                          {badge.label}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-gray-800 mb-0 truncate" title={file.name}>{file.name}</p>
                          <span className="text-[10px] text-gray-400">{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleViewFile(file)}
                          className="px-2.5 py-1 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-1 transition-colors"
                        >
                          <i className="ri-eye-line text-xs"></i> Lihat
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Hapus File"
                        >
                          <i className="ri-delete-bin-line text-base"></i>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Fallback empty state when no files uploaded */
                <div className="border border-dashed border-gray-300 rounded-lg p-3.5 flex items-center justify-center gap-3 bg-gray-50/50 text-gray-500 min-h-[120px]">
                  <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center shrink-0">
                    <i className="ri-file-unknow-line text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-0">Tidak ada berkas terunggah</p>
                    <span className="text-[10px] text-gray-400">Unggah berkas di sebelah kanan untuk menambahkan dokumen</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Upload Feature */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">Unggah Berkas Baru</label>
            
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[140px] ${
                isDragging ? 'border-emerald-500 bg-emerald-50/60' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/60'
              }`}
            >
              <i className="ri-upload-cloud-2-line text-2xl text-emerald-600 mb-1"></i>
              <p className="text-xs font-semibold text-gray-700 mb-0.5">Klik atau drag file ke sini untuk upload</p>
              <p className="text-[10px] text-gray-400 mb-2.5">PDF, JPG, PNG (Maks. 5 MB per file)</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
              >
                Pilih File
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Detail Rencana Tanam per Lahan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <i className="ri-landscape-line text-[#078836] text-lg"></i>
                <h4 className="font-bold text-sm text-gray-800">
                  {modalMode === 'add' ? 'Tambah Detail Rencana Tanam per Lahan' : 'Edit Detail Rencana Tanam per Lahan'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveModal}>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs max-h-[70vh] overflow-y-auto">
                <div className="md:col-span-2">
                  <label className="font-semibold text-gray-700 mb-1 block">Lahan <span className="text-red-500">*</span></label>
                  <select
                    value={formDetail.idLahan || formDetail.lahan}
                    onChange={(e) => {
                      const val = e.target.value;
                      const opt = options?.lahanKomoOption?.lahan?.find((o: any) => o.value === val || o.label === val);
                      setFormDetail(prev => ({
                        ...prev,
                        idLahan: val,
                        lahan: opt ? opt.label : val
                      }));
                    }}
                    className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
                    required
                  >
                    <option value="">Pilih Lahan</option>
                    {options?.lahanKomoOption?.lahan?.map((opt: any, idx: number) => (
                      <option key={idx} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 mb-1 block">Luas Tanam (Ha) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formDetail.luas}
                    onChange={(e) => setFormDetail(prev => ({ ...prev, luas: e.target.value }))}
                    placeholder="1,50"
                    className="form-control text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 mb-1 block">Tanggal Tanam <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formDetail.tglTanam}
                    onChange={(e) => setFormDetail(prev => ({ ...prev, tglTanam: e.target.value }))}
                    placeholder="10/06/2025"
                    className="form-control text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 mb-1 block">Komoditas <span className="text-red-500">*</span></label>
                  <select
                    value={formDetail.idKomoditas || formDetail.komoditas}
                    onChange={(e) => {
                      const val = e.target.value;
                      const opt = options?.lahanKomoOption?.komoditas?.find((o: any) => o.value === val || o.label === val);
                      const komoName = opt ? opt.label : val;

                      // Filter available varietas for newly selected komoditas
                      const allVars = options?.lahanKomoOption?.allVarietas || [];
                      const matchingVars = allVars.filter((v: any) => (
                        v.commodityId === val ||
                        v.commodity?.id === val ||
                        v.commodity?.kodeKomoditas === val ||
                        v.commodity?.namaKomoditas === komoName
                      ));
                      const firstVar = matchingVars.length > 0 ? matchingVars[0] : null;

                      setFormDetail(prev => ({
                        ...prev,
                        idKomoditas: val,
                        komoditas: komoName,
                        idVarietas: firstVar ? (firstVar.kodeVarietas || firstVar.id) : '',
                        varietas: firstVar ? firstVar.namaVarietas : ''
                      }));
                    }}
                    className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
                  >
                    <option value="">Pilih Komoditas</option>
                    {options?.lahanKomoOption?.komoditas?.map((opt: any, idx: number) => (
                      <option key={idx} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 mb-1 block">Varietas <span className="text-red-500">*</span></label>
                  <select
                    value={formDetail.idVarietas || formDetail.varietas}
                    onChange={(e) => {
                      const val = e.target.value;
                      const opt = filteredVarietasForModal?.find((o: any) => o.value === val || o.label === val);
                      setFormDetail(prev => ({
                        ...prev,
                        idVarietas: val,
                        varietas: opt ? opt.label : val
                      }));
                    }}
                    className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
                  >
                    <option value="">
                      {filteredVarietasForModal.length > 0 ? 'Pilih Varietas' : 'Tidak ada varietas untuk komoditas ini'}
                    </option>
                    {filteredVarietasForModal?.map((opt: any, idx: number) => (
                      <option key={idx} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 mb-1 block">Tipe Lahan</label>
                  <select
                    value={formDetail.tipe}
                    onChange={(e) => setFormDetail(prev => ({ ...prev, tipe: e.target.value }))}
                    className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
                  >
                    <option value="Lahan Terbuka">Lahan Terbuka</option>
                    <option value="Greenhouse">Greenhouse</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 mb-1 block">Sistem Irigasi</label>
                  <select
                    value={formDetail.irigasi}
                    onChange={(e) => setFormDetail(prev => ({ ...prev, irigasi: e.target.value }))}
                    className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
                  >
                    <option value="Irigasi Terjadwal">Irigasi Terjadwal</option>
                    <option value="Irigasi Otomatis">Irigasi Otomatis</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-gray-700 mb-1 block">Populasi Tanaman</label>
                  <input
                    type="text"
                    value={formDetail.populasi}
                    onChange={(e) => setFormDetail(prev => ({ ...prev, populasi: e.target.value }))}
                    placeholder="250.000 batang/Ha"
                    className="form-control text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#078836] hover:bg-[#06732d] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <i className="ri-save-line"></i> {modalMode === 'add' ? 'Tambah Lahan' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Preview Dokumen Pendukung */}
      {previewFile && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
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

            {/* Content */}
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
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 text-left text-xs text-gray-600 space-y-1">
                    <p>• <strong>Nama Berkas:</strong> {previewFile.name}</p>
                    <p>• <strong>Status File:</strong> Dokumen Terlampir Rencana Tanam</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
              {previewFile.url && (
                <a
                  href={previewFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={previewFile.name}
                  className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <i className="ri-download-2-line"></i> Unduh File
                </a>
              )}
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
