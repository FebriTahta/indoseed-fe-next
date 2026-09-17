import { useState, useEffect, useCallback } from 'react';
import { PerencanaanProduksi, PerencanaanStats } from '@/app/types/perencanaanProduksi';
import { perencanaanProduksiService } from '@/app/services/perencanaanProduksiService';
import { commodityService } from '@/app/services/commodityService';
import { varietyService } from '@/app/services/varietyService';
import { partnerService } from '@/app/services/partnerService';
import Swal from 'sweetalert2';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';
import { Partner } from '../types/partner';

export function usePerencanaanProduksi() {
  const [items, setItems] = useState<PerencanaanProduksi[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [komoditasOption, setKomoditasOption] = useState<any[]>([]);
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [varietasOption, setVarietasOption] = useState<any[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnersOption, setPartnersOption] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<PerencanaanProduksi | null>(null);

  const [stats, setStats] = useState<PerencanaanStats>({
    totalRencana: 12,
    totalTargetProduksi: 4850,
    totalAktualProduksi: 3450,
    totalKebutuhanBenih: 2850,
    totalLuasLahan: 25,
    jumlahPetani: 8,
    persenTerpenuhiRataRata: 71.1
  });

  // Filters
  const [search, setSearch] = useState<string>('');
  const [periode, setPeriode] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [komoditas, setKomoditas] = useState<string>('');
  const [varietas, setVarietas] = useState<string>('');
  const [namaPetani, setNamaPetani] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modals
  const [isTambahModalOpen, setIsTambahModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isCetakModalOpen, setIsCetakModalOpen] = useState<boolean>(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await perencanaanProduksiService.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await perencanaanProduksiService.getList({
        search: search || undefined,
        periode: periode || undefined,
        status: status || undefined,
        komoditas: komoditas || undefined,
        varietas: varietas || undefined,
        namaPetani: namaPetani || undefined,
        page: currentPage,
        limit: pageSize
      });

      const commodities = await commodityService.getCommodities({});

      setCommodities(commodities.data);

      if (res.success) {
        setItems(res.data);
        setTotalRecords(res.meta.total);
        setTotalPages(res.meta.totalPages);

        // Keep selected item synced if already selected
        if (res.data.length > 0) {
          setSelectedItem((prev) => {
            if (prev) {
              const matched = res.data.find((x) => x.id === prev.id);
              if (matched) return matched;
            }
            return null;
          });
        }
      } else {
        setError('Gagal memuat data');
      }
    } catch (err: any) {
      console.error('Error fetching perencanaan produksi:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  }, [search, periode, status, komoditas, varietas, namaPetani, currentPage, pageSize]);

  useEffect(() => {
    const options = commodities.map((item) => ({
      value: item.id,
      label: item.namaKomoditas,
    }));

    setKomoditasOption(options);
  }, [commodities]);

  useEffect(() => {
    const options = varieties.map((item) => ({
      value: item.id,
      label: item.namaVarietas,
    }));

    setVarietasOption(options);

    const options2 = partners.map((item) => ({
      value: item.id,
      label: item.namaPetani,
    }));

    setPartnersOption(options2);
  }, [varieties, partners]);

  useEffect(() => {
    const fetchData = async () => {
      const varieties = await varietyService.getVarieties({
        commodityId: komoditas
      });

      setVarieties(varieties.data);

      const partners = await partnerService.getPartners({});

      setPartners(partners.data);
    };

    fetchData();

  }, [komoditas])

  useEffect(() => {
    fetchData();
    fetchStats();
  }, [fetchData, fetchStats]);

  const handleResetFilters = () => {
    setSearch('');
    setPeriode('');
    setStatus('');
    setKomoditas('');
    setVarietas('');
    setNamaPetani('');
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchData();
  };

  const handleDelete = async (id: string, noPerencanaan: string) => {
    const confirm = await Swal.fire({
      title: 'Konfirmasi Hapus',
      text: `Apakah Anda yakin ingin menghapus Rencana Produksi ${noPerencanaan}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await perencanaanProduksiService.delete(id);
        if (res.success) {
          Swal.fire({
            title: 'Berhasil!',
            text: `Rencana produksi ${noPerencanaan} berhasil dihapus.`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          setSelectedItem(null);
          fetchData();
          fetchStats();
        }
      } catch (err: any) {
        Swal.fire('Error', err.message || 'Gagal menghapus rencana produksi', 'error');
      }
    }
  };

  return {
    items,
    loading,
    error,
    stats,
    selectedItem,
    setSelectedItem,
    // Filters
    search,
    setSearch,
    periode,
    setPeriode,
    status,
    setStatus,
    komoditas,
    setKomoditas,
    komoditasOption,
    varietas,
    setVarietas,
    varietasOption,
    namaPetani,
    setNamaPetani,
    partnersOption,
    handleResetFilters,
    handleApplyFilters,
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    // Modals
    isTambahModalOpen,
    setIsTambahModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isCetakModalOpen,
    setIsCetakModalOpen,
    handleDelete,
    refreshData: () => {
      fetchData();
      fetchStats();
    }
  };
}
