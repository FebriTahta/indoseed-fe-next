"use client";

import { buttonClass, iconButtonClass } from '@/app/(components)/(content-layout)/shared/buttonStyles';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const CreatableSelect = dynamic(() => import('react-select/creatable'), { ssr: false });
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import { qcService } from '@/app/services/qcService';
import { commodityService } from '@/app/services/commodityService';
import { varietyService } from '@/app/services/varietyService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import { SaveButton, CancelButton } from '@/app/(components)/(content-layout)/shared/ActionButtons';
import { Commodity } from '@/app/types/commodity';
import { Variety } from '@/app/types/variety';
import { TestMethodDocument } from '@/app/types/qc';
import { useQcLookups } from '@/app/hooks/useQcReference';
import DokumenTerkaitSection from './DokumenTerkaitSection';

interface ParameterItem {
  id: string; // temp id for UI mapping
  parameter: string;
  kategori?: string | null;
  satuan: string;
  operator: string; // '<=', '>=', '<', '>', '=', 'rentang'
  nilai: string;
  batasMin: string;
  batasMax: string;
}

const parseBatasAcuan = (batasAcuan?: string) => {
  if (!batasAcuan) {
    return { operator: '<=', nilai: '', batasMin: '', batasMax: '' };
  }
  const str = batasAcuan.trim();
  if (str.includes('-')) {
    const parts = str.split('-');
    const min = parts[0]?.trim() || '';
    const max = parts[1]?.trim() || '';
    return { operator: 'rentang', nilai: '', batasMin: min, batasMax: max };
  }
  if (str.startsWith('≤') || str.startsWith('<=')) {
    const val = str.replace(/^[≤<=]+/, '').trim();
    return { operator: '<=', nilai: val, batasMin: '', batasMax: val };
  }
  if (str.startsWith('≥') || str.startsWith('>=')) {
    const val = str.replace(/^[≥>=]+/, '').trim();
    return { operator: '>=', nilai: val, batasMin: val, batasMax: '' };
  }
  if (str.startsWith('<')) {
    const val = str.replace(/^<+/, '').trim();
    return { operator: '<', nilai: val, batasMin: '', batasMax: val };
  }
  if (str.startsWith('>')) {
    const val = str.replace(/^>+/, '').trim();
    return { operator: '>', nilai: val, batasMin: val, batasMax: '' };
  }
  if (str.startsWith('=')) {
    const val = str.replace(/^=+/, '').trim();
    return { operator: '=', nilai: val, batasMin: val, batasMax: val };
  }
  return { operator: '<=', nilai: str, batasMin: '', batasMax: str };
};

