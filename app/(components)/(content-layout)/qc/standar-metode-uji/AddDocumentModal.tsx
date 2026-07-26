import React, { useState, useRef } from 'react';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  standards: any[];
  methods: any[];
  mode?: 'add' | 'edit';
  initialData?: any;
}

export default function AddDocumentModal({ isOpen, onClose, onSubmit, standards, methods, mode = 'add', initialData }: AddDocumentModalProps) {
  const [formData, setFormData] = useState({
    nama: '',
    kategori: '',
    terkaitTipe: '',
    terkaitId: '',
    jenisDokumen: '',
    versi: '',
    tanggalBerlaku: '',
    deskripsi: '',
    tingkatAkses: 'Semua Pengguna',
    status: 'Aktif',
    catatan: ''
  });

  React.useEffect(() => {
    if (isOpen && mode === 'edit' && initialData) {
      setFormData({
        nama: initialData.nama || '',
        kategori: initialData.kategori || '',
        terkaitTipe: initialData.standarId ? 'standar' : initialData.metodeId ? 'metode' : '',
        terkaitId: initialData.standarId || initialData.metodeId || '',
        jenisDokumen: initialData.jenisDokumen || '',
        versi: initialData.versi || '',
        tanggalBerlaku: initialData.tanggalBerlaku ? new Date(initialData.tanggalBerlaku).toISOString().split('T')[0] : '',
        deskripsi: initialData.deskripsi || '',
        tingkatAkses: initialData.tingkatAkses || 'Semua Pengguna',
        status: initialData.status || 'Aktif',
        catatan: initialData.catatan || ''
      });
    } else if (isOpen && mode === 'add') {
      setFormData({
        nama: '',
        kategori: '',
        terkaitTipe: '',
        terkaitId: '',
        jenisDokumen: '',
        versi: '',
        tanggalBerlaku: '',
        deskripsi: '',
        tingkatAkses: 'Semua Pengguna',
        status: 'Aktif',
        catatan: ''
      });
      setSelectedFile(null);
    }
  }, [isOpen, mode, initialData]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Derive file type from selected file extension
    const ext = selectedFile?.name.split('.').pop()?.toUpperCase() || 'PDF';
    const tipeFile = ['PDF', 'DOCX', 'XLSX', 'PPTX', 'JPG', 'PNG'].includes(ext) ? ext : 'PDF';

    const submitData: any = {
      // Auto-generate a unique kode using timestamp; backend can override if needed
      kode: `DOC-QC-${Date.now()}`,
      nama: formData.nama,
      kategori: formData.kategori,
      jenisDokumen: formData.jenisDokumen,
      versi: formData.versi,
      tanggalBerlaku: formData.tanggalBerlaku ? new Date(formData.tanggalBerlaku) : null,
      deskripsi: formData.deskripsi,
      tingkatAkses: formData.tingkatAkses,
      status: formData.status,
      catatan: formData.catatan,
      tipeFile,
      fileName: selectedFile?.name || null,
      fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : null,
      file: selectedFile,
    };
    if (formData.terkaitTipe === 'standar') {
      submitData.standarId = formData.terkaitId;
    } else if (formData.terkaitTipe === 'metode') {
      submitData.metodeId = formData.terkaitId;
    }
    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-xl overflow-hidden animate-slide-down">
          <div className="flex items-center justify-between px-6 py-4 border-b border-defaultborder">
            <h5 className="text-lg font-bold text-gray-800 mb-0">{mode === 'edit' ? 'Edit' : 'Tambah'} Dokumen Pendukung</h5>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div>
                <div className="flex items-center gap-2 mb-4 text-success font-semibold">
                  <i className="ri-information-line text-lg"></i>
                  <span>Informasi Dokumen</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Dokumen <span className="text-danger">*</span></label>
                    <input type="text" name="nama" value={formData.nama} onChange={handleChange} className="form-control w-full" placeholder="Masukkan nama dokumen" required />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-danger">*</span></label>
                    <select name="kategori" value={formData.kategori} onChange={handleChange} className="form-select w-full" required>
                      <option value="">Pilih kategori</option>
                      <option value="Prosedur">Prosedur</option>
                      <option value="Instruksi Kerja">Instruksi Kerja</option>
                      <option value="Formulir">Formulir</option>
                      <option value="Referensi">Referensi</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Standar Uji / Metode Uji <span className="text-danger">*</span></label>
                    <div className="flex gap-2">
                      <select name="terkaitTipe" value={formData.terkaitTipe} onChange={handleChange} className="form-select w-1/3" required>
                        <option value="">Tipe</option>
                        <option value="standar">Standar Uji</option>
                        <option value="metode">Metode Uji</option>
                      </select>
                      <select name="terkaitId" value={formData.terkaitId} onChange={handleChange} className="form-select w-2/3" required>
                        <option value="">Pilih...</option>
                        {formData.terkaitTipe === 'standar' && standards.map(s => <option key={s.id} value={s.id}>{s.kode} - {s.nama}</option>)}
                        {formData.terkaitTipe === 'metode' && methods.map(m => <option key={m.id} value={m.id}>{m.kode} - {m.nama}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Dokumen <span className="text-danger">*</span></label>
                    <select name="jenisDokumen" value={formData.jenisDokumen} onChange={handleChange} className="form-select w-full" required>
                      <option value="">Pilih jenis dokumen</option>
                      <option value="Internal">Internal</option>
                      <option value="Eksternal">Eksternal</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Versi</label>
                    <input type="text" name="versi" value={formData.versi} onChange={handleChange} className="form-control w-full" placeholder="Contoh: v1.0, 2024, Rev. A" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Dokumen</label>
                    <input type="date" name="tanggalBerlaku" value={formData.tanggalBerlaku} onChange={handleChange} className="form-control w-full" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <div className="relative">
                      <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} className="form-control w-full h-20 resize-none" placeholder="Masukkan deskripsi singkat dokumen (opsional)" maxLength={500}></textarea>
                      <div className="absolute bottom-2 right-2 text-xs text-gray-400">{formData.deskripsi.length}/500</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 text-success font-semibold">
                  <i className="ri-folder-upload-line text-lg"></i>
                  <span>File Dokumen</span>
                </div>
                <div
                  className={`border-2 border-dashed ${isDragging ? 'border-success bg-success/10' : 'border-success/30 bg-success/5'} rounded-lg p-8 text-center hover:bg-success/10 transition-colors cursor-pointer relative`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.xlsx,.pptx,.jpg,.png"
                  />
                  <i className="ri-cloud-upload-line text-3xl text-success mb-2 block"></i>
                  <p className="text-sm text-gray-700 mb-1"><strong>Drag & drop file di sini</strong><br />atau klik untuk memilih file dari perangkat Anda</p>
                  <p className="text-xs text-gray-500">Format yang didukung: PDF, DOCX, XLSX, PPTX, JPG, PNG (Maks. 50 MB)</p>
                </div>

                {selectedFile ? (
                  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-md p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <i className={`text-2xl ${selectedFile.name.endsWith('.pdf') ? 'ri-file-pdf-fill text-danger' : selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls') ? 'ri-file-excel-fill text-success' : 'ri-file-fill text-primary'}`}></i>
                      <div>
                        <div className="text-sm font-medium">{selectedFile.name}</div>
                        <div className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ri-checkbox-circle-fill text-success"></i>
                      <i className="ri-close-line text-gray-400 cursor-pointer hover:text-danger" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}></i>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-md p-3 flex justify-between items-center opacity-50">
                    <div className="flex items-center gap-3">
                      <i className="ri-file-pdf-fill text-danger text-2xl"></i>
                      <div>
                        <div className="text-sm font-medium">Contoh_Dokumen.pdf</div>
                        <div className="text-xs text-gray-500">Menunggu file...</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 text-success font-semibold">
                  <i className="ri-information-line text-lg"></i>
                  <span>Informasi Tambahan</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Akses</label>
                    <select name="tingkatAkses" value={formData.tingkatAkses} onChange={handleChange} className="form-select w-full">
                      <option value="Semua Pengguna">Semua Pengguna</option>
                      <option value="Admin Saja">Admin Saja</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="form-select w-full">
                      <option value="Aktif">Aktif</option>
                      <option value="Tidak Aktif">Tidak Aktif</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (opsional)</label>
                    <div className="relative">
                      <textarea name="catatan" value={formData.catatan} onChange={handleChange} className="form-control w-full h-10 resize-none" placeholder="Tambahkan catatan jika diperlukan" maxLength={200}></textarea>
                      <div className="absolute bottom-2 right-2 text-xs text-gray-400">{formData.catatan.length}/200</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-defaultborder bg-gray-50 rounded-b-xl">
              <button type="button" onClick={onClose} className="py-2.5 px-4 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm transition-colors flex items-center gap-1.5 shadow-sm">
                <i className="ri-close-line"></i> Batal
              </button>
              <button type="submit" className="py-2.5 px-4 rounded-md text-white bg-[#10b981] hover:bg-[#059669] font-medium text-sm transition-colors flex items-center gap-1.5 shadow-sm">
                <i className="ri-save-line"></i> Simpan Dokumen
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
