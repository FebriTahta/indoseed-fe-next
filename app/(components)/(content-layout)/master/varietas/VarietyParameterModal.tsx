"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import parameterService from '@/app/services/parameterService';
import { CombinedVarietyParameter, MasterParameter, SaveVarietyParameterPayload } from '@/app/types/parameter';
import ModalKatalogMasterParameter from './component/ModalKatalogMasterParameter';

interface VarietyParameterModalProps {
  isOpen: boolean;
  onClose: () => void;
  variety: {
    id: string;
    namaVarietas: string;
    kodeVarietas: string;
  } | null;
}

export default function VarietyParameterModal({
  isOpen,
  onClose,
  variety,
}: VarietyParameterModalProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [combinedParams, setCombinedParams] = useState<CombinedVarietyParameter[]>([]);
  const [selectedModulTab, setSelectedModulTab] = useState<string>('ALL');
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);

  // Form local values map: parameterId -> SaveVarietyParameterPayload
  const [formMap, setFormMap] = useState<Record<string, SaveVarietyParameterPayload>>({});

  const fetchVarietyParams = useCallback(async () => {
    if (!variety?.id) return;
    setLoading(true);
    try {
      // Hanya ambil parameter yang memang sudah ditetapkan untuk varietas ini
      const res = await parameterService.getVarietyParameters(variety.id, { assignedOnly: true });
      if (res.status === 'success' && res.data) {
        setCombinedParams(res.data);
        const map: Record<string, SaveVarietyParameterPayload> = {};

        res.data.forEach((cp) => {
          const vp = cp.varietyParameter;
          map[cp.parameter.id] = {
            parameterId: cp.parameter.id,
            optionId: vp?.optionId || null,
            nilaiNumber: vp?.nilaiNumber ?? null,
            nilaiText: vp?.nilaiText || '',
            operator: vp?.operator || '=',
            nilaiMin: vp?.nilaiMin ?? null,
            nilaiMax: vp?.nilaiMax ?? null,
          };
        });

        setFormMap(map);
      }
    } catch (err: any) {
      console.error('Failed to load variety parameters:', err);
      toast.error('Gagal memuat parameter varietas');
    } finally {
      setLoading(false);
    }
  }, [variety]);

  useEffect(() => {
    if (isOpen && variety) {
      fetchVarietyParams();
    }
  }, [isOpen, variety, fetchVarietyParams]);

  if (!isOpen || !variety) return null;

  // Distinct modules for filter tabs
  const availableModuls = Array.from(
    new Set(combinedParams.map((cp) => cp.parameter.namaModul))
  );

  const filteredParams = combinedParams.filter((cp) =>
    selectedModulTab === 'ALL' ? true : cp.parameter.namaModul === selectedModulTab
  );

  const handleInputChange = (parameterId: string, field: keyof SaveVarietyParameterPayload, value: any) => {
    setFormMap((prev) => ({
      ...prev,
      [parameterId]: {
        ...prev[parameterId],
        parameterId,
        [field]: value,
      },
    }));
  };

  // Tambah parameter yang dipilih dari katalog
  const handleAddFromCatalog = (selectedParams: MasterParameter[]) => {
    const newCombined: CombinedVarietyParameter[] = selectedParams.map((mp) => ({
      parameter: mp,
      varietyParameter: null,
    }));

    setCombinedParams((prev) => [...prev, ...newCombined]);

    setFormMap((prev) => {
      const next = { ...prev };
      selectedParams.forEach((mp) => {
        if (!next[mp.id]) {
          next[mp.id] = {
            parameterId: mp.id,
            optionId: null,
            nilaiNumber:
              mp.batasLulus !== null && mp.batasLulus !== undefined
                ? typeof mp.batasLulus === 'number'
                  ? mp.batasLulus
                  : parseFloat(String(mp.batasLulus)) || null
                : null,
            nilaiText: '',
            operator: '=',
            nilaiMin: null,
            nilaiMax: null,
          };
        }
      });
      return next;
    });

    toast.success(`${selectedParams.length} parameter ditambahkan ke daftar varietas`);
  };

  // Hapus parameter dari varietas
  const handleRemoveParameter = (parameterId: string) => {
    setCombinedParams((prev) => prev.filter((cp) => cp.parameter.id !== parameterId));
    setFormMap((prev) => {
      const next = { ...prev };
      // Tandai nilai menjadi kosong/null agar di backend dihapus saat save batch
      next[parameterId] = {
        parameterId,
        optionId: null,
        nilaiNumber: null,
        nilaiText: null,
        operator: null,
        nilaiMin: null,
        nilaiMax: null,
      };
      return next;
    });
    toast.info('Parameter dikeluarkan dari daftar varietas');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: SaveVarietyParameterPayload[] = Object.values(formMap);
      await parameterService.saveVarietyParameters(variety.id, payload);
      toast.success(`Parameter standar varietas '${variety.namaVarietas}' berhasil disimpan`);
      onClose();
    } catch (err: any) {
      console.error('Failed to save variety parameters:', err);
      toast.error(err.response?.data?.message || 'Gagal menyimpan parameter varietas');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-emerald-700 text-white">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <i className="ri-settings-4-line text-xl"></i>
              Parameter Standar Varietas
            </h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              Varietas: <span className="font-semibold text-white">{variety.namaVarietas}</span> ({variety.kodeVarietas})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCatalogOpen(true)}
              className="px-3.5 py-1.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <i className="ri-folder-shared-line text-sm"></i>
              <span>Pilih dari Katalog</span>
            </button>
            <button
              onClick={onClose}
              className="text-emerald-100 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              title="Tutup"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
        </div>

        {/* Module Filter Tabs & Catalog Action */}
        <div className="px-6 pt-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedModulTab('ALL')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
                selectedModulTab === 'ALL'
                  ? 'border-emerald-600 text-emerald-600 bg-white shadow-sm'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Semua Terpilih ({combinedParams.length})
            </button>
            {availableModuls.map((modul) => {
              const count = combinedParams.filter((cp) => cp.parameter.namaModul === modul).length;
              return (
                <button
                  key={modul}
                  onClick={() => setSelectedModulTab(modul)}
                  className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
                    selectedModulTab === modul
                      ? 'border-emerald-600 text-emerald-600 bg-white shadow-sm'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {modul} ({count})
                </button>
              );
            })}
          </div>

          <div className="pb-2">
            <button
              type="button"
              onClick={() => setIsCatalogOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              <i className="ri-add-line font-bold"></i>
              <span>+ Tambah Parameter Lain</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-12 text-center text-gray-500 space-y-2">
              <i className="ri-loader-4-line text-3xl animate-spin text-emerald-600"></i>
              <p className="text-sm font-medium">Memuat parameter standar varietas...</p>
            </div>
          ) : filteredParams.length === 0 ? (
            <div className="py-16 text-center text-gray-400 space-y-3 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center text-2xl mx-auto">
                <i className="ri-list-settings-line"></i>
              </div>
              <p className="text-sm font-semibold text-gray-700">Belum ada parameter standar yang dipilih</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Daftar awal kosong. Klik tombol di bawah untuk memilih parameter standar mutu & karakteristik dari katalog master.
              </p>
              <button
                type="button"
                onClick={() => setIsCatalogOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
              >
                <i className="ri-folder-shared-line text-sm"></i>
                <span>Buka Katalog Master Parameter</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredParams.map(({ parameter: param }) => {
                const formVal = formMap[param.id] || {
                  parameterId: param.id,
                  optionId: null,
                  nilaiNumber: null,
                  nilaiText: '',
                  operator: '=',
                  nilaiMin: null,
                  nilaiMax: null,
                };

                return (
                  <div
                    key={param.id}
                    className="p-4 rounded-xl border border-gray-200 bg-white hover:border-emerald-300 transition-shadow shadow-xs space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          {param.kode}
                        </span>
                        <span className="font-semibold text-sm text-gray-800">{param.nama}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {param.namaModul}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveParameter(param.id)}
                          className="w-6 h-6 rounded-md text-gray-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                          title="Hapus parameter dari varietas ini"
                        >
                          <i className="ri-delete-bin-line text-xs"></i>
                        </button>
                      </div>
                    </div>

                    {param.deskripsi && (
                      <p className="text-xs text-gray-500 italic">{param.deskripsi}</p>
                    )}

                    {/* Dynamic Field rendering according to tipeNilai */}
                    <div>
                      {param.tipeNilai === 'NUMBER' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="any"
                            className="form-control form-control-sm rounded-lg flex-1"
                            placeholder={`Nilai (${param.satuan || '-'})`}
                            value={formVal.nilaiNumber ?? ''}
                            onChange={(e) =>
                              handleInputChange(
                                param.id,
                                'nilaiNumber',
                                e.target.value !== '' ? parseFloat(e.target.value) : null
                              )
                            }
                          />
                          {param.satuan && (
                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1.5 rounded-lg">
                              {param.satuan}
                            </span>
                          )}
                        </div>
                      )}

                      {param.tipeNilai === 'RANGE' && (
                        <div className="space-y-1.5">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[11px] text-gray-500 font-semibold">
                                Min {param.satuan ? `(${param.satuan})` : ''}
                              </label>
                              <input
                                type="number"
                                step="any"
                                className="form-control form-control-sm rounded-lg"
                                placeholder="Nilai Min"
                                value={formVal.nilaiMin ?? ''}
                                onChange={(e) =>
                                  handleInputChange(
                                    param.id,
                                    'nilaiMin',
                                    e.target.value !== '' ? parseFloat(e.target.value) : null
                                  )
                                }
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-gray-500 font-semibold">
                                Max {param.satuan ? `(${param.satuan})` : ''}
                              </label>
                              <input
                                type="number"
                                step="any"
                                className="form-control form-control-sm rounded-lg"
                                placeholder="Nilai Max"
                                value={formVal.nilaiMax ?? ''}
                                onChange={(e) =>
                                  handleInputChange(
                                    param.id,
                                    'nilaiMax',
                                    e.target.value !== '' ? parseFloat(e.target.value) : null
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {param.tipeNilai === 'OPTION' && (
                        <select
                          className="form-select form-select-sm rounded-lg"
                          value={formVal.optionId || ''}
                          onChange={(e) =>
                            handleInputChange(param.id, 'optionId', e.target.value || null)
                          }
                        >
                          <option value="">-- Pilih Opsi --</option>
                          {param.options?.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.nama} ({opt.kode})
                            </option>
                          ))}
                        </select>
                      )}

                      {param.tipeNilai === 'TEXT' && (
                        <input
                          type="text"
                          className="form-control form-control-sm rounded-lg"
                          placeholder="Masukkan teks acuan / deskripsi..."
                          value={formVal.nilaiText || ''}
                          onChange={(e) => handleInputChange(param.id, 'nilaiText', e.target.value)}
                        />
                      )}

                      {param.tipeNilai === 'BOOLEAN' && (
                        <select
                          className="form-select form-select-sm rounded-lg"
                          value={formVal.nilaiText || ''}
                          onChange={(e) => handleInputChange(param.id, 'nilaiText', e.target.value)}
                        >
                          <option value="">-- Pilih --</option>
                          <option value="Ya">Ya / Sesuai</option>
                          <option value="Tidak">Tidak / Tidak Sesuai</option>
                        </select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Total <strong>{combinedParams.length}</strong> parameter standar terhubung dengan varietas ini.
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn btn-sm btn-light rounded-lg font-medium"
              onClick={onClose}
              disabled={saving}
            >
              Batal
            </button>
            <button
              type="button"
              className="ti-btn ti-btn-sm ti-btn-primary flex items-center gap-1 font-semibold rounded-lg px-4"
              onClick={handleSave}
              disabled={saving || loading}
            >
              {saving ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i> Menyimpan...
                </>
              ) : (
                <>
                  <i className="ri-save-line"></i> Simpan Parameter Standar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Katalog Master Parameter Modal */}
      <ModalKatalogMasterParameter
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        namaModul="ALL"
        title={`Katalog Master Parameter - Varietas ${variety.namaVarietas}`}
        subtitle="Pilih parameter standar yang ingin diterapkan untuk varietas ini."
        alreadySelectedIds={combinedParams.map((cp) => cp.parameter.id)}
        onAddParameters={handleAddFromCatalog}
      />
    </div>
  );
}
