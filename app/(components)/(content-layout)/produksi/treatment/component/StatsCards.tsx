"use client";

import React from 'react';
import { TreatmentStats } from '@/app/types/treatment';

interface StatsCardsProps {
  stats: TreatmentStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Total Batch Treatment */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-gray-500">Total Batch Treatment</p>
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
              {stats.totalBatch ?? 12}
            </h3>
            <p className="text-[10px] text-gray-400">batch dalam periode ini</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0">
            <i className="ri-flask-line text-lg"></i>
          </div>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
          <i className="ri-arrow-up-line"></i>
          <span>{stats.totalBatchDelta ?? 2} batch dari periode lalu</span>
        </div>
      </div>

      {/* 2. Total Benih Diproses */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-gray-500">Total Benih Diproses</p>
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
              {stats.totalBenihDiproses?.includes('kg') ? stats.totalBenihDiproses : `${stats.totalBenihDiproses} kg`}
            </h3>
            <p className="text-[10px] text-gray-400">dari {stats.totalBatch ?? 12} batch</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shrink-0">
            <i className="ri-seedling-line text-lg"></i>
          </div>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
          <i className="ri-arrow-up-line"></i>
          <span>{stats.totalBenihDeltaPercent ?? 18}% dari periode lalu</span>
        </div>
      </div>

      {/* 3. Batch Selesai */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-gray-500">Batch Selesai</p>
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
              {stats.batchSelesai ?? 10}
            </h3>
            <p className="text-[10px] text-gray-400">batch</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <i className="ri-check-line text-lg"></i>
          </div>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
          <i className="ri-arrow-up-line"></i>
          <span>{stats.batchSelesaiDelta ?? 3} batch dari periode lalu</span>
        </div>
      </div>

      {/* 4. Dalam Proses */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-gray-500">Dalam Proses</p>
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
              {stats.dalamProses ?? 2}
            </h3>
            <p className="text-[10px] text-gray-400">batch</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-red-50 border border-red-200/80 flex items-center justify-center text-red-500 shrink-0">
            <i className="ri-time-line text-lg"></i>
          </div>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center gap-1 text-[10px] text-red-500 font-medium">
          <i className="ri-arrow-down-line"></i>
          <span>{Math.abs(stats.dalamProsesDelta ?? 1)} batch dari periode lalu</span>
        </div>
      </div>

      {/* 5. Batch Bermasalah */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-gray-500">Batch Bermasalah</p>
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
              {stats.batchBermasalah ?? 0}
            </h3>
            <p className="text-[10px] text-gray-400">batch</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-500 shrink-0">
            <i className="ri-alert-line text-lg"></i>
          </div>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center gap-1 text-[10px] text-gray-500 font-medium">
          <i className="ri-arrow-right-line"></i>
          <span>sama dengan periode lalu</span>
        </div>
      </div>
    </div>
  );
}
