"use client";

import React from 'react';
import { MonitoringGudangStats } from '@/app/types/monitoringGudang';

interface DistribusiStatusDonutProps {
  stats: MonitoringGudangStats;
}

export default function DistribusiStatusDonut({ stats }: DistribusiStatusDonutProps) {
  const total = stats.totalZona || 18;
  const normal = stats.normal || 13;
  const perluPerhatian = stats.perluPerhatian || 3;
  const tidakSesuai = stats.tidakSesuai || 1;
  const sensorOffline = stats.sensorOffline || 1;

  // Donut geometry
  const radius = 64;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  // Calculate segment lengths
  const normalLen = (normal / total) * circumference;
  const perhatianLen = (perluPerhatian / total) * circumference;
  const tidakSesuaiLen = (tidakSesuai / total) * circumference;
  const offlineLen = (sensorOffline / total) * circumference;

  // Offsets (starting from top -90deg)
  const offsetNormal = 0;
  const offsetPerhatian = -normalLen;
  const offsetTidakSesuai = -(normalLen + perhatianLen);
  const offsetOffline = -(normalLen + perhatianLen + tidakSesuaiLen);

  const pctNormal = total > 0 ? ((normal / total) * 100).toFixed(1).replace('.', ',') : '72,2';
  const pctPerhatian = total > 0 ? ((perluPerhatian / total) * 100).toFixed(1).replace('.', ',') : '16,7';
  const pctTidakSesuai = total > 0 ? ((tidakSesuai / total) * 100).toFixed(1).replace('.', ',') : '5,6';
  const pctOffline = total > 0 ? ((sensorOffline / total) * 100).toFixed(1).replace('.', ',') : '5,6';

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm hover:shadow transition-shadow flex flex-col justify-between h-full">
      <div>
        <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight mb-1">Distribusi Status Zona</h3>
        <p className="text-xs text-gray-500 mb-4">Total: {total} Zona</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto pt-2">
          {/* Donut SVG */}
          <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background circle track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#f1f5f9"
                strokeWidth={strokeWidth}
              />
              {/* Normal Segment (Green) */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#10b981"
                strokeWidth={strokeWidth}
                strokeDasharray={`${normalLen} ${circumference}`}
                strokeDashoffset={offsetNormal}
                className="transition-all duration-500"
              />
              {/* Perlu Perhatian Segment (Yellow) */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#f59e0b"
                strokeWidth={strokeWidth}
                strokeDasharray={`${perhatianLen} ${circumference}`}
                strokeDashoffset={offsetPerhatian}
                className="transition-all duration-500"
              />
              {/* Tidak Sesuai Segment (Red) */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#ef4444"
                strokeWidth={strokeWidth}
                strokeDasharray={`${tidakSesuaiLen} ${circumference}`}
                strokeDashoffset={offsetTidakSesuai}
                className="transition-all duration-500"
              />
              {/* Sensor Offline Segment (Slate) */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#94a3b8"
                strokeWidth={strokeWidth}
                strokeDasharray={`${offlineLen} ${circumference}`}
                strokeDashoffset={offsetOffline}
                className="transition-all duration-500"
              />
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-900 leading-none">{total}</span>
              <span className="text-[11px] font-medium text-gray-500 mt-0.5">Zona</span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-2.5 text-xs w-full max-w-[200px]">
            {/* Normal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-gray-700 font-medium">Normal</span>
              </div>
              <span className="text-gray-600 font-semibold">{normal} Zona ({pctNormal}%)</span>
            </div>

            {/* Perlu Perhatian */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-gray-700 font-medium">Perlu Perhatian</span>
              </div>
              <span className="text-gray-600 font-semibold">{perluPerhatian} Zona ({pctPerhatian}%)</span>
            </div>

            {/* Tidak Sesuai */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-gray-700 font-medium">Tidak Sesuai</span>
              </div>
              <span className="text-gray-600 font-semibold">{tidakSesuai} Zona ({pctTidakSesuai}%)</span>
            </div>

            {/* Sensor Offline */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <span className="text-gray-700 font-medium">Sensor Offline</span>
              </div>
              <span className="text-gray-600 font-semibold">{sensorOffline} Zona ({pctOffline}%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <span>Pemantauan aktif 24 jam</span>
        <span className="text-emerald-700 font-medium">Tingkat kepatuhan: 94.4%</span>
      </div>
    </div>
  );
}
