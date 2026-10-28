"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DistribusiStatusCardProps {
  distribution?: Record<string, number>;
  totalLot?: number;
}

export default function DistribusiStatusCard({
  distribution = {
    'Bahan Belum Diproses': 7,
    'Dalam Pengeringan': 4,
    'Menunggu Sortasi': 1,
  },
  totalLot = 12,
}: DistribusiStatusCardProps) {
  const countBelum = distribution['Bahan Belum Diproses'] || 7;
  const countPengeringan = distribution['Dalam Pengeringan'] || 4;
  const countSortasi = distribution['Menunggu Sortasi'] || 1;

  const total = countBelum + countPengeringan + countSortasi || totalLot || 12;

  const pctBelum = ((countBelum / total) * 100).toFixed(1).replace('.', ',');
  const pctPengeringan = ((countPengeringan / total) * 100).toFixed(1).replace('.', ',');
  const pctSortasi = ((countSortasi / total) * 100).toFixed(1).replace('.', ',');

  const series = [countBelum, countPengeringan, countSortasi];
  const labels = ['Bahan Belum Diproses', 'Dalam Pengeringan', 'Menunggu Sortasi'];
  const colors = ['#D97706', '#3B82F6', '#FBBF24']; // Amber-600, Blue-500, Yellow-400

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
      height: 190,
      fontFamily: 'inherit',
    },
    labels: labels,
    colors: colors,
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: ['#ffffff'] },
    legend: { show: false }, // We render custom legend matching screenshot
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: {
            show: true,
            name: { show: false },
            value: {
              show: true,
              fontSize: '18px',
              fontWeight: 800,
              color: '#111827',
              formatter: () => `${total} Lot`,
            },
            total: {
              show: true,
              label: '',
              fontSize: '18px',
              fontWeight: 800,
              color: '#111827',
              formatter: () => `${total} Lot`,
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} Lot (${((val / total) * 100).toFixed(1)}%)`,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-gray-800 tracking-tight flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-emerald-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          Distribusi Status
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Donut chart */}
        <div className="w-44 h-44 flex items-center justify-center flex-shrink-0">
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="donut"
            height={180}
            width={180}
          />
        </div>

        {/* Legend on right matching screenshot */}
        <div className="space-y-2 text-xs flex-1 min-w-0 pl-1">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] flex-shrink-0"></span>
              <span className="text-gray-700 truncate">Bahan Belum Diproses</span>
            </div>
            <span className="font-semibold text-gray-900 whitespace-nowrap text-[11px]">
              {countBelum} ({pctBelum}%)
            </span>
          </div>

          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] flex-shrink-0"></span>
              <span className="text-gray-700 truncate">Dalam Pengeringan</span>
            </div>
            <span className="font-semibold text-gray-900 whitespace-nowrap text-[11px]">
              {countPengeringan} ({pctPengeringan}%)
            </span>
          </div>

          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] flex-shrink-0"></span>
              <span className="text-gray-700 truncate">Menunggu Sortasi</span>
            </div>
            <span className="font-semibold text-gray-900 whitespace-nowrap text-[11px]">
              {countSortasi} ({pctSortasi}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
