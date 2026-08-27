import React, { useState, useRef, useEffect } from 'react';
import SpkDatepickr from "@/shared/@spk-reusable-components/spk-packages/datepicker-component";
import uploadService from '@/app/services/uploadService';
import { batchProduksiService } from '@/app/services/batchProduksiService';
import { qcKemurnianService } from '@/app/services/qcKemurnianService';
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

export default function CreateKemurnianModal({ isOpen, onClose, onSuccess, methods = [], commodities = [], varieties = [], initialData }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [lampiranUrl, setLampiranUrl] = useState<string>('');
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
  const [petugasUji, setPetugasUji] = useState<string>('Dewi Lestari');
  const [metodeUji, setMetodeUji] = useState<string>('');

  // 2. Hasil Uji Kemurnian
  const [beratBenihMurni, setBeratBenihMurni] = useState<string>('');
  const [beratTanamanLain, setBeratTanamanLain] = useState<string>('');
  const [beratGulma, setBeratGulma] = useState<string>('');
  const [beratBahanAsing, setBeratBahanAsing] = useState<string>('');
  const [batasMinimal, setBatasMinimal] = useState<string>('98');
  const [status, setStatus] = useState<string>('Otomatis');

  // 3. Detail Pengujian
  const [alatInstrumen, setAlatInstrumen] = useState<string>('');
  const [waktuPengujian, setWaktuPengujian] = useState<string>('');
  const [suhuRuangan, setSuhuRuangan] = useState<string>('');
  const [beratAwalSampel, setBeratAwalSampel] = useState<string>('');
  const [ulangan, setUlangan] = useState<string>('');
  const [catatanTambahan, setCatatanTambahan] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      // Reset state
      setKodeBatch(''); setCommodityId(''); setVarietyId(''); setLotNoBenih('');
      setBeratBenihMurni(''); setBeratTanamanLain(''); setBeratGulma(''); setBeratBahanAsing('');
      setJumlahSampel(''); setLokasiLab(''); setMetodeUji('');
      setAlatInstrumen(''); setWaktuPengujian(''); setSuhuRuangan(''); setBeratAwalSampel(''); setUlangan(''); setCatatanTambahan('');
      setLampiranUrl(''); setSelectedDate(null);
      return;
    }

    if (initialData) {
      // Populating data for Edit mode
      setKodeBatch(initialData.kodeBatch || '');
      setCommodityId(initialData.komoditasId || '');
      setVarietyId(initialData.varietasId || '');
      setLotNoBenih(initialData.lotNoBenih || '');
      setJumlahSampel(initialData.jumlahSampel || '');
      setLokasiLab(initialData.lokasiLab || '');
      setMetodeUji(initialData.metodeUji || '');
      
      setBeratBenihMurni(initialData.beratBenihMurni || '');
      setBeratTanamanLain(initialData.beratTanamanLain || '');
      setBeratGulma(initialData.beratGulma || '');
      setBeratBahanAsing(initialData.beratBahanAsing || '');
      setBatasMinimal(initialData.batasMinimal || '98');
      
      setAlatInstrumen(initialData.alatInstrumen || '');
      setWaktuPengujian(initialData.waktuPengujian || '');
      setSuhuRuangan(initialData.suhuRuangan || '');
      setBeratAwalSampel(initialData.beratAwalSampel || '');
      setUlangan(initialData.ulangan || '');
      setCatatanTambahan(initialData.catatanTambahan || '');
      if (initialData.tanggalUji) setSelectedDate(new Date(initialData.tanggalUji));
      if (initialData.lampiranUrl) setLampiranUrl(initialData.lampiranUrl);
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
      setCommodityId(''); setVarietyId(''); setLotNoBenih('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadService.uploadFile(file, 'qc');
      if (res.success && res.data?.fileUrl) {
        setLampiranUrl(res.data.fileUrl);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Gagal mengupload file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const payload = {
        kodeBatch,
        commodityId: commodityId || null,
        varietyId: varietyId || null,
        metodeUji: metodeUji || null,
        lotNoBenih: lotNoBenih || null,
        tanggalUji: selectedDate,
        lokasiLab: lokasiLab || null,
        petugasUji: petugasUji || null,
        jumlahSampel: parseInt(jumlahSampel) || null,

        kemurnian: parseFloat(kemurnianPct) || null,
        batasMinimal: parseFloat(batasMinimal) || null,
        status,

        beratBenihMurni: bbm,
        beratTanamanLain: btl,
        beratGulma: bg,
        beratBahanAsing: bba,

        alatInstrumen: alatInstrumen || null,
        waktuPengujian: waktuPengujian || null,
        suhuRuangan: suhuRuangan || null,
        beratAwalSampel: parseFloat(beratAwalSampel) || null,
        ulangan: ulangan || null,
        catatan: catatanTambahan || null,

        lampiranUrl
      };

      if (initialData?.id) {
        await qcKemurnianService.updateQcKemurnian(initialData.id, payload);
      } else {
        await qcKemurnianService.createQcKemurnian(payload);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      alert('Gagal menyimpan data uji kemurnian.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculations
  const bbm = parseFloat(beratBenihMurni) || 0;
  const btl = parseFloat(beratTanamanLain) || 0;
  const bg = parseFloat(beratGulma) || 0;
  const bba = parseFloat(beratBahanAsing) || 0;
  const totalBerat = bbm + btl + bg + bba;

  const pctBM = totalBerat > 0 ? ((bbm / totalBerat) * 100).toFixed(2) : '0.00';
  const pctTL = totalBerat > 0 ? ((btl / totalBerat) * 100).toFixed(2) : '0.00';
  const pctG = totalBerat > 0 ? ((bg / totalBerat) * 100).toFixed(2) : '0.00';
  const pctBA = totalBerat > 0 ? ((bba / totalBerat) * 100).toFixed(2) : '0.00';
  const kemurnianPct = totalBerat > 0 ? pctBM : '0.00';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h5 className="font-semibold text-lg">{initialData ? 'Edit Uji Kemurnian' : 'Tambah Uji Baru - Uji Kemurnian'}</h5>
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
                    <option value="Dewi Lestari">Dewi Lestari</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Metode Uji <span className="text-danger">*</span></label>
                  <select className="form-select text-sm h-[38px] w-full" value={metodeUji} onChange={e => setMetodeUji(e.target.value)}>
                    <option value="">Pilih metode uji</option>
                    {methods?.map(m => (
                      <option key={m.id} value={m.kode}>{m.nama}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Hasil Uji Kemurnian */}
            <div>
              <h6 className="font-semibold text-sm mb-3 flex items-center gap-2 text-primary">
                <i className="ri-flask-line"></i> 2. Hasil Uji Kemurnian
              </h6>
              <div className="border border-gray-100 rounded overflow-hidden mb-4">
                <table className="table whitespace-nowrap min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Komponen</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Berat (g)</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Persentase (%)</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-50">
                      <td className="text-sm py-2 px-4 font-medium">Benih Murni</td>
                      <td className="text-sm py-2 px-4">
                        <input type="number" className="form-control text-sm py-1.5" placeholder="Masukkan berat benih murni" value={beratBenihMurni} onChange={e => setBeratBenihMurni(e.target.value)} />
                      </td>
                      <td className="text-sm py-2 px-4 font-semibold text-gray-600">{pctBM} %</td>
                      <td className="text-sm py-2 px-4 text-gray-500">Benih spesies yang diinginkan</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="text-sm py-2 px-4 font-medium">Benih Tanaman Lain (Other Crop Seed)</td>
                      <td className="text-sm py-2 px-4">
                        <input type="number" className="form-control text-sm py-1.5" placeholder="Masukkan berat" value={beratTanamanLain} onChange={e => setBeratTanamanLain(e.target.value)} />
                      </td>
                      <td className="text-sm py-2 px-4 font-semibold text-gray-600">{pctTL} %</td>
                      <td className="text-sm py-2 px-4 text-gray-500">Benih tanaman budidaya lain</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="text-sm py-2 px-4 font-medium">Benih Gulma (Weed Seed)</td>
                      <td className="text-sm py-2 px-4">
                        <input type="number" className="form-control text-sm py-1.5" placeholder="Masukkan berat" value={beratGulma} onChange={e => setBeratGulma(e.target.value)} />
                      </td>
                      <td className="text-sm py-2 px-4 font-semibold text-gray-600">{pctG} %</td>
                      <td className="text-sm py-2 px-4 text-gray-500">Benih gulma</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="text-sm py-2 px-4 font-medium">Bahan Asing Lainnya</td>
                      <td className="text-sm py-2 px-4">
                        <input type="number" className="form-control text-sm py-1.5" placeholder="Masukkan berat" value={beratBahanAsing} onChange={e => setBeratBahanAsing(e.target.value)} />
                      </td>
                      <td className="text-sm py-2 px-4 font-semibold text-gray-600">{pctBA} %</td>
                      <td className="text-sm py-2 px-4 text-gray-500">Kotoran, tanah, batu, dll</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="text-sm py-3 px-4 font-bold text-gray-700">Total</td>
                      <td className="text-sm py-3 px-4 font-bold text-gray-700">{totalBerat.toFixed(2)}</td>
                      <td className="text-sm py-3 px-4 font-bold text-gray-700">{totalBerat > 0 ? '100.00' : '0.00'} %</td>
                      <td className="text-sm py-3 px-4"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Kemurnian (%)</label>
                  <p className="text-[10px] text-gray-400 mb-1 leading-none">Rumus: (Benih Murni / Total) x 100</p>
                  <div className="flex">
                    <input type="text" className="form-control text-sm h-[38px] w-full rounded-r-none border-r-0 bg-gray-50" readOnly placeholder="Akan dihitung otomatis" value={kemurnianPct} />
                    <span className="inline-flex items-center px-3 h-[38px] text-sm text-gray-900 bg-gray-100 border border-l-0 border-gray-200 rounded-r-md">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1 mt-[14px]">Batas Minimal (%)</label>
                  <div className="flex">
                    <input type="number" className="form-control text-sm h-[38px] w-full rounded-r-none border-r-0" placeholder="Contoh: 98" value={batasMinimal} onChange={e => setBatasMinimal(e.target.value)} />
                    <span className="inline-flex items-center px-3 h-[38px] text-sm text-gray-900 bg-gray-100 border border-l-0 border-gray-200 rounded-r-md">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1 mt-[14px]">Status</label>
                  <select className="form-select text-sm h-[38px] w-full" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="Otomatis">Otomatis</option>
                    <option value="Memenuhi">Memenuhi</option>
                    <option value="Mendekati">Mendekati</option>
                    <option value="Tidak Memenuhi">Tidak Memenuhi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Detail Pengujian */}
            <div>
              <h6 className="font-semibold text-sm mb-3 flex items-center gap-2 text-primary">
                <i className="ri-settings-4-line"></i> 3. Detail Pengujian
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Alat / Instrumen</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: Purity Work Board" value={alatInstrumen} onChange={e => setAlatInstrumen(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Waktu Pengujian</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: 45 menit" value={waktuPengujian} onChange={e => setWaktuPengujian(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Suhu Ruangan (°C)</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: 25 ± 2" value={suhuRuangan} onChange={e => setSuhuRuangan(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Berat Awal Sampel (g)</label>
                  <input type="number" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: 100" value={beratAwalSampel} onChange={e => setBeratAwalSampel(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Ulangan</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: 2 kali" value={ulangan} onChange={e => setUlangan(e.target.value)} />
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Catatan (Opsional)</label>
                  <div className="relative">
                    <textarea className="form-control text-sm min-h-[80px] w-full pb-6" placeholder="Tambahkan catatan jika diperlukan..." value={catatanTambahan} onChange={e => setCatatanTambahan(e.target.value)}></textarea>
                    <span className="absolute bottom-2 right-2 text-[10px] text-gray-400">0/300</span>
                  </div>
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
              />

              <div
                className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${lampiranUrl ? 'border-primary/50 bg-primary/5' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-sm font-semibold">Mengupload...</p>
                  </div>
                ) : lampiranUrl ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                      <i className="ri-check-line text-2xl"></i>
                    </div>
                    <p className="text-sm font-semibold mb-1 text-primary">File berhasil diupload</p>
                    <a href={lampiranUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline" onClick={(e) => e.stopPropagation()}>Lihat File</a>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 text-gray-400 flex items-center justify-center mb-3">
                      <i className="ri-upload-cloud-2-line text-3xl"></i>
                    </div>
                    <p className="text-sm font-semibold mb-1">Drag & drop file di sini</p>
                    <p className="text-sm font-semibold mb-1">atau klik untuk memilih file</p>
                    <p className="text-xs text-gray-500 mt-2">Format yang didukung: JPG, PNG, PDF, XLSX (Maks. 10 MB)</p>
                  </>
                )}
              </div>
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
