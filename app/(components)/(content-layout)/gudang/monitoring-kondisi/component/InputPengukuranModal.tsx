"use client";

import React, { useState } from 'react';
import { MasterGudangOption, MonitoringFormInput, MonitoringGudangItem } from '@/app/types/monitoringGudang';

interface InputPengukuranModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e?: React.FormEvent) => void;
  formData: MonitoringFormInput;
  setFormData: React.Dispatch<React.SetStateAction<MonitoringFormInput>>;
  gudangOptions: MasterGudangOption[];
  editingItem: MonitoringGudangItem | null;
  isSubmitting: boolean;
}

export default function InputPengukuranModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  gudangOptions,
  editingItem,
  isSubmitting,
}: InputPengukuranModalProps) {
  if (!isOpen) return null;

  const handleGudangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const found = gudangOptions.find((g) => g.id === selectedId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        gudangId: found.id,
        namaGudang: found.namaGudang,
        // Auto default suggested sensor prefix if empty
        sensor: prev.sensor || `SNR-${found.kodeGudang || 'GD'}-01`,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        gudangId: '',
        namaGudang: selectedId,
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-800">
              {editingItem ? 'Edit Pengukuran Kondisi Gudang' : 'Input Pengukuran Kondisi Gudang'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Pilih gudang dari Master Gudang dan input parameter suhu &amp; kelembapan secara manual
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Master Gudang Reference */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Gudang (Referensi Master Gudang) <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={formData.gudangId || ''}
                onChange={handleGudangChange}
                className="w-full text-xs rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-2xs py-2 px-3 bg-white"
              >
                <option value="">-- Pilih Gudang dari Master Data --</option>
                {gudangOptions.map((g) => (
                  <option key={g.id} value={g.id}>
                    [{g.kodeGudang}] {g.namaGudang} ({g.kategori})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-gray-400 mt-0.5 block">
                Data master gudang terhubung dengan modul inventory
              </span>
            </div>

            {/* Zona */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Zona Gudang <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.zona}
                onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
                className="w-full text-xs rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-2xs py-2 px-3 bg-white"
              >
                <option value="Zona A">Zona A</option>
                <option value="Zona B">Zona B</option>
                <option value="Zona C">Zona C</option>
                <option value="Zona D">Zona D</option>
                <option value="Cold Storage 1">Cold Storage 1</option>
                <option value="Cold Storage 2">Cold Storage 2</option>
              </select>
            </div>

            {/* Sensor / Identifier */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kode / ID Sensor
              </label>
              <input
                type="text"
                placeholder="Contoh: SNR-GB-A01 atau '-'"
                value={formData.sensor || ''}
                onChange={(e) => setFormData({ ...formData, sensor: e.target.value })}
                className="w-full text-xs rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-2xs py-2 px-3"
              />
            </div>

            {/* Sumber Data */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Sumber Data
              </label>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="sumberData"
                    value="Manual"
                    checked={formData.sumberData === 'Manual'}
                    onChange={(e) => setFormData({ ...formData, sumberData: e.target.value })}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Input Manual</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="sumberData"
                    value="IoT Sensor"
                    checked={formData.sumberData === 'IoT Sensor'}
                    onChange={(e) => setFormData({ ...formData, sumberData: e.target.value })}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>IoT Sensor</span>
                </label>
              </div>
            </div>

            {/* Waktu Pengukuran */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Waktu Pengukuran <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={formData.waktuPengukuran}
                onChange={(e) => setFormData({ ...formData, waktuPengukuran: e.target.value })}
                className="w-full text-xs rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-2xs py-2 px-3"
              />
            </div>

            {/* Suhu Terakhir & Batas Suhu */}
            <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
              <label className="block text-xs font-semibold text-emerald-900 mb-1.5">
                <i className="ri-temp-hot-line text-emerald-600 mr-1"></i>
                Pengukuran Suhu (°C)
              </label>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-gray-500">Suhu Terukur (°C):</span>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Contoh: 24.5"
                    value={formData.suhu !== null && formData.suhu !== undefined ? formData.suhu : ''}
                    onChange={(e) => setFormData({ ...formData, suhu: e.target.value })}
                    className="w-full text-xs rounded-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 py-1.5 px-2.5 mt-0.5"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-gray-500">Batas Min (°C):</span>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.suhuMin}
                      onChange={(e) => setFormData({ ...formData, suhuMin: e.target.value })}
                      className="w-full text-xs rounded-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 py-1 px-2 mt-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500">Batas Max (°C):</span>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.suhuMax}
                      onChange={(e) => setFormData({ ...formData, suhuMax: e.target.value })}
                      className="w-full text-xs rounded-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 py-1 px-2 mt-0.5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Kelembapan RH & Batas RH */}
            <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
              <label className="block text-xs font-semibold text-amber-900 mb-1.5">
                <i className="ri-drop-line text-amber-600 mr-1"></i>
                Kelembapan Relatif / RH (%)
              </label>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-gray-500">RH Terukur (%):</span>
                  <input
                    type="number"
                    step="1"
                    placeholder="Contoh: 48"
                    value={formData.rh !== null && formData.rh !== undefined ? formData.rh : ''}
                    onChange={(e) => setFormData({ ...formData, rh: e.target.value })}
                    className="w-full text-xs rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 py-1.5 px-2.5 mt-0.5"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-gray-500">Batas Min (%):</span>
                    <input
                      type="number"
                      step="1"
                      value={formData.rhMin}
                      onChange={(e) => setFormData({ ...formData, rhMin: e.target.value })}
                      className="w-full text-xs rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 py-1 px-2 mt-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500">Batas Max (%):</span>
                    <input
                      type="number"
                      step="1"
                      value={formData.rhMax}
                      onChange={(e) => setFormData({ ...formData, rhMax: e.target.value })}
                      className="w-full text-xs rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 py-1 px-2 mt-0.5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Penilaian */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Status Kondisi
              </label>
              <select
                value={formData.status || 'Auto'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-xs rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-2xs py-2 px-3 bg-white"
              >
                <option value="Auto">Auto (Hitung Otomatis Berdasarkan Batas)</option>
                <option value="Normal">Normal</option>
                <option value="Perlu Perhatian">Perlu Perhatian</option>
                <option value="Tidak Sesuai">Tidak Sesuai</option>
                <option value="Sensor Offline">Sensor Offline</option>
              </select>
            </div>

            {/* Petugas */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Petugas Pencatat
              </label>
              <input
                type="text"
                placeholder="Nama Petugas / Operator"
                value={formData.petugas || ''}
                onChange={(e) => setFormData({ ...formData, petugas: e.target.value })}
                className="w-full text-xs rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-2xs py-2 px-3"
              />
            </div>

            {/* Catatan */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Catatan Kondisi / Observasi
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Kondisi sirkulasi AC normal, ventilasi berjalan baik."
                value={formData.catatan || ''}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                className="w-full text-xs rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-2xs py-2 px-3"
              ></textarea>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-2xs"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-2xs flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-sm"></i>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <i className="ri-save-line text-sm"></i>
                  <span>{editingItem ? 'Simpan Perubahan' : 'Simpan Pengukuran'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
