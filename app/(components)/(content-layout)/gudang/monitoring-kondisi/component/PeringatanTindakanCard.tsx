"use client";

import React from 'react';
import { MonitoringAlertItem } from '@/app/types/monitoringGudang';

interface PeringatanTindakanCardProps {
  alerts: MonitoringAlertItem[];
  onActionClick: (alert: MonitoringAlertItem) => void;
}

export default function PeringatanTindakanCard({
  alerts,
  onActionClick,
}: PeringatanTindakanCardProps) {
  const getIcon = (tipe: string) => {
    switch (tipe) {
      case 'warning':
        return <i className="ri-error-warning-line text-amber-500 text-lg flex-shrink-0"></i>;
      case 'danger':
        return <i className="ri-close-circle-line text-rose-500 text-lg flex-shrink-0"></i>;
      case 'success':
        return <i className="ri-checkbox-circle-line text-emerald-500 text-lg flex-shrink-0"></i>;
      default:
        return <i className="ri-information-line text-blue-500 text-lg flex-shrink-0"></i>;
    }
  };

  const getActionBtnClass = (tipe: string, actionType: string) => {
    if (actionType === 'done' || tipe === 'success') {
      return 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200';
    }
    if (actionType === 'check_sensor') {
      return 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200';
    }
    if (actionType === 'investigate') {
      return 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200';
    }
    return 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm hover:shadow transition-shadow flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">Peringatan &amp; Tindakan</h3>
          <span className="text-xs bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded-full border border-rose-200">
            {alerts.filter(a => a.tipe !== 'success').length} Perlu Respon
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-4">Log peringatan anomali lingkungan gudang</p>

        <div className="space-y-3">
          {alerts.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5">{getIcon(item.tipe)}</div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 leading-snug truncate" title={item.title}>
                    {item.title}
                  </p>
                  <span className="text-[11px] text-gray-400 mt-0.5 block">{item.waktu}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onActionClick(item)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all whitespace-nowrap shadow-2xs ${getActionBtnClass(
                  item.tipe,
                  item.actionType
                )}`}
              >
                {item.actionLabel}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <span>Respon darurat &lt; 30 menit</span>
        <button
          type="button"
          onClick={() => alert('SOP Tindakan Perbaikan Suhu/RH: Hidupkan dehumidifier, cek ventilasi, dan karantina material sensitif.')}
          className="text-emerald-700 hover:text-emerald-800 font-medium underline"
        >
          Lihat SOP Tindakan
        </button>
      </div>
    </div>
  );
}
