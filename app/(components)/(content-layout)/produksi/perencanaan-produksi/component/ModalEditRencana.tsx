import React, { useState, useEffect } from 'react';
import { PerencanaanProduksi } from '@/app/types/perencanaanProduksi';
import { perencanaanProduksiService } from '@/app/services/perencanaanProduksiService';
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

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    }
  }, [item]);

  if (!isOpen || !item) return null;

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
    if (!item.id) return;
    setLoading(true);
    try {
      const res = await perencanaanProduksiService.update(item.id, {
        ...formData,
        targetProduksi: Number(formData.targetProduksi) || 0,
        aktualProduksi: Number(formData.aktualProduksi) || 0,
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
          showConfirmButton: false
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
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
            {/* Produk */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Nama Produk Benih *</label>
              <input
                type="text"
                name="produk"
                required
                value={formData.produk || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

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
              <label className="block font-semibold text-gray-700 mb-1">Komoditas</label>
              <input
                type="text"
                name="komoditas"
                value={formData.komoditas || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Varietas */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Varietas</label>
              <input
                type="text"
                name="varietas"
                value={formData.varietas || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Target Produksi */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Target Produksi (kg) *</label>
              <input
                type="number"
                name="targetProduksi"
                required
                value={formData.targetProduksi || 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Aktual Produksi (Core Requirement) */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Aktual Produksi / Terpenuhi (kg) *</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  name="aktualProduksi"
                  value={formData.aktualProduksi || 0}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <span className="shrink-0 px-2 py-1.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-700 font-bold text-[11px]">
                  {formData.produksiTerpenuhi || 0}%
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
                value={formData.targetLuasLahan || 0}
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
                value={formData.kebutuhanBenih || 0}
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

            {/* Petani Mitra */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Petani Mitra Penanggung Jawab</label>
              <input
                type="text"
                name="namaPetani"
                value={formData.namaPetani || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
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
