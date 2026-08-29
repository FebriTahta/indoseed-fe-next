import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import SpkDatepickr from "@/shared/@spk-reusable-components/spk-packages/datepicker-component";
import uploadService from '@/app/services/uploadService';
import { batchProduksiService } from '@/app/services/batchProduksiService';
import { qcVigorService } from '@/app/services/qcVigorService';
import { pengujiService } from '@/app/services/pengujiService';
import ModalFooter from '../components/ModalFooter';
import SpkSelect from '@/shared/@spk-reusable-components/spk-packages/spk-reactselect';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  methods?: any[];
  commodities?: any[];
  varieties?: any[];
  initialData?: any; // To support Edit mode
}

export default function CreateVigorModal({ isOpen, onClose, onSuccess, methods = [], commodities = [], varieties = [], initialData }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [lampiranUrls, setLampiranUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [batchList, setBatchList] = useState<any[]>([]);
  const [isBatchLoading, setIsBatchLoading] = useState<boolean>(false);
  const [batchSearchTerm, setBatchSearchTerm] = useState<string>('');
  
  // 1. Informasi Batch
  const [kodeBatch, setKodeBatch] = useState<string>('');
  const [commodityId, setCommodityId] = useState<string>('');
  const [varietyId, setVarietyId] = useState<string>('');
  const [lotNoBenih, setLotNoBenih] = useState<string>('');
  const [jumlahSampel, setJumlahSampel] = useState<string>('');
  const [lokasiLab, setLokasiLab] = useState<string>('');
  const [petugasUji, setPetugasUji] = useState<string>('');
  const [pengujis, setPengujis] = useState<any[]>([]);
  const [metodeUji, setMetodeUji] = useState<string>('');

  // 2. Parameter Uji Vigor
  const [indeksVigor, setIndeksVigor] = useState<string>('');
  const [katIndeksVigor, setKatIndeksVigor] = useState<string>('');
  const [perkecambahanAwal, setPerkecambahanAwal] = useState<string>('');
  const [katPerkecambahanAwal, setKatPerkecambahanAwal] = useState<string>('');
  const [kecepatanTumbuh, setKecepatanTumbuh] = useState<string>('');
  const [katKecepatanTumbuh, setKatKecepatanTumbuh] = useState<string>('');
  const [panjangAkarPrimer, setPanjangAkarPrimer] = useState<string>('');
  const [katPanjangAkarPrimer, setKatPanjangAkarPrimer] = useState<string>('');
  const [catatan, setCatatan] = useState<string>('');

  // 3. Kondisi Pengujian
  const [suhu, setSuhu] = useState<string>('');
  const [mediaUji, setMediaUji] = useState<string>('');
  const [lamaPengujian, setLamaPengujian] = useState<string>('');
  const [kelembaban, setKelembaban] = useState<string>('');
  const [pencahayaan, setPencahayaan] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      // Reset state
      setKodeBatch(''); setCommodityId(''); setVarietyId(''); setLotNoBenih('');
      setJumlahSampel(''); setLokasiLab(''); setPetugasUji(''); setMetodeUji('');
      setIndeksVigor(''); setKatIndeksVigor(''); setPerkecambahanAwal(''); setKatPerkecambahanAwal('');
      setKecepatanTumbuh(''); setKatKecepatanTumbuh(''); setPanjangAkarPrimer(''); setKatPanjangAkarPrimer('');
      setCatatan('');
      setSuhu(''); setMediaUji(''); setLamaPengujian(''); setKelembaban(''); setPencahayaan('');
      setLampiranUrls([]); setSelectedDate(null);
      return;
    }

    pengujiService.getPengujis().then(res => {
      setPengujis(res.data || []);
    }).catch(console.error);

    if (initialData) {
      // Populating data for Edit mode
      setKodeBatch(initialData.kodeBatch || '');
      setCommodityId(initialData.komoditasId || '');
      setVarietyId(initialData.varietasId || '');
      setLotNoBenih(initialData.lotNoBenih || (initialData.kodeBatch ? `LOT-${initialData.kodeBatch.replace('BP-', '')}` : ''));
      setJumlahSampel(initialData.jumlahSampel || '');
      setLokasiLab(initialData.lokasiLab || '');
      setPetugasUji(initialData.petugasUjiId || '');
      setMetodeUji(initialData.testMethodId || '');
      
      setIndeksVigor(initialData.indeksVigor || '');
      setKatIndeksVigor(initialData.katIndeksVigor || '');
      setPerkecambahanAwal(initialData.perkecambahanAwal || '');
      setKatPerkecambahanAwal(initialData.katPerkecambahanAwal || '');
      setKecepatanTumbuh(initialData.kecepatanTumbuh || '');
      setKatKecepatanTumbuh(initialData.katKecepatanTumbuh || '');
      setPanjangAkarPrimer(initialData.panjangAkarPrimer || '');
      setKatPanjangAkarPrimer(initialData.katPanjangAkarPrimer || '');
      setCatatan(initialData.catatan || '');

      setSuhu(initialData.suhu || '');
      setMediaUji(initialData.mediaUji || '');
      setLamaPengujian(initialData.lamaPengujian || '');
      setKelembaban(initialData.kelembaban || '');
      setPencahayaan(initialData.pencahayaan || '');

      if (initialData.tanggalUji) setSelectedDate(new Date(initialData.tanggalUji));
      
      let parsedUrls: string[] = [];
      if (initialData.lampirans && Array.isArray(initialData.lampirans)) {
        parsedUrls = initialData.lampirans.map((l: any) => l.url);
      }
      setLampiranUrls(parsedUrls);
    }

    const timer = setTimeout(async () => {
      setIsBatchLoading(true);
      try {
        const batchRes = await batchProduksiService.getBatchProduksiList({ search: batchSearchTerm, limit: 100 });
        if (batchRes?.data) {
          setBatchList(batchRes.data);
        }
      } catch (err) {
        console.error("Failed to load batch list", err);
      } finally {
        setIsBatchLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isOpen, batchSearchTerm]);

  useEffect(() => {
    if (initialData && batchList.length > 0 && kodeBatch) {
      const selectedBatch = batchList.find(b => b.kodeBatch === kodeBatch);
      if (selectedBatch) {
        if (!commodityId) {
          const matchedCommodity = commodities?.find(c => c.id === selectedBatch.komoditas || c.namaKomoditas === selectedBatch.komoditas);
          if (matchedCommodity) setCommodityId(matchedCommodity.id);
        }
        if (!varietyId) {
          const matchedVariety = varieties?.find(v => v.id === selectedBatch.varietas || v.namaVarietas === selectedBatch.varietas);
          if (matchedVariety) setVarietyId(matchedVariety.id);
        }
      }
    }
  }, [batchList, initialData, kodeBatch, commodityId, varietyId, commodities, varieties]);

  const handleBatchChange = (selectedOption: any) => {
    const selectedKode = selectedOption ? selectedOption.value : '';
    setKodeBatch(selectedKode);

    const selectedBatch = batchList.find(b => b.kodeBatch === selectedKode);
    if (selectedBatch) {
      const matchedCommodity = commodities.find(c => c.id === selectedBatch.komoditas || c.namaKomoditas === selectedBatch.komoditas);
      if (matchedCommodity) setCommodityId(matchedCommodity.id);

      const matchedVariety = varieties.find(v => v.id === selectedBatch.varietas || v.namaVarietas === selectedBatch.varietas);
      if (matchedVariety) setVarietyId(matchedVariety.id);

      const computedLot = selectedBatch.batchLot?.kodeLot || `LOT-${selectedKode.replace('BP-', '')}`;
      setLotNoBenih(computedLot);
    } else {
      if (initialData && initialData.kodeBatch === selectedKode) {
        setCommodityId(initialData.commodityId || initialData.komoditasId || '');
        setVarietyId(initialData.varietyId || initialData.varietasId || '');
        const fallbackLot = `LOT-${selectedKode.replace('BP-', '')}`;
        setLotNoBenih(initialData.lotNoBenih || fallbackLot);
      } else {
        setCommodityId(''); setVarietyId(''); setLotNoBenih('');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const uploaded: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadService.uploadFile(file, 'qc');
        if (res.success && res.data?.fileUrl) {
          uploaded.push(res.data.fileUrl);
        }
      }
      setLampiranUrls(prev => [...prev, ...uploaded]);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Gagal mengupload file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveLampiran = (index: number) => {
    setLampiranUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!kodeBatch || !metodeUji || !petugasUji || !selectedDate) {
      toast.error('Harap lengkapi semua field yang wajib (Kode Batch, Metode Uji, Petugas Uji, Tanggal Uji)!');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        kodeBatch,
        commodityId: commodityId || null,
        varietyId: varietyId || null,
        lotNoBenih: lotNoBenih || null,
        jumlahSampel: parseInt(jumlahSampel) || null,
        tanggalUji: selectedDate,
        lokasiLab: lokasiLab || null,
        petugasUjiId: petugasUji || null,
        testMethodId: metodeUji || null,

        indeksVigor: parseFloat(indeksVigor) || null,
        katIndeksVigor: katIndeksVigor || null,
        perkecambahanAwal: parseFloat(perkecambahanAwal) || null,
        katPerkecambahanAwal: katPerkecambahanAwal || null,
        kecepatanTumbuh: parseFloat(kecepatanTumbuh) || null,
        katKecepatanTumbuh: katKecepatanTumbuh || null,
        panjangAkarPrimer: parseFloat(panjangAkarPrimer) || null,
        katPanjangAkarPrimer: katPanjangAkarPrimer || null,
        catatan: catatan || null,

        suhu: suhu || null,
        mediaUji: mediaUji || null,
        lamaPengujian: lamaPengujian || null,
        kelembaban: kelembaban || null,
        pencahayaan: pencahayaan || null,

        lampiranUrls: lampiranUrls.length > 0 ? lampiranUrls : []
      };

      if (initialData?.id) {
        await qcVigorService.updateQcVigor(initialData.id, payload);
      } else {
        await qcVigorService.createQcVigor(payload);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      toast.error('Gagal menyimpan data uji vigor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h5 className="font-semibold text-lg">{initialData ? 'Edit Uji Vigor' : 'Tambah Uji Baru - Uji Vigor'}</h5>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">

            {/* 1. Informasi Batch */}
            <div>
              <h6 className="font-semibold text-sm mb-3 flex items-center gap-2 text-primary">
                <i className="ri-information-line"></i> 1. Informasi Batch
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Kode Batch / Lot <span className="text-danger">*</span></label>
                  <SpkSelect 
                    name="kodeBatch"
                    id="kodeBatch"
                    searchable={true}
                    isLoading={isBatchLoading}
                    isDisabled={!!initialData} // Lock batch selection in Edit mode
                    onInputChange={(val: string) => setBatchSearchTerm(val)}
                    value={kodeBatch ? { value: kodeBatch, label: kodeBatch } : null}
                    onfunchange={handleBatchChange}
                    option={batchList?.map((b: any) => ({
                      value: b.kodeBatch,
                      label: `${b.kodeBatch} - ${b.komoditas}`
                    }))}
                    placeholder="Pilih kode batch atau lot"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Komoditas <span className="text-danger">*</span></label>
                  <select 
                    className={`form-select text-sm h-[38px] w-full ${kodeBatch ? 'bg-gray-100 pointer-events-none' : ''}`}
                    value={commodityId} 
                    onChange={e => setCommodityId(e.target.value)}
                  >
                    <option value="">Pilih komoditas</option>
                    {commodities?.map(c => <option key={c.id} value={c.id}>{c.namaKomoditas}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Varietas <span className="text-danger">*</span></label>
                  <select 
                    className={`form-select text-sm h-[38px] w-full ${kodeBatch ? 'bg-gray-100 pointer-events-none' : ''}`}
                    value={varietyId} 
                    onChange={e => setVarietyId(e.target.value)}
                  >
                    <option value="">Pilih varietas</option>
                    {varieties?.map(v => <option key={v.id} value={v.id}>{v.namaVarietas}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Lot / No. Benih <span className="text-danger">*</span></label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Masukkan lot / no. benih" value={lotNoBenih} onChange={e => setLotNoBenih(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Jumlah Sampel <span className="text-danger">*</span></label>
                  <div className="flex">
                    <input type="number" className="form-control text-sm h-[38px] w-full rounded-r-none border-r-0" placeholder="Masukkan jumlah sampel" value={jumlahSampel} onChange={e => setJumlahSampel(e.target.value)} />
                    <span className="inline-flex items-center px-3 h-[38px] text-sm text-gray-900 bg-gray-100 border border-l-0 border-gray-200 rounded-r-md">Butir</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Tanggal Uji <span className="text-danger">*</span></label>
                  <div className="relative">
                    <SpkDatepickr
                      className="form-control text-sm h-[38px] w-full"
                      placeholderText="Pilih tanggal uji"
                      selected={selectedDate}
                      onChange={(date: any) => setSelectedDate(date)}
                    />
                    <i className="ri-calendar-line absolute right-3 top-2.5 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Lokasi / Lab <span className="text-danger">*</span></label>
                  <select className="form-select text-sm h-[38px] w-full" value={lokasiLab} onChange={e => setLokasiLab(e.target.value)}>
                    <option value="">Pilih lokasi / laboratorium</option>
                    <option value="Lab Pusat">Lab Pusat</option>
                    <option value="Lab Cabang">Lab Cabang</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Petugas Uji <span className="text-danger">*</span></label>
                  <select className="form-select text-sm h-[38px] w-full" value={petugasUji} onChange={e => setPetugasUji(e.target.value)}>
                    <option value="">Pilih petugas uji</option>
                    {pengujis.filter((p: any) => {
                      if (!metodeUji) return true;
                      const selectedMethod = methods?.find(m => m.kode === metodeUji || m.id === metodeUji);
                      if (!selectedMethod) return true;
                      return p.metodeUji?.some((mu: any) => mu.testMethodId === selectedMethod.id);
                    }).map((p: any) => (
                      <option key={p.id} value={p.id}>{p.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Metode Uji <span className="text-danger">*</span></label>
                  <select className="form-select text-sm h-[38px] w-full" value={metodeUji} onChange={e => setMetodeUji(e.target.value)}>
                    <option value="">Pilih metode uji</option>
                    {methods?.filter((m: any) => {
                      if (!petugasUji) return true;
                      const selectedPenguji = pengujis.find((p: any) => p.id === petugasUji);
                      if (!selectedPenguji) return true;
                      return selectedPenguji.metodeUji?.some((mu: any) => mu.testMethodId === m.id);
                    }).map(m => (
                      <option key={m.id} value={m.id}>{m.nama}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Parameter Uji Vigor */}
            <div>
              <h6 className="font-semibold text-sm mb-3 flex items-center gap-2 text-primary">
                <i className="ri-flask-line"></i> 2. Parameter Uji Vigor
              </h6>
              <div className="border border-gray-100 rounded overflow-hidden mb-4">
                <table className="table whitespace-nowrap min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4 w-[40%]">Parameter</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4 w-[10%]">Satuan</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4 w-[25%]">Hasil Uji</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4 w-[25%]">Kategori</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-50">
                      <td className="text-sm py-2 px-4 font-medium text-gray-700">Indeks Vigor</td>
                      <td className="text-sm py-2 px-4 text-gray-500">-</td>
                      <td className="text-sm py-2 px-4">
                        <input type="number" className="form-control text-sm py-1.5" placeholder="Masukkan hasil indeks" value={indeksVigor} onChange={e => setIndeksVigor(e.target.value)} />
                      </td>
                      <td className="text-sm py-2 px-4">
                        <select className="form-select text-sm h-[32px] w-full py-0" value={katIndeksVigor} onChange={e => setKatIndeksVigor(e.target.value)}>
                          <option value="">Pilih kategori</option>
                          <option value="Tinggi">Tinggi</option>
                          <option value="Sedang">Sedang</option>
                          <option value="Rendah">Rendah</option>
                        </select>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="text-sm py-2 px-4 font-medium text-gray-700">Perkecambahan Awal (First Count)</td>
                      <td className="text-sm py-2 px-4 text-gray-500">%</td>
                      <td className="text-sm py-2 px-4">
                        <input type="number" className="form-control text-sm py-1.5" placeholder="Masukkan hasil" value={perkecambahanAwal} onChange={e => setPerkecambahanAwal(e.target.value)} />
                      </td>
                      <td className="text-sm py-2 px-4">
                        <select className="form-select text-sm h-[32px] w-full py-0" value={katPerkecambahanAwal} onChange={e => setKatPerkecambahanAwal(e.target.value)}>
                          <option value="">Pilih kategori</option>
                          <option value="Tinggi">Tinggi</option>
                          <option value="Sedang">Sedang</option>
                          <option value="Rendah">Rendah</option>
                        </select>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="text-sm py-2 px-4 font-medium text-gray-700">Kecepatan Tumbuh (Speed of Growth)</td>
                      <td className="text-sm py-2 px-4 text-gray-500">-</td>
                      <td className="text-sm py-2 px-4">
                        <input type="number" className="form-control text-sm py-1.5" placeholder="Masukkan hasil" value={kecepatanTumbuh} onChange={e => setKecepatanTumbuh(e.target.value)} />
                      </td>
                      <td className="text-sm py-2 px-4">
                        <select className="form-select text-sm h-[32px] w-full py-0" value={katKecepatanTumbuh} onChange={e => setKatKecepatanTumbuh(e.target.value)}>
                          <option value="">Pilih kategori</option>
                          <option value="Tinggi">Tinggi</option>
                          <option value="Sedang">Sedang</option>
                          <option value="Rendah">Rendah</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm py-2 px-4 font-medium text-gray-700">Panjang Akar Primer</td>
                      <td className="text-sm py-2 px-4 text-gray-500">cm</td>
                      <td className="text-sm py-2 px-4">
                        <input type="number" className="form-control text-sm py-1.5" placeholder="Masukkan hasil" value={panjangAkarPrimer} onChange={e => setPanjangAkarPrimer(e.target.value)} />
                      </td>
                      <td className="text-sm py-2 px-4">
                        <select className="form-select text-sm h-[32px] w-full py-0" value={katPanjangAkarPrimer} onChange={e => setKatPanjangAkarPrimer(e.target.value)}>
                          <option value="">Pilih kategori</option>
                          <option value="Tinggi">Tinggi</option>
                          <option value="Sedang">Sedang</option>
                          <option value="Rendah">Rendah</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="w-full">
                <label className="text-xs font-semibold text-gray-600 block mb-1">Catatan (Jika Ada)</label>
                <div className="relative">
                  <textarea className="form-control text-sm min-h-[80px] w-full pb-6" placeholder="Tambahkan catatan jika diperlukan..." value={catatan} onChange={e => setCatatan(e.target.value)}></textarea>
                  <span className="absolute bottom-2 right-2 text-[10px] text-gray-400">0/300</span>
                </div>
              </div>
            </div>

            {/* 3. Kondisi Pengujian */}
            <div>
              <h6 className="font-semibold text-sm mb-3 flex items-center gap-2 text-primary">
                <i className="ri-settings-4-line"></i> 3. Kondisi Pengujian
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Suhu (°C)</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: 25 ± 2" value={suhu} onChange={e => setSuhu(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Media Uji</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: Kertas Merang" value={mediaUji} onChange={e => setMediaUji(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Lama Pengujian</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: 7 Hari" value={lamaPengujian} onChange={e => setLamaPengujian(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Kelembaban (%)</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: 70 - 80" value={kelembaban} onChange={e => setKelembaban(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Pencahayaan</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: 12 Jam Terang / 12 Jam Gelap" value={pencahayaan} onChange={e => setPencahayaan(e.target.value)} />
                </div>
              </div>
            </div>

            {/* 4. Lampiran */}
            <div>
              <h6 className="font-semibold text-sm mb-3 flex items-center gap-2 text-primary">
                <i className="ri-attachment-line"></i> 4. Lampiran (Opsional)
              </h6>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".svg,.png,.jpg,.jpeg,.pdf,.xlsx"
                multiple
              />

              <div
                className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors border-gray-200 bg-gray-50/50 hover:bg-gray-50 mb-4`}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-sm font-semibold">Mengupload...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 text-gray-400 flex items-center justify-center mb-3">
                      <i className="ri-upload-cloud-2-line text-3xl"></i>
                    </div>
                    <p className="text-sm font-semibold mb-1 text-gray-700">Drag & drop file di sini</p>
                    <p className="text-sm font-semibold mb-1 text-gray-700">atau <span className="text-primary font-bold">klik untuk memilih file</span></p>
                    <p className="text-xs text-gray-500 mt-2">Format yang didukung: JPG, PNG, PDF, XLSX (Maks. 10 MB). Bisa pilih lebih dari satu.</p>
                  </>
                )}
              </div>

              {lampiranUrls.length > 0 && (
                <div className="flex flex-col gap-2">
                  {lampiranUrls.map((url, idx) => {
                    const fileName = url.split('/').pop() || `File ${idx + 1}`;
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-md bg-white shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 text-primary rounded flex items-center justify-center">
                            <i className="ri-file-text-line text-xl"></i>
                          </div>
                          <div>
                            <p className="text-sm font-medium line-clamp-1">{fileName}</p>
                            <a href={url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">Lihat File</a>
                          </div>
                        </div>
                        <button type="button" onClick={() => handleRemoveLampiran(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors" title="Hapus File">
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Footer */}
        <ModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isDisabled={isUploading}
          submitText="Simpan & Proses Hasil"
        />
      </div>
    </div>
  );
}

