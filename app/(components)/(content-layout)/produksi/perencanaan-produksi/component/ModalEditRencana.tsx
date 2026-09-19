import React, { useState, useEffect, useMemo } from 'react';
import { PerencanaanProduksi } from '@/app/types/perencanaanProduksi';
import { perencanaanProduksiService } from '@/app/services/perencanaanProduksiService';
import { commodityService } from '@/app/services/commodityService';
import { varietyService } from '@/app/services/varietyService';
import { partnerService } from '@/app/services/partnerService';
import { Commodity } from '@/app/types/commodity';
import { Variety } from '@/app/types/variety';
import { Partner } from '@/app/types/partner';
import Swal from 'sweetalert2';

interface ModalEditRencanaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: PerencanaanProduksi | null;
}

export default function ModalEditRencana({ isOpen, onClose, onSuccess, item }: ModalEditRencanaProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<PerencanaanProduksi>>({});
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loadingMaster, setLoadingMaster] = useState(false);

  useEffect(() => {
    if (item && isOpen) {
      setFormData({ ...item });

      setLoadingMaster(true);
      Promise.all([
        commodityService.getCommodities({ status: 'Aktif' }).catch(() => ({ data: [] })),
        partnerService.getPartners({ pageSize: 100, status: 'Aktif' }).catch(() => ({ data: [] })),
      ])
        .then(([commRes, partRes]) => {
          setCommodities(commRes.data || []);
          setPartners(partRes.data || []);
        })
        .finally(() => {
          setLoadingMaster(false);
        });

      const commId = item.commodityId || item.commodity?.id;
      if (commId) {
        varietyService
          .getVarieties({ commodityId: commId, status: 'Aktif' })
          .then((res) => setVarieties(res.data || []))
          .catch(() => setVarieties([]));
      } else {
        setVarieties([]);
      }
    }
  }, [item, isOpen]);

  const handleCommodityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedObj = commodities.find((c) => c.id === selectedId);
    const commName = selectedObj ? selectedObj.namaKomoditas : '';

    setFormData((prev) => ({
      ...prev,
      commodityId: selectedId || null,
      komoditas: commName || prev.komoditas || '',
      varietyId: null,
      varietas: '',
    }));

    if (selectedId) {
      try {
        const res = await varietyService.getVarieties({ commodityId: selectedId, status: 'Aktif' });
        setVarieties(res.data || []);
      } catch (err) {
        console.error('Error loading varieties:', err);
        setVarieties([]);
      }
    } else {
      setVarieties([]);
    }
  };

  const handleVarietyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedObj = varieties.find((v) => v.id === selectedId);
    setFormData((prev) => ({
      ...prev,
      varietyId: selectedId || null,
      varietas: selectedObj ? selectedObj.namaVarietas : prev.varietas || '',
    }));
  };

  const filteredPartners = useMemo(() => {
    const commId = formData.commodityId;
    const commName = formData.komoditas;

    if (!commId && !commName) return partners;

    const matched = partners.filter((p) => {
      if (p.commodityId && commId && p.commodityId === commId) return true;
      if (p.komoditasUtama && commName) {
        const pKom = p.komoditasUtama.toLowerCase();
        const sKom = commName.toLowerCase();
        if (pKom.includes(sKom) || sKom.includes(pKom)) return true;
      }
      return false;
    });

    return matched.length > 0 ? matched : partners;
  }, [partners, formData.commodityId, formData.komoditas]);

  const handlePartnerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedObj = partners.find((p) => p.id === selectedId);
    setFormData((prev) => ({
      ...prev,
      partnerId: selectedId || null,
      namaPetani: selectedObj ? selectedObj.namaPetani : prev.namaPetani || '',
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated: any = { ...prev, [name]: value };

      if (name === 'targetProduksi' || name === 'aktualProduksi') {
        const target = name === 'targetProduksi' ? Number(value) : Number(prev.targetProduksi || 0);
        const actual = name === 'aktualProduksi' ? Number(value) : Number(prev.aktualProduksi || 0);
        updated.produksiTerpenuhi = target > 0 ? Number(((actual / target) * 100).toFixed(1)) : 0;
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item?.id) return;
    setLoading(true);
    try {
      const {
        id: _id,
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        commodity: _commodity,
        variety: _variety,
        partner: _partner,
        greenhouse: _greenhouse,
        petaniDistribusi: _petaniDistribusi,
        produk: _produk,
        ...cleanData
      } = formData as any;

      const target = Number(formData.targetProduksi) || 0;
      const actual = Number(formData.aktualProduksi) || 0;
      const terpenuhi = target > 0 ? Number(((actual / target) * 100).toFixed(1)) : 0;

      const res = await perencanaanProduksiService.update(item.id, {
        ...cleanData,
        commodityId: formData.commodityId || null,
        komoditas: formData.komoditas || '',
        varietyId: formData.varietyId || null,
        varietas: formData.varietas || '',
        partnerId: formData.partnerId || null,
        namaPetani: formData.namaPetani || null,
        targetProduksi: target,
        aktualProduksi: actual,
        produksiTerpenuhi: formData.produksiTerpenuhi !== undefined ? Number(formData.produksiTerpenuhi) : terpenuhi,
        targetLuasLahan: Number(formData.targetLuasLahan) || 0,
        lahanTersedia: Number(formData.lahanTersedia) || 0,
        realisasiTanam: Number(formData.realisasiTanam) || 0,
        kebutuhanBenih: Number(formData.kebutuhanBenih) || 0,
        estimasiHasilPerHa: Number(formData.estimasiHasilPerHa) || 0,
      });

      if (res.success) {
        Swal.fire({
          title: 'Berhasil!',
          text: `Rencana produksi ${item.noPerencanaan} berhasil diperbarui.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      Swal.fire('Gagal', err.message || 'Terjadi kesalahan saat memperbarui', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">Edit Rencana Produksi</h3>
              <p className="text-xs text-gray-500">ID: {item.noPerencanaan}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* No Perencanaan */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">No. Perencanaan</label>
              <input
                type="text"
                disabled
                value={formData.noPerencanaan || ''}
                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
              />
            </div>

            {/* Komoditas */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Komoditas *</label>
              {commodities.length > 0 ? (
                <select
                  name="commodityId"
                  value={formData.commodityId || ''}
                  onChange={handleCommodityChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="">-- Pilih Komoditas --</option>
                  {commodities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.namaKomoditas}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="komoditas"
                  value={formData.komoditas || ''}
                  onChange={handleChange}
                  placeholder="Nama Komoditas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              )}
            </div>

            {/* Varietas */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Varietas *</label>
              {varieties.length > 0 ? (
                <select
                  name="varietyId"
                  value={formData.varietyId || ''}
                  onChange={handleVarietyChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="">-- Pilih Varietas --</option>
                  {varieties.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.namaVarietas}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="varietas"
                  value={formData.varietas || ''}
                  onChange={handleChange}
                  placeholder="Nama Varietas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              )}
            </div>

            {/* Target Produksi */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Target Produksi (kg) *</label>
              <input
                type="number"
                name="targetProduksi"
                required
                value={formData.targetProduksi ?? 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Aktual Produksi */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Aktual Produksi / Terpenuhi (kg)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  name="aktualProduksi"
                  value={formData.aktualProduksi ?? 0}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <span className="shrink-0 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-700 font-bold text-[11px]">
                  {formData.produksiTerpenuhi ?? 0}%
                </span>
              </div>
            </div>

            {/* Target Luas Lahan */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Target Luas Lahan (ha)</label>
              <input
                type="number"
                step="0.1"
                name="targetLuasLahan"
                value={formData.targetLuasLahan ?? 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Kebutuhan Benih */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Kebutuhan Benih (kg)</label>
              <input
                type="number"
                name="kebutuhanBenih"
                value={formData.kebutuhanBenih ?? 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Periode */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Periode Produksi</label>
              <input
                type="text"
                name="periode"
                value={formData.periode || ''}
                onChange={handleChange}
                placeholder="cth: 01/09/2026 - 17/01/2027"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Metode Tanam */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Metode Tanam</label>
              <select
                name="metodeTanam"
                value={formData.metodeTanam || 'Pindah Tanam'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Pindah Tanam">Pindah Tanam</option>
                <option value="Tanam Langsung">Tanam Langsung</option>
              </select>
            </div>

            {/* Petani Mitra Penanggung Jawab */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Petani Mitra Penanggung Jawab</label>
              {partners.length > 0 ? (
                <select
                  name="partnerId"
                  value={formData.partnerId || ''}
                  onChange={handlePartnerChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="">-- Pilih Petani Mitra --</option>
                  {filteredPartners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.namaPetani} {p.komoditasUtama ? `(${p.komoditasUtama})` : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="namaPetani"
                  value={formData.namaPetani || ''}
                  onChange={handleChange}
                  placeholder="Nama Petani Mitra"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Status Rencana</label>
              <select
                name="status"
                value={formData.status || 'Draft'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Draft">Draft</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Proses">Proses</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Catatan Tambahan</label>
            <textarea
              name="catatan"
              rows={3}
              value={formData.catatan || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            ></textarea>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#078836] hover:bg-[#06732e] rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

