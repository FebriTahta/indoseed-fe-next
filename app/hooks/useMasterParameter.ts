"use client";
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import parameterService from '../services/parameterService';
import { MasterParameter, CreateMasterParameterPayload, MasterParameterOption } from '../types/parameter';

export function useMasterParameter() {
  const [parameters, setParameters] = useState<MasterParameter[]>([]);
  const [modulList, setModulList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  // Filters & Pagination
  const [search, setSearch] = useState<string>('');
  const [filterModul, setFilterModul] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedParam, setSelectedParam] = useState<MasterParameter | null>(null);

  // Form State
  const [formValues, setFormValues] = useState<{
    kode: string;
    nama: string;
    namaModul: string;
    tipeNilai: 'NUMBER' | 'TEXT' | 'OPTION' | 'RANGE' | 'BOOLEAN';
    satuan: string;
    batasLulus: string | number | null;
    deskripsi: string;
    status: string;
    options: MasterParameterOption[];
  }>({
    kode: '',
    nama: '',
    namaModul: 'UMUM',
    tipeNilai: 'NUMBER',
    satuan: '',
    batasLulus: '',
    deskripsi: '',
    status: 'Aktif',
    options: [],
  });

  // Fetch Modul List
  const fetchModuls = useCallback(async () => {
    try {
      const res = await parameterService.getModulList();
      if (res.status === 'success' && res.data) {
        setModulList(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch moduls:', err);
    }
  }, []);

  // Fetch Master Parameters
  const fetchParameters = useCallback(async () => {
    setIsTableLoading(true);
    try {
      const res = await parameterService.getParameters({
        search: search.trim() || undefined,
        namaModul: filterModul !== 'ALL' ? filterModul : undefined,
        status: filterStatus !== 'ALL' ? filterStatus : undefined,
        page: currentPage,
        pageSize,
      });

      if (res.status === 'success' && res.data) {
        setParameters(res.data);
        if (res.pagination) {
          setTotalRecords(res.pagination.totalItems);
          setTotalPages(res.pagination.totalPages);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch master parameters:', err);
      toast.error(err.response?.data?.message || 'Gagal memuat data parameter');
    } finally {
      setIsTableLoading(false);
      setLoading(false);
    }
  }, [search, filterModul, filterStatus, currentPage, pageSize]);

  useEffect(() => {
    fetchModuls();
  }, [fetchModuls]);

  useEffect(() => {
    fetchParameters();
  }, [fetchParameters]);

  const handleResetFilters = () => {
    setSearch('');
    setFilterModul('ALL');
    setFilterStatus('ALL');
    setCurrentPage(1);
  };

  const handleOpenAddModal = () => {
    setModalMode('create');
    setSelectedParam(null);
    setFormValues({
      kode: '',
      nama: '',
      namaModul: 'UMUM',
      tipeNilai: 'NUMBER',
      satuan: '',
      batasLulus: '',
      deskripsi: '',
      status: 'Aktif',
      options: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (param: MasterParameter) => {
    setModalMode('edit');
    setSelectedParam(param);
    setFormValues({
      kode: param.kode,
      nama: param.nama,
      namaModul: param.namaModul,
      tipeNilai: param.tipeNilai,
      satuan: param.satuan || '',
      batasLulus: param.batasLulus || '',
      deskripsi: param.deskripsi || '',
      status: param.status || 'Aktif',
      options: param.options ? param.options.map((opt) => ({ ...opt })) : [],
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.kode || !formValues.nama) {
      toast.error('Kode dan Nama Parameter wajib diisi');
      return;
    }

    if (formValues.tipeNilai === 'OPTION' && formValues.options.length === 0) {
      toast.error('Parameter tipe OPTION harus memiliki minimal 1 opsi');
      return;
    }

    setIsSubmitLoading(true);

    try {
      const payload: CreateMasterParameterPayload = {
        kode: formValues.kode.trim().toUpperCase(),
        nama: formValues.nama.trim(),
        namaModul: formValues.namaModul.trim().toUpperCase(),
        tipeNilai: formValues.tipeNilai,
        satuan: formValues.satuan ? formValues.satuan.trim() : undefined,
        batasLulus: formValues.batasLulus !== '' && formValues.batasLulus != null ? Number(formValues.batasLulus) : null,
        deskripsi: formValues.deskripsi ? formValues.deskripsi.trim() : undefined,
        status: formValues.status,
        options:
          formValues.tipeNilai === 'OPTION'
            ? formValues.options.map((opt, idx) => ({
                kode: opt.kode ? opt.kode.trim().toUpperCase() : `OPT_${idx + 1}`,
                nama: opt.nama.trim(),
                urutan: opt.urutan ?? idx + 1,
                status: opt.status || 'Aktif',
              }))
            : undefined,
      };

      if (modalMode === 'create') {
        await parameterService.createParameter(payload);
        toast.success('Master parameter berhasil ditambahkan');
      } else if (selectedParam) {
        await parameterService.updateParameter(selectedParam.id, payload);
        toast.success('Master parameter berhasil diperbarui');
      }

      setIsModalOpen(false);
      fetchParameters();
      fetchModuls();
    } catch (err: any) {
      console.error('Failed to save master parameter:', err);
      toast.error(err.response?.data?.message || 'Gagal menyimpan master parameter');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDeleteParameter = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus parameter ini?')) return;

    try {
      await parameterService.deleteParameter(id);
      toast.success('Parameter berhasil dihapus');
      fetchParameters();
    } catch (err: any) {
      console.error('Failed to delete master parameter:', err);
      toast.error(err.response?.data?.message || 'Gagal menghapus parameter');
    }
  };

  return {
    loading,
    isTableLoading,
    isSubmitLoading,
    parameters,
    modulList,
    search,
    setSearch,
    filterModul,
    setFilterModul,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    isModalOpen,
    setIsModalOpen,
    modalMode,
    selectedParam,
    formValues,
    setFormValues,
    handleResetFilters,
    handleOpenAddModal,
    handleOpenEditModal,
    handleSaveModal,
    handleDeleteParameter,
    refreshParameters: fetchParameters,
  };
}