const getFormattedPatokan = (param: ParameterItem) => {
  if (param.operator === 'rentang') {
    if (param.batasMin || param.batasMax) {
      return `${param.batasMin || '0'} - ${param.batasMax || '0'} ${param.satuan || ''}`.trim();
    }
    return '-';
  }
  const val = (param.nilai || '').trim();
  if (!val) return '-';
  const sym = param.operator === '<=' ? '≤' : param.operator === '>=' ? '≥' : param.operator;
  return `${sym} ${val} ${param.satuan || ''}`.trim();
};

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

  // Multi-select state for commodities & varieties
  const [selectedKomoditas, setSelectedKomoditas] = useState<string[]>(['Semua Komoditas']);
  const [selectedVarietas, setSelectedVarietas] = useState<string[]>(['Semua Varietas']);

  // Reference data for dropdowns
  const { options: lookupOptions } = useQcLookups(['JENIS_UJI', 'TIPE_BENIH', 'SATUAN_PARAMETER']);
  const [masterParamNames, setMasterParamNames] = useState<string[]>([]);
  const [referenceStandards, setReferenceStandards] = useState<any[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [varieties, setVarieties] = useState<Variety[]>([]);

  useEffect(() => {
    qcService
      .getParameters()
      .then((res) => setMasterParamNames([...new Set((res.data || []).map((p) => p.nama))].sort()))
      .catch((err) => console.error('Error fetching parameter names', err));
  }, []);

  /** Opsi lookup + nilai lama yang tidak ada di master agar tetap tampil. */
  const withCurrent = (opts: { value: string; label: string }[], current?: string) =>
    current && !opts.some((o) => o.value === current) ? [...opts, { value: current, label: current }] : opts;

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
        alatDigunakan: initialData.alatDigunakan || '',
        prosedur: initialData.deskripsi || '', // map prosedur to deskripsi
        versiMetode: initialData.versiMetode || '',
        tanggalBerlaku: formattedInitialDate,
        catatan: initialData.catatan || '',
      });
      // Extract parameters if any
      if (initialData.testParameters) {
        const mappedParams = initialData.testParameters.map((p: any) => {
          const parsed = parseBatasAcuan(p.batasAcuan);
          return {
            id: p.id || Math.random().toString(),
            parameter: p.nama || '',
            kategori: p.kategori || null,
            satuan: p.satuan || '',
            operator: parsed.operator,
            nilai: parsed.nilai,
            batasMin: parsed.batasMin,
            batasMax: parsed.batasMax,
          };
        });
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
      setParameters([{ id: '1', parameter: '', satuan: '%', operator: '<=', nilai: '', batasMin: '', batasMax: '' }]);
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
      const res = await commodityService.getCommodities({ pageSize: 1000 });
      setCommodities(res.data || []);
    } catch (error) {
      console.error("Error fetching commodities", error);
    }
  };

  const fetchVarieties = async () => {
    try {
      const res = await varietyService.getVarieties({ pageSize: 1000 });
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
    setParameters([
      ...parameters,
      {
        id: Math.random().toString(),
        parameter: '',
        satuan: '%',
        operator: '<=',
        nilai: '',
        batasMin: '',
        batasMax: '',
      }
    ]);
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
          .map((p, idx) => {
            let batasAcuanStr = '';
            if (p.operator === 'rentang') {
              const min = p.batasMin?.trim() || '0';
              const max = p.batasMax?.trim() || '0';
              batasAcuanStr = `${min} - ${max}`;
            } else {
              const val = (p.nilai?.trim() || p.batasMax?.trim() || p.batasMin?.trim() || '').replace(/^[=<>≤≥\s]+/, '');
              if (val) {
                const sym = p.operator === '<=' ? '≤' : p.operator === '>=' ? '≥' : p.operator;
                batasAcuanStr = `${sym} ${val}`;
              }
            }

            return {
              id: p.id && !p.id.startsWith('temp-') && p.id.length > 10 ? p.id : undefined,
              nama: p.parameter.trim(),
              kategori: p.kategori || null,
              satuan: p.satuan?.trim() || null,
              batasAcuan: batasAcuanStr || null,
              batasMin: p.operator === 'rentang' ? (p.batasMin?.trim() || null) : null,
              batasMax: p.operator === 'rentang' ? (p.batasMax?.trim() || null) : (p.nilai?.trim() || null),
            };
          }),
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
      <ToastContainer position="top-right" autoClose={3000} theme="colored" style={{ zIndex: 10050 }} />

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
                    {withCurrent(lookupOptions('JENIS_UJI'), formData.jenisUji).map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
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
                    {withCurrent(lookupOptions('TIPE_BENIH'), formData.tipe).map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
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
              {parameters.map((param, index) => {
                const previewPatokan = getFormattedPatokan(param);
                return (
                  <div
                    key={param.id}
                    className="p-3.5 mb-3 bg-gray-50/70 hover:bg-gray-50 rounded-xl border border-defaultborder transition-colors space-y-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      {/* Parameter */}
                      <div className="md:col-span-3">
                        <label className="form-label text-xs font-semibold text-gray-700 mb-1 block">
                          Parameter <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          list={`param-suggestions-${index}`}
                          value={param.parameter}
                          onChange={(e) => updateParameter(index, 'parameter', e.target.value)}
                          className="form-control text-sm h-[38px]"
                          placeholder="Pilih / ketik nama parameter"
                        />
                        <datalist id={`param-suggestions-${index}`}>
                          {masterParamNames.map((nama) => (
                            <option key={nama} value={nama} />
                          ))}
                        </datalist>
                      </div>

                      {/* Satuan */}
                      <div className="md:col-span-2">
                        <label className="form-label text-xs font-semibold text-gray-700 mb-1 block">
                          Satuan <span className="text-danger">*</span>
                        </label>
                        <select
                          value={param.satuan}
                          onChange={(e) => updateParameter(index, 'satuan', e.target.value)}
                          className="form-select text-sm h-[38px]"
                        >
                          <option value="">Pilih Satuan</option>
                          {withCurrent(lookupOptions('SATUAN_PARAMETER'), param.satuan).map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Operator */}
                      <div className="md:col-span-2">
                        <label className="form-label text-xs font-semibold text-gray-700 mb-1 block">
                          Operator <span className="text-danger">*</span>
                        </label>
                        <select
                          value={param.operator}
                          onChange={(e) => updateParameter(index, 'operator', e.target.value)}
                          className="form-select text-sm h-[38px] font-medium text-gray-800"
                        >
                          <option value="<=">(≤)</option>
                          <option value=">=">(≥)</option>
                          <option value="<">(&lt;)</option>
                          <option value=">">(&gt;)</option>
                          <option value="=">(=)</option>
                          <option value="rentang">(Min - Maks)</option>
                        </select>
                      </div>

                      {/* Nilai / Batas Acuan */}
                      <div className="md:col-span-4">
                        {param.operator === 'rentang' ? (
                          <div>
                            <label className="form-label text-xs font-semibold text-gray-700 mb-1 block">
                              Batas Acuan (Min - Maks) <span className="text-danger">*</span>
                            </label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={param.batasMin}
                                onChange={(e) => updateParameter(index, 'batasMin', e.target.value)}
                                className="form-control text-sm h-[38px]"
                                placeholder="Min (cth: 6.0)"
                              />
                              <span className="text-gray-400 font-semibold text-xs">-</span>
                              <input
                                type="text"
                                value={param.batasMax}
                                onChange={(e) => updateParameter(index, 'batasMax', e.target.value)}
                                className="form-control text-sm h-[38px]"
                                placeholder="Maks (cth: 7.5)"
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label className="form-label text-xs font-semibold text-gray-700 mb-1 block">
                              Nilai Acuan <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <div className="input-group-text font-bold text-sm bg-gray-100 text-gray-700 min-w-[38px] flex items-center justify-center">
                                {param.operator === '<=' ? '≤' : param.operator === '>=' ? '≥' : param.operator}
                              </div>
                              <input
                                type="text"
                                value={param.nilai}
                                onChange={(e) => updateParameter(index, 'nilai', e.target.value)}
                                className="form-control text-sm h-[38px]"
                                placeholder="Nilai (cth: 8.0)"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Tombol Hapus */}
                      <div className="md:col-span-1 flex justify-center pb-0.5">
                        <button
                          type="button"
                          onClick={() => removeParameter(index)}
                          className={iconButtonClass("rose", "!w-[38px] !h-[38px]")}
                          title="Hapus parameter ini"
                        >
                          <i className="ri-delete-bin-line text-sm"></i>
                        </button>
                      </div>
                    </div>

                    {/* Preview Patokan Bar */}
                    <div className="flex items-center justify-between text-xs pt-1 px-1 border-t border-gray-200/60">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 font-medium text-[11px]">Hasil Patokan Standar:</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded text-xs">
                          <i className="ri-checkbox-circle-line text-emerald-600 text-[11px]"></i>
                          {previewPatokan}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {param.operator === 'rentang' ? 'Format rentang toleransi' : `Operator ${param.operator}`}
                      </span>
                    </div>
                  </div>
                );
              })}

              <button type="button" onClick={addParameter} className={buttonClass("outline", "md", "mt-2")}>
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

          <DokumenTerkaitSection
            documents={dokumenList}
            onChange={setDokumenList}
            isUploading={isUploading}
            onUploadingChange={setIsUploading}
          />

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
