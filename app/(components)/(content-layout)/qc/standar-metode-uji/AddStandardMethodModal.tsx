import React, { useState } from 'react';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';

interface AddStandardMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  mode?: 'add' | 'edit';
  initialData?: any;
  /** List of SupportDocument records to pick from */
  documents?: any[];
}

export default function AddStandardMethodModal({ isOpen, onClose, onSubmit, mode = 'add', initialData, documents = [] }: AddStandardMethodModalProps) {
  // No file upload state needed — document is linked by ID
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');

  const [formData, setFormData] = useState({
    jenis: '', // 'Standar Acuan' | 'Metode Uji'
    nama: '',
    kode: '',
    versiTahun: '',
    organisasi: '',
    kategori: '',
    deskripsi: '',
    bahasa: '',
    catatan: '',
    documentId: '', // ID of the linked SupportDocument
  });

  React.useEffect(() => {
    if (isOpen && mode === 'edit' && initialData) {
      setFormData({
        // testParameters is only present on TestMethod API responses (from findAllMethods include); absent on ReferenceStandard
        jenis: Array.isArray(initialData.testParameters) ? 'Metode Uji' : 'Standar Acuan',
        nama: initialData.nama || '',
        kode: initialData.kode || '',
        versiTahun: initialData.versiTahun || '',
        organisasi: initialData.organisasi || '',
        kategori: initialData.kategori || '',
        deskripsi: initialData.deskripsi || '',
        bahasa: initialData.bahasa || '',
        catatan: initialData.catatan || '',
        documentId: initialData.documentId || (initialData.document ? initialData.document.id : ''),
      });
      setSelectedDocumentId(initialData.documentId || (initialData.document ? initialData.document.id : ''));
    } else if (isOpen && mode === 'add') {
      setFormData({
        jenis: '',
        nama: '',
        kode: '',
        versiTahun: '',
        organisasi: '',
        kategori: '',
        deskripsi: '',
        bahasa: '',
        catatan: '',
        documentId: '',
      });
      setSelectedDocumentId('');
    }
  }, [isOpen, mode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocumentId(docId);
    setFormData((p) => ({ ...p, documentId: docId }));
  };

  /** Icon class based on tipeFile */
  const getDocIcon = (doc: any) => {
    const t = (doc.tipeFile || '').toUpperCase();
    if (t === 'PDF') return 'ri-file-pdf-fill text-danger';
    if (t === 'DOCX' || t === 'DOC') return 'ri-file-word-fill text-primary';
    if (t === 'XLSX' || t === 'XLS') return 'ri-file-excel-fill text-success';
    if (t === 'PPTX' || t === 'PPT') return 'ri-file-ppt-fill text-warning';
    return 'ri-file-fill text-gray-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Center Container */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-xl overflow-hidden animate-slide-down">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-defaultborder">
            <h5 className="text-lg font-bold text-gray-800 mb-0">{mode === 'edit' ? 'Edit' : 'Tambah'} Standar / Metode Uji</h5>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Informasi Umum */}
              <div>
                <div className="flex items-center gap-2 mb-4 text-success font-semibold">
                  <i className="ri-information-line text-lg"></i>
                  <span>Informasi Umum</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jenis <span className="text-danger">*</span>
                    </label>
                    <select name="jenis" value={formData.jenis} onChange={handleChange} className="form-select w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50" required>
                      <option value="">Pilih jenis</option>
                      <option value="Standar Acuan">Standar Acuan</option>
                      <option value="Metode Uji">Metode Uji</option>
                    </select>
                    <span className="text-xs text-gray-500 mt-1 block">Pilih apakah ini Standar Acuan atau Metode Uji</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Standar / Metode <span className="text-danger">*</span>
                    </label>
                    <input type="text" name="nama" value={formData.nama} onChange={handleChange} className="form-control w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50" placeholder="Masukkan nama standar atau metode uji" required />
                    <span className="text-xs text-gray-500 mt-1 block">Contoh: ISTA 2023 atau Germination Test</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kode / Nomor <span className="text-danger">*</span>
                    </label>
                    <input type="text" name="kode" value={formData.kode} onChange={handleChange} className="form-control w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50" placeholder="Masukkan kode atau nomor" required />
                    <span className="text-xs text-gray-500 mt-1 block">Contoh: ISTA 5.2.1, SNI 01-2891-1992</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Versi / Tahun <span className="text-danger">*</span>
                    </label>
                    <input type="text" name="versiTahun" value={formData.versiTahun} onChange={handleChange} className="form-control w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50" placeholder="Contoh: 2023 atau v3.1" required />
                    <span className="text-xs text-gray-500 mt-1 block">Tahun publikasi atau versi dokumen</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organisasi / Penerbit <span className="text-danger">*</span>
                    </label>
                    <select name="organisasi" value={formData.organisasi} onChange={handleChange} className="form-select w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50" required>
                      <option value="">Pilih organisasi atau penerbit</option>
                      <option value="ISTA">ISTA</option>
                      <option value="BSN">BSN</option>
                      <option value="ISO">ISO</option>
                    </select>
                    <span className="text-xs text-gray-500 mt-1 block">Contoh: ISTA, BSN, ISO, dll</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori <span className="text-danger">*</span>
                    </label>
                    <select name="kategori" value={formData.kategori} onChange={handleChange} className="form-select w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50" required>
                      <option value="">Pilih kategori</option>
                      <option value="Fisiologis">Fisiologis</option>
                      <option value="Fisik">Fisik</option>
                      <option value="Kesehatan">Kesehatan</option>
                    </select>
                    <span className="text-xs text-gray-500 mt-1 block">Pilih kategori standar atau metode uji</span>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} className="form-control w-full h-24 resize-none border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50" placeholder="Masukkan deskripsi singkat tentang standar atau metode uji" required maxLength={500}></textarea>
                      <div className="absolute bottom-2 right-2 text-xs text-gray-400">{formData.deskripsi.length}/500</div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">Jelaskan tujuan, ruang lingkup, dan penerapan standar/metode uji ini</span>
                  </div>
                </div>
              </div>

              {/* Dokumen Pendukung — linked from existing SupportDocuments */}
              <div>
                <div className="flex items-center gap-2 mb-4 text-success font-semibold">
                  <i className="ri-folder-2-line text-lg"></i>
                  <span>Dokumen Pendukung</span>
                  <span className="text-xs font-normal text-gray-400">(opsional, pilih dari daftar dokumen yang tersedia)</span>
                </div>

                {/* Select dropdown */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Dokumen</label>
                  <select
                    value={selectedDocumentId}
                    onChange={(e) => handleDocumentSelect(e.target.value)}
                    className="form-select w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50"
                  >
                    <option value="">-- Tidak ada dokumen terkait --</option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.kode} — {doc.nama}
                        {doc.versi ? ` (${doc.versi})` : ''}
                      </option>
                    ))}
                  </select>
                  {documents.length === 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      Belum ada dokumen pendukung. Tambahkan dokumen terlebih dahulu di tab <em>Dokumen Pendukung</em>.
                    </p>
                  )}
                </div>

                {/* Preview card — shown when a document is selected */}
                {selectedDocumentId && (() => {
                  const doc = documents.find((d) => d.id === selectedDocumentId);
                  if (!doc) return null;
                  return (
                    <div className="relative rounded-lg border border-success/30 bg-success/5 p-4 flex items-start gap-3">
                      {/* Clear button */}
                      <button
                        type="button"
                        className="absolute top-2 right-2 text-gray-400 hover:text-danger transition-colors"
                        onClick={() => handleDocumentSelect('')}
                        title="Hapus pilihan"
                      >
                        <i className="ri-close-line"></i>
                      </button>

                      {/* File icon */}
                      <div className="shrink-0 w-10 h-10 rounded-md bg-white border border-defaultborder flex items-center justify-center">
                        <i className={`text-xl ${getDocIcon(doc)}`}></i>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            {doc.kode}
                          </span>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                              doc.status === 'Aktif'
                                ? 'bg-success/10 text-success'
                                : 'bg-danger/10 text-danger'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </div>
                        <div className="mt-1 text-sm font-semibold text-gray-800 truncate">{doc.nama}</div>
                        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
                          {doc.kategori && <span><i className="ri-price-tag-3-line mr-0.5"></i>{doc.kategori}</span>}
                          {doc.jenisDokumen && <span><i className="ri-file-list-line mr-0.5"></i>{doc.jenisDokumen}</span>}
                          {doc.versi && <span><i className="ri-git-branch-line mr-0.5"></i>{doc.versi}</span>}
                          {doc.tipeFile && <span><i className="ri-attachment-line mr-0.5"></i>{doc.tipeFile}</span>}
                          {doc.fileSize && <span><i className="ri-database-line mr-0.5"></i>{doc.fileSize}</span>}
                        </div>
                        {doc.deskripsi && (
                          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{doc.deskripsi}</p>
                        )}
                        {doc.tanggalBerlaku && (
                          <p className="mt-0.5 text-xs text-gray-400">
                            <i className="ri-calendar-line mr-0.5"></i>
                            Berlaku:{' '}
                            {new Date(doc.tanggalBerlaku).toLocaleDateString('id-ID', {
                              day: '2-digit', month: 'long', year: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Informasi Tambahan (Opsional) */}
              <div>
                <div className="flex items-center gap-2 mb-4 text-success font-semibold">
                  <i className="ri-add-circle-line text-lg"></i>
                  <span>Informasi Tambahan (Opsional)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bahasa</label>
                    <select name="bahasa" value={formData.bahasa} onChange={handleChange} className="form-select w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50">
                      <option value="">Pilih bahasa</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                    <div className="relative">
                      <textarea name="catatan" value={formData.catatan} onChange={handleChange} className="form-control w-full h-20 resize-none border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50" placeholder="Tambahkan catatan jika diperlukan" maxLength={200}></textarea>
                      <div className="absolute bottom-2 right-2 text-xs text-gray-400">{formData.catatan.length}/200</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-defaultborder bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <i className="ri-close-line"></i> Batal
              </button>
              <button
                type="submit"
                className="py-2.5 px-4 rounded-md text-white bg-[#10b981] hover:bg-[#059669] font-medium text-sm transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <i className="ri-save-line"></i> Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
