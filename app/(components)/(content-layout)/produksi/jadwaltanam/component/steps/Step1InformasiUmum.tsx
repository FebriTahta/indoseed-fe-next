import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import StandarKepatuhanISO from '../StandarKepatuhan';
import RingkasanJadwal from '../RingkasanJadwal';
import InformasiBenih from '../InfoBenih';
import SpkDatepickr from '@/shared/@spk-reusable-components/spk-packages/datepicker-component';

interface Step1Props {
  dataIU: any;
  dataLK: any;
  dataRT: any;
  dataCT: any;
  onChangeIU: (field: string, val: any) => void;
  onChangeLK: (field: string, val: any) => void;
  onChangeRT: (field: string, val: any) => void;
  onChangeCT: (field: string, val: any) => void;
  options: any;
}

export default function Step1InformasiUmum({
  dataIU,
  dataLK,
  dataRT,
  dataCT,
  onChangeIU,
  onChangeLK,
  onChangeRT,
  onChangeCT,
  options
}: Step1Props) {
  const parseDateStr = (dateStr: string, fallback: Date): Date => {
    if (!dateStr) return fallback;
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const parsed = new Date(year, month, day);
        if (!isNaN(parsed.getTime())) return parsed;
      }
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? fallback : d;
  };

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [startDate, setStartDate] = useState<Date | null>(
    dataIU?.periodeTanamMulai ? parseDateStr(dataIU.periodeTanamMulai, firstDayOfMonth) : firstDayOfMonth
  );
  const [endDate, setEndDate] = useState<Date | null>(
    dataIU?.periodeTanamSelesai ? parseDateStr(dataIU.periodeTanamSelesai, lastDayOfMonth) : lastDayOfMonth
  );

  const [tglPersemaian, setTglPersemaian] = useState<Date | null>(
    dataRT?.tanggalPersemaian ? parseDateStr(dataRT.tanggalPersemaian, now) : now
  );
  const [tglTanam, setTglTanam] = useState<Date | null>(
    dataRT?.tanggalTanam ? parseDateStr(dataRT.tanggalTanam, now) : now
  );
  const [tglPanen, setTglPanen] = useState<Date | null>(
    dataRT?.perkiraanPanen ? parseDateStr(dataRT.perkiraanPanen, now) : now
  );

  const formatDateStr = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateRangeChange = (update: [Date | null, Date | null]) => {
    const [start, end] = update;
    setStartDate(start);
    setEndDate(end);

    if (start) {
      onChangeIU('periodeTanamMulai', formatDateStr(start));
    } else {
      onChangeIU('periodeTanamMulai', '');
    }

    if (end) {
      onChangeIU('periodeTanamSelesai', formatDateStr(end));
    } else {
      onChangeIU('periodeTanamSelesai', '');
    }
  }

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) {
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
      if (!['pdf', 'png', 'jpg', 'jpeg'].includes(ext || '')) {
        toast.error(`Format file "${file.name}" tidak didukung (gunakan PDF, PNG, JPG).`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      const existing: File[] = dataCT?.dokumenFiles || [];
      const updated = [...existing, ...validFiles];
      onChangeCT('dokumenFiles', updated);
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
    onChangeCT('dokumenFiles', updated);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Column Form (8 cols on xl) */}
      <div className="xl:col-span-8 col-span-12 space-y-6">

        {/* Card 1: Informasi Umum */}
        <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Informasi Umum</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Kode Jadwal Tanam</label>
              <input
                type="text"
                disabled
                value="Auto (akan dibuat otomatis)"
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-400 w-full"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Periode Tanam <span className="text-red-500">*</span></label>
              <div className="relative flex items-center">
                <SpkDatepickr
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleDateRangeChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY - DD/MM/YYYY"
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 pr-8 text-gray-700 w-full bg-white"
                />
                <i className="ri-calendar-line absolute right-2.5 text-gray-400 text-sm pointer-events-none z-10"></i>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Musim Tanam <span className="text-red-500">*</span></label>
              <select
                value={dataIU?.musimTanam || 'Musim Kemarau'}
                onChange={(e) => onChangeIU('musimTanam', e.target.value)}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="kemarau">Musim Kemarau</option>
                <option value="hujan">Musim Hujan</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Tujuan Produksi <span className="text-red-500">*</span></label>
              <select
                value={dataIU?.tujuanProduksi || 'Benih Bersertifikat'}
                onChange={(e) => onChangeIU('tujuanProduksi', e.target.value)}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="Benih Bersertifikat">Benih Bersertifikat</option>
                <option value="Benih Sebar">Benih Sebar</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Tipe Produksi <span className="text-red-500">*</span></label>
              <select
                value={dataIU?.tipeProduksi || 'FS (Foundation Seed)'}
                onChange={(e) => onChangeIU('tipeProduksi', e.target.value)}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="FS (Foundation Seed)">FS (Foundation Seed)</option>
                <option value="BS (Breeder Seed)">BS (Breeder Seed)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Status Jadwal <span className="text-red-500">*</span></label>
              <select
                value={dataIU?.statusJadwal || 'Draft'}
                onChange={(e) => onChangeIU('statusJadwal', e.target.value)}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="Draft">Draft</option>
                <option value="Direncanakan">Direncanakan</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-gray-700 mb-1 block">Deskripsi (Opsional)</label>
              <div className="relative">
                <textarea
                  rows={2}
                  value={dataIU?.deskripsi || ''}
                  onChange={(e) => onChangeIU('deskripsi', e.target.value)}
                  placeholder="Tuliskan keterangan tambahan jika diperlukan..."
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full resize-none"
                />
                <span className="absolute bottom-2 right-3 text-[10px] text-gray-400">0/250</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Lahan & Komoditas */}
        <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Lahan & Komoditas</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Lahan <span className="text-red-500">*</span></label>
              <select
                value={dataLK?.idLahan || dataLK?.namaLahan || ''}
                onChange={(e) => {
                  const selectedOpt = options?.lahanKomoOption?.lahan?.find((opt: any) => opt.value === e.target.value || opt.label === e.target.value);
                  onChangeLK('idLahan', e.target.value);
                  if (selectedOpt) onChangeLK('namaLahan', selectedOpt.label);
                }}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white mb-1"
              >
                <option value="">Pilih Lahan</option>
                {options?.lahanKomoOption?.lahan?.map((opt: any, idx: number) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {dataLK?.luasTanam > 0 && (
                <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200/60">
                  Luas Tersedia: {dataLK.luasTanam} Ha
                </span>
              )}
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Luas Tanam <span className="text-red-500">*</span></label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={dataLK?.luasTanam || ''}
                  onChange={(e) => onChangeLK('luasTanam', e.target.value)}
                  placeholder="5,00"
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 pr-8 text-gray-700 w-full"
                />
                <span className="absolute right-3 text-xs text-gray-500 font-medium">Ha</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Komoditas <span className="text-red-500">*</span></label>
              <select
                value={dataLK?.komoditas || ''}
                onChange={(e) => onChangeLK('komoditas', e.target.value)}
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
                value={dataLK?.varietas || ''}
                onChange={(e) => onChangeLK('varietas', e.target.value)}
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
              <label className="font-semibold text-gray-700 mb-1 block">Asal Benih <span className="text-red-500">*</span></label>
              <select
                value={dataLK?.asalBenih || ''}
                onChange={(e) => onChangeLK('asalBenih', e.target.value)}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white mb-1"
              >
                <option value="">Pilih Asal Benih</option>
                {options?.lahanKomoOption?.asalBenih?.map((opt: any, idx: number) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Jumlah Benih Diperlukan <span className="text-red-500">*</span></label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={dataLK?.jumlahBenihDiperlukan || '125'}
                  onChange={(e) => onChangeLK('jumlahBenihDiperlukan', e.target.value)}
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 pr-8 text-gray-700 w-full"
                />
                <span className="absolute right-3 text-xs text-gray-500 font-medium">Kg</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Jarak Tanam <span className="text-red-500">*</span></label>
              <select
                value={dataLK?.jarakTanam || '25 cm x 25 cm'}
                onChange={(e) => onChangeLK('jarakTanam', e.target.value)}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="25 cm x 25 cm">25 cm x 25 cm</option>
                <option value="30 cm x 30 cm">30 cm x 30 cm</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Sistem Tanam <span className="text-red-500">*</span></label>
              <select
                value={dataLK?.sistemTanam || 'Jajar Legowo 4:1'}
                onChange={(e) => onChangeLK('sistemTanam', e.target.value)}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="Jajar Legowo 4:1">Jajar Legowo 4:1</option>
                <option value="Tegel">Tegel</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 3: Rencana Tanam */}
        <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Rencana Tanam</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Tanggal Persemaian <span className="text-red-500">*</span></label>
              <div className="relative flex items-center">
                <SpkDatepickr
                  selected={tglPersemaian}
                  onChange={(date: Date | null) => {
                    setTglPersemaian(date);
                    if (date) onChangeRT('tanggalPersemaian', formatDateStr(date));
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Pilih Tanggal Persemaian"
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 pr-8 text-gray-700 w-full bg-white"
                />
                <i className="ri-calendar-line absolute right-2.5 text-gray-400 text-sm pointer-events-none z-10"></i>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Tanggal Tanam <span className="text-red-500">*</span></label>
              <div className="relative flex items-center">
                <SpkDatepickr
                  selected={tglTanam}
                  onChange={(date: Date | null) => {
                    setTglTanam(date);
                    if (date) onChangeRT('tanggalTanam', formatDateStr(date));
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Pilih Tanggal Tanam"
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 pr-8 text-gray-700 w-full bg-white"
                />
                <i className="ri-calendar-line absolute right-2.5 text-gray-400 text-sm pointer-events-none z-10"></i>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Perkiraan Panen <span className="text-red-500">*</span></label>
              <div className="relative flex items-center">
                <SpkDatepickr
                  selected={tglPanen}
                  onChange={(date: Date | null) => {
                    setTglPanen(date);
                    if (date) onChangeRT('perkiraanPanen', formatDateStr(date));
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Pilih Perkiraan Panen"
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 pr-8 text-gray-700 w-full bg-white"
                />
                <i className="ri-calendar-line absolute right-2.5 text-gray-400 text-sm pointer-events-none z-10"></i>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Siklus Tanam (Hari) <span className="text-red-500">*</span></label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={dataRT?.siklusTanamHari || '101'}
                  onChange={(e) => onChangeRT('siklusTanamHari', e.target.value)}
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 pr-10 text-gray-700 w-full"
                />
                <span className="absolute right-3 text-xs text-gray-500 font-medium">Hari</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Metode Tanam <span className="text-red-500">*</span></label>
              <select
                value={dataRT?.metodeTanam || 'Langsung'}
                onChange={(e) => onChangeRT('metodeTanam', e.target.value)}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="Langsung">Langsung</option>
                <option value="Transplanting">Transplanting</option>
                <option value="Manual">Manual</option>
                <option value="Mesin">Mesin</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Kepadatan Tanam</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={dataRT?.kepadatanTanam || '160'}
                  onChange={(e) => onChangeRT('kepadatanTanam', e.target.value)}
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 pr-20 text-gray-700 w-full"
                />
                <span className="absolute right-3 text-xs text-gray-500 font-medium">Tanaman/m²</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Irigasi <span className="text-red-500">*</span></label>
              <select
                value={dataRT?.irigasi || 'Irigasi Terjadwal'}
                onChange={(e) => onChangeRT('irigasi', e.target.value)}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="Irigasi Terjadwal">Irigasi Terjadwal</option>
                <option value="Irigasi Otomatis">Irigasi Otomatis</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Sumber Air <span className="text-red-500">*</span></label>
              <select
                value={dataRT?.sumberAir || 'Sumur Bor'}
                onChange={(e) => onChangeRT('sumberAir', e.target.value)}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="Sumur Bor">Sumur Bor</option>
                <option value="Sungai">Sungai</option>
                <option value="Irigasi Teknis">Irigasi Teknis</option>
                <option value="Waduk / Embung">Waduk / Embung</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 4: Catatan Tambahan */}
        <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Catatan Tambahan</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Catatan</label>
              <div className="relative">
                <textarea
                  rows={4}
                  value={dataCT?.catatan || ''}
                  onChange={(e) => onChangeCT('catatan', e.target.value)}
                  placeholder="Tulis catatan tambahan terkait jadwal tanam ini..."
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full resize-none"
                />
                <span className="absolute bottom-2 right-3 text-[10px] text-gray-400">0/500</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Dokumen Pendukung (Opsional)</label>

              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[110px] ${isDragging ? 'border-emerald-500 bg-emerald-50/60' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/60'
                  }`}
              >
                <i className="ri-upload-cloud-2-line text-2xl text-emerald-600 mb-1"></i>
                <p className="text-xs font-semibold text-gray-700 mb-0.5">Klik atau drag file ke sini untuk upload</p>
                <p className="text-[10px] text-gray-400 mb-3">PDF, JPG, PNG (Maks. 5 MB per file)</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
                >
                  Pilih File
                </button>
              </div>

              {/* Uploaded Files List */}
              {dataCT?.dokumenFiles && dataCT.dokumenFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {dataCT.dokumenFiles.map((file: File, idx: number) => {
                    const badge = getFileBadge(file.name);
                    return (
                      <div key={idx} className="border border-gray-200 rounded-md p-2 flex items-center justify-between bg-white text-xs shadow-sm">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <div className="truncate">
                            <p className="font-semibold text-gray-800 truncate mb-0 leading-tight">{file.name}</p>
                            <span className="text-[10px] text-gray-400">{formatFileSize(file.size)}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors shrink-0 ml-2"
                          title="Hapus File"
                        >
                          <i className="ri-delete-bin-line text-sm"></i>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Right Column Summary Cards (4 cols on xl) */}
      <div className="xl:col-span-4 col-span-12 space-y-6">
        <StandarKepatuhanISO />
        <RingkasanJadwal summary={{
          komoditas: dataLK?.namaKomoditas || '-',
          varietas: dataLK?.namaVarietas || '-',
          lahan: dataLK?.namaLahan || '-',
          luasTanam: `${dataLK?.luasTanam || '-'} Ha`,
          periodeTanam: (dataIU?.periodeTanamMulai && dataIU?.periodeTanamSelesai)
            ? `${dataIU.periodeTanamMulai} - ${dataIU.periodeTanamSelesai}`
            : (dataIU?.periodeTanamMulai || dataIU?.periodeTanamSelesai || '-'),
          perkiraanPanen: dataRT?.perkiraanPanen || '-',
          benihDiperlukan: `${dataLK?.jumlahBenihDiperlukan || '-'} Kg`,
          tujuanProduksi: `${dataIU?.tujuanProduksi || '-'}`,
          tipeProduksi: `${dataIU?.tipeProduksi || '-'}`
        }} />
        <InformasiBenih data={{
          batchBenih: dataLK.idBenih,
          asalBenih: dataLK.asalBenih,
          tanggalProduksi: dataLK.tanggalProduksi,
          dayaBerkecambah: dataLK.dayaBerkecambah,
          kemurnian: dataLK.kemurnian,
          kadarAir: dataLK.kadarAir
        }} />
      </div>
    </div>
  );
}
