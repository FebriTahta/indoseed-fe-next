"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import { qcService } from '@/app/services/qcService';
import { toast } from 'react-toastify';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import { SaveButton, CancelButton } from '@/app/(components)/(content-layout)/shared/ActionButtons';

interface ParameterItem {
  id: string; // temp id for UI mapping
  parameter: string;
  satuan: string;
  batasMin: string;
  batasMax: string;
}

export default function MetodeUjiForm({ mode, initialData }: { mode: 'create' | 'edit', initialData?: any }) {
  const router = useRouter();

  // Basic info state
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    jenisUji: '',
    standarId: '',
    komoditas: '',
    varietas: '',
    tipe: '',
    status: 'Aktif',
    metode: '',
    alatDigunakan: '',
    prosedur: '',
    versiMetode: '',
    tanggalBerlaku: '',
    catatan: '',
  });

  const [parameters, setParameters] = useState<ParameterItem[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Reference data for dropdowns
  const [referenceStandards, setReferenceStandards] = useState<any[]>([]);

  useEffect(() => {
    fetchReferenceStandards();
    if (mode === 'edit' && initialData) {
      setFormData({
        kode: initialData.kode || '',
        nama: initialData.nama || '',
        jenisUji: initialData.jenisUji || '',
        standarId: initialData.standarId || '',
        komoditas: initialData.komoditas || '',
        varietas: initialData.varietas || '', // from detail if mapped
        tipe: initialData.tipe || '', // from detail if mapped
        status: initialData.status || 'Aktif',
        metode: initialData.metode || '',
        alatDigunakan: initialData.alatDigunakan || '',
        prosedur: initialData.deskripsi || '', // map prosedur to deskripsi
        versiMetode: initialData.versiMetode || '',
        tanggalBerlaku: initialData.tanggalBerlaku ? new Date(initialData.tanggalBerlaku).toISOString().split('T')[0] : '',
        catatan: initialData.catatan || '',
      });
      // Extract parameters if any
      if (initialData.testParameters) {
        const mappedParams = initialData.testParameters.map((p: any) => ({
          id: p.id || Math.random().toString(),
          parameter: p.nama || '',
          satuan: p.satuan || '',
          batasMin: p.batasAcuan ? p.batasAcuan.split(' - ')[0] || '' : '',
          batasMax: p.batasAcuan ? p.batasAcuan.split(' - ')[1] || '' : '',
        }));
        setParameters(mappedParams);
      }
    } else {
      // Add one default empty parameter
      setParameters([{ id: '1', parameter: '', satuan: '', batasMin: '', batasMax: '' }]);
    }
  }, [mode, initialData]);

  const fetchReferenceStandards = async () => {
    try {
      const res = await qcService.getStandards();
      if (res.data) setReferenceStandards(res.data);
    } catch (error) {
      console.error("Error fetching standards", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusToggle = () => {
    setFormData(prev => ({ ...prev, status: prev.status === 'Aktif' ? 'Nonaktif' : 'Aktif' }));
  };

  const addParameter = () => {
    setParameters([...parameters, { id: Math.random().toString(), parameter: '', satuan: '', batasMin: '', batasMax: '' }]);
  };

  const updateParameter = (index: number, field: string, value: string) => {
    const newParams = [...parameters];
    newParams[index] = { ...newParams[index], [field]: value };
    setParameters(newParams);
  };

  const removeParameter = (index: number) => {
    const newParams = [...parameters];
    newParams.splice(index, 1);
    setParameters(newParams);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleSave = async () => {
    try {
      const payload: any = {
        kode: formData.kode,
        nama: formData.nama,
        jenisUji: formData.jenisUji,
        standarId: formData.standarId,
        komoditas: formData.komoditas,
        deskripsi: formData.prosedur, // mapping prosedur to deskripsi
        status: formData.status,
        alatDigunakan: formData.alatDigunakan,
        versiMetode: formData.versiMetode,
        tanggalBerlaku: formData.tanggalBerlaku ? new Date(formData.tanggalBerlaku).toISOString() : null,
        catatan: formData.catatan,
        testParameters: parameters.filter(p => p.parameter.trim() !== '')
      };

      if (mode === 'create') {
        const res = await qcService.createMethod(payload);
        toast.success("Metode Uji berhasil ditambahkan");
        router.push('/qc/standar-metode-uji');
      } else {
        await qcService.updateMethod(initialData.id, payload);
        toast.success("Metode Uji berhasil diperbarui");
        router.push('/qc/standar-metode-uji');
      }
    } catch (error) {
      console.error("Error saving method", error);
      toast.error("Terjadi kesalahan saat menyimpan");
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Pageheader
          currentpage={mode === 'create' ? "Tambah Metode Uji" : "Edit Metode Uji"}
          activepage="Metode Uji"
          mainpage="Master Data"
          mainpageurl="/qc/standar-metode-uji"
        />
        <div className="flex gap-2">
          <CancelButton onClick={() => router.push('/qc/standar-metode-uji')} />
          <SaveButton onClick={handleSave} />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
            <i className="ri-flask-fill text-3xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{mode === 'create' ? "Tambah Metode Uji" : "Edit Metode Uji"}</h1>
            <p className="text-sm text-gray-500">Lengkapi informasi metode uji untuk memastikan standar pengujian sesuai dengan kebutuhan perusahaan.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Informasi Dasar */}
          <div className="box">
            <div className="box-header flex items-center gap-2 border-b border-defaultborder pb-3">
              <i className="ri-information-line text-lg text-primary"></i>
              <h3 className="box-title font-semibold text-base">Informasi Dasar</h3>
            </div>
            <div className="box-body pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-sm font-semibold">Kode Metode Uji <span className="text-danger">*</span></label>
                  <div className="relative">
                    <input type="text" name="kode" value={formData.kode} onChange={handleChange} className="form-control text-sm" placeholder="Contoh: MT-001" />
                    <span className="absolute right-3 top-2 text-xs text-gray-400">{formData.kode.length}/10</span>
                  </div>
                </div>
                <div>
                  <label className="form-label text-sm font-semibold">Nama Metode Uji <span className="text-danger">*</span></label>
                  <input type="text" name="nama" value={formData.nama} onChange={handleChange} className="form-control text-sm" placeholder="Contoh: Kadar Air" />
                </div>
                <div>
                  <label className="form-label text-sm font-semibold">Jenis Uji <span className="text-danger">*</span></label>
                  <select name="jenisUji" value={formData.jenisUji} onChange={handleChange} className="form-select text-sm">
                    <option value="">Pilih Jenis Uji</option>
                    <option value="Fisik">Fisik</option>
                    <option value="Visual">Visual</option>
                    <option value="Fisiologi">Fisiologi</option>
                    <option value="Biologis">Biologis</option>
                    <option value="Kimia">Kimia</option>
                  </select>
                </div>
                <div>
                  <label className="form-label text-sm font-semibold">Standar Acuan <span className="text-danger">*</span></label>
                  <select name="standarId" value={formData.standarId} onChange={handleChange} className="form-select text-sm">
                    <option value="">Pilih Standar Acuan</option>
                    {referenceStandards.map(rs => (
                      <option key={rs.id} value={rs.id}>{rs.kode} - {rs.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label text-sm font-semibold">Komoditas <span className="text-danger">*</span></label>
                  <select name="komoditas" value={formData.komoditas} onChange={handleChange} className="form-select text-sm">
                    <option value="">Pilih Komoditas</option>
                    <option value="Padi">Padi</option>
                    <option value="Jagung">Jagung</option>
                  </select>
                </div>
                <div>
                  <label className="form-label text-sm font-semibold">Varietas</label>
                  <select name="varietas" value={formData.varietas} onChange={handleChange} className="form-select text-sm">
                    <option value="">Pilih Varietas</option>
                    <option value="Varietas A">Varietas A</option>
                  </select>
                </div>
                <div>
                  <label className="form-label text-sm font-semibold">Tipe <span className="text-danger">*</span></label>
                  <select name="tipe" value={formData.tipe} onChange={handleChange} className="form-select text-sm">
                    <option value="">Pilih Tipe</option>
                    <option value="Inbred">Inbred</option>
                    <option value="Hibrida">Hibrida</option>
                  </select>
                </div>
                <div>
                  <label className="form-label text-sm font-semibold block">Status <span className="text-danger">*</span></label>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`custom-toggle-switch flex items-center w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.status === 'Aktif' ? 'bg-primary' : 'bg-gray-300'}`} onClick={handleStatusToggle}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${formData.status === 'Aktif' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                    <span className={`text-sm font-medium ${formData.status === 'Aktif' ? 'text-primary' : 'text-gray-500'}`}>{formData.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Parameter Pengujian */}
          <div className="box">
            <div className="box-header flex items-center gap-2 border-b border-defaultborder pb-3">
              <i className="ri-flask-line text-lg text-primary"></i>
              <h3 className="box-title font-semibold text-base">Parameter Pengujian</h3>
            </div>
            <div className="box-body pt-4">
              {parameters.map((param, index) => (
                <div key={param.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-end bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                  <div className="md:col-span-4">
                    <label className="form-label text-xs font-semibold">Parameter <span className="text-danger">*</span></label>
                    <select value={param.parameter} onChange={(e) => updateParameter(index, 'parameter', e.target.value)} className="form-select text-sm h-[38px]">
                      <option value="">Pilih Parameter</option>
                      <option value="Kadar Air">Kadar Air</option>
                      <option value="Daya Berkecambah">Daya Berkecambah</option>
                      <option value="Kemurnian Fisik">Kemurnian Fisik</option>
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="form-label text-xs font-semibold">Satuan <span className="text-danger">*</span></label>
                    <select value={param.satuan} onChange={(e) => updateParameter(index, 'satuan', e.target.value)} className="form-select text-sm h-[38px]">
                      <option value="">Pilih Satuan</option>
                      <option value="%">%</option>
                      <option value="kg">kg</option>
                      <option value="gr">gr</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="form-label text-xs font-semibold">Batas Minimum</label>
                    <input type="text" value={param.batasMin} onChange={(e) => updateParameter(index, 'batasMin', e.target.value)} className="form-control text-sm h-[38px]" placeholder="Contoh: 1,0" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="form-label text-xs font-semibold">Batas Maksimum</label>
                    <input type="text" value={param.batasMax} onChange={(e) => updateParameter(index, 'batasMax', e.target.value)} className="form-control text-sm h-[38px]" placeholder="Contoh: 10,0" />
                  </div>
                  <div className="md:col-span-1 flex justify-center pb-1">
                    <button type="button" onClick={() => removeParameter(index)} className="btn btn-icon btn-sm btn-danger-light rounded-full w-8 h-8 flex items-center justify-center">
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
              ))}

              <button type="button" onClick={addParameter} className="btn btn-outline-primary btn-sm flex items-center gap-1 mt-2">
                <i className="ri-add-line"></i> Tambah Parameter
              </button>
            </div>
          </div>

          {/* Metode & Prosedur */}
          <div className="box">
            <div className="box-header flex items-center gap-2 border-b border-defaultborder pb-3">
              <i className="ri-time-line text-lg text-primary"></i>
              <h3 className="box-title font-semibold text-base">Metode & Prosedur</h3>
            </div>
            <div className="box-body pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1 flex flex-col gap-4">
                  <div>
                    <label className="form-label text-sm font-semibold">Metode <span className="text-danger">*</span></label>
                    <select name="metode" value={formData.metode} onChange={handleChange} className="form-select text-sm h-[38px]">
                      <option value="">Pilih Metode</option>
                      <option value="Oven">Oven</option>
                      <option value="Timbangan">Timbangan</option>
                    </select>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <label className="form-label text-sm font-semibold">Prosedur / SOP <span className="text-danger">*</span></label>
                    <div className="relative flex-1">
                      <textarea name="prosedur" value={formData.prosedur} onChange={handleChange} className="form-control text-sm h-full min-h-[120px] pb-6" placeholder="Masukkan langkah-langkah prosedur pengujian..."></textarea>
                      <span className="absolute right-3 bottom-2 text-xs text-gray-400">{formData.prosedur.length}/1000</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-1 flex flex-col gap-4">
                  <div>
                    <label className="form-label text-sm font-semibold">Alat yang Digunakan</label>
                    <div className="relative">
                      <textarea name="alatDigunakan" value={formData.alatDigunakan} onChange={handleChange} className="form-control text-sm h-[80px] pb-6" placeholder="Contoh: Moisture Analyzer, Timbangan Analitik, Oven..."></textarea>
                      <span className="absolute right-3 bottom-2 text-xs text-gray-400">{formData.alatDigunakan.length}/500</span>
                    </div>
                  </div>
                  <div>
                    <label className="form-label text-sm font-semibold">Versi Metode</label>
                    <input type="text" name="versiMetode" value={formData.versiMetode} onChange={handleChange} className="form-control text-sm" placeholder="Contoh: 1.0" />
                  </div>
                  <div>
                    <label className="form-label text-sm font-semibold">Tanggal Berlaku</label>
                    <div className="relative">
                      <input type="date" name="tanggalBerlaku" value={formData.tanggalBerlaku} onChange={handleChange} className="form-control text-sm pr-10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Dokumen Terkait */}
          <div className="box">
            <div className="box-header flex items-center gap-2 border-b border-defaultborder pb-3">
              <i className="ri-file-list-3-line text-lg text-primary"></i>
              <h3 className="box-title font-semibold text-base">Dokumen Terkait</h3>
            </div>
            <div className="box-body pt-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" />
                <div className="text-primary text-3xl mb-2">
                  <i className="ri-cloud-upload-line"></i>
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Upload Dokumen Pendukung</p>
                <p className="text-xs text-gray-500 mb-3">(PDF, DOC, XLS, JPG, PNG - Maks. 10 MB)</p>
                <button type="button" className="btn btn-outline-primary btn-sm px-4">Pilih File</button>
              </div>

              <div className="mt-4">
                <table className="w-full text-left text-sm text-gray-500 border-collapse">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="py-2 px-3 font-semibold text-xs border-b border-defaultborder text-primary w-1/2">Nama File</th>
                      <th className="py-2 px-3 font-semibold text-xs border-b border-defaultborder text-primary">Ukuran</th>
                      <th className="py-2 px-3 font-semibold text-xs border-b border-defaultborder text-primary text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedFiles.length > 0 ? (
                      uploadedFiles.map((f, i) => (
                        <tr key={i} className="border-b border-defaultborder">
                          <td className="py-2 px-3 truncate max-w-[150px]" title={f.name}>{f.name}</td>
                          <td className="py-2 px-3 text-xs">{(f.size / 1024).toFixed(1)} KB</td>
                          <td className="py-2 px-3 text-center">
                            <button type="button" onClick={() => {
                              const newF = [...uploadedFiles];
                              newF.splice(i, 1);
                              setUploadedFiles(newF);
                            }} className="text-danger hover:text-danger/80">
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-8 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <i className="ri-folder-open-line text-3xl mb-2 opacity-50"></i>
                            <span className="text-xs">Belum ada dokumen yang diunggah</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Catatan */}
          <div className="box">
            <div className="box-header flex items-center gap-2 border-b border-defaultborder pb-3">
              <i className="ri-sticky-note-line text-lg text-primary"></i>
              <h3 className="box-title font-semibold text-base">Catatan</h3>
            </div>
            <div className="box-body pt-4">
              <div className="relative">
                <textarea name="catatan" value={formData.catatan} onChange={handleChange} className="form-control text-sm w-full h-[150px] pb-6" placeholder="Tambahkan catatan tambahan mengenai metode uji ini..."></textarea>
                <span className="absolute right-3 bottom-2 text-xs text-gray-400">{formData.catatan.length}/500</span>
              </div>
            </div>
          </div>

          {/* Informasi */}
          <div className="box bg-emerald-50/50 border-emerald-100">
            <div className="box-body p-4">
              <div className="flex items-start gap-2">
                <i className="ri-information-fill text-emerald-600 mt-0.5 text-lg"></i>
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-1">Informasi</h4>
                  <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                    <li>Metode uji akan digunakan pada proses permintaan pengujian dan pemeriksaan QC.</li>
                    <li>Pastikan semua parameter dan standar acuan sudah sesuai dengan regulasi ISO.</li>
                    <li>Setelah disimpan, metode uji dapat diedit kembali melalui menu edit.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
