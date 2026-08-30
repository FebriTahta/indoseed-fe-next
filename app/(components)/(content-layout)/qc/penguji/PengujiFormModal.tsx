import React, { useState, useEffect } from 'react';
import axiosInstance from '@/app/lib/axios';
import ImageUpload from '../../shared/ImageUpload';

interface PengujiFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'add' | 'edit';
  initialData?: any;
  onSubmit: (data: any) => void;
  laboratoriums?: any[];
  testMethods?: any[];
}

export default function PengujiFormModal({
  isOpen,
  onClose,
  mode = 'add',
  initialData,
  onSubmit,
  laboratoriums = [],
  testMethods = []
}: PengujiFormModalProps) {
  const [formData, setFormData] = useState({
    kodePenguji: '',
    nama: '',
    email: '',
    laboratoriumId: '',
    noTelepon: '',
    metodeUji: [] as string[],
    tanggalBergabung: '',
    status: 'Aktif',
    berlakuHingga: '',
    keterangan: '',
    noSertifikat: '',
    tanggalSertifikat: '',
    foto: null as File | null,
    sertifikatFile: null as File | null,
    existingSertifikatUrl: null as string | null
  });

  useEffect(() => {
    if (isOpen && mode === 'edit' && initialData) {
      const sertif = initialData.sertifikasi && initialData.sertifikasi.length > 0 ? initialData.sertifikasi[0] : null;

      setFormData({
        kodePenguji: initialData.kodePenguji || '',
        nama: initialData.nama || '',
        email: initialData.user?.email || '',
        laboratoriumId: initialData.laboratoriumId || '',
        noTelepon: initialData.noTelepon || '', 
        metodeUji: initialData.metodeUji?.map((m: any) => m.testMethodId) || [],
        tanggalBergabung: initialData.createdAt ? new Date(initialData.createdAt).toISOString().split('T')[0] : (initialData.tanggalBergabung ? new Date(initialData.tanggalBergabung).toISOString().split('T')[0] : ''),
        status: initialData.status || 'Aktif',
        berlakuHingga: sertif?.berlakuHingga ? new Date(sertif.berlakuHingga).toISOString().split('T')[0] : '',
        keterangan: initialData.keterangan || '',
        noSertifikat: sertif?.noSertifikat || sertif?.nomorSertifikat || sertif?.namaSertifikasi || '',
        tanggalSertifikat: sertif?.tanggalSertifikat ? new Date(sertif.tanggalSertifikat).toISOString().split('T')[0] : (sertif?.createdAt ? new Date(sertif.createdAt).toISOString().split('T')[0] : ''),
        foto: null,
        sertifikatFile: null,
        existingSertifikatUrl: sertif?.lampiranUrl || null
      });
    } else if (isOpen && mode === 'add') {
      setFormData({
        kodePenguji: '',
        nama: '',
        email: '',
        laboratoriumId: '',
        noTelepon: '',
        metodeUji: [],
        tanggalBergabung: new Date().toISOString().split('T')[0],
        status: 'Aktif',
        berlakuHingga: '',
        keterangan: '',
        noSertifikat: '',
        tanggalSertifikat: '',
        foto: null,
        sertifikatFile: null,
        existingSertifikatUrl: null
      });
    }
  }, [isOpen, mode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, metodeUji: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [fieldName]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...formData };
    
    // Convert File to URL by uploading to backend
    if (submitData.foto instanceof File) {
      try {
        const formDataUpload = new FormData();
        formDataUpload.append('file', submitData.foto);
        formDataUpload.append('folder', 'penguji');
        const uploadRes = await axiosInstance.post('/upload', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (uploadRes.data?.success) {
          submitData.foto = uploadRes.data.data.fileUrl;
        } else {
          submitData.foto = null as any;
        }
      } catch (err) {
        console.error("Failed to upload foto", err);
        submitData.foto = null as any;
      }
    }

    if (submitData.sertifikatFile instanceof File) {
      try {
        const formDataUpload = new FormData();
        formDataUpload.append('file', submitData.sertifikatFile);
        formDataUpload.append('folder', 'sertifikasi');
        const uploadRes = await axiosInstance.post('/upload', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (uploadRes.data?.success) {
          submitData.sertifikatFile = uploadRes.data.data.fileUrl;
        } else {
          delete submitData.sertifikatFile;
        }
      } catch (err) {
        console.error("Failed to upload sertifikatFile", err);
        delete submitData.sertifikatFile;
      }
    }

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-4xl rounded-xl bg-white shadow-xl overflow-hidden animate-slide-down">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h5 className="text-lg font-bold text-gray-800 mb-0">{mode === 'edit' ? 'Edit' : 'Tambah'} Penguji</h5>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* 1. Informasi Penguji */}
              <div>
                <h6 className="text-sm font-bold text-success mb-4 flex items-center gap-2">
                  <i className="ri-user-line"></i> 1. Informasi Penguji
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kode Penguji <span className="text-danger">*</span>
                      </label>
                      <input type="text" name="kodePenguji" value={formData.kodePenguji} onChange={handleChange} className="form-control w-full border-gray-200 rounded text-sm focus:border-success focus:ring focus:ring-success/20" placeholder="Contoh: PGJ-0019" required />
                      <p className="text-xs text-gray-400 mt-1">Kode unik penguji</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap <span className="text-danger">*</span>
                      </label>
                      <input type="text" name="nama" value={formData.nama} onChange={handleChange} className="form-control w-full border-gray-200 rounded text-sm focus:border-success focus:ring focus:ring-success/20" placeholder="Masukkan nama lengkap" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Laboratorium <span className="text-danger">*</span>
                      </label>
                      <select name="laboratoriumId" value={formData.laboratoriumId} onChange={handleChange} className="form-select w-full border-gray-200 rounded text-sm focus:border-success focus:ring focus:ring-success/20" required>
                        <option value="">Pilih laboratorium</option>
                        {laboratoriums.map(l => (
                          <option key={l.id} value={l.id}>{l.namaLaboratorium}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Metode Uji yang Dikuasai <span className="text-danger">*</span>
                      </label>
                      <select multiple name="metodeUji" value={formData.metodeUji} onChange={handleMultiSelect} className="form-select w-full border-gray-200 rounded text-sm h-48 focus:border-success focus:ring focus:ring-success/20" required>
                        {testMethods.map(m => (
                          <option key={m.id} value={m.id}>{m.nama}</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-400 mt-1">Tahan Ctrl/Cmd untuk memilih lebih dari satu metode uji</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <ImageUpload
                        label="Foto Penguji (Maks. 2MB)"
                        imageUrl={mode === 'edit' && initialData?.foto ? initialData.foto : undefined}
                        onImageChange={(file) => setFormData(prev => ({ ...prev, foto: file }))}
                        className="h-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control w-full border-gray-200 rounded text-sm focus:border-success focus:ring focus:ring-success/20" placeholder="Masukkan email" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        No. Telepon
                      </label>
                      <input type="text" name="noTelepon" value={formData.noTelepon} onChange={handleChange} className="form-control w-full border-gray-200 rounded text-sm focus:border-success focus:ring focus:ring-success/20" placeholder="Masukkan nomor telepon" />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* 2. Informasi Tambahan */}
              <div>
                <h6 className="text-sm font-bold text-success mb-4 flex items-center gap-2">
                  <i className="ri-information-line"></i> 2. Informasi Tambahan
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Bergabung <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <input type="date" name="tanggalBergabung" value={formData.tanggalBergabung} onChange={handleChange} className="form-control w-full border-gray-200 rounded text-sm focus:border-success focus:ring focus:ring-success/20" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Berlaku Hingga
                    </label>
                    <div className="relative">
                      <input type="date" name="berlakuHingga" value={formData.berlakuHingga} onChange={handleChange} className="form-control w-full border-gray-200 rounded text-sm focus:border-success focus:ring focus:ring-success/20" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status <span className="text-danger">*</span>
                    </label>
                    <select name="status" value={formData.status} onChange={handleChange} className="form-select w-full border-gray-200 rounded text-sm focus:border-success focus:ring focus:ring-success/20" required>
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keterangan
                    </label>
                    <textarea name="keterangan" value={formData.keterangan} onChange={handleChange} className="form-control text-sm min-h-[100px] w-full" rows={3}  placeholder="Masukkan keterangan (opsional)"></textarea>
                    <div className="text-right text-xs text-gray-400 mt-1">0/200</div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* 3. Sertifikasi (Opsional) */}
              <div>
                <h6 className="text-sm font-bold text-success mb-4 flex items-center gap-2">
                  <i className="ri-medal-line"></i> 3. Sertifikasi (Opsional)
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No. Sertifikat
                    </label>
                    <input type="text" name="noSertifikat" value={formData.noSertifikat} onChange={handleChange} className="form-control w-full border-gray-200 rounded text-sm focus:border-success focus:ring focus:ring-success/20" placeholder="Masukkan nomor sertifikat" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Sertifikat
                    </label>
                    <div className="relative">
                      <input type="date" name="tanggalSertifikat" value={formData.tanggalSertifikat} onChange={handleChange} className="form-control w-full border-gray-200 rounded text-sm focus:border-success focus:ring focus:ring-success/20" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Sertifikat
                  </label>
                  <div className="border border-dashed border-gray-300 rounded p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer relative">
                    <input type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'sertifikatFile')} />
                    <i className="ri-upload-cloud-2-line text-2xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-600 mb-1">Klik atau drag file sertifikat di sini</p>
                    <p className="text-xs text-gray-400">Format PDF. Maks. 5MB</p>
                    {formData.sertifikatFile && <p className="text-xs text-success mt-2 font-medium">{formData.sertifikatFile.name}</p>}
                    {!formData.sertifikatFile && (formData as any).existingSertifikatUrl && (
                      <a href={(formData as any).existingSertifikatUrl} target="_blank" rel="noreferrer" className="text-xs text-primary mt-2 font-medium hover:underline relative z-10" onClick={(e) => e.stopPropagation()}>
                        Lihat file sertifikat saat ini
                      </a>
                    )}
                  </div>
                </div>
              </div>

            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
              <button type="button" onClick={onClose} className="py-2 px-6 rounded border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm transition-colors">
                Batal
              </button>
              <button type="submit" className="py-2 px-6 rounded text-white bg-success hover:bg-success/90 font-medium text-sm transition-colors flex items-center gap-2 shadow-sm">
                <i className="ri-save-line"></i> Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
