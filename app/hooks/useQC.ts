import { useState, useEffect, useMemo } from 'react';
import { qcService } from '../services/qcService';
import { ReferenceStandard, TestMethod, TestParameter } from '../types/qc';
import { toast } from 'react-toastify';

export const useQC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [standards, setStandards] = useState<ReferenceStandard[]>([]);
  const [methods, setMethods] = useState<TestMethod[]>([]);
  const [parameters, setParameters] = useState<TestParameter[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentStandards, setDocumentStandards] = useState<ReferenceStandard[]>([]);

  // Modals and Drawers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [activeTab, setActiveTab] = useState<'parameter' | 'method' | 'standard' | 'document'>('parameter');
  // Selection
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Search and filters
  const [search, setSearch] = useState('');

  const fetchStandards = async () => {
    try {
      setLoading(true);
      const res = await qcService.getStandards();
      setStandards(res.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengambil data standar');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentStandards = async () => {
    try {
      setLoading(true);
      const res = await qcService.getStandards(true);
      setDocumentStandards(res.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengambil data standar dokumen');
    } finally {
      setLoading(false);
    }
  };

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const res = await qcService.getMethods();
      setMethods(res.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengambil data metode');
    } finally {
      setLoading(false);
    }
  };

  const fetchParameters = async () => {
    try {
      setLoading(true);
      const res = await qcService.getParameters();
      setParameters(res.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengambil data parameter');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await qcService.getDocuments();
      setDocuments(res.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengambil data dokumen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'parameter') {
      fetchParameters();
      fetchStandards();
      fetchMethods();
    } else if (activeTab === 'method') {
      fetchMethods();
      fetchStandards();
      fetchDocuments();
    } else if (activeTab === 'standard') {
      fetchStandards();
      fetchDocuments();
    } else if (activeTab === 'document') {
      fetchDocuments();
      fetchStandards();
      fetchDocumentStandards();
      fetchMethods();
    }
  }, [activeTab]);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setModalMode('edit');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  /**
   * Create a new item based on activeTab.
   * For 'standard' tab, the modal sends { jenis, ...fields }.
   * jenis === 'Standar Acuan' → call createStandard
   * jenis === 'Metode Uji'    → call createMethod
   */
  const handleCreate = async (data: any, currentTab?: string) => {
    const tab = currentTab || activeTab;
    try {
      setLoading(true);
      if (tab === 'parameter') {
        // Map terkaitTipe/terkaitId to standarId/metodeId
        const payload: any = { ...data };
        if (data.terkaitTipe === 'standar') {
          payload.standarId = data.terkaitId;
        } else if (data.terkaitTipe === 'metode') {
          payload.metodeId = data.terkaitId;
        }
        delete payload.terkaitTipe;
        delete payload.terkaitId;
        await qcService.createParameter(payload);
        toast.success('Parameter berhasil ditambahkan');
        fetchParameters();
      } else if (tab === 'method') {
        await qcService.createMethod(data);
        toast.success('Metode berhasil ditambahkan');
        fetchMethods();
      } else if (tab === 'standard') {
        const isMethod = data.jenis === 'Metode Uji';
        const { jenis, ...payload } = data;
        if (isMethod) {
          await qcService.createMethod(payload);
          toast.success('Metode Uji berhasil ditambahkan');
          fetchMethods();
        } else {
          await qcService.createStandard(payload);
          toast.success('Standar Acuan berhasil ditambahkan');
          fetchStandards();
        }
      } else if (tab === 'document') {
        await qcService.createDocument(data);
        toast.success('Dokumen berhasil ditambahkan');
        fetchDocuments();
      }
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing item based on activeTab.
   */
  const handleUpdate = async (data: any, currentTab?: string) => {
    if (!selectedItem?.id) {
      toast.error('Data yang diedit tidak ditemukan');
      return;
    }
    const tab = currentTab || activeTab;
    try {
      setLoading(true);
      if (tab === 'parameter') {
        const payload: any = { ...data };
        if (data.terkaitTipe === 'standar') {
          payload.standarId = data.terkaitId;
          payload.metodeId = null;
        } else if (data.terkaitTipe === 'metode') {
          payload.metodeId = data.terkaitId;
          payload.standarId = null;
        }
        delete payload.terkaitTipe;
        delete payload.terkaitId;
        await qcService.updateParameter(selectedItem.id, payload);
        toast.success('Parameter berhasil diperbarui');
        fetchParameters();
      } else if (tab === 'method') {
        await qcService.updateMethod(selectedItem.id, data);
        toast.success('Metode berhasil diperbarui');
        fetchMethods();
      } else if (tab === 'standard') {
        // Determine which service to call based on jenis field or original item type
        const isMethod = data.jenis === 'Metode Uji' || selectedItem.standarId !== undefined;
        const { jenis, ...payload } = data;
        if (isMethod) {
          await qcService.updateMethod(selectedItem.id, payload);
          toast.success('Metode Uji berhasil diperbarui');
          fetchMethods();
        } else {
          await qcService.updateStandard(selectedItem.id, payload);
          toast.success('Standar Acuan berhasil diperbarui');
          fetchStandards();
        }
      } else if (tab === 'document') {
        await qcService.updateDocument(selectedItem.id, data);
        toast.success('Dokumen berhasil diperbarui');
        fetchDocuments();
      }
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        setLoading(true);
        if (type === 'parameter') {
          await qcService.deleteParameter(id);
          fetchParameters();
        } else if (type === 'method') {
          await qcService.deleteMethod(id);
          fetchMethods();
        } else if (type === 'standard') {
          await qcService.deleteStandard(id);
          fetchStandards();
        } else if (type === 'document') {
          await qcService.deleteDocument(id);
          fetchDocuments();
        }
        toast.success('Data berhasil dihapus');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Gagal menghapus data');
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    loading,
    error,
    standards,
    documentStandards,
    methods,
    parameters,
    documents,
    activeTab,
    setActiveTab,
    isModalOpen,
    setIsModalOpen,
    modalMode,
    setModalMode,
    selectedItem,
    setSelectedItem,
    search,
    setSearch,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCreate,
    handleUpdate,
    handleDelete,
    fetchStandards,
    fetchMethods,
    fetchParameters,
    fetchDocuments
  };
};
