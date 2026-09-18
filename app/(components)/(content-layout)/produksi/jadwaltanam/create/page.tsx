"use client";

import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Seo from '@/shared/layouts-components/seo/seo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { partnerService } from '@/app/services/partnerService';
import { commodityService } from '@/app/services/commodityService';
import { varietyService } from '@/app/services/varietyService';
import { greenhouseService } from '@/app/services/greenhouseService';
import { perencanaanProduksiService } from '@/app/services/perencanaanProduksiService';
import { jadwalTanamService } from '@/app/services/jadwalTanamService';
import { JadwalTanamDetail } from '@/app/types/jadwalTanam';

export default function CreateJadwalTanamPage() {
  const router = useRouter();

  // Master Data Lists
  const [partners, setPartners] = useState<any[]>([]);
  const [commodities, setCommodities] = useState<any[]>([]);
  const [varieties, setVarieties] = useState<any[]>([]);
  const [greenhouses, setGreenhouses] = useState<any[]>([]);
  const [perencanaanList, setPerencanaanList] = useState<any[]>([]);
  const [loadingMaster, setLoadingMaster] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State - Section 1: Informasi Utama
  const [kodeJadwalTanam, setKodeJadwalTanam] = useState('');
  const [selectedPerencanaanId, setSelectedPerencanaanId] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

  // Form State - Section 2: Data Petani & Lahan
  const [partnerId, setPartnerId] = useState('');
  const [namaPetani, setNamaPetani] = useState('');
  const [kodePetani, setKodePetani] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);

  const [greenhouseId, setGreenhouseId] = useState('');
  const [namaLahan, setNamaLahan] = useState('');
  const [selectedLand, setSelectedLand] = useState<any | null>(null);

  // Form State - Section 3: Data Tanam
  const [tanggalTanam, setTanggalTanam] = useState('');
  const [perkiraanPanen, setPerkiraanPanen] = useState('');
  const [metodeTanam, setMetodeTanam] = useState('');
  const [luasTanam, setLuasTanam] = useState<number | string>('');
  const [commodityId, setCommodityId] = useState('');
  const [komoditas, setKomoditas] = useState('');
  const [varietyId, setVarietyId] = useState('');
  const [varietas, setVarietas] = useState('');
  const [selectedVariety, setSelectedVariety] = useState<any | null>(null);
  const [keterangan, setKeterangan] = useState('');

  // Form State - Section 4: Estimasi Hasil
  const [estimasiHasilPerHa, setEstimasiHasilPerHa] = useState<number | string>('');

  // Right Sidebar States
  const [statusJadwal, setStatusJadwal] = useState('Draft');
  const [targetProduksi, setTargetProduksi] = useState<number | string>('');

  // Load Master Data & Initial Next Code
  useEffect(() => {
    async function init() {
      setLoadingMaster(true);
      try {
        const [nextCodeRes, partRes, commRes, varRes, ghRes, planRes] = await Promise.all([
          jadwalTanamService.getNextKodeJadwalTanam().catch(() => ({ data: { nextKodeJadwalTanam: 'JT-2026-011' } })),
          partnerService.getPartners({ pageSize: 100, status: 'Aktif' }).catch(() => ({ data: [] })),
          commodityService.getCommodities({ status: 'Aktif' }).catch(() => ({ data: [] })),
          varietyService.getVarieties({ status: 'Aktif' }).catch(() => ({ data: [] })),
          greenhouseService.getLands({ pageSize: 100, status: 'Aktif' }).catch(() => ({ data: [] })),
          perencanaanProduksiService.getList({ limit: 100 }).catch(() => ({ data: [] })),
        ]);

        if (nextCodeRes?.data?.nextKodeJadwalTanam) {
          setKodeJadwalTanam(nextCodeRes.data.nextKodeJadwalTanam);
        } else {
          setKodeJadwalTanam('JT-2026-011');
        }

        setPartners(partRes?.data || []);
        setCommodities(commRes?.data || []);
        setVarieties(varRes?.data || []);
        setGreenhouses(ghRes?.data || []);
        setPerencanaanList(planRes?.data || []);
      } catch (err) {
        console.error('Error loading master data:', err);
      } finally {
        setLoadingMaster(false);
      }
    }
    init();
  }, []);

  // Handler Generate Code
  const handleGenerateCode = async () => {
    try {
      const res = await jadwalTanamService.getNextKodeJadwalTanam();
      if (res?.data?.nextKodeJadwalTanam) {
        setKodeJadwalTanam(res.data.nextKodeJadwalTanam);
        toast.info(`Kode baru: ${res.data.nextKodeJadwalTanam}`);
      } else {
        const randomSeq = String(Math.floor(Math.random() * 900) + 100);
        setKodeJadwalTanam(`JT-2026-${randomSeq}`);
      }
    } catch {
      const randomSeq = String(Math.floor(Math.random() * 900) + 100);
      setKodeJadwalTanam(`JT-2026-${randomSeq}`);
    }
  };

  // Helper calculate harvest date from plant date + variety days
  const calculateHarvestDate = (plantDateStr: string, varietyObj: any) => {
    if (!plantDateStr) return '';
    let days = 90; // default 90 days
    if (varietyObj?.umurTanam) {
      const match = String(varietyObj.umurTanam).match(/\d+/g);
      if (match && match.length > 0) {
        days = parseInt(match[match.length - 1], 10);
      }
    }
    const d = new Date(plantDateStr);
    if (isNaN(d.getTime())) return '';
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  // Filtered partners based on selected Perencanaan Produksi
  const availablePartners = useMemo(() => {
    // If no perencanaan is selected or standalone is chosen, allow choosing any active partner
    if (!selectedPerencanaanId || selectedPerencanaanId === 'standalone' || !selectedPlan) {
      return partners;
    }

    const registered: any[] = [];
    const registeredIds = new Set<string>();

    // 1. Check petaniDistribusi in selectedPlan
    if (selectedPlan.petaniDistribusi && Array.isArray(selectedPlan.petaniDistribusi)) {
      selectedPlan.petaniDistribusi.forEach((dist: any) => {
        const pId = dist.partnerId || (dist.partner ? dist.partner.id : null);
        if (pId) {
          if (!registeredIds.has(pId)) {
            registeredIds.add(pId);
            const foundInMaster = partners.find((p) => p.id === pId);
            if (foundInMaster) {
              registered.push(foundInMaster);
            } else if (dist.partner) {
              registered.push(dist.partner);
            } else {
              registered.push({
                id: pId,
                namaPetani: dist.namaPetani,
                kodePetani: dist.kodePetani || '',
                alamat: dist.alamat || '-',
                noTelepon: dist.noTelepon || dist.telepon || '-',
              });
            }
          }
        } else if (dist.namaPetani) {
          const foundByName = partners.find((p) => p.namaPetani.toLowerCase() === dist.namaPetani.toLowerCase());
          if (foundByName && !registeredIds.has(foundByName.id)) {
            registeredIds.add(foundByName.id);
            registered.push(foundByName);
          } else if (!registeredIds.has(dist.namaPetani)) {
            registeredIds.add(dist.namaPetani);
            registered.push({
              id: `dist-${dist.namaPetani}`,
              namaPetani: dist.namaPetani,
              kodePetani: '',
              alamat: '-',
              noTelepon: '-',
            });
          }
        }
      });
    }

    // 2. Check header level partner in selectedPlan
    if (selectedPlan.partnerId || selectedPlan.namaPetani) {
      const pId = selectedPlan.partnerId;
      if (pId && !registeredIds.has(pId)) {
        registeredIds.add(pId);
        const found = partners.find((p) => p.id === pId);
        if (found) {
          registered.push(found);
        } else if (selectedPlan.partner) {
          registered.push(selectedPlan.partner);
        } else {
          registered.push({
            id: pId,
            namaPetani: selectedPlan.namaPetani,
            kodePetani: selectedPlan.kodePetani || '',
            alamat: '-',
            noTelepon: '-',
          });
        }
      } else if (selectedPlan.namaPetani && !pId) {
        const found = partners.find((p) => p.namaPetani.toLowerCase() === selectedPlan.namaPetani.toLowerCase());
        if (found && !registeredIds.has(found.id)) {
          registeredIds.add(found.id);
          registered.push(found);
        }
      }
    }

    return registered;
  }, [selectedPerencanaanId, selectedPlan, partners]);

  // Handle Perencanaan Produksi selection
  const handlePerencanaanChange = (planId: string) => {
    setSelectedPerencanaanId(planId);
    if (!planId || planId === 'standalone') {
      setSelectedPlan(null);
      return;
    }

    const plan = perencanaanList.find((p) => p.id === planId);
    if (!plan) return;

    setSelectedPlan(plan);

    // Auto-fill target produksi
    if (plan.targetProduksi) {
      setTargetProduksi(plan.targetProduksi);
    }
    // Auto-fill target luas lahan
    if (plan.targetLuasLahan) {
      setLuasTanam(plan.targetLuasLahan);
    }
    // Auto-fill metode tanam
    if (plan.metodeTanam) {
      setMetodeTanam(plan.metodeTanam);
    }

    // Auto-fill dates
    if (plan.periodeMulai) {
      const pMulai = new Date(plan.periodeMulai);
      if (!isNaN(pMulai.getTime())) {
        const startStr = pMulai.toISOString().split('T')[0];
        setTanggalTanam(startStr);

        if (plan.periodeSelesai) {
          const pSelesai = new Date(plan.periodeSelesai);
          if (!isNaN(pSelesai.getTime())) {
            setPerkiraanPanen(pSelesai.toISOString().split('T')[0]);
          }
        }
      }
    }

    // Auto-fill commodity
    if (plan.komoditas) {
      setKomoditas(plan.komoditas);
      const matchedComm = commodities.find((c) => c.namaKomoditas === plan.komoditas || c.id === plan.commodityId);
      if (matchedComm) setCommodityId(matchedComm.id);
    }

    // Auto-fill variety
    if (plan.varietas) {
      setVarietas(plan.varietas);
      const matchedVar = varieties.find((v) => v.namaVarietas === plan.varietas || v.id === plan.varietyId);
      if (matchedVar) {
        setVarietyId(matchedVar.id);
        setSelectedVariety(matchedVar);
        if (matchedVar.potensiHasil) {
          const potMatch = matchedVar.potensiHasil.match(/[\d.]+/);
          if (potMatch) {
            let val = parseFloat(potMatch[0]);
            if (val < 100) val = val * 1000;
            setEstimasiHasilPerHa(val);
          }
        }
      }
    }

    // Determine registered farmers in this plan
    const registered: any[] = [];
    const registeredIds = new Set<string>();

    if (plan.petaniDistribusi && Array.isArray(plan.petaniDistribusi)) {
      plan.petaniDistribusi.forEach((dist: any) => {
        const pId = dist.partnerId;
        if (pId && !registeredIds.has(pId)) {
          registeredIds.add(pId);
          const found = partners.find((p) => p.id === pId);
          if (found) registered.push(found);
          else {
            registered.push({
              id: pId,
              namaPetani: dist.namaPetani,
              kodePetani: dist.kodePetani || '',
              alamat: dist.alamat || '-',
              noTelepon: dist.noTelepon || '-',
            });
          }
        } else if (dist.namaPetani && !registeredIds.has(dist.namaPetani)) {
          registeredIds.add(dist.namaPetani);
          const found = partners.find((p) => p.namaPetani.toLowerCase() === dist.namaPetani.toLowerCase());
          if (found) registered.push(found);
          else {
            registered.push({
              id: `dist-${dist.namaPetani}`,
              namaPetani: dist.namaPetani,
              kodePetani: '',
              alamat: '-',
              noTelepon: '-',
            });
          }
        }
      });
    }

    if (plan.partnerId && !registeredIds.has(plan.partnerId)) {
      registeredIds.add(plan.partnerId);
      const found = partners.find((p) => p.id === plan.partnerId);
      if (found) registered.push(found);
      else if (plan.namaPetani) {
        registered.push({
          id: plan.partnerId,
          namaPetani: plan.namaPetani,
          kodePetani: plan.kodePetani || '',
          alamat: '-',
          noTelepon: '-',
        });
      }
    }

    // Auto-select if exactly 1 farmer registered, otherwise prompt selection
    if (registered.length === 1) {
      const single = registered[0];
      setPartnerId(single.id);
      setNamaPetani(single.namaPetani);
      setKodePetani(single.kodePetani || '');
      setSelectedPartner(single);

      // Check if dist has dedicated land & area
      const dist = plan.petaniDistribusi?.find(
        (d: any) => d.partnerId === single.id || d.namaPetani?.toLowerCase() === single.namaPetani.toLowerCase()
      ) || plan.petaniDistribusi?.[0];

      if (dist) {
        if (dist.luasLahan) setLuasTanam(dist.luasLahan);
        if (dist.targetProduksi) setTargetProduksi(dist.targetProduksi);
        if (dist.greenhouseId || dist.namaLahan) {
          const matchLand = greenhouses.find(g => g.id === dist.greenhouseId || g.namaLahan === dist.namaLahan);
          if (matchLand) {
            setGreenhouseId(matchLand.id);
            setNamaLahan(matchLand.namaLahan);
            setSelectedLand(matchLand);
          } else if (dist.namaLahan) {
            setNamaLahan(dist.namaLahan);
            setSelectedLand({
              id: dist.greenhouseId || 'custom-land',
              namaLahan: dist.namaLahan,
              kodeLahan: 'LHN-001',
              luas: (Number(dist.luasLahan) || 1) * 10000,
            });
          }
        }
      }

      toast.info(`Perencanaan ${plan.noPerencanaan} dipilih. Petani mitra otomatis diatur ke ${single.namaPetani}.`);
    } else if (registered.length > 1) {
      // Multiple registered farmers
      const currentStillValid = registered.find((r) => r.id === partnerId);
      if (currentStillValid) {
        setPartnerId(currentStillValid.id);
        setNamaPetani(currentStillValid.namaPetani);
        setKodePetani(currentStillValid.kodePetani || '');
        setSelectedPartner(currentStillValid);
      } else {
        setPartnerId('');
        setNamaPetani('');
        setKodePetani('');
        setSelectedPartner(null);
        toast.info(
          `Perencanaan ${plan.noPerencanaan} memiliki ${registered.length} petani terdaftar. Silakan pilih salah satu petani.`
        );
      }
    } else {
      setPartnerId('');
      setNamaPetani('');
      setKodePetani('');
      setSelectedPartner(null);
      toast.warning(`Perencanaan ${plan.noPerencanaan} belum memiliki petani mitra terdaftar.`);
    }
  };

  // Handle Partner Change
  const handlePartnerChange = (pId: string) => {
    setPartnerId(pId);
    const found = availablePartners.find((p) => p.id === pId) || partners.find((p) => p.id === pId);
    if (found) {
      setSelectedPartner(found);
      setNamaPetani(found.namaPetani);
      setKodePetani(found.kodePetani || '');

      // Check if selectedPlan has a distribution record specifically for this farmer!
      if (selectedPlan && selectedPlan.petaniDistribusi) {
        const dist = selectedPlan.petaniDistribusi.find(
          (d: any) => d.partnerId === found.id || d.namaPetani?.toLowerCase() === found.namaPetani?.toLowerCase()
        );
        if (dist) {
          if (dist.luasLahan) setLuasTanam(dist.luasLahan);
          if (dist.targetProduksi) setTargetProduksi(dist.targetProduksi);
          if (dist.tanggalTanam) {
            const dt = new Date(dist.tanggalTanam);
            if (!isNaN(dt.getTime())) setTanggalTanam(dt.toISOString().split('T')[0]);
          }
          if (dist.tanggalPanen) {
            const dp = new Date(dist.tanggalPanen);
            if (!isNaN(dp.getTime())) setPerkiraanPanen(dp.toISOString().split('T')[0]);
          }

          // If distribution specifies a land/greenhouse, match it!
          if (dist.greenhouseId || dist.namaLahan) {
            const matchedLand = greenhouses.find(
              (g) => g.id === dist.greenhouseId || g.namaLahan?.toLowerCase() === dist.namaLahan?.toLowerCase()
            );
            if (matchedLand) {
              setGreenhouseId(matchedLand.id);
              setNamaLahan(matchedLand.namaLahan);
              setSelectedLand(matchedLand);
            } else if (dist.namaLahan) {
              setNamaLahan(dist.namaLahan);
              setSelectedLand({
                id: dist.greenhouseId || 'custom-land',
                namaLahan: dist.namaLahan,
                kodeLahan: 'LHN-DIST',
                luas: (Number(dist.luasLahan) || 1) * 10000,
              });
            }
          }
        }
      } else {
        // Standalone mode: if partner has greenhouse, auto-select first one if not selected
        if (found.greenhouses && found.greenhouses.length > 0 && !greenhouseId) {
          const firstLand = found.greenhouses[0];
          setGreenhouseId(firstLand.id);
          setNamaLahan(firstLand.namaLahan);
          setSelectedLand(firstLand);
        }
      }
    } else {
      setSelectedPartner(null);
      setNamaPetani('');
      setKodePetani('');
    }
  };

  // Handle Land Change
  const handleLandChange = (gId: string) => {
    setGreenhouseId(gId);
    const found = greenhouses.find((g) => g.id === gId);
    if (found) {
      setSelectedLand(found);
      setNamaLahan(found.namaLahan);

      // If partner is not selected yet, and land has partner info, set it
      if (!partnerId && found.partnerId) {
        handlePartnerChange(found.partnerId);
      }
    } else {
      setSelectedLand(null);
      setNamaLahan('');
    }
  };

  // Handle Date Tanam Change
  const handleTanggalTanamChange = (newDate: string) => {
    setTanggalTanam(newDate);
    if (selectedVariety && newDate) {
      const autoHarvest = calculateHarvestDate(newDate, selectedVariety);
      if (autoHarvest) {
        setPerkiraanPanen(autoHarvest);
      }
    }
  };

  // Handle Variety Change
  const handleVarietyChange = (vId: string) => {
    setVarietyId(vId);
    const found = varieties.find((v) => v.id === vId);
    if (found) {
      setSelectedVariety(found);
      setVarietas(found.namaVarietas);

      // Auto-set commodity if not set or mismatched
      if (found.commodityId) {
        setCommodityId(found.commodityId);
        const comm = commodities.find((c) => c.id === found.commodityId);
        if (comm) setKomoditas(comm.namaKomoditas);
      }

      // Auto-calculate harvest date if plant date already specified
      if (tanggalTanam) {
        const autoHarvest = calculateHarvestDate(tanggalTanam, found);
        if (autoHarvest) {
          setPerkiraanPanen(autoHarvest);
        }
      }

      // Auto-fill estimasi hasil per Ha from potensiHasil
      if (found.potensiHasil) {
        const matches = String(found.potensiHasil).match(/[\d.]+/g);
        if (matches && matches.length > 0) {
          let val = parseFloat(matches[matches.length - 1]);
          if (val < 100) val = val * 1000; // e.g. 8.5 ton -> 8500 kg
          setEstimasiHasilPerHa(Math.round(val));
        }
      } else if (Number(targetProduksi) > 0 && Number(luasTanam) > 0) {
        setEstimasiHasilPerHa(Math.round(Number(targetProduksi) / Number(luasTanam)));
      } else if (!estimasiHasilPerHa) {
        setEstimasiHasilPerHa(5000);
      }
    } else {
      setSelectedVariety(null);
      setVarietas('');
    }
  };

  // Computations
  const totalEstimasiHasil = useMemo(() => {
    const luas = Number(luasTanam) || 0;
    const hasil = Number(estimasiHasilPerHa) || 0;
    return Math.round(luas * hasil);
  }, [luasTanam, estimasiHasilPerHa]);

  const targetProduksiNum = useMemo(() => {
    return Number(targetProduksi) || (totalEstimasiHasil > 0 ? totalEstimasiHasil : 0);
  }, [targetProduksi, totalEstimasiHasil]);

  const progressPct = useMemo(() => {
    if (!targetProduksiNum || targetProduksiNum <= 0) return 0;
    return Math.min(100, Math.round((totalEstimasiHasil / targetProduksiNum) * 100));
  }, [totalEstimasiHasil, targetProduksiNum]);

  const sisaTarget = useMemo(() => {
    return Math.max(0, targetProduksiNum - totalEstimasiHasil);
  }, [targetProduksiNum, totalEstimasiHasil]);

  // Reset Form
  const handleReset = () => {
    setSelectedPerencanaanId('');
    setSelectedPlan(null);
    setPartnerId('');
    setNamaPetani('');
    setKodePetani('');
    setSelectedPartner(null);
    setGreenhouseId('');
    setNamaLahan('');
    setSelectedLand(null);
    setTanggalTanam('');
    setPerkiraanPanen('');
    setMetodeTanam('');
    setLuasTanam('');
    setCommodityId('');
    setKomoditas('');
    setVarietyId('');
    setVarietas('');
    setSelectedVariety(null);
    setKeterangan('');
    setEstimasiHasilPerHa('');
    setStatusJadwal('Draft');
    setTargetProduksi('');
    handleGenerateCode();
    toast.info('Formulir berhasil di-reset.');
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kodeJadwalTanam.trim()) {
      toast.error('No. Jadwal Tanam wajib diisi');
      return;
    }
    if (!namaPetani.trim()) {
      toast.error('Petani Mitra wajib dipilih');
      return;
    }
    if (!namaLahan.trim()) {
      toast.error('Lahan wajib dipilih');
      return;
    }
    if (!tanggalTanam) {
      toast.error('Tanggal Tanam wajib diisi');
      return;
    }
    if (!varietas.trim()) {
      toast.error('Varietas wajib dipilih');
      return;
    }

    try {
      setIsSubmitting(true);

      const computedLuas = Number(luasTanam) || 0;
      const computedHasilHa = Number(estimasiHasilPerHa) || 0;
      const computedTarget = targetProduksiNum;

      const detailLahanPayload: JadwalTanamDetail[] = [
        {
          namaLahan: namaLahan || 'Lahan Utama',
          kodeLahan: selectedLand?.kodeLahan || 'LHN-001',
          greenhouseId: greenhouseId || null,
          komoditasVarietas: `${komoditas || '-'} / ${varietas || '-'}`.trim(),
          rencanaTanam: tanggalTanam || null,
          estimasiPanen: perkiraanPanen || null,
          luas: computedLuas * 10000 || (selectedLand?.luas ? Number(selectedLand.luas) : 10000), // in m2
          targetProduksi: computedTarget || totalEstimasiHasil || 0,
          statusLahan: 'Siap Tanam',
          keterangan: keterangan || '-',
        },
      ];

      const payload = {
        kodeJadwalTanam: kodeJadwalTanam.trim(),
        perencanaanProduksiId:
          selectedPerencanaanId && selectedPerencanaanId !== 'standalone' ? selectedPerencanaanId : null,
        partnerId: partnerId || null,
        namaPetani: namaPetani.trim(),
        kodePetani: kodePetani || null,
        greenhouseId: greenhouseId || null,
        commodityId: commodityId || null,
        komoditas: komoditas.trim() || 'Benih Pertanian',
        varietyId: varietyId || null,
        varietas: varietas.trim(),
        periodeTanam: tanggalTanam && perkiraanPanen ? `${tanggalTanam} - ${perkiraanPanen}` : '',
        periodeTanamMulai: tanggalTanam || null,
        periodeTanamSelesai: perkiraanPanen || null,
        tanggalTanam: tanggalTanam || null,
        perkiraanPanen: perkiraanPanen || null,
        metodeTanam: metodeTanam || 'Pindah Tanam',
        luasTanam: computedLuas,
        estimasiHasilPerHa: computedHasilHa,
        targetProduksi: computedTarget,
        statusJadwal: statusJadwal || 'Draft',
        keterangan: keterangan || '-',
        penanggungJawab: 'Admin',
        detailLahan: detailLahanPayload,
      };

      const res = await jadwalTanamService.createJadwalTanams(payload);
      toast.success(res?.message || 'Jadwal Tanam berhasil disimpan!');
      router.push('/produksi/jadwaltanam');
    } catch (err: any) {
      console.error('Error creating Jadwal Tanam:', err);
      toast.error(err.response?.data?.message || 'Gagal menyimpan Jadwal Tanam');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Fragment>
      <Seo title="Tambah Jadwal Tanam | Sistem Informasi Perusahaan Benih" />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="p-4 sm:p-6 space-y-6 max-w-[1440px] mx-auto min-h-screen">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Link href="/produksi/jadwaltanam" className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span>Produksi</span>
          </Link>
          <span className="text-gray-400">›</span>
          <Link href="/produksi/jadwaltanam" className="text-emerald-600 hover:text-emerald-700">
            Jadwal Tanam
          </Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-600 font-normal">Tambah Jadwal Tanam</span>
        </div>

        {/* Page Title Row */}
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Tambah Jadwal Tanam</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Buat jadwal tanam baru berdasarkan perencanaan produksi, petani, lahan, dan komoditas yang telah ditentukan.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Main 2-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: 8 COLS */}
            <div className="lg:col-span-8 space-y-6">
              {/* SECTION 1: Informasi Utama */}
              <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="font-bold text-gray-900 text-sm">Informasi Utama</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Left: No Jadwal Tanam */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      No. Jadwal Tanam <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={kodeJadwalTanam}
                        onChange={(e) => setKodeJadwalTanam(e.target.value)}
                        placeholder="JT-2026-011"
                        required
                        className="flex-1 px-3 py-2 text-xs text-gray-900 bg-gray-50/50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateCode}
                        className="px-3 py-2 border border-emerald-600 text-emerald-700 bg-white hover:bg-emerald-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        <span>Generate</span>
                      </button>
                    </div>
                  </div>

                  {/* Right: Perencanaan Produksi */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Perencanaan Produksi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedPerencanaanId}
                        onChange={(e) => handlePerencanaanChange(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 text-xs text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none"
                      >
                        <option value="">Pilih Perencanaan Produksi</option>
                        <option value="standalone">-- Tanpa Perencanaan (Stand Alone) --</option>
                        {perencanaanList.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.noPerencanaan} - {plan.komoditas} {plan.varietas ? `(${plan.varietas})` : ''}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <svg
                        className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {/* Preview Box Perencanaan */}
                    <div className="mt-2.5 bg-gray-50/70 border border-gray-100 rounded-lg p-3 text-xs space-y-1.5">
                      <div className="grid grid-cols-12 gap-1 text-gray-600">
                        <span className="col-span-5 text-gray-500">Produk</span>
                        <span className="col-span-7 font-medium text-gray-900">
                          : {selectedPlan?.namaProduk || selectedPlan?.komoditas || (selectedPerencanaanId === 'standalone' ? 'Stand Alone' : '-')}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 gap-1 text-gray-600">
                        <span className="col-span-5 text-gray-500">Komoditas / Varietas</span>
                        <span className="col-span-7 font-medium text-gray-900">
                          : {selectedPlan ? `${selectedPlan.komoditas || '-'} / ${selectedPlan.varietas || '-'}` : '-'}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 gap-1 text-gray-600">
                        <span className="col-span-5 text-gray-500">Target Produksi</span>
                        <span className="col-span-7 font-medium text-gray-900">
                          : {selectedPlan?.targetProduksi ? `${Number(selectedPlan.targetProduksi).toLocaleString('id-ID')} kg` : '-'}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 gap-1 text-gray-600">
                        <span className="col-span-5 text-gray-500">Periode</span>
                        <span className="col-span-7 font-medium text-gray-900">
                          : {selectedPlan?.periodeMulai && selectedPlan?.periodeSelesai
                            ? `${new Date(selectedPlan.periodeMulai).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })} - ${new Date(selectedPlan.periodeSelesai).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}`
                            : selectedPlan?.periode || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Data Petani & Lahan */}
              <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="font-bold text-gray-900 text-sm">Data Petani & Lahan</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Left: Petani Mitra */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        Petani Mitra <span className="text-red-500">*</span>
                      </label>
                      {selectedPlan && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                          </svg>
                          <span>{availablePartners.length} Terdaftar di {selectedPlan.noPerencanaan}</span>
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <select
                        value={partnerId}
                        onChange={(e) => handlePartnerChange(e.target.value)}
                        required
                        className="w-full pl-8 pr-4 py-2 text-xs text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none"
                      >
                        <option value="">
                          {selectedPlan
                            ? availablePartners.length > 0
                              ? `-- Pilih Petani Terdaftar (${availablePartners.length}) --`
                              : '-- Tidak Ada Petani Terdaftar --'
                            : 'Pilih Petani'}
                        </option>
                        {availablePartners.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.namaPetani} {p.kodePetani ? `(${p.kodePetani})` : ''}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <svg
                        className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {selectedPlan && availablePartners.length === 0 && (
                      <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-start gap-1.5">
                        <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Perencanaan {selectedPlan.noPerencanaan} belum memiliki petani mitra terdaftar. Gunakan mode Stand Alone atau daftarkan petani di modul Perencanaan Produksi.</span>
                      </div>
                    )}

                    {/* Preview Box Informasi Petani */}
                    <div className="mt-2.5 bg-gray-50/70 border border-gray-100 rounded-lg p-3 text-xs space-y-1.5">
                      <div className="font-semibold text-gray-900">
                        {selectedPartner ? selectedPartner.namaPetani : 'Informasi Petani'}
                      </div>
                      <div className="grid grid-cols-12 gap-1 text-gray-600">
                        <span className="col-span-3 text-gray-500">Alamat</span>
                        <span className="col-span-9 font-medium text-gray-900 truncate">
                          : {selectedPartner?.alamat || '-'}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 gap-1 text-gray-600">
                        <span className="col-span-3 text-gray-500">No. HP</span>
                        <span className="col-span-9 font-medium text-gray-900">
                          : {selectedPartner?.noTelepon || selectedPartner?.telepon || '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Lahan */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Lahan <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={greenhouseId}
                        onChange={(e) => handleLandChange(e.target.value)}
                        required
                        className="w-full pl-8 pr-4 py-2 text-xs text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none"
                      >
                        <option value="">Pilih Lahan</option>
                        {greenhouses.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.namaLahan} {g.kodeLahan ? `(${g.kodeLahan})` : ''} - {g.luas ? `${g.luas} m²` : ''}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <svg
                        className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {/* Preview Box Informasi Lahan */}
                    <div className="mt-2.5 bg-gray-50/70 border border-gray-100 rounded-lg p-3 text-xs space-y-1.5">
                      <div className="font-semibold text-gray-900">
                        {selectedLand ? selectedLand.namaLahan : 'Informasi Lahan'}
                      </div>
                      <div className="grid grid-cols-12 gap-1 text-gray-600">
                        <span className="col-span-4 text-gray-500">Luas Total</span>
                        <span className="col-span-8 font-medium text-gray-900">
                          : {selectedLand?.luas ? `${(Number(selectedLand.luas) / 10000).toFixed(2)} Ha (${Number(selectedLand.luas).toLocaleString('id-ID')} m²)` : '-'}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 gap-1 text-gray-600">
                        <span className="col-span-4 text-gray-500">Luas Tersedia</span>
                        <span className="col-span-8 font-medium text-gray-900">
                          : {selectedLand?.luas ? `${((Number(selectedLand.luas) * 0.8) / 10000).toFixed(2)} Ha` : '-'}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 gap-1 text-gray-600">
                        <span className="col-span-4 text-gray-500">Luas Digunakan</span>
                        <span className="col-span-8 font-medium text-gray-900">
                          : {luasTanam ? `${luasTanam} Ha` : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Data Tanam */}
              <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="font-bold text-gray-900 text-sm">Data Tanam</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Row 1 - Left: Tanggal Tanam */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Tanggal Tanam <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={tanggalTanam}
                        onChange={(e) => handleTanggalTanamChange(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Row 1 - Right: Estimasi Tanggal Panen */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Estimasi Tanggal Panen <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={perkiraanPanen}
                        onChange={(e) => setPerkiraanPanen(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-emerald-700 mt-1 italic">
                      * Estimasi panen akan otomatis terisi berdasarkan umur panen varietas.
                    </p>
                  </div>

                  {/* Row 2 - Left: Metode Tanam */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Metode Tanam <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={metodeTanam}
                        onChange={(e) => setMetodeTanam(e.target.value)}
                        required
                        className="w-full pl-8 pr-4 py-2 text-xs text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none"
                      >
                        <option value="">Pilih metode tanam</option>
                        <option value="Pindah Tanam">Pindah Tanam (Transplanting)</option>
                        <option value="Tanam Langsung">Tanam Langsung (Direct Seeding)</option>
                        <option value="Sistem Tabur">Sistem Tabur</option>
                        <option value="Hidroponik">Hidroponik / NFT</option>
                        <option value="Greenhouse / Polybag">Greenhouse / Polybag</option>
                        <option value="Mulsa Plastik">Mulsa Plastik</option>
                      </select>
                      <svg
                        className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <svg
                        className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Row 2 - Right: Luas Tanam */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Luas Tanam <span className="text-red-500">*</span>
                    </label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-1 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={luasTanam}
                        onChange={(e) => setLuasTanam(e.target.value)}
                        placeholder="0,00"
                        required
                        className="flex-1 px-3 py-2 text-xs text-gray-800 bg-white outline-none"
                      />
                      <span className="px-3.5 py-2 bg-gray-50 border-l border-gray-300 text-xs text-gray-500 font-medium">
                        Ha
                      </span>
                    </div>
                  </div>

                  {/* Row 3 - Left: Varietas */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Varietas <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={varietyId}
                        onChange={(e) => handleVarietyChange(e.target.value)}
                        required
                        className="w-full pl-8 pr-4 py-2 text-xs text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none"
                      >
                        <option value="">Pilih Varietas</option>
                        {varieties.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.namaVarietas} {v.umurTanam ? `(${v.umurTanam})` : ''}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      <svg
                        className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Row 3 - Right: Keterangan */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Keterangan</label>
                    <div className="relative">
                      <textarea
                        value={keterangan}
                        onChange={(e) => setKeterangan(e.target.value.slice(0, 500))}
                        rows={3}
                        placeholder="Masukkan keterangan tambahan..."
                        className="w-full px-3 py-2 text-xs text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none pb-6"
                      ></textarea>
                      <span className="absolute right-2.5 bottom-2 text-[10px] text-gray-400">
                        {keterangan.length}/500
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Estimasi Hasil */}
              <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h2 className="font-bold text-gray-900 text-sm">Estimasi Hasil</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Left: Input Estimasi Hasil per Ha (4 cols) */}
                  <div className="md:col-span-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Estimasi Hasil per Ha</label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-1 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                      <input
                        type="number"
                        min="0"
                        value={estimasiHasilPerHa}
                        onChange={(e) => setEstimasiHasilPerHa(e.target.value)}
                        placeholder="0"
                        className="flex-1 px-3 py-2 text-xs text-gray-800 bg-white outline-none"
                      />
                      <span className="px-3 py-2 bg-gray-50 border-l border-gray-300 text-xs text-gray-500 font-medium">
                        kg/Ha
                      </span>
                    </div>
                  </div>

                  {/* Center: Highlight Card Total Estimasi Hasil Panen (4 cols) */}
                  <div className="md:col-span-4">
                    <div className="border border-emerald-300 bg-emerald-50/60 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[11px] text-gray-600 font-medium leading-tight">
                          Total Estimasi Hasil Panen
                        </div>
                        <div className="text-xl font-bold text-gray-900 tracking-tight">
                          {totalEstimasiHasil.toLocaleString('id-ID')} kg
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Info Box (4 cols) */}
                  <div className="md:col-span-4">
                    <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3 flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        Estimasi hasil panen akan dihitung otomatis berdasarkan luas tanam dan estimasi hasil per ha
                        dari varietas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/produksi/jadwaltanam"
                  className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Kembali</span>
                </Link>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 border border-emerald-600 text-emerald-700 bg-white hover:bg-emerald-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Reset</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    <span>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: 4 COLS (SIDEBAR) */}
            <div className="lg:col-span-4 space-y-6">
              {/* SIDEBAR CARD 1: Ringkasan Jadwal Tanam */}
              <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100">
                  <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="font-bold text-gray-900 text-sm">Ringkasan Jadwal Tanam</h3>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Perencanaan Produksi
                    </span>
                    <span className="font-medium text-gray-800 text-right truncate max-w-[160px]">
                      {selectedPlan?.noPerencanaan || (selectedPerencanaanId === 'standalone' ? 'Stand Alone' : '-')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      Produk
                    </span>
                    <span className="font-medium text-gray-800 text-right truncate max-w-[160px]">
                      {selectedPlan?.namaProduk || selectedPlan?.komoditas || (komoditas || '-')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      Komoditas / Varietas
                    </span>
                    <span className="font-medium text-gray-800 text-right truncate max-w-[160px]">
                      {komoditas || varietas ? `${komoditas || '-'} / ${varietas || '-'}` : '-'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Petani
                    </span>
                    <span className="font-medium text-gray-800 text-right truncate max-w-[160px]">
                      {namaPetani || '-'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Lahan
                    </span>
                    <span className="font-medium text-gray-800 text-right truncate max-w-[160px]">
                      {namaLahan || '-'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                        />
                      </svg>
                      Luas Tanam
                    </span>
                    <span className="font-bold text-gray-900 text-right">
                      {luasTanam ? `${luasTanam} Ha` : '0 Ha'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Tanggal Tanam
                    </span>
                    <span className="font-medium text-gray-800 text-right">
                      {tanggalTanam
                        ? new Date(tanggalTanam).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : '-'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Estimasi Panen
                    </span>
                    <span className="font-medium text-gray-800 text-right">
                      {perkiraanPanen
                        ? new Date(perkiraanPanen).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : '-'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Metode Tanam
                    </span>
                    <span className="font-medium text-gray-800 text-right truncate max-w-[160px]">
                      {metodeTanam || '-'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-gray-700 font-medium flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Estimasi Hasil
                    </span>
                    <span className="font-black text-gray-900 text-sm text-right">
                      {totalEstimasiHasil.toLocaleString('id-ID')} kg
                    </span>
                  </div>
                </div>
              </div>

              {/* SIDEBAR CARD 2: Progress Target Produksi */}
              <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100">
                  <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="font-bold text-gray-900 text-sm">Progress Target Produksi</h3>
                </div>

                <div>
                  <div className="text-xs text-gray-500 font-medium mb-1">Target Produksi</div>
                  <div className="text-xl font-black text-gray-900 tracking-tight">
                    {targetProduksiNum.toLocaleString('id-ID')} kg
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-blue-100/70 rounded-full h-2 overflow-hidden mt-3 mb-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-[11px] font-bold text-blue-600 mb-4">{progressPct}%</div>

                  <div className="space-y-3 pt-1 border-t border-gray-100 text-xs">
                    {/* Realisasi */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-gray-700 font-medium leading-tight">Realisasi (dari semua jadwal)</div>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 text-right">
                        {totalEstimasiHasil.toLocaleString('id-ID')} kg
                      </span>
                    </div>

                    {/* Sisa Target */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-gray-700 font-medium leading-tight">Sisa Target</div>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 text-right">
                        {sisaTarget.toLocaleString('id-ID')} kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SIDEBAR CARD 3: Status Jadwal Tanam */}
              <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100">
                  <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <h3 className="font-bold text-gray-900 text-sm">Status Jadwal Tanam</h3>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <select
                      value={statusJadwal}
                      onChange={(e) => setStatusJadwal(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 text-xs text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none font-semibold"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Dalam Proses">Dalam Proses</option>
                      <option value="Disetujui">Disetujui</option>
                      <option value="Revisi">Revisi</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                    <svg
                      className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <div className="bg-gray-50/70 border border-gray-100 rounded-lg p-2.5 flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Status akan berubah sesuai dengan proses persetujuan dan realisasi di lapangan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
}