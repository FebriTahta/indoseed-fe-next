"use client";

import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { VarietyDocItem } from '@/app/types/variety';

interface ModalTambahDokumenProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: VarietyDocItem) => void;
  availableBrands?: string[];
}

export default function ModalTambahDokumen({
  isOpen,
  onClose,
  onSave,
  availableBrands = [],
}: ModalTambahDokumenProps) {
  const [docUploadFile, setDocUploadFile] = useState<File | null>(null);
  const [docJenis, setDocJenis] = useState('Sertifikat Benih');
  const [docNama, setDocNama] = useState('');
  const [docBerlaku, setDocBerlaku] = useState('Semua');
  const [docNomor, setDocNomor] = useState('');
  const [docTanggal, setDocTanggal] = useState('');
  const [docKeterangan, setDocKeterangan] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setDocUploadFile(null);
      setDocJenis('Sertifikat Benih');
      setDocNama('');
      setDocBerlaku('Semua');
      setDocNomor('');
      const today = new Date().toISOString().split('T')[0];
      setDocTanggal(today);
      setDocKeterangan('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocUploadFile(file);
      if (!docNama) {
        setDocNama(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!docNama.trim()) {
      toast.error('Nama dokumen wajib diisi');
      return;
    }

    const fileExt = docUploadFile ? docUploadFile.name.split('.').pop()?.toLowerCase() || 'pdf' : 'pdf';
    const fileSizeFormatted = docUploadFile
      ? `${(docUploadFile.size / (1024 * 1024)).toFixed(1)} MB`
      : '1.2 MB';

    // Format tanggal dokumen if YYYY-MM-DD to DD/MM/YYYY
    let formattedDate = docTanggal;
    if (docTanggal && docTanggal.includes('-')) {
      const [year, month, day] = docTanggal.split('-');
      formattedDate = `${day}/${month}/${year}`;
    }

    const newDoc: VarietyDocItem = {
      id: String(Date.now()),
      namaDokumen: docNama.trim(),
      jenisDokumen: docJenis,
      berlakuUntuk: docBerlaku,
      nomorDokumen: docNomor.trim() || `DOC-${Date.now().toString().slice(-4)}`,
      tanggalDokumen: formattedDate || '20/09/2026',
      fileName: docUploadFile ? docUploadFile.name : `${docNama.trim().toLowerCase().replace(/\s+/g, '-')}.${fileExt}`,
      fileSize: fileSizeFormatted,
      fileType: fileExt,
      keterangan: docKeterangan.trim() || undefined,
    };

    onSave(newDoc);
    toast.success('Dokumen berhasil ditambahkan!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-700 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-lg">
              <i className="ri-file-upload-line"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold">Tambah / Upload Dokumen</h3>
              <p className="text-[11px] text-emerald-100">Upload dokumen pendukung varietas atau kode benih</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* File Upload Drop Area */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              File Dokumen <span className="text-rose-500">*</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-5 bg-gray-50/60 hover:bg-emerald-50/30 hover:border-emerald-400 transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">
                <i className="ri-upload-cloud-2-line"></i>
              </div>
              <span className="font-semibold text-gray-800 text-xs mb-1">
                {docUploadFile ? docUploadFile.name : 'Klik atau tarik file ke sini untuk mengunggah'}
              </span>
              <p className="text-[11px] text-gray-400">PDF, JPG, PNG, DOCX • Maksimal 10 MB</p>
              {docUploadFile && (
                <span className="mt-2 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {(docUploadFile.size / (1024 * 1024)).toFixed(2)} MB - Siap diupload
                </span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Jenis Dokumen */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Jenis Dokumen <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={docJenis}
                  onChange={(e) => setDocJenis(e.target.value)}
                  className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Sertifikat Benih">Sertifikat Benih</option>
                  <option value="Spesifikasi Teknis">Spesifikasi Teknis</option>
                  <option value="Dokumen Sumber Benih">Dokumen Sumber Benih</option>
                  <option value="Dokumen Legal">Dokumen Legal / Registrasi</option>
                  <option value="Laporan Uji Mutu">Laporan Uji Mutu</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                  <i className="ri-arrow-down-s-line"></i>
                </div>
              </div>
            </div>

            {/* Nama Dokumen */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Nama Dokumen <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={docNama}
                onChange={(e) => setDocNama(e.target.value)}
                placeholder="Contoh: Sertifikat Benih Melon Tere"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Berlaku Untuk */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Berlaku Untuk <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={docBerlaku}
                  onChange={(e) => setDocBerlaku(e.target.value)}
                  className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Semua">Semua Merk / Varietas Terkait</option>
                  {availableBrands.map((brand, idx) => (
                    <option key={idx} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                  <i className="ri-arrow-down-s-line"></i>
                </div>
              </div>
            </div>

            {/* Nomor Dokumen */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Nomor Dokumen
              </label>
              <input
                type="text"
                value={docNomor}
                onChange={(e) => setDocNomor(e.target.value)}
                placeholder="Contoh: SB-001/ME-01/2026"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Tanggal Dokumen */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Tanggal Dokumen
              </label>
              <input
                type="date"
                value={docTanggal}
                onChange={(e) => setDocTanggal(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Keterangan */}
            <div className="md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1.5">
                Keterangan / Catatan Tambahan
              </label>
              <textarea
                rows={2}
                value={docKeterangan}
                onChange={(e) => setDocKeterangan(e.target.value)}
                placeholder="Catatan mengenai masa berlaku, penerbit sertifikat, dll..."
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <i className="ri-close-line text-sm"></i>
              <span>Batal</span>
            </button>

            <button
              type="submit"
              disabled={!docNama.trim()}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5"
            >
              <i className="ri-check-line text-sm"></i>
              <span>Simpan Dokumen</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
