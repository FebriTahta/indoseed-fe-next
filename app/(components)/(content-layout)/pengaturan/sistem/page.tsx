"use client"
import React, { useState, useEffect, Fragment } from 'react';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Redux
import { useDispatch } from 'react-redux';
import { setSettings } from '@/shared/redux/action';

// FilePond
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default function SistemPengaturanPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    namaWebsite: '',
    titleWebsite: '',
    logoWebsite: '',
    logoColor: '#11b238'
  });
  
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setInitialLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setFormData({
          namaWebsite: data.data.namaWebsite || '',
          titleWebsite: data.data.titleWebsite || '',
          logoWebsite: data.data.logoWebsite || '',
          logoColor: data.data.logoColor || '#11b238'
        });
        if (data.data.logoWebsite) {
          setPreviewLogo(data.data.logoWebsite);
        }
      } else {
        toast.error(data.message || 'Gagal mengambil pengaturan');
      }
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan koneksi');
    } finally {
      setInitialLoading(false);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!selectedFile) return formData.logoWebsite;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const uploadData = new FormData();
    uploadData.append('file', selectedFile);
    uploadData.append('folder', 'settings');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: uploadData
    });

    const data = await res.json();
    if (data.success) {
      return data.data.fileUrl;
    }
    throw new Error(data.message || 'Gagal mengupload logo');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalLogoUrl = formData.logoWebsite;

      if (selectedFile) {
        finalLogoUrl = await uploadLogo() || '';
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const payload = {
        ...formData,
        logoWebsite: finalLogoUrl
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.status === 'success') {
        toast.success('Pengaturan berhasil disimpan');
        // Update local state to match response
        setFormData({
          namaWebsite: data.data.namaWebsite || '',
          titleWebsite: data.data.titleWebsite || '',
          logoWebsite: data.data.logoWebsite || '',
          logoColor: data.data.logoColor || '#11b238'
        });
        
        // Dispatch to Redux for instant global update
        dispatch(setSettings(data.data));

        if (data.data.logoWebsite) {
            setPreviewLogo(data.data.logoWebsite);
        }
        
        // Reset FilePond
        setFiles([]);
        setSelectedFile(null);
      } else {
        toast.error(data.message || 'Gagal menyimpan pengaturan');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-full mt-20">
        <div className="ti-spinner" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Seo title="Pengaturan Sistem" />
      <Pageheader currentpage="Pengaturan Sistem" activepage="Pengaturan" title="Sistem" customButton={<></>} />
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8 xl:col-start-3">
          <div className="box border-0 shadow-lg rounded-xl overflow-hidden">
            <div className="box-header bg-primary/5 py-4 px-6 border-b border-gray-100 dark:border-defaultborder/10 justify-between">
              <div className="box-title flex items-center gap-2 text-primary font-semibold text-lg">
                <i className="bi bi-gear-fill"></i> Konfigurasi Website
              </div>
            </div>
            <div className="box-body p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  
                  {/* Nama Website */}
                  <div>
                    <label className="ti-form-label font-medium mb-2 text-sm text-gray-700 dark:text-gray-300">Nama Website <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className="ti-form-input bg-gray-50 dark:bg-bgdark border-gray-200 dark:border-white/10 rounded-lg focus:ring-primary focus:border-primary" 
                      placeholder="Masukkan nama website" 
                      value={formData.namaWebsite}
                      onChange={(e) => setFormData({...formData, namaWebsite: e.target.value})}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Nama ini akan digunakan di berbagai elemen UI aplikasi.</p>
                  </div>
                  
                  {/* Title Website */}
                  <div>
                    <label className="ti-form-label font-medium mb-2 text-sm text-gray-700 dark:text-gray-300">Title Website <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className="ti-form-input bg-gray-50 dark:bg-bgdark border-gray-200 dark:border-white/10 rounded-lg focus:ring-primary focus:border-primary" 
                      placeholder="Masukkan title website (untuk tab browser)" 
                      value={formData.titleWebsite}
                      onChange={(e) => setFormData({...formData, titleWebsite: e.target.value})}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Judul yang akan tampil pada tab browser pengguna.</p>
                  </div>
                  
                  {/* Logo Website */}
                  <div className="mt-2">
                    <label className="ti-form-label font-medium mb-2 text-sm text-gray-700 dark:text-gray-300">Logo Website</label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* Current Logo Preview */}
                        <div className="border border-dashed border-gray-300 dark:border-white/10 rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px] bg-gray-50/50 dark:bg-bgdark/50">
                            <span className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Logo Saat Ini</span>
                            {previewLogo ? (
                                <div 
                                    className="h-16 w-full max-w-[200px]"
                                    style={{
                                        WebkitMaskImage: `url(${previewLogo.startsWith('http') ? previewLogo : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${previewLogo}`})`,
                                        WebkitMaskSize: 'contain',
                                        WebkitMaskRepeat: 'no-repeat',
                                        WebkitMaskPosition: 'center',
                                        backgroundColor: formData.logoColor || '#11b238',
                                    }}
                                ></div>
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <i className="bi bi-image text-3xl mb-1"></i>
                                    <span className="text-sm">Belum ada logo</span>
                                </div>
                            )}
                        </div>

                        {/* FilePond Uploader */}
                        <div className="filepond-custom-wrapper">
                            <FilePond
                                files={files}
                                onupdatefiles={(fileItems) => {
                                    setFiles(fileItems.map(f => f.file));
                                    if (fileItems.length > 0) {
                                        setSelectedFile(fileItems[0].file as File);
                                    } else {
                                        setSelectedFile(null);
                                    }
                                }}
                                allowMultiple={false}
                                maxFiles={1}
                                name="logo"
                                labelIdle='<div class="flex flex-col items-center justify-center py-4"><i class="bi bi-cloud-arrow-up text-3xl text-primary mb-2"></i><span class="text-sm font-medium">Drag & Drop logo baru atau <span class="filepond--label-action text-primary font-semibold">Browse</span></span></div>'
                            />
                        </div>
                    </div>
                  </div>
                  
                  {/* Warna Logo Dinamis */}
                  <div className="mt-2">
                    <label className="ti-form-label font-medium mb-2 text-sm text-gray-700 dark:text-gray-300">Warna Tema Logo (Khusus PNG)</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="color" 
                        className="p-1 h-12 w-16 bg-white dark:bg-bgdark border border-gray-200 dark:border-white/10 rounded-lg cursor-pointer" 
                        value={formData.logoColor}
                        onChange={(e) => setFormData({...formData, logoColor: e.target.value})}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Pilih warna untuk menimpa warna logo secara dinamis. Fitur ini bekerja maksimal pada gambar berformat PNG transparan (satu warna).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <hr className="my-6 border-gray-100 dark:border-white/10" />
                
                <div className="flex justify-end">
                  <SpkButton 
                    buttontype="submit" 
                    variant="primary" 
                    customClass="ti-btn ti-btn-primary btn-wave px-8 py-2.5 rounded-lg shadow-sm shadow-primary/30"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="ti-spinner w-4 h-4 me-2"></span>Menyimpan...</>
                    ) : (
                      <><i className="bi bi-check-circle me-2"></i> Simpan Pengaturan</>
                    )}
                  </SpkButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer />
    </Fragment>
  );
}
