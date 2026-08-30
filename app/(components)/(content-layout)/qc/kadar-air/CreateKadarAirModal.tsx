import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import SpkDatepickr from "@/shared/@spk-reusable-components/spk-packages/datepicker-component";
import uploadService from '@/app/services/uploadService';
import { qcKadarAirService } from '@/app/services/qcKadarAirService';
import { batchProduksiService } from '@/app/services/batchProduksiService';
import { qcService } from '@/app/services/qcService';
import { pengujiService } from '@/app/services/pengujiService';
import ModalFooter from '../components/ModalFooter';
import SpkSelect from '@/shared/@spk-reusable-components/spk-packages/spk-reactselect';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  methods: any[];
  commodities: any[];
  varieties: any[];
  editData?: any;
}

export default function CreateKadarAirModal({ isOpen, onClose, onSuccess, methods, commodities, varieties, editData }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [lampiranUrls, setLampiranUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [batchList, setBatchList] = useState<any[]>([]);
  const [isBatchLoading, setIsBatchLoading] = useState<boolean>(false);
  const [batchSearchTerm, setBatchSearchTerm] = useState<string>('');

  const [kodeBatch, setKodeBatch] = useState<string>('');
  const [commodityId, setCommodityId] = useState<string>('');
  const [varietyId, setVarietyId] = useState<string>('');
  const [lotNumber, setLotNumber] = useState<string>('');
  const [jumlahSampel, setJumlahSampel] = useState<string>('');
  const [testMethodId, setTestMethodId] = useState<string>('');
  const [lokasiLab, setLokasiLab] = useState<string>('Lab Pusat');
  const [petugasUji, setPetugasUji] = useState<string>('');
  const [pengujis, setPengujis] = useState<any[]>([]);
  
  const [allParameters, setAllParameters] = useState<any[]>([]);
  const [parameterResults, setParameterResults] = useState<Record<string, { hasilUji: number; status: string }>>({});
  
  const [alat, setAlat] = useState<string>('');
  const [suhuUji, setSuhuUji] = useState<string>('');
  const [waktuPengeringan, setWaktuPengeringan] = useState<string>('');
  const [ulangan, setUlangan] = useState<string>('');
  const [beratAwal, setBeratAwal] = useState<string>('');
  const [beratAkhir, setBeratAkhir] = useState<string>('');
  const [catatan, setCatatan] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      qcService.getParameters().then(res => {
        setAllParameters(Array.isArray(res) ? res : res?.data || []);
      }).catch(console.error);
      pengujiService.getPengujis().then(res => {
        setPengujis(res.data || []);
      }).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setKodeBatch('');
      setCommodityId('');
      setVarietyId('');
      setBatchList([]);
      setBatchSearchTerm('');
      setLotNumber('');
      setParameterResults({});
      setLampiranUrls([]);
      setJumlahSampel('');
      setTestMethodId('');
      setLokasiLab('Lab Pusat');
      setPetugasUji('');
      setAlat('');
      setSuhuUji('');
      setWaktuPengeringan('');
      setUlangan('');
      setBeratAwal('');
      setBeratAkhir('');
      setCatatan('');
      setSelectedDate(null);
      return;
    }

    if (editData) {
      setKodeBatch(editData.kodeBatch || '');
      setCommodityId(editData.commodityId || editData.komoditasId || '');
      setVarietyId(editData.varietyId || editData.varietasId || '');
      const fallbackLot = editData.kodeBatch ? `LOT-${editData.kodeBatch.replace('BP-', '')}` : '';
      setLotNumber(editData.lotNumber || fallbackLot);
      setJumlahSampel(editData.jumlahSampel?.toString() || '');
      setTestMethodId(editData.testMethodId || '');
      setLokasiLab(editData.lokasiLab || 'Lab Pusat');
      setPetugasUji(editData.petugasUjiId || '');
      setAlat(editData.alat || '');
      setSuhuUji(editData.suhuUji || '');
      setWaktuPengeringan(editData.waktuPengeringan || '');
      setUlangan(editData.ulangan || '');
      setBeratAwal(editData.beratAwal?.toString() || '');
      setBeratAkhir(editData.beratAkhir?.toString() || '');
      setCatatan(editData.catatan || '');
      if (editData.tanggalUji) setSelectedDate(new Date(editData.tanggalUji));
      if (editData.lampirans && editData.lampirans.length > 0) {
        setLampiranUrls(editData.lampirans.map((l: any) => l.url));
      }

      if (editData.parameterUji) {
        try {
          const params = typeof editData.parameterUji === 'string' ? JSON.parse(editData.parameterUji) : editData.parameterUji;
          const parsedResults: any = {};
          if (Array.isArray(params)) {
            params.forEach((p: any) => {
              parsedResults[p.id] = { hasilUji: p.hasilUji, status: p.status };
            });
          }
          setParameterResults(parsedResults);
        } catch (e) {}
      }
    }

    const timer = setTimeout(async () => {
      setIsBatchLoading(true);
      try {
        const [batchRes, qcRes] = await Promise.all([
          batchProduksiService.getBatchProduksiList({ search: batchSearchTerm, limit: 100 }),
          qcKadarAirService.getKadarAir({ limit: 1000 }).catch(() => ({ data: [] }))
        ]);

        if (batchRes?.data) {
          // Exclude batches that already have a QC Kadar Air test
          const testedBatchCodes = (qcRes?.data || []).map((q: any) => q.kodeBatch);
          const filteredBatches = batchRes.data.filter((b: any) => !testedBatchCodes.includes(b.kodeBatch) || (editData && b.kodeBatch === editData.kodeBatch));

          const sortedData = [...filteredBatches].sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt || a.tanggalMulai || 0).getTime();
            const dateB = new Date(b.createdAt || b.tanggalMulai || 0).getTime();
            return dateA - dateB;
          });
          setBatchList(sortedData);
        }
      } catch (err) {
        console.error("Failed to load batch list or QC data", err);
      } finally {
        setIsBatchLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isOpen, batchSearchTerm]);

  useEffect(() => {
    if (editData && batchList.length > 0 && kodeBatch) {
      const selectedBatch = batchList.find(b => b.kodeBatch === kodeBatch);
      if (selectedBatch) {
        if (!commodityId) {
          const matchedCommodity = commodities.find(c => c.id === selectedBatch.komoditas || c.namaKomoditas === selectedBatch.komoditas);
          if (matchedCommodity) setCommodityId(matchedCommodity.id);
        }
        if (!varietyId) {
          const matchedVariety = varieties.find(v => v.id === selectedBatch.varietas || v.namaVarietas === selectedBatch.varietas);
          if (matchedVariety) setVarietyId(matchedVariety.id);
        }
      }
    }
  }, [batchList, editData, kodeBatch, commodityId, varietyId, commodities, varieties]);

  const handleBatchChange = (selectedOption: any) => {
    const selectedKode = selectedOption ? selectedOption.value : '';
    setKodeBatch(selectedKode);

    // Auto-fill commodity and variety from selected batch
    const selectedBatch = batchList.find(b => b.kodeBatch === selectedKode);
    if (selectedBatch) {
      const matchedCommodity = commodities.find(c => c.id === selectedBatch.komoditas || c.namaKomoditas === selectedBatch.komoditas);
      if (matchedCommodity) setCommodityId(matchedCommodity.id);

      const matchedVariety = varieties.find(v => v.id === selectedBatch.varietas || v.namaVarietas === selectedBatch.varietas);
      if (matchedVariety) setVarietyId(matchedVariety.id);

      // Auto-fill Lot
      const computedLot = selectedBatch.batchLot?.kodeLot || `LOT-${selectedKode.replace('BP-', '')}`;
      setLotNumber(computedLot);
    } else {
      if (editData && editData.kodeBatch === selectedKode) {
        setCommodityId(editData.commodityId || editData.komoditasId || '');
        setVarietyId(editData.varietyId || editData.varietasId || '');
        const fallbackLot = `LOT-${selectedKode.replace('BP-', '')}`;
        setLotNumber(editData.lotNumber || fallbackLot);
      } else {
        setCommodityId('');
        setVarietyId('');
        setLotNumber('');
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
    if (!kodeBatch || !testMethodId || !petugasUji || !selectedDate) {
      toast.error('Harap lengkapi semua field yang wajib (Kode Batch, Metode Uji, Petugas Uji, Tanggal Uji)!');
      return;
    }

    try {
      setIsSubmitting(true);
      
      let extractedKadarAir: number | null = null;
      let extractedBatas: number | null = null;
      let extractedStatus: string = 'Sedang Diuji';

      const paramKadarAir = allParameters.find(p => p.nama?.toLowerCase().includes('kadar air'));
      if (paramKadarAir && parameterResults[paramKadarAir.id]) {
        extractedKadarAir = parameterResults[paramKadarAir.id].hasilUji;
        extractedStatus = parameterResults[paramKadarAir.id].status;
        
        if (paramKadarAir.batasAcuan) {
          const match = paramKadarAir.batasAcuan.match(/[\d.]+/);
          if (match) extractedBatas = parseFloat(match[0]);
        }
      }
      
      const payload = {
        kodeBatch,
        commodityId: commodityId || null,
        varietyId: varietyId || null,
        testMethodId: testMethodId || null,
        lotNumber,
        tanggalUji: selectedDate,
        lokasiLab,
        petugasUjiId: petugasUji || null,
        jumlahSampel: parseInt(jumlahSampel) || null,
        lampiranUrls: lampiranUrls.length > 0 ? lampiranUrls : [],
        kadarAir: extractedKadarAir,
        batasMaksimal: extractedBatas,
        status: extractedStatus !== 'Sedang Diuji' ? extractedStatus : undefined,
        alat: alat || null,
        suhuUji: suhuUji || null,
        waktuPengeringan: waktuPengeringan || null,
        ulangan: ulangan || null,
        beratAwal: parseFloat(beratAwal) || null,
        beratAkhir: parseFloat(beratAkhir) || null,
        catatan: catatan || null,
        parameterUji: JSON.stringify(Object.keys(parameterResults).map(id => {
          const p = allParameters.find(x => x.id === id);
          return {
             id,
             parameter: p?.nama,
             satuan: p?.satuan,
             batasAcuan: p?.batasAcuan,
             hasilUji: parameterResults[id].hasilUji,
             status: parameterResults[id].status
          };
        })),
      };

      const res = editData 
        ? await qcKadarAirService.updateKadarAir(editData.id, payload)
        : await qcKadarAirService.createKadarAir(payload);
      if (res.success) {
         if (onSuccess) onSuccess();
         onClose();
      }
    } catch (e) {
       console.error(e);
       toast.error('Gagal menyimpan.');
    } finally {
       setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h5 className="font-semibold text-lg">{editData ? 'Edit Uji - Kadar Air' : 'Buat Uji Baru - Kadar Air'}</h5>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            
            <div>
              <h6 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">1</span>
                Informasi Batch
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded border border-gray-100">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Kode Batch / Lot <span className="text-danger">*</span></label>
                  <SpkSelect 
                    name="kodeBatch"
                    id="kodeBatch"
                    searchable={true}
                    isLoading={isBatchLoading}
                    onInputChange={(val: string) => setBatchSearchTerm(val)}
                    value={kodeBatch ? { value: kodeBatch, label: kodeBatch } : null}
                    onfunchange={handleBatchChange}
                    option={batchList?.map((b: any) => ({
                      value: b.kodeBatch,
                      label: `${b.kodeBatch} - ${b.komoditas}`
                    }))}
                    placeholder="Pilih Batch Produksi..."
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Komoditas <span className="text-danger">*</span></label>
                  <select 
                    className={`form-select text-sm h-[38px] w-full ${kodeBatch ? 'bg-gray-100 pointer-events-none' : ''}`}
                    value={commodityId} 
                    onChange={e => setCommodityId(e.target.value)}
                    disabled={!!kodeBatch}
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
                    disabled={!!kodeBatch}
                  >
                    <option value="">Pilih varietas</option>
                    {varieties?.map(v => <option key={v.id} value={v.id}>{v.namaVarietas}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Lot / No. Benih <span className="text-danger">*</span></label>
                  <input type="text" className="form-control text-sm h-[38px] w-full bg-gray-100" readOnly value={lotNumber} onChange={e => setLotNumber(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Jumlah Sampel <span className="text-danger">*</span></label>
                  <div className="flex">
                    <input type="number" className="form-control text-sm h-[38px] w-full rounded-r-none border-r-0" placeholder="0" value={jumlahSampel} onChange={e => setJumlahSampel(e.target.value)} />
                    <span className="inline-flex items-center px-3 h-[38px] text-sm text-gray-900 bg-gray-100 border border-l-0 border-gray-200 rounded-r-md">Butir</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Tanggal Uji <span className="text-danger">*</span></label>
                  <div className="relative">
                    <SpkDatepickr 
                      className="form-control text-sm h-[38px] w-full" 
                      placeholderText="Pilih Tanggal..." 
                      selected={selectedDate}
                      onChange={(date: any) => setSelectedDate(date)}
                    />
                    <i className="ri-calendar-line absolute right-3 top-2.5 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Lokasi / Lab <span className="text-danger">*</span></label>
                  <select className="form-select text-sm h-[38px] w-full" value={lokasiLab} onChange={e => setLokasiLab(e.target.value)}>
                    <option value="Lab Pusat">Lab Pusat</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Petugas Uji <span className="text-danger">*</span></label>
                  <select className="form-select text-sm h-[38px] w-full" value={petugasUji} onChange={e => setPetugasUji(e.target.value)}>
                    <option value="">Pilih Petugas Uji</option>
                    {pengujis.filter((p: any) => !testMethodId || p.metodeUji?.some((mu: any) => mu.testMethodId === testMethodId)).map((p: any) => (
                      <option key={p.id} value={p.id}>{p.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Metode Uji <span className="text-danger">*</span></label>
                  <select className="form-select text-sm h-[38px] w-full" value={testMethodId} onChange={e => setTestMethodId(e.target.value)}>
                    <option value="">Pilih Metode Uji</option>
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

            <div>
              <h6 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">2</span>
                Parameter Uji
              </h6>
              <div className="border border-gray-100 rounded overflow-hidden">
                <table className="table whitespace-nowrap min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-500 py-2 px-4">Parameter</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-2 px-4">Satuan</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-2 px-4">Batas Minimal</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-2 px-4">Hasil Uji</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-2 px-4 w-36">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const selectedMethod = methods?.find(m => m.kode === testMethodId || m.id === testMethodId);
                      let paramsToRender = (selectedMethod?.testParameters || allParameters?.filter(p => p.metodeId === selectedMethod?.id) || []);
                      
                      if (paramsToRender.length === 0) {
                        const defaultParamNames = ['kadar air'];
                        paramsToRender = allParameters?.filter(p => {
                          if (!p.nama) return false;
                          const pNama = p.nama.toLowerCase();
                          return defaultParamNames.some(d => pNama.includes(d));
                        }) || [];
                      }

                      if (paramsToRender.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="text-center text-sm py-4 text-gray-500">
                              {allParameters?.length === 0 ? 'Memuat parameter...' : 'Tidak ada parameter yang tersedia.'}
                            </td>
                          </tr>
                        );
                      }

                      return paramsToRender.map((param: any, i: number) => {
                        const result = parameterResults[param.id] || { hasilUji: '', status: 'Sedang Diuji' };
                        
                        const handleResultChange = (val: string) => {
                          const numVal = parseFloat(val);
                          let status = 'Sedang Diuji';
                          
                          if (!isNaN(numVal) && param.batasAcuan) {
                            if (param.batasAcuan.includes('>=')) {
                              const limit = parseFloat(param.batasAcuan.replace('>=', '').replace(',', '.').trim());
                              status = numVal >= limit ? 'Lulus' : 'Tidak Lulus';
                            } else if (param.batasAcuan.includes('<=')) {
                              const limit = parseFloat(param.batasAcuan.replace('<=', '').replace(',', '.').trim());
                              status = numVal <= limit ? 'Lulus' : 'Tidak Lulus';
                            } else if (param.batasAcuan.includes('>')) {
                              const limit = parseFloat(param.batasAcuan.replace('>', '').replace(',', '.').trim());
                              status = numVal > limit ? 'Lulus' : 'Tidak Lulus';
                            } else if (param.batasAcuan.includes('<')) {
                              const limit = parseFloat(param.batasAcuan.replace('<', '').replace(',', '.').trim());
                              status = numVal < limit ? 'Lulus' : 'Tidak Lulus';
                            }
                          }
                          
                          setParameterResults(prev => ({
                            ...prev,
                            [param.id]: { hasilUji: isNaN(numVal) ? 0 : numVal, status }
                          }));
                        };

                        return (
                          <tr key={i} className="border-b border-gray-50">
                            <td className="text-sm py-2 px-4 font-medium">{param.nama}</td>
                            <td className="text-sm py-2 px-4 text-gray-500">{param.satuan || '-'}</td>
                            <td className="text-sm py-2 px-4">{param.batasAcuan || '-'}</td>
                            <td className="text-sm py-2 px-4 w-48">
                              <input 
                                type="number" 
                                className="form-control text-sm py-1" 
                                placeholder="0.00"
                                value={result.hasilUji}
                                onChange={(e) => handleResultChange(e.target.value)}
                              />
                            </td>
                            <td className="text-sm py-2 px-4 w-36">
                              <span className={`badge min-w-[100px] inline-block text-center ${result.status === 'Lulus' ? 'bg-success/10 text-success' : result.status === 'Tidak Lulus' ? 'bg-danger/10 text-danger' : 'bg-gray-100 text-gray-500'}`}>
                                {result.status}
                              </span>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h6 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">3</span>
                Detail Pengujian
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded border border-gray-100">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Alat / Instrumen</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: Oven Memmert UN55" value={alat} onChange={e => setAlat(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Suhu Uji (°C)</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: 105 ± 3" value={suhuUji} onChange={e => setSuhuUji(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Waktu Pengeringan</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: 17 jam" value={waktuPengeringan} onChange={e => setWaktuPengeringan(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Ulangan</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: 2 kali" value={ulangan} onChange={e => setUlangan(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Berat Awal (g) (Opsional)</label>
                  <input type="number" className="form-control text-sm h-[38px] w-full" placeholder="0" value={beratAwal} onChange={e => setBeratAwal(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Berat Akhir (g) (Opsional)</label>
                  <input type="number" className="form-control text-sm h-[38px] w-full" placeholder="0" value={beratAkhir} onChange={e => setBeratAkhir(e.target.value)} />
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Catatan (Opsional)</label>
                  <textarea className="form-control text-sm min-h-[100px] w-full" rows={3} placeholder="Tambahkan catatan jika diperlukan..." value={catatan} onChange={e => setCatatan(e.target.value)}></textarea>
                </div>
              </div>
            </div>

            <div>
              <h6 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">4</span>
                Lampiran (Opsional)
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
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                      <i className="ri-upload-cloud-2-line text-2xl"></i>
                    </div>
                    <p className="text-sm font-semibold mb-1">Drag & drop file di sini atau klik untuk memilih file</p>
                    <p className="text-xs text-gray-500">Format yang didukung: JPG, PNG, PDF, XLSX (Maks. 10 MB). Bisa pilih lebih dari satu.</p>
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
