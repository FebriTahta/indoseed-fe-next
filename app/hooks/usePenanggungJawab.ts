"use client";
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import penanggungJawabService from '../services/penanggungJawabService';
import { PenanggungJawab } from '../types/penanggungJawab';

export function usePenanggungJawab() {
  const [penanggungJawabList, setPenanggungJawabList] = useState<PenanggungJawab[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  // Filters & Pagination
  const [search, setSearch] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<PenanggungJawab | null>(null);

  // Delete Confirm Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<PenanggungJawab | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  // Form Values - only nama as requested
  const [formValues, setFormValues] = useState<{
    nama: string;
    status: string;
  }>({
    nama: '',
    status: 'Aktif',
  });

  const [formErrors, setFormErrors] = useState<{
    nama?: string;
  }>({});

  // Status Filter Options
  const statusOptions = [
    { value: 'ALL', label: 'Semua Status' },
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Nonaktif', label: 'Nonaktif' },
  ];

  // Fetch list
  const fetchPenanggungJawab = useCallback(async () => {
    setIsTableLoading(true);
    try {
      const res = await penanggungJawabService.getPenanggungJawab({
        search: search.trim() || undefined,
        status: filterStatus === 'ALL' ? undefined : filterStatus,
        page: currentPage,
        pageSize,
      });

      if (res.status === 'success') {
        setPenanggungJawabList(res.data || []);
        if (res.pagination) {
          setTotalRecords(res.pagination.totalItems);
          setTotalPages(res.pagination.totalPages);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch penanggung jawab:', err);
      toast.error(err.response?.data?.message || 'Gagal memuat data penanggung jawab');
    } finally {
      setIsTableLoading(false);
      setLoading(false);
    }
  }, [search, filterStatus, currentPage, pageSize]);

  // Debounced search / filter change triggers fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPenanggungJawab();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchPenanggungJawab]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode('create');
    setSelectedItem(null);
    setFormValues({
      nama: '',
      status: 'Aktif',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: PenanggungJawab) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormValues({
      nama: item.nama,
      status: item.status || 'Aktif',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (item: PenanggungJawab) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setFilterStatus('ALL');
    setCurrentPage(1);
  };

  // Save Modal (Create / Edit)
  const handleSaveModal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formValues.nama.trim()) {
      setFormErrors({ nama: 'Nama penanggung jawab wajib diisi' });
      return;
    }

    setIsSubmitLoading(true);
    try {
      if (modalMode === 'create') {
        const res = await penanggungJawabService.createPenanggungJawab({
          nama: formValues.nama.trim(),
          status: formValues.status,
        });

        if (res.status === 'success') {
          toast.success('Penanggung jawab berhasil ditambahkan');
          setIsModalOpen(false);
          fetchPenanggungJawab();
        }
      } else if (modalMode === 'edit' && selectedItem) {
        const res = await penanggungJawabService.updatePenanggungJawab(selectedItem.id, {
          nama: formValues.nama.trim(),
          status: formValues.status,
        });

        if (res.status === 'success') {
          toast.success('Penanggung jawab berhasil diperbarui');
          setIsModalOpen(false);
          fetchPenanggungJawab();
        }
      }
    } catch (err: any) {
      console.error('Failed to save penanggung jawab:', err);
      toast.error(err.response?.data?.message || 'Gagal menyimpan data penanggung jawab');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleteLoading(true);
    try {
      const res = await penanggungJawabService.deletePenanggungJawab(itemToDelete.id);
      if (res.status === 'success') {
        toast.success('Penanggung jawab berhasil dihapus');
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        fetchPenanggungJawab();
      }
    } catch (err: any) {
      console.error('Failed to delete penanggung jawab:', err);
      toast.error(err.response?.data?.message || 'Gagal menghapus penanggung jawab');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return {
    penanggungJawabList,
    loading,
    isTableLoading,
    isSubmitLoading,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    statusOptions,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    isModalOpen,
    setIsModalOpen,
    modalMode,
    selectedItem,
    formValues,
    setFormValues,
    formErrors,
    setFormErrors,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    itemToDelete,
    isDeleteLoading,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleResetFilters,
    handleSaveModal,
    handleConfirmDelete,
    fetchPenanggungJawab,
  };
}

export default usePenanggungJawab;
