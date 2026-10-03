"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const CreatableSelect = dynamic(() => import('react-select/creatable'), { ssr: false });
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import { qcService } from '@/app/services/qcService';
import { commodityService } from '@/app/services/commodityService';
import { varietyService } from '@/app/services/varietyService';
import uploadService from '@/app/services/uploadService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import { SaveButton, CancelButton } from '@/app/(components)/(content-layout)/shared/ActionButtons';
import { Commodity } from '@/app/types/commodity';
import { Variety } from '@/app/types/variety';
import { TestMethodDocument } from '@/app/types/qc';

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
    komoditas: 'Semua Komoditas',
    varietas: 'Semua Varietas',
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
  const [dokumenList, setDokumenList] = useState<TestMethodDocument[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Multi-select state for commodities & varieties
  const [selectedKomoditas, setSelectedKomoditas] = useState<string[]>(['Semua Komoditas']);
  const [selectedVarietas, setSelectedVarietas] = useState<string[]>(['Semua Varietas']);

  // Reference data for dropdowns
  const [referenceStandards, setReferenceStandards] = useState<any[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [varieties, setVarieties] = useState<Variety[]>([]);

  useEffect(() => {
    fetchReferenceStandards();
    fetchCommodities();
    fetchVarieties();
    if (mode === 'edit' && initialData) {
      let formattedInitialDate = '';
      if (initialData.tanggalBerlaku) {
        const d = new Date(initialData.tanggalBerlaku);
        if (!isNaN(d.getTime())) {
          formattedInitialDate = d.toISOString().split('T')[0];
        }
      }

      let kList = ['Semua Komoditas'];
      if (initialData.komoditas && initialData.komoditas.trim() !== '') {
        const parts = initialData.komoditas.split(',').map((s: string) => s.trim()).filter(Boolean);
        if (parts.length > 0) kList = parts;
      }
      setSelectedKomoditas(kList);

      let vList = ['Semua Varietas'];
      if (initialData.varietas && initialData.varietas.trim() !== '') {
        const parts = initialData.varietas.split(',').map((s: string) => s.trim()).filter(Boolean);
        if (parts.length > 0) vList = parts;
      }
      setSelectedVarietas(vList);

      setFormData({
        kode: initialData.kode || '',
        nama: initialData.nama || '',
        jenisUji: initialData.jenisUji || '',
        standarId: initialData.standarId || '',
        komoditas: initialData.komoditas || 'Semua Komoditas',
        varietas: initialData.varietas || 'Semua Varietas', // from detail if mapped
        tipe: initialData.tipe || '', // from detail if mapped
        status: initialData.status || 'Aktif',
        metode: initialData.metode || '',
        alatDigunakan: initialData.alatDigunakan || '',
        prosedur: initialData.deskripsi || '', // map prosedur to deskripsi
        versiMetode: initialData.versiMetode || '',
        tanggalBerlaku: formattedInitialDate,
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
      // Extract existing documents if any
      if (initialData.dokumen && Array.isArray(initialData.dokumen)) {
        setDokumenList(initialData.dokumen);
      }
    } else {
      setSelectedKomoditas(['Semua Komoditas']);
      setSelectedVarietas(['Semua Varietas']);
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

  const fetchCommodities = async () => {
    try {
      const res = await commodityService.getCommodities({});
      setCommodities(res.data || []);
    } catch (error) {
      console.error("Error fetching commodities", error);
    }
  };

  const fetchVarieties = async () => {
    try {
      const res = await varietyService.getVarieties({});
      const data = res.data || [];
      setVarieties(data);
    } catch (error) {
      console.error("Error fetching varieties", error);
    }
  };

  const commodityOptions = useMemo(() => {
    return [
      { value: 'Semua Komoditas', label: 'Semua Komoditas' },
      ...commodities.map(c => ({ value: c.namaKomoditas, label: c.namaKomoditas }))
    ];
  }, [commodities]);

  const filteredVarietiesOptions = useMemo(() => {
    const isAllCommodities = selectedKomoditas.includes('Semua Komoditas') || selectedKomoditas.length === 0;

    let relevantVarieties = varieties;
    if (!isAllCommodities) {
      const selectedCommIds = new Set(
        commodities.filter(c => selectedKomoditas.includes(c.namaKomoditas)).map(c => c.id)
      );
      relevantVarieties = varieties.filter(v => {
        if (selectedCommIds.has(v.commodityId)) return true;
        if (v.commodity && selectedKomoditas.includes(v.commodity.namaKomoditas)) return true;
        return false;
      });
    }

    return [
      { value: 'Semua Varietas', label: 'Semua Varietas' },
      ...relevantVarieties.map(v => ({
        value: v.namaVarietas,
        label: isAllCommodities && v.commodity?.namaKomoditas
          ? `${v.namaVarietas} (${v.commodity.namaKomoditas})`
          : v.namaVarietas,
      }))
    ];
  }, [selectedKomoditas, commodities, varieties]);

  const handleKomoditasChange = (selectedOptions: any) => {
    if (!selectedOptions || selectedOptions.length === 0) {
      setSelectedKomoditas([]);
      return;
    }

    const values: string[] = selectedOptions.map((opt: any) => opt.value);
    const hadSemua = selectedKomoditas.includes('Semua Komoditas');
    const nowHasSemua = values.includes('Semua Komoditas');

    let nextValues: string[] = [];

    if (!hadSemua && nowHasSemua) {
      nextValues = ['Semua Komoditas'];
    } else if (hadSemua && values.length > 1) {
      nextValues = values.filter(v => v !== 'Semua Komoditas');
    } else if (nowHasSemua && values.length > 1) {
      if (values[values.length - 1] === 'Semua Komoditas') {
        nextValues = ['Semua Komoditas'];
      } else {
        nextValues = values.filter(v => v !== 'Semua Komoditas');
      }
    } else {
      nextValues = values;
    }

    setSelectedKomoditas(nextValues);
  };

  const handleVarietasChange = (selectedOptions: any) => {
    if (!selectedOptions || selectedOptions.length === 0) {
      setSelectedVarietas([]);
      return;
    }

    const values: string[] = selectedOptions.map((opt: any) => opt.value);
    const hadSemua = selectedVarietas.includes('Semua Varietas');
    const nowHasSemua = values.includes('Semua Varietas');

    let nextValues: string[] = [];

    if (!hadSemua && nowHasSemua) {
      nextValues = ['Semua Varietas'];
    } else if (hadSemua && values.length > 1) {
      nextValues = values.filter(v => v !== 'Semua Varietas');
    } else if (nowHasSemua && values.length > 1) {
      if (values[values.length - 1] === 'Semua Varietas') {
        nextValues = ['Semua Varietas'];
      } else {
        nextValues = values.filter(v => v !== 'Semua Varietas');
      }
    } else {
      nextValues = values;
    }

    setSelectedVarietas(nextValues);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Clear validation error when field changes
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    setFormData({ ...formData, [name]: value });
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

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const newDocs: TestMethodDocument[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const sizeFormatted = file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(1)} KB`;
        const ext = file.name.split('.').pop()?.toLowerCase() || '';

        const res = await uploadService.uploadFile(file, 'metode-uji');
        if (res.success && res.data?.fileUrl) {
          newDocs.push({
            id: `temp-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
            namaFile: file.name,
            fileUrl: res.data.fileUrl,
            tipeFile: ext,
            ukuran: sizeFormatted,
          });
        }
      }
      setDokumenList(prev => [...prev, ...newDocs]);
      toast.success(`${newDocs.length} dokumen berhasil diunggah ke MinIO`);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Gagal mengupload dokumen ke MinIO');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

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
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleRemoveDokumen = (index: number) => {
    setDokumenList(prev => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  const getFileIcon = (fileName: string, tipeFile?: string) => {
    const ext = (tipeFile || fileName.split('.').pop() || '').toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
      return <i className="ri-image-fill text-info text-xl"></i>;
    }
    if (ext === 'pdf') {
      return <i className="ri-file-pdf-fill text-danger text-xl"></i>;
    }
    if (['doc', 'docx'].includes(ext)) {
      return <i className="ri-file-word-fill text-primary text-xl"></i>;
    }
    if (['xls', 'xlsx'].includes(ext)) {
      return <i className="ri-file-excel-fill text-success text-xl"></i>;
    }
    if (['ppt', 'pptx'].includes(ext)) {
      return <i className="ri-file-ppt-fill text-warning text-xl"></i>;
    }
    return <i className="ri-file-text-fill text-gray-400 text-xl"></i>;
  };

  const isImageFile = (fileName: string, tipeFile?: string) => {
    const ext = (tipeFile || fileName.split('.').pop() || '').toLowerCase();
    return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext);
  };

  const handleSave = async () => {
    const errors: Record<string, string> = {};

    if (!formData.kode || !formData.kode.trim()) {
      errors.kode = "Kode Metode Uji wajib diisi";
    }
    if (!formData.nama || !formData.nama.trim()) {
      errors.nama = "Nama Metode Uji wajib diisi";
    }
    if (!formData.jenisUji) {
      errors.jenisUji = "Jenis Uji wajib dipilih";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      const firstErrorMessage = Object.values(errors)[0];
      toast.error(firstErrorMessage);

      if (errors.kode) {
        document.getElementById('input-kode-metode')?.focus();
      } else if (errors.nama) {
        document.getElementById('input-nama-metode')?.focus();
      } else if (errors.jenisUji) {
        document.getElementById('input-jenis-uji')?.focus();
      }
      return;
    }

    // Safe date formatting
    let formattedDate: string | null = null;
    if (formData.tanggalBerlaku && formData.tanggalBerlaku.trim() !== '') {
      const d = new Date(formData.tanggalBerlaku);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toISOString();
      }
    }

    try {
      setIsSubmitting(true);
      const finalKomoditas = selectedKomoditas.length === 0 || selectedKomoditas.includes('Semua Komoditas')
        ? 'Semua Komoditas'
        : selectedKomoditas.join(', ');

      const finalVarietas = selectedVarietas.length === 0 || selectedVarietas.includes('Semua Varietas')
        ? 'Semua Varietas'
        : selectedVarietas.join(', ');

      const payload: any = {
        kode: formData.kode.trim(),
        nama: formData.nama.trim(),
        jenisUji: formData.jenisUji,
        standarId: formData.standarId && formData.standarId.trim() !== '' ? formData.standarId : null,
        komoditas: finalKomoditas,
        varietas: finalVarietas,
        tipe: formData.tipe && formData.tipe.trim() !== '' ? formData.tipe : null,
        deskripsi: formData.prosedur && formData.prosedur.trim() !== '' ? formData.prosedur.trim() : null, // mapping prosedur to deskripsi
        status: formData.status || 'Aktif',
        alatDigunakan: formData.alatDigunakan && formData.alatDigunakan.trim() !== '' ? formData.alatDigunakan.trim() : null,
        versiMetode: formData.versiMetode && formData.versiMetode.trim() !== '' ? formData.versiMetode.trim() : null,
        tanggalBerlaku: formattedDate,
        catatan: formData.catatan && formData.catatan.trim() !== '' ? formData.catatan.trim() : null,
        testParameters: parameters
          .filter(p => p.parameter && p.parameter.trim() !== '')
          .map((p, idx) => ({
            id: p.id && !p.id.startsWith('temp-') && p.id.length > 10 ? p.id : undefined,
            nama: p.parameter.trim(),
            satuan: p.satuan || null,
            batasMin: p.batasMin || null,
            batasMax: p.batasMax || null,
          })),
        dokumen: dokumenList.map(d => ({
          namaFile: d.namaFile,
          fileUrl: d.fileUrl,
          tipeFile: d.tipeFile || (d.namaFile ? d.namaFile.split('.').pop()?.toLowerCase() : null),
          ukuran: d.ukuran || null,
        }))
      };

      if (mode === 'create') {
        await qcService.createMethod(payload);
        toast.success("Metode Uji berhasil ditambahkan");
        setTimeout(() => {
          router.push('/qc/standar-metode-uji');
        }, 500);
      } else {
        await qcService.updateMethod(initialData.id, payload);
        toast.success("Metode Uji berhasil diperbarui");
        setTimeout(() => {
          router.push('/qc/standar-metode-uji');
        }, 500);
      }
    } catch (error: any) {
      console.error("Error saving method", error);
      const msg = error.response?.data?.message || error.message || "Terjadi kesalahan saat menyimpan";
      toast.error(msg);
      if (msg.toLowerCase().includes('kode') || msg.toLowerCase().includes('terdaftar')) {
        setValidationErrors(prev => ({ ...prev, kode: msg }));
        document.getElementById('input-kode-metode')?.focus();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="flex items-center justify-between mb-4">
        <Pageheader
          currentpage={mode === 'create' ? "Tambah Metode Uji" : "Edit Metode Uji"}
          activepage="Metode Uji"
          mainpage="Master Data"
          mainpageurl="/qc/standar-metode-uji"
        />
        <div className="flex gap-2">
          <CancelButton onClick={() => router.push('/qc/standar-metode-uji')} disabled={isSubmitting} />
          <SaveButton
            onClick={handleSave}
            disabled={isUploading || isSubmitting}
            label={isUploading ? "Mengunggah Dokumen..." : isSubmitting ? "Menyimpan..." : (mode === 'create' ? "Simpan" : "Simpan Perubahan")}
          />
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
                    <input
                      id="input-kode-metode"
                      type="text"
                      name="kode"
                      value={formData.kode}
                      onChange={handleChange}
                      className={`form-control text-sm ${validationErrors.kode ? '!border-danger focus:!border-danger' : ''}`}
                      placeholder="Contoh: MT-001"
                    />
                    <span className="absolute right-3 top-2 text-xs text-gray-400">{formData.kode.length}/10</span>
                  </div>
                  {validationErrors.kode && (
                    <p className="text-danger text-xs mt-1">{validationErrors.kode}</p>
                  )}
                </div>
                <div>
                  <label className="form-label text-sm font-semibold">Nama Metode Uji <span className="text-danger">*</span></label>
                  <input
                    id="input-nama-metode"
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className={`form-control text-sm ${validationErrors.nama ? '!border-danger focus:!border-danger' : ''}`}
                    placeholder="Contoh: Kadar Air"
                  />
                  {validationErrors.nama && (
                    <p className="text-danger text-xs mt-1">{validationErrors.nama}</p>
                  )}
                </div>
                <div>
                  <label className="form-label text-sm font-semibold">Jenis Uji <span className="text-danger">*</span></label>
                  <select
                    id="input-jenis-uji"
                    name="jenisUji"
                    value={formData.jenisUji}
                    onChange={handleChange}
                    className={`form-select text-sm ${validationErrors.jenisUji ? '!border-danger focus:!border-danger' : ''}`}
                  >
                    <option value="">Pilih Jenis Uji</option>
                    <option value="Fisik">Fisik</option>
                    <option value="Visual">Visual</option>
                    <option value="Fisiologi">Fisiologi</option>
                    <option value="Biologis">Biologis</option>
                    <option value="Kimia">Kimia</option>
                  </select>
                  {validationErrors.jenisUji && (
                    <p className="text-danger text-xs mt-1">{validationErrors.jenisUji}</p>
                  )}
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="form-label text-sm font-semibold mb-0">
                      Komoditas <span className="text-danger">*</span>
                    </label>
                    <span className="text-[11px] text-gray-400">Pilih 1 atau beberapa</span>
                  </div>
                  <CreatableSelect
                    instanceId="select-metode-komoditas"
                    isMulti
                    isSearchable
                    options={commodityOptions}
                    value={selectedKomoditas.map(k => ({ value: k, label: k }))}
                    onChange={handleKomoditasChange}
                    placeholder="Pilih komoditas (atau Semua Komoditas)..."
                    className="text-sm"
                    classNamePrefix="react-select"
                    noOptionsMessage={() => "Komoditas tidak ditemukan"}
                    formatCreateLabel={(val) => `Tambah komoditas "${val}"`}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                    styles={{
                      menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
                      control: (base: any) => ({ ...base, minHeight: '38px', borderColor: '#e5e7eb' })
                    }}
                  />
                  {selectedKomoditas.includes('Semua Komoditas') && (
                    <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                      <i className="ri-checkbox-circle-line"></i> Berlaku untuk semua komoditas
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="form-label text-sm font-semibold mb-0">
                      Varietas
                    </label>
                    <span className="text-[11px] text-gray-400">Pilih 1 atau beberapa</span>
                  </div>
                  <CreatableSelect
                    instanceId="select-metode-varietas"
                    isMulti
                    isSearchable
                    options={filteredVarietiesOptions}
                    value={selectedVarietas.map(v => ({ value: v, label: v }))}
                    onChange={handleVarietasChange}
                    placeholder="Pilih varietas (atau Semua Varietas)..."
                    className="text-sm"
                    classNamePrefix="react-select"
                    noOptionsMessage={() => "Varietas tidak ditemukan"}
                    formatCreateLabel={(val) => `Tambah varietas "${val}"`}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                    styles={{
                      menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
                      control: (base: any) => ({ ...base, minHeight: '38px', borderColor: '#e5e7eb' })
                    }}
                  />
                  {selectedVarietas.includes('Semua Varietas') && (
                    <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                      <i className="ri-checkbox-circle-line"></i> Berlaku untuk semua varietas
                    </p>
                  )}
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
            <div className="box-header flex items-center justify-between border-b border-defaultborder pb-3">
              <div className="flex items-center gap-2">
                <i className="ri-file-list-3-line text-lg text-primary"></i>
                <h3 className="box-title font-semibold text-base">Dokumen Terkait</h3>
              </div>
              <span className="badge bg-primary/10 text-primary font-semibold text-xs rounded-full px-2.5 py-0.5">
                {dokumenList.length} File
              </span>
            </div>
            <div className="box-body pt-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-5 text-center transition-all cursor-pointer relative ${
                  isDragging
                    ? 'border-primary bg-primary/10 scale-[1.01]'
                    : isUploading
                    ? 'border-gray-200 bg-gray-50 cursor-wait'
                    : 'border-gray-300 hover:border-primary/60 hover:bg-gray-50/80'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.webp,.svg,.txt,.csv"
                />

                {isUploading ? (
                  <div className="flex flex-col items-center justify-center py-2">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-xs font-semibold text-primary">Mengunggah ke MinIO Storage...</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Mohon tunggu sebentar</p>
                  </div>
                ) : (
                  <>
                    <div className="text-primary text-3xl mb-1.5 flex justify-center">
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                        <i className="ri-cloud-upload-line text-2xl"></i>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 mb-0.5">
                      Upload Dokumen & Gambar Pendukung
                    </p>
                    <p className="text-[11px] text-gray-500 mb-2">
                      PDF, DOCX, XLSX, JPG, PNG, WEBP (Maks. 10 MB per file)
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm px-3 py-1 text-xs"
                      >
                        Pilih File
                      </button>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5 flex items-center gap-1 font-medium">
                        <i className="ri-hard-drive-2-line"></i> MinIO
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4">
                <div className="table-responsive rounded border border-defaultborder overflow-hidden">
                  <table className="w-full text-left text-sm text-gray-500 border-collapse">
                    <thead className="bg-gray-50/80">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold text-xs border-b border-defaultborder text-primary">
                          Berkas
                        </th>
                        <th className="py-2.5 px-3 font-semibold text-xs border-b border-defaultborder text-primary w-20 text-center">
                          Ukuran
                        </th>
                        <th className="py-2.5 px-3 font-semibold text-xs border-b border-defaultborder text-primary w-20 text-center">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-defaultborder">
                      {dokumenList.length > 0 ? (
                        dokumenList.map((doc, i) => {
                          const isImg = isImageFile(doc.namaFile, doc.tipeFile);
                          const ext = (doc.tipeFile || doc.namaFile.split('.').pop() || '').toUpperCase();
                          return (
                            <tr key={doc.id || i} className="hover:bg-gray-50/60 transition-colors">
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2.5">
                                  {isImg && doc.fileUrl ? (
                                    <a
                                      href={doc.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="relative block w-8 h-8 rounded border border-gray-200 overflow-hidden shrink-0 group"
                                      title="Klik untuk melihat gambar penuh"
                                    >
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={doc.fileUrl}
                                        alt={doc.namaFile}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                      />
                                    </a>
                                  ) : (
                                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
                                      {getFileIcon(doc.namaFile, doc.tipeFile)}
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p
                                      className="text-xs font-semibold text-gray-800 truncate mb-0.5"
                                      title={doc.namaFile}
                                    >
                                      {doc.namaFile}
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-mono text-gray-500 uppercase bg-gray-100 px-1 py-0.2 rounded">
                                        {ext || 'FILE'}
                                      </span>
                                      <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                                        <i className="ri-check-line text-[11px]"></i> MinIO
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-xs text-center text-gray-500 whitespace-nowrap">
                                {doc.ukuran || '-'}
                              </td>
                              <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">
                                  <a
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-7 h-7 flex items-center justify-center rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                    title="Buka / Unduh Berkas"
                                  >
                                    <i className="ri-external-link-line text-sm"></i>
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDokumen(i)}
                                    className="w-7 h-7 flex items-center justify-center rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                    title="Hapus Berkas"
                                  >
                                    <i className="ri-delete-bin-line text-sm"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-7 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                              <i className="ri-folder-open-line text-3xl mb-1.5 opacity-40"></i>
                              <span className="text-xs font-medium">Belum ada dokumen yang diunggah</span>
                              <span className="text-[11px] text-gray-400 mt-0.5">
                                Dokumen atau gambar akan otomatis disimpan ke MinIO
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-defaultborder">
        <CancelButton onClick={() => router.push('/qc/standar-metode-uji')} disabled={isSubmitting} />
        <SaveButton
          onClick={handleSave}
          disabled={isUploading || isSubmitting}
          label={isUploading ? "Mengunggah Dokumen..." : isSubmitting ? "Menyimpan..." : (mode === 'create' ? "Simpan Metode Uji" : "Simpan Perubahan")}
        />
      </div>
    </div>
  );
}
